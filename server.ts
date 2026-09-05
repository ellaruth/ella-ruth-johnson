import express, { Request, Response } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { initDatabase, resetDatabaseToDefaults, dbQueries } from './server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Initialize SQLite DB (idempotent, supports both local and cloud Turso)
initDatabase().catch(err => {
  console.error('[Database] Initialization error:', err);
});

export const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'SafeHaven2026!';

// 1. Security Headers Middleware (OWASP recommended baseline)
app.use((_req: Request, res: Response, next: () => void) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// 2. Request body size limit to prevent memory exhaustion DoS
app.use(express.json({ limit: '1mb' }));

// 3. Simple in-memory sliding-window rate limiter for public submissions
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
function rateLimitSubmissions(req: Request, res: Response, next: () => void) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 30; // Max 30 submissions per minute per IP

  const record = ipRequestCounts.get(ip);
  if (!record || now > record.resetTime) {
    ipRequestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (record.count >= maxRequests) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please wait a moment before submitting again.'
    });
  }

  record.count += 1;
  next();
}

// 4. Admin Authentication Middleware
function requireAdminAuth(req: Request, res: Response, next: () => void) {
  const provided = (req.headers['x-admin-passcode'] as string) || (req.headers['authorization']?.replace('Bearer ', ''));
  if (provided && provided === ADMIN_PASSCODE) {
    return next();
  }
  return res.status(401).json({
    success: false,
    error: 'Unauthorized: Valid staff passcode required.'
  });
}

// --- REST API ENDPOINTS ---

// 1. Bootstrap all initial data in one fast request
app.get('/api/bootstrap', async (_req: Request, res: Response) => {
  try {
    const events = await dbQueries.getAllEvents();
    const sermons = await dbQueries.getAllSermons();
    const announcements = await dbQueries.getAllAnnouncements();
    const prayerRequests = await dbQueries.getAllPrayers();
    const donationFunds = await dbQueries.getAllFunds();

    res.json({
      success: true,
      data: {
        events,
        sermons,
        announcements,
        prayerRequests,
        donationFunds
      }
    });
  } catch (err: any) {
    console.error('Error in /api/bootstrap:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Events Endpoints
app.get('/api/events', async (_req: Request, res: Response) => {
  try {
    const events = await dbQueries.getAllEvents();
    res.json({ success: true, data: events });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/events', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    if (!req.body.title || typeof req.body.title !== 'string') {
      return res.status(400).json({ success: false, error: 'Title is required and must be text' });
    }
    const event = {
      id: req.body.id || `evt-${Date.now()}`,
      title: req.body.title.slice(0, 200),
      category: req.body.category || 'Conference',
      date: req.body.date || 'TBD',
      time: req.body.time || '10:00 AM',
      location: (req.body.location || 'Columbia, MS').slice(0, 200),
      description: (req.body.description || '').slice(0, 2000),
      image: req.body.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=900&auto=format&fit=crop',
      isUpcoming: req.body.isUpcoming !== undefined ? req.body.isUpcoming : true,
      registrationRequired: req.body.registrationRequired !== undefined ? req.body.registrationRequired : true,
      attendeesCount: Math.max(0, parseInt(req.body.attendeesCount, 10) || 0)
    };
    const created = await dbQueries.createEvent(event);
    res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/events/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    await dbQueries.deleteEvent(req.params.id);
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/events/:id/rsvp', rateLimitSubmissions, async (req: Request, res: Response) => {
  try {
    const fullName = (req.body.fullName || '').trim().slice(0, 100);
    const email = (req.body.email || '').trim().slice(0, 100);
    const guestsCount = Math.min(20, Math.max(1, parseInt(req.body.guestsCount, 10) || 1));

    if (!fullName || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    const rsvp = {
      id: `rsvp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      eventId: req.params.id,
      fullName,
      email,
      guestsCount,
      notes: (req.body.notes || '').slice(0, 500)
    };
    await dbQueries.addEventRsvp(rsvp);
    res.status(201).json({ success: true, data: rsvp, message: 'RSVP confirmed successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Sermons Endpoints
app.get('/api/sermons', async (_req: Request, res: Response) => {
  try {
    const sermons = await dbQueries.getAllSermons();
    res.json({ success: true, data: sermons });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/sermons', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    if (!req.body.title || !req.body.scripture) {
      return res.status(400).json({ success: false, error: 'Title and scripture are required' });
    }
    const sermon = {
      id: req.body.id || `sermon-${Date.now()}`,
      title: req.body.title.slice(0, 200),
      scripture: req.body.scripture.slice(0, 200),
      series: (req.body.series || 'Divine Transformation').slice(0, 100),
      date: req.body.date || 'Recent Teaching',
      duration: req.body.duration || '40 min',
      summary: (req.body.summary || '').slice(0, 2000),
      corePoints: Array.isArray(req.body.corePoints) ? req.body.corePoints.slice(0, 10) : [
        'Walking in spiritual and bodily obedience',
        'Receiving healing as a present reality',
        'Stewardship of the body as God’s temple'
      ],
      reflectionPrayer: (req.body.reflectionPrayer || 'Lord, let this word take root in our hearts. Amen.').slice(0, 1000),
      featuredQuote: (req.body.featuredQuote || '“God is faithful in all seasons.”').slice(0, 500),
      audioPreviewAvailable: req.body.audioPreviewAvailable !== undefined ? req.body.audioPreviewAvailable : true
    };
    const created = await dbQueries.createSermon(sermon);
    res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/sermons/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    await dbQueries.deleteSermon(req.params.id);
    res.json({ success: true, message: 'Sermon deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Announcements Endpoints
app.get('/api/announcements', async (_req: Request, res: Response) => {
  try {
    const announcements = await dbQueries.getAllAnnouncements();
    res.json({ success: true, data: announcements });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/announcements', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    if (!req.body.text || typeof req.body.text !== 'string') {
      return res.status(400).json({ success: false, error: 'Announcement text is required' });
    }
    const ann = {
      id: req.body.id || `ann-${Date.now()}`,
      highlight: (req.body.highlight || 'Announcement').slice(0, 100),
      text: req.body.text.slice(0, 500),
      linkTab: req.body.linkTab || 'events',
      date: req.body.date || 'New Update',
      active: req.body.active !== undefined ? req.body.active : true
    };
    const created = await dbQueries.createAnnouncement(ann);
    res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/announcements/:id/toggle', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    await dbQueries.toggleAnnouncement(req.params.id);
    res.json({ success: true, message: 'Announcement status toggled' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/announcements/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    await dbQueries.deleteAnnouncement(req.params.id);
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Prayer Wall Endpoints (Returns only public prayers to prevent sensitive data leaks)
app.get('/api/prayers', async (_req: Request, res: Response) => {
  try {
    const prayers = await dbQueries.getAllPrayers(false);
    res.json({ success: true, data: prayers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/prayers', rateLimitSubmissions, async (req: Request, res: Response) => {
  try {
    if (!req.body.requestText || typeof req.body.requestText !== 'string') {
      return res.status(400).json({ success: false, error: 'Prayer request text is required' });
    }
    const prayer = {
      id: req.body.id || `pr-${Date.now()}`,
      authorName: (req.body.authorName || 'A Faithful Friend').trim().slice(0, 100),
      cityState: (req.body.cityState || 'Mississippi').trim().slice(0, 100),
      requestText: req.body.requestText.trim().slice(0, 1000),
      date: req.body.date || 'Just now',
      isPrivate: Boolean(req.body.isPrivate),
      prayedCount: 1
    };
    const created = await dbQueries.createPrayer(prayer);
    res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/prayers/:id/pray', rateLimitSubmissions, async (req: Request, res: Response) => {
  try {
    const newCount = await dbQueries.incrementPrayerCount(req.params.id);
    res.json({ success: true, data: { id: req.params.id, prayedCount: newCount } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Donation Endpoints
app.get('/api/donations/funds', async (_req: Request, res: Response) => {
  try {
    const funds = await dbQueries.getAllFunds();
    res.json({ success: true, data: funds });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/donations', rateLimitSubmissions, async (req: Request, res: Response) => {
  try {
    const amount = parseFloat(req.body.amount);
    if (!amount || isNaN(amount) || amount <= 0 || amount > 500000) {
      return res.status(400).json({ success: false, error: 'Valid donation amount required ($1 - $500,000)' });
    }
    const receiptNumber = `SHR-${Math.floor(100000 + Math.random() * 900000)}`;
    const donation = {
      id: `don-${Date.now()}`,
      receiptId: receiptNumber,
      fundId: (req.body.fundId || 'fund-general').slice(0, 50),
      fundName: (req.body.fundName || 'Safe Haven Ministry General Fund').slice(0, 150),
      amount,
      frequency: req.body.frequency === 'monthly' ? 'monthly' : 'once',
      donorName: (req.body.donorName || 'Generous Supporter').trim().slice(0, 150),
      donorEmail: (req.body.donorEmail || '').trim().slice(0, 150),
      dedicationNote: (req.body.dedicationNote || '').slice(0, 500),
      dateStr: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
    const saved = await dbQueries.recordDonation(donation);
    res.status(201).json({ success: true, data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Volunteer Application Endpoint
app.post('/api/volunteers', rateLimitSubmissions, async (req: Request, res: Response) => {
  try {
    const fullName = (req.body.fullName || '').trim().slice(0, 150);
    const email = (req.body.email || '').trim().slice(0, 150);
    if (!fullName || !email) {
      return res.status(400).json({ success: false, error: 'Full name and email are required' });
    }
    const appData = {
      id: `vol-${Date.now()}`,
      fullName,
      phone: (req.body.phone || '').trim().slice(0, 50),
      email,
      city: (req.body.city || 'Columbia, MS').trim().slice(0, 100),
      interests: Array.isArray(req.body.interests) ? req.body.interests.slice(0, 10) : [],
      availability: (req.body.availability || 'Weekends').slice(0, 50),
      notes: (req.body.notes || '').slice(0, 1000)
    };
    const saved = await dbQueries.addVolunteerApplication(appData);
    res.status(201).json({ success: true, data: saved, message: 'Volunteer application submitted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Coaching Inquiries & Vitality Leads Endpoint
app.post('/api/coaching/inquiry', rateLimitSubmissions, async (req: Request, res: Response) => {
  try {
    const fullName = (req.body.fullName || '').trim().slice(0, 150);
    const phone = (req.body.phone || '').trim().slice(0, 50);
    if (!fullName || !phone) {
      return res.status(400).json({ success: false, error: 'Full name and phone are required' });
    }
    const inquiry = {
      id: `coach-${Date.now()}`,
      fullName,
      phone,
      coachingFormat: (req.body.coachingFormat || '1on1').slice(0, 50),
      primaryGoal: (req.body.primaryGoal || '').slice(0, 500),
      energyScore: req.body.energyScore ? Math.min(5, Math.max(1, parseInt(req.body.energyScore, 10))) : undefined,
      hydrationLevel: (req.body.hydrationLevel || '').slice(0, 50) || undefined,
      movementLevel: (req.body.movementLevel || '').slice(0, 50) || undefined
    };
    const saved = await dbQueries.addCoachingInquiry(inquiry);
    res.status(201).json({ success: true, data: saved, message: 'Coaching consultation inquiry received' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Devotional Download Lead Endpoint
app.post('/api/devotional/download', rateLimitSubmissions, async (req: Request, res: Response) => {
  try {
    const email = (req.body.email || '').trim().slice(0, 150);
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email address required' });
    }
    const lead = {
      id: `lead-${Date.now()}`,
      fullName: (req.body.fullName || '').trim().slice(0, 150),
      email
    };
    const saved = await dbQueries.addDevotionalLead(lead);
    res.status(201).json({ success: true, data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. Newsletter Subscription Endpoint
app.post('/api/newsletter/subscribe', rateLimitSubmissions, async (req: Request, res: Response) => {
  try {
    const email = (req.body.email || '').trim().slice(0, 150);
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email required' });
    }
    const sub = {
      id: `sub-${Date.now()}`,
      email,
      preference: (req.body.preference || 'both').slice(0, 50)
    };
    const saved = await dbQueries.addNewsletterSubscriber(sub);
    res.status(201).json({ success: true, data: saved, message: 'Subscribed to ministry newsletter' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. Contact Message Endpoint
app.post('/api/contact', rateLimitSubmissions, async (req: Request, res: Response) => {
  try {
    const name = (req.body.name || '').trim().slice(0, 150);
    const email = (req.body.email || '').trim().slice(0, 150);
    const message = (req.body.message || '').trim().slice(0, 3000);
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
    }
    const contact = {
      id: `msg-${Date.now()}`,
      name,
      email,
      phone: (req.body.phone || '').trim().slice(0, 50),
      inquiryType: (req.body.inquiryType || 'general').slice(0, 50),
      message
    };
    const saved = await dbQueries.addContactInquiry(contact);
    res.status(201).json({ success: true, data: saved, message: 'Message received by Safe Haven team' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 12. Admin Submissions & Review Portal Endpoint (Protected by staff authorization)
app.get('/api/admin/submissions', requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    const submissions = await dbQueries.getAdminSubmissions();
    res.json({ success: true, data: submissions });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 13. Admin Database Reset Endpoint (Protected by staff authorization)
app.post('/api/admin/reset-defaults', requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    await resetDatabaseToDefaults();
    const events = await dbQueries.getAllEvents();
    const sermons = await dbQueries.getAllSermons();
    const announcements = await dbQueries.getAllAnnouncements();
    const prayerRequests = await dbQueries.getAllPrayers(false);

    res.json({
      success: true,
      message: 'Database reset to default seed data',
      data: {
        events,
        sermons,
        announcements,
        prayerRequests
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- VITE MIDDLEWARE OR STATIC SERVING ---
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const distDir = path.resolve(__dirname, 'dist');

  if (isProduction && fs.existsSync(distDir)) {
    // Serve production build
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    // Mount Vite dev server in middleware mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Safe Haven Out Reach Ministries] Server running at http://localhost:${PORT}`);
    console.log(`[Database] Database initialized and ready.`);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

export default app;
