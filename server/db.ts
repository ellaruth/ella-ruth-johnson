import { createClient, Client } from '@libsql/client';
import path from 'node:path';
import fs from 'node:fs';
import {
  INITIAL_ANNOUNCEMENTS,
  SERMON_TEACHINGS,
  UPCOMING_EVENTS,
  DONATION_FUNDS,
  INITIAL_PRAYER_REQUESTS
} from '../src/data/initialData.js';

let dbClient: Client | null = null;
let isInitialized = false;

// Return a singleton database client: connects to Turso in production or local SQLite in dev
export function getDb(): Client {
  if (dbClient) return dbClient;

  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl && (tursoUrl.startsWith('libsql:') || tursoUrl.startsWith('https:'))) {
    console.log('[Database] Connecting to Turso Cloud SQLite:', tursoUrl);
    dbClient = createClient({
      url: tursoUrl,
      authToken: tursoAuthToken
    });
  } else {
    // Local development or fallback
    const isVercel = Boolean(process.env.VERCEL);
    let dbFile: string;

    if (isVercel) {
      // In serverless Vercel environment without Turso URL, use /tmp
      dbFile = '/tmp/database.sqlite';
      console.log('[Database] Running on Vercel: Using temporary SQLite at', dbFile);
    } else {
      const dataDir = path.resolve(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      dbFile = path.join(dataDir, 'database.sqlite');
      console.log('[Database] Local development: Using SQLite file at', dbFile);
    }

    dbClient = createClient({
      url: `file:${dbFile}`
    });
  }

  return dbClient;
}

// Initialize tables and default seed data idempotently
export async function initDatabase(): Promise<void> {
  if (isInitialized) return;
  const db = getDb();

  const schemaSql = `
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      is_upcoming INTEGER NOT NULL DEFAULT 1,
      registration_required INTEGER NOT NULL DEFAULT 0,
      attendees_count INTEGER NOT NULL DEFAULT 0,
      recap_notes TEXT,
      photos_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS event_rsvps (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      guests_count INTEGER NOT NULL DEFAULT 1,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sermons (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      scripture TEXT NOT NULL,
      series TEXT NOT NULL,
      date TEXT NOT NULL,
      duration TEXT NOT NULL,
      summary TEXT NOT NULL,
      core_points TEXT NOT NULL,
      reflection_prayer TEXT NOT NULL,
      featured_quote TEXT NOT NULL,
      audio_preview_available INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id TEXT PRIMARY KEY,
      highlight TEXT NOT NULL,
      text TEXT NOT NULL,
      link_tab TEXT NOT NULL DEFAULT 'events',
      date TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS prayer_requests (
      id TEXT PRIMARY KEY,
      author_name TEXT NOT NULL,
      city_state TEXT NOT NULL,
      request_text TEXT NOT NULL,
      date TEXT NOT NULL,
      is_private INTEGER NOT NULL DEFAULT 0,
      prayed_count INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS donation_funds (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      description TEXT NOT NULL,
      impact_quote TEXT NOT NULL,
      suggested_amounts TEXT NOT NULL,
      default_amount REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS donation_receipts (
      id TEXT PRIMARY KEY,
      receipt_id TEXT UNIQUE NOT NULL,
      fund_id TEXT NOT NULL,
      fund_name TEXT NOT NULL,
      amount REAL NOT NULL,
      frequency TEXT NOT NULL DEFAULT 'once',
      donor_name TEXT NOT NULL,
      donor_email TEXT NOT NULL,
      dedication_note TEXT,
      date_str TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS volunteer_applications (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      city TEXT NOT NULL,
      interests TEXT NOT NULL,
      availability TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS coaching_inquiries (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      coaching_format TEXT NOT NULL,
      primary_goal TEXT NOT NULL,
      energy_score INTEGER,
      hydration_level TEXT,
      movement_level TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS devotional_leads (
      id TEXT PRIMARY KEY,
      full_name TEXT,
      email TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      preference TEXT NOT NULL DEFAULT 'both',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_inquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      inquiry_type TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await db.executeMultiple(schemaSql);
  await seedDefaults();
  isInitialized = true;
}

export async function seedDefaults(): Promise<void> {
  const db = getDb();

  // 1. Seed Events
  const eventRes = await db.execute('SELECT COUNT(*) as count FROM events');
  const eventCount = Number(eventRes.rows[0]?.count) || 0;
  if (eventCount === 0) {
    for (const evt of UPCOMING_EVENTS) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO events (id, title, category, date, time, location, description, image, is_upcoming, registration_required, attendees_count)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          evt.id,
          evt.title,
          evt.category,
          evt.date,
          evt.time,
          evt.location,
          evt.description,
          evt.image,
          evt.isUpcoming ? 1 : 0,
          evt.registrationRequired ? 1 : 0,
          evt.attendeesCount || 0
        ]
      });
    }
  }

  // 2. Seed Sermons
  const sermonRes = await db.execute('SELECT COUNT(*) as count FROM sermons');
  const sermonCount = Number(sermonRes.rows[0]?.count) || 0;
  if (sermonCount === 0) {
    for (const s of SERMON_TEACHINGS) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO sermons (id, title, scripture, series, date, duration, summary, core_points, reflection_prayer, featured_quote, audio_preview_available)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          s.id,
          s.title,
          s.scripture,
          s.series,
          s.date,
          s.duration,
          s.summary,
          JSON.stringify(s.corePoints),
          s.reflectionPrayer,
          s.featuredQuote,
          s.audioPreviewAvailable ? 1 : 0
        ]
      });
    }
  }

  // 3. Seed Announcements
  const annRes = await db.execute('SELECT COUNT(*) as count FROM announcements');
  const annCount = Number(annRes.rows[0]?.count) || 0;
  if (annCount === 0) {
    for (const ann of INITIAL_ANNOUNCEMENTS) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO announcements (id, highlight, text, link_tab, date, active)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          ann.id,
          ann.highlight,
          ann.text,
          ann.linkTab,
          ann.date,
          ann.active ? 1 : 0
        ]
      });
    }
  }

  // 4. Seed Prayer Requests
  const prayerRes = await db.execute('SELECT COUNT(*) as count FROM prayer_requests');
  const prayerCount = Number(prayerRes.rows[0]?.count) || 0;
  if (prayerCount === 0) {
    for (const pr of INITIAL_PRAYER_REQUESTS) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO prayer_requests (id, author_name, city_state, request_text, date, is_private, prayed_count)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          pr.id,
          pr.authorName,
          pr.cityState,
          pr.requestText,
          pr.date,
          pr.isPrivate ? 1 : 0,
          pr.prayedCount
        ]
      });
    }
  }

  // 5. Seed Donation Funds
  const fundRes = await db.execute('SELECT COUNT(*) as count FROM donation_funds');
  const fundCount = Number(fundRes.rows[0]?.count) || 0;
  if (fundCount === 0) {
    for (const fund of DONATION_FUNDS) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO donation_funds (id, name, icon, description, impact_quote, suggested_amounts, default_amount)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          fund.id,
          fund.name,
          fund.icon,
          fund.description,
          fund.impactQuote,
          JSON.stringify(fund.suggestedAmounts),
          fund.defaultAmount
        ]
      });
    }
  }
}

// Reset Database to baseline defaults
export async function resetDatabaseToDefaults(): Promise<void> {
  const db = getDb();
  await db.executeMultiple(`
    DELETE FROM event_rsvps;
    DELETE FROM events;
    DELETE FROM sermons;
    DELETE FROM announcements;
    DELETE FROM prayer_requests;
    DELETE FROM donation_funds;
    DELETE FROM donation_receipts;
    DELETE FROM volunteer_applications;
    DELETE FROM coaching_inquiries;
    DELETE FROM devotional_leads;
    DELETE FROM newsletter_subscribers;
    DELETE FROM contact_inquiries;
  `);

  await seedDefaults();
}

// Helper query accessors
export const dbQueries = {
  // Events
  getAllEvents: async () => {
    await initDatabase();
    const db = getDb();
    const res = await db.execute('SELECT * FROM events ORDER BY is_upcoming DESC, created_at DESC');
    return res.rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      date: r.date,
      time: r.time,
      location: r.location,
      description: r.description,
      image: r.image,
      isUpcoming: Boolean(r.is_upcoming),
      registrationRequired: Boolean(r.registration_required),
      attendeesCount: Number(r.attendees_count) || 0,
      recapNotes: r.recap_notes,
      photosCount: Number(r.photos_count) || 0
    }));
  },

  createEvent: async (event: any) => {
    await initDatabase();
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO events (id, title, category, date, time, location, description, image, is_upcoming, registration_required, attendees_count)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        event.id,
        event.title,
        event.category,
        event.date,
        event.time,
        event.location,
        event.description,
        event.image,
        event.isUpcoming ? 1 : 0,
        event.registrationRequired ? 1 : 0,
        event.attendeesCount || 0
      ]
    });
    return event;
  },

  deleteEvent: async (id: string) => {
    await initDatabase();
    const db = getDb();
    await db.execute({ sql: 'DELETE FROM events WHERE id = ?', args: [id] });
  },

  addEventRsvp: async (rsvp: { id: string; eventId: string; fullName: string; email: string; guestsCount: number; notes?: string }) => {
    await initDatabase();
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO event_rsvps (id, event_id, full_name, email, guests_count, notes)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        rsvp.id,
        rsvp.eventId,
        rsvp.fullName,
        rsvp.email,
        rsvp.guestsCount,
        rsvp.notes || ''
      ]
    });
    await db.execute({
      sql: 'UPDATE events SET attendees_count = attendees_count + ? WHERE id = ?',
      args: [rsvp.guestsCount, rsvp.eventId]
    });
    return rsvp;
  },

  // Sermons
  getAllSermons: async () => {
    await initDatabase();
    const db = getDb();
    const res = await db.execute('SELECT * FROM sermons ORDER BY created_at DESC');
    return res.rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      scripture: r.scripture,
      series: r.series,
      date: r.date,
      duration: r.duration,
      summary: r.summary,
      corePoints: JSON.parse(r.core_points || '[]'),
      reflectionPrayer: r.reflection_prayer,
      featuredQuote: r.featured_quote,
      audioPreviewAvailable: Boolean(r.audio_preview_available)
    }));
  },

  createSermon: async (sermon: any) => {
    await initDatabase();
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO sermons (id, title, scripture, series, date, duration, summary, core_points, reflection_prayer, featured_quote, audio_preview_available)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        sermon.id,
        sermon.title,
        sermon.scripture,
        sermon.series,
        sermon.date,
        sermon.duration,
        sermon.summary,
        JSON.stringify(sermon.corePoints || []),
        sermon.reflectionPrayer,
        sermon.featuredQuote,
        sermon.audioPreviewAvailable ? 1 : 0
      ]
    });
    return sermon;
  },

  deleteSermon: async (id: string) => {
    await initDatabase();
    const db = getDb();
    await db.execute({ sql: 'DELETE FROM sermons WHERE id = ?', args: [id] });
  },

  // Announcements
  getAllAnnouncements: async () => {
    await initDatabase();
    const db = getDb();
    const res = await db.execute('SELECT * FROM announcements ORDER BY created_at DESC');
    return res.rows.map((r: any) => ({
      id: r.id,
      highlight: r.highlight,
      text: r.text,
      linkTab: r.link_tab,
      date: r.date,
      active: Boolean(r.active)
    }));
  },

  createAnnouncement: async (ann: any) => {
    await initDatabase();
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO announcements (id, highlight, text, link_tab, date, active)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [ann.id, ann.highlight, ann.text, ann.linkTab, ann.date, ann.active ? 1 : 0]
    });
    return ann;
  },

  toggleAnnouncement: async (id: string) => {
    await initDatabase();
    const db = getDb();
    await db.execute({
      sql: 'UPDATE announcements SET active = CASE WHEN active = 1 THEN 0 ELSE 1 END WHERE id = ?',
      args: [id]
    });
  },

  deleteAnnouncement: async (id: string) => {
    await initDatabase();
    const db = getDb();
    await db.execute({ sql: 'DELETE FROM announcements WHERE id = ?', args: [id] });
  },

  // Prayers (Confidentiality protected)
  getAllPrayers: async (includePrivate: boolean = false) => {
    await initDatabase();
    const db = getDb();
    const query = includePrivate
      ? 'SELECT * FROM prayer_requests ORDER BY created_at DESC'
      : 'SELECT * FROM prayer_requests WHERE is_private = 0 ORDER BY created_at DESC';
    const res = await db.execute(query);
    return res.rows.map((r: any) => ({
      id: r.id,
      authorName: r.author_name,
      cityState: r.city_state,
      requestText: r.request_text,
      date: r.date,
      isPrivate: Boolean(r.is_private),
      prayedCount: Number(r.prayed_count) || 1
    }));
  },

  createPrayer: async (prayer: any) => {
    await initDatabase();
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO prayer_requests (id, author_name, city_state, request_text, date, is_private, prayed_count)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        prayer.id,
        prayer.authorName,
        prayer.cityState,
        prayer.requestText,
        prayer.date,
        prayer.isPrivate ? 1 : 0,
        prayer.prayedCount || 1
      ]
    });
    return prayer;
  },

  incrementPrayerCount: async (id: string) => {
    await initDatabase();
    const db = getDb();
    await db.execute({
      sql: 'UPDATE prayer_requests SET prayed_count = prayed_count + 1 WHERE id = ?',
      args: [id]
    });
    const res = await db.execute({
      sql: 'SELECT prayed_count FROM prayer_requests WHERE id = ?',
      args: [id]
    });
    return Number(res.rows[0]?.prayed_count) || 1;
  },

  // Donations
  getAllFunds: async () => {
    await initDatabase();
    const db = getDb();
    const res = await db.execute('SELECT * FROM donation_funds');
    return res.rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      icon: r.icon,
      description: r.description,
      impactQuote: r.impact_quote,
      suggestedAmounts: JSON.parse(r.suggested_amounts || '[]'),
      defaultAmount: Number(r.default_amount) || 50
    }));
  },

  recordDonation: async (donation: {
    id: string;
    receiptId: string;
    fundId: string;
    fundName: string;
    amount: number;
    frequency: string;
    donorName: string;
    donorEmail: string;
    dedicationNote?: string;
    dateStr: string;
  }) => {
    await initDatabase();
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO donation_receipts (id, receipt_id, fund_id, fund_name, amount, frequency, donor_name, donor_email, dedication_note, date_str)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        donation.id,
        donation.receiptId,
        donation.fundId,
        donation.fundName,
        donation.amount,
        donation.frequency,
        donation.donorName,
        donation.donorEmail,
        donation.dedicationNote || '',
        donation.dateStr
      ]
    });
    return donation;
  },

  // Volunteers
  addVolunteerApplication: async (app: {
    id: string;
    fullName: string;
    phone: string;
    email: string;
    city: string;
    interests: string[];
    availability: string;
    notes?: string;
  }) => {
    await initDatabase();
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO volunteer_applications (id, full_name, phone, email, city, interests, availability, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        app.id,
        app.fullName,
        app.phone,
        app.email,
        app.city,
        JSON.stringify(app.interests || []),
        app.availability,
        app.notes || ''
      ]
    });
    return app;
  },

  // Coaching
  addCoachingInquiry: async (inquiry: {
    id: string;
    fullName: string;
    phone: string;
    coachingFormat: string;
    primaryGoal: string;
    energyScore?: number;
    hydrationLevel?: string;
    movementLevel?: string;
  }) => {
    await initDatabase();
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO coaching_inquiries (id, full_name, phone, coaching_format, primary_goal, energy_score, hydration_level, movement_level)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        inquiry.id,
        inquiry.fullName,
        inquiry.phone,
        inquiry.coachingFormat,
        inquiry.primaryGoal,
        inquiry.energyScore || null,
        inquiry.hydrationLevel || null,
        inquiry.movementLevel || null
      ]
    });
    return inquiry;
  },

  // Devotional Leads
  addDevotionalLead: async (lead: { id: string; fullName?: string; email: string }) => {
    await initDatabase();
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO devotional_leads (id, full_name, email) VALUES (?, ?, ?)`,
      args: [lead.id, lead.fullName || '', lead.email]
    });
    return lead;
  },

  // Newsletter
  addNewsletterSubscriber: async (sub: { id: string; email: string; preference: string }) => {
    await initDatabase();
    const db = getDb();
    await db.execute({
      sql: `INSERT OR REPLACE INTO newsletter_subscribers (id, email, preference) VALUES (?, ?, ?)`,
      args: [sub.id, sub.email, sub.preference]
    });
    return sub;
  },

  // Contact
  addContactInquiry: async (contact: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    inquiryType: string;
    message: string;
  }) => {
    await initDatabase();
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO contact_inquiries (id, name, email, phone, inquiry_type, message) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        contact.id,
        contact.name,
        contact.email,
        contact.phone || '',
        contact.inquiryType,
        contact.message
      ]
    });
    return contact;
  },

  // Admin Submissions
  getAdminSubmissions: async () => {
    await initDatabase();
    const db = getDb();
    const donations = (await db.execute('SELECT * FROM donation_receipts ORDER BY created_at DESC LIMIT 50')).rows;
    const volunteersRaw = (await db.execute('SELECT * FROM volunteer_applications ORDER BY created_at DESC LIMIT 50')).rows;
    const parsedVolunteers = volunteersRaw.map((v: any) => ({
      ...v,
      interests: JSON.parse(v.interests || '[]')
    }));
    const coaching = (await db.execute('SELECT * FROM coaching_inquiries ORDER BY created_at DESC LIMIT 50')).rows;
    const contacts = (await db.execute('SELECT * FROM contact_inquiries ORDER BY created_at DESC LIMIT 50')).rows;
    const leads = (await db.execute('SELECT * FROM devotional_leads ORDER BY created_at DESC LIMIT 50')).rows;
    const subscribers = (await db.execute('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC LIMIT 50')).rows;
    const rsvps = (await db.execute(`
      SELECT r.*, e.title as event_title 
      FROM event_rsvps r 
      LEFT JOIN events e ON r.event_id = e.id 
      ORDER BY r.created_at DESC LIMIT 50
    `)).rows;

    return {
      donations,
      volunteers: parsedVolunteers,
      coaching,
      contacts,
      leads,
      subscribers,
      rsvps
    };
  }
};
