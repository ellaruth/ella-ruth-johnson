import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import {
  INITIAL_ANNOUNCEMENTS,
  SERMON_TEACHINGS,
  UPCOMING_EVENTS,
  DONATION_FUNDS,
  INITIAL_PRAYER_REQUESTS,
  MINISTRY_PROGRAMS,
  GALLERY_PHOTOS,
  TESTIMONIALS,
  COACHING_PILLARS,
  LIFE_TIMELINE
} from '../src/data/initialData.js';

// Ensure data directory exists
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'database.sqlite');
export const db = new DatabaseSync(dbPath);

// Initialize schema
export function initDatabase() {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

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
      core_points TEXT NOT NULL, -- JSON array
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
      suggested_amounts TEXT NOT NULL, -- JSON array
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
      interests TEXT NOT NULL, -- JSON array
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
  `);

  // Seed default data if tables are empty
  seedDefaults();
}

function seedDefaults() {
  // 1. Seed Events
  const eventCountStmt = db.prepare('SELECT COUNT(*) as count FROM events');
  const eventCount = (eventCountStmt.get() as { count: number }).count;
  if (eventCount === 0) {
    const insertEvent = db.prepare(`
      INSERT INTO events (id, title, category, date, time, location, description, image, is_upcoming, registration_required, attendees_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const evt of UPCOMING_EVENTS) {
      insertEvent.run(
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
      );
    }
  }

  // 2. Seed Sermons
  const sermonCountStmt = db.prepare('SELECT COUNT(*) as count FROM sermons');
  const sermonCount = (sermonCountStmt.get() as { count: number }).count;
  if (sermonCount === 0) {
    const insertSermon = db.prepare(`
      INSERT INTO sermons (id, title, scripture, series, date, duration, summary, core_points, reflection_prayer, featured_quote, audio_preview_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const s of SERMON_TEACHINGS) {
      insertSermon.run(
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
      );
    }
  }

  // 3. Seed Announcements
  const annCountStmt = db.prepare('SELECT COUNT(*) as count FROM announcements');
  const annCount = (annCountStmt.get() as { count: number }).count;
  if (annCount === 0) {
    const insertAnn = db.prepare(`
      INSERT INTO announcements (id, highlight, text, link_tab, date, active)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const ann of INITIAL_ANNOUNCEMENTS) {
      insertAnn.run(
        ann.id,
        ann.highlight,
        ann.text,
        ann.linkTab,
        ann.date,
        ann.active ? 1 : 0
      );
    }
  }

  // 4. Seed Prayer Requests
  const prayerCountStmt = db.prepare('SELECT COUNT(*) as count FROM prayer_requests');
  const prayerCount = (prayerCountStmt.get() as { count: number }).count;
  if (prayerCount === 0) {
    const insertPrayer = db.prepare(`
      INSERT INTO prayer_requests (id, author_name, city_state, request_text, date, is_private, prayed_count)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const pr of INITIAL_PRAYER_REQUESTS) {
      insertPrayer.run(
        pr.id,
        pr.authorName,
        pr.cityState,
        pr.requestText,
        pr.date,
        pr.isPrivate ? 1 : 0,
        pr.prayedCount
      );
    }
  }

  // 5. Seed Donation Funds
  const fundCountStmt = db.prepare('SELECT COUNT(*) as count FROM donation_funds');
  const fundCount = (fundCountStmt.get() as { count: number }).count;
  if (fundCount === 0) {
    const insertFund = db.prepare(`
      INSERT INTO donation_funds (id, name, icon, description, impact_quote, suggested_amounts, default_amount)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const fund of DONATION_FUNDS) {
      insertFund.run(
        fund.id,
        fund.name,
        fund.icon,
        fund.description,
        fund.impactQuote,
        JSON.stringify(fund.suggestedAmounts),
        fund.defaultAmount
      );
    }
  }
}

// Reset Database to baseline defaults
export function resetDatabaseToDefaults() {
  db.exec(`
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

  seedDefaults();
}

// Helper query accessors
export const dbQueries = {
  // Events
  getAllEvents: () => {
    const rows = db.prepare('SELECT * FROM events ORDER BY is_upcoming DESC, created_at DESC').all() as any[];
    return rows.map(r => ({
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
      attendeesCount: r.attendees_count,
      recapNotes: r.recap_notes,
      photosCount: r.photos_count
    }));
  },

  createEvent: (event: any) => {
    const stmt = db.prepare(`
      INSERT INTO events (id, title, category, date, time, location, description, image, is_upcoming, registration_required, attendees_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
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
    );
    return event;
  },

  deleteEvent: (id: string) => {
    db.prepare('DELETE FROM events WHERE id = ?').run(id);
  },

  addEventRsvp: (rsvp: { id: string; eventId: string; fullName: string; email: string; guestsCount: number; notes?: string }) => {
    db.prepare(`
      INSERT INTO event_rsvps (id, event_id, full_name, email, guests_count, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(rsvp.id, rsvp.eventId, rsvp.fullName, rsvp.email, rsvp.guestsCount, rsvp.notes || '');

    // Increment event attendees count
    db.prepare(`
      UPDATE events SET attendees_count = attendees_count + ? WHERE id = ?
    `).run(rsvp.guestsCount, rsvp.eventId);

    return rsvp;
  },

  // Sermons
  getAllSermons: () => {
    const rows = db.prepare('SELECT * FROM sermons ORDER BY created_at DESC').all() as any[];
    return rows.map(r => ({
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

  createSermon: (sermon: any) => {
    const stmt = db.prepare(`
      INSERT INTO sermons (id, title, scripture, series, date, duration, summary, core_points, reflection_prayer, featured_quote, audio_preview_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
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
    );
    return sermon;
  },

  deleteSermon: (id: string) => {
    db.prepare('DELETE FROM sermons WHERE id = ?').run(id);
  },

  // Announcements
  getAllAnnouncements: () => {
    const rows = db.prepare('SELECT * FROM announcements ORDER BY created_at DESC').all() as any[];
    return rows.map(r => ({
      id: r.id,
      highlight: r.highlight,
      text: r.text,
      linkTab: r.link_tab,
      date: r.date,
      active: Boolean(r.active)
    }));
  },

  createAnnouncement: (ann: any) => {
    const stmt = db.prepare(`
      INSERT INTO announcements (id, highlight, text, link_tab, date, active)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(ann.id, ann.highlight, ann.text, ann.linkTab, ann.date, ann.active ? 1 : 0);
    return ann;
  },

  toggleAnnouncement: (id: string) => {
    db.prepare(`
      UPDATE announcements SET active = CASE WHEN active = 1 THEN 0 ELSE 1 END WHERE id = ?
    `).run(id);
  },

  deleteAnnouncement: (id: string) => {
    db.prepare('DELETE FROM announcements WHERE id = ?').run(id);
  },

  // Prayers (Protects confidential prayer requests from public exposure)
  getAllPrayers: (includePrivate: boolean = false) => {
    const query = includePrivate
      ? 'SELECT * FROM prayer_requests ORDER BY created_at DESC'
      : 'SELECT * FROM prayer_requests WHERE is_private = 0 ORDER BY created_at DESC';
    const rows = db.prepare(query).all() as any[];
    return rows.map(r => ({
      id: r.id,
      authorName: r.author_name,
      cityState: r.city_state,
      requestText: r.request_text,
      date: r.date,
      isPrivate: Boolean(r.is_private),
      prayedCount: r.prayed_count
    }));
  },

  createPrayer: (prayer: any) => {
    const stmt = db.prepare(`
      INSERT INTO prayer_requests (id, author_name, city_state, request_text, date, is_private, prayed_count)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      prayer.id,
      prayer.authorName,
      prayer.cityState,
      prayer.requestText,
      prayer.date,
      prayer.isPrivate ? 1 : 0,
      prayer.prayedCount || 1
    );
    return prayer;
  },

  incrementPrayerCount: (id: string) => {
    db.prepare('UPDATE prayer_requests SET prayed_count = prayed_count + 1 WHERE id = ?').run(id);
    const updated = db.prepare('SELECT prayed_count FROM prayer_requests WHERE id = ?').get(id) as { prayed_count: number };
    return updated?.prayed_count || 1;
  },

  // Donations
  getAllFunds: () => {
    const rows = db.prepare('SELECT * FROM donation_funds').all() as any[];
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      icon: r.icon,
      description: r.description,
      impactQuote: r.impact_quote,
      suggestedAmounts: JSON.parse(r.suggested_amounts || '[]'),
      defaultAmount: r.default_amount
    }));
  },

  recordDonation: (donation: {
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
    db.prepare(`
      INSERT INTO donation_receipts (id, receipt_id, fund_id, fund_name, amount, frequency, donor_name, donor_email, dedication_note, date_str)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
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
    );
    return donation;
  },

  // Volunteers
  addVolunteerApplication: (app: {
    id: string;
    fullName: string;
    phone: string;
    email: string;
    city: string;
    interests: string[];
    availability: string;
    notes?: string;
  }) => {
    db.prepare(`
      INSERT INTO volunteer_applications (id, full_name, phone, email, city, interests, availability, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      app.id,
      app.fullName,
      app.phone,
      app.email,
      app.city,
      JSON.stringify(app.interests || []),
      app.availability,
      app.notes || ''
    );
    return app;
  },

  // Coaching
  addCoachingInquiry: (inquiry: {
    id: string;
    fullName: string;
    phone: string;
    coachingFormat: string;
    primaryGoal: string;
    energyScore?: number;
    hydrationLevel?: string;
    movementLevel?: string;
  }) => {
    db.prepare(`
      INSERT INTO coaching_inquiries (id, full_name, phone, coaching_format, primary_goal, energy_score, hydration_level, movement_level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      inquiry.id,
      inquiry.fullName,
      inquiry.phone,
      inquiry.coachingFormat,
      inquiry.primaryGoal,
      inquiry.energyScore || null,
      inquiry.hydrationLevel || null,
      inquiry.movementLevel || null
    );
    return inquiry;
  },

  // Devotional Leads
  addDevotionalLead: (lead: { id: string; fullName?: string; email: string }) => {
    db.prepare(`
      INSERT INTO devotional_leads (id, full_name, email)
      VALUES (?, ?, ?)
    `).run(lead.id, lead.fullName || '', lead.email);
    return lead;
  },

  // Newsletter
  addNewsletterSubscriber: (sub: { id: string; email: string; preference: string }) => {
    db.prepare(`
      INSERT OR REPLACE INTO newsletter_subscribers (id, email, preference)
      VALUES (?, ?, ?)
    `).run(sub.id, sub.email, sub.preference);
    return sub;
  },

  // Contact
  addContactInquiry: (contact: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    inquiryType: string;
    message: string;
  }) => {
    db.prepare(`
      INSERT INTO contact_inquiries (id, name, email, phone, inquiry_type, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      contact.id,
      contact.name,
      contact.email,
      contact.phone || '',
      contact.inquiryType,
      contact.message
    );
    return contact;
  },

  // Admin Submissions summary
  getAdminSubmissions: () => {
    const donations = db.prepare('SELECT * FROM donation_receipts ORDER BY created_at DESC LIMIT 50').all();
    const volunteers = db.prepare('SELECT * FROM volunteer_applications ORDER BY created_at DESC LIMIT 50').all() as any[];
    const parsedVolunteers = volunteers.map(v => ({
      ...v,
      interests: JSON.parse(v.interests || '[]')
    }));
    const coaching = db.prepare('SELECT * FROM coaching_inquiries ORDER BY created_at DESC LIMIT 50').all();
    const contacts = db.prepare('SELECT * FROM contact_inquiries ORDER BY created_at DESC LIMIT 50').all();
    const leads = db.prepare('SELECT * FROM devotional_leads ORDER BY created_at DESC LIMIT 50').all();
    const subscribers = db.prepare('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC LIMIT 50').all();
    const rsvps = db.prepare(`
      SELECT r.*, e.title as event_title 
      FROM event_rsvps r 
      LEFT JOIN events e ON r.event_id = e.id 
      ORDER BY r.created_at DESC LIMIT 50
    `).all();

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
