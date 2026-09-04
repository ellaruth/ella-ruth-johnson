import { describe, it, expect, beforeEach } from 'vitest';
import { dbQueries, resetDatabaseToDefaults, initDatabase } from './db.js';

describe('SQLite Database Layer (dbQueries)', () => {
  beforeEach(() => {
    initDatabase();
    resetDatabaseToDefaults();
  });

  describe('Events & RSVPs', () => {
    it('should retrieve all seeded events', () => {
      const events = dbQueries.getAllEvents();
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThanOrEqual(1);
      expect(events[0]).toHaveProperty('title');
      expect(events[0]).toHaveProperty('category');
    });

    it('should create a new event and retrieve it', () => {
      const newEvent = {
        id: `test-evt-${Date.now()}`,
        title: 'Community Fellowship Banquet',
        category: 'Banquet',
        date: 'October 15, 2026',
        time: '6:00 PM',
        location: 'Safe Haven Center',
        description: 'An evening of celebration and shared testimonies.',
        image: 'https://example.com/banquet.jpg',
        isUpcoming: true,
        registrationRequired: true,
        attendeesCount: 25
      };

      const created = dbQueries.createEvent(newEvent);
      expect(created.id).toBe(newEvent.id);

      const all = dbQueries.getAllEvents();
      const found = all.find(e => e.id === newEvent.id);
      expect(found).toBeDefined();
      expect(found?.title).toBe('Community Fellowship Banquet');
      expect(found?.attendeesCount).toBe(25);
    });

    it('should delete an event by id', () => {
      const newEvent = {
        id: `to-delete-${Date.now()}`,
        title: 'Temporary Gathering',
        category: 'Prayer',
        date: 'Tomorrow',
        time: '7:00 AM',
        location: 'Chapel',
        description: 'Brief prayer.',
        image: 'https://example.com/temp.jpg',
        isUpcoming: true,
        registrationRequired: false,
        attendeesCount: 0
      };

      dbQueries.createEvent(newEvent);
      expect(dbQueries.getAllEvents().some(e => e.id === newEvent.id)).toBe(true);

      dbQueries.deleteEvent(newEvent.id);
      expect(dbQueries.getAllEvents().some(e => e.id === newEvent.id)).toBe(false);
    });

    it('should record an RSVP and increment event attendees count', () => {
      const events = dbQueries.getAllEvents();
      const targetEvent = events[0];
      const initialAttendees = targetEvent.attendeesCount || 0;

      const rsvp = {
        id: `rsvp-test-${Date.now()}`,
        eventId: targetEvent.id,
        fullName: 'Brother Marcus Cole',
        email: 'marcus@example.org',
        guestsCount: 3,
        notes: 'Bringing family members'
      };

      const saved = dbQueries.addEventRsvp(rsvp);
      expect(saved.id).toBe(rsvp.id);

      const refreshed = dbQueries.getAllEvents().find(e => e.id === targetEvent.id);
      expect(refreshed?.attendeesCount).toBe(initialAttendees + 3);
    });
  });

  describe('Sermons', () => {
    it('should retrieve seeded sermons', () => {
      const sermons = dbQueries.getAllSermons();
      expect(Array.isArray(sermons)).toBe(true);
      expect(sermons.length).toBeGreaterThanOrEqual(1);
      expect(sermons[0]).toHaveProperty('scripture');
      expect(sermons[0]).toHaveProperty('corePoints');
    });

    it('should create and delete a sermon message', () => {
      const sermon = {
        id: `sermon-test-${Date.now()}`,
        title: 'Unfailing Love in Every Valley',
        scripture: 'Psalm 23:1-6',
        series: 'The Shepherd Series',
        date: 'September 2026',
        duration: '42 min',
        summary: 'A message on trusting God in darkness.',
        corePoints: ['He leads beside still waters', 'His rod and staff comfort'],
        reflectionPrayer: 'Lord, keep our hearts focused on Your presence.',
        featuredQuote: 'The Lord is my shepherd.',
        audioPreviewAvailable: true
      };

      dbQueries.createSermon(sermon);
      const fetched = dbQueries.getAllSermons().find(s => s.id === sermon.id);
      expect(fetched).toBeDefined();
      expect(fetched?.scripture).toBe('Psalm 23:1-6');
      expect(fetched?.corePoints).toContain('He leads beside still waters');

      dbQueries.deleteSermon(sermon.id);
      expect(dbQueries.getAllSermons().some(s => s.id === sermon.id)).toBe(false);
    });
  });

  describe('Announcements Banner Ticker', () => {
    it('should retrieve active announcements', () => {
      const items = dbQueries.getAllAnnouncements();
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThanOrEqual(1);
    });

    it('should create, toggle active state, and delete an announcement', () => {
      const ann = {
        id: `ann-test-${Date.now()}`,
        highlight: 'Special Alert',
        text: 'Youth rally meeting tonight at 6:30 PM.',
        linkTab: 'events',
        date: 'Today',
        active: true
      };

      dbQueries.createAnnouncement(ann);
      let found = dbQueries.getAllAnnouncements().find(a => a.id === ann.id);
      expect(found).toBeDefined();
      expect(found?.active).toBe(true);

      dbQueries.toggleAnnouncement(ann.id);
      found = dbQueries.getAllAnnouncements().find(a => a.id === ann.id);
      expect(found?.active).toBe(false);

      dbQueries.deleteAnnouncement(ann.id);
      expect(dbQueries.getAllAnnouncements().some(a => a.id === ann.id)).toBe(false);
    });
  });

  describe('Prayer Wall & Privacy Guard', () => {
    it('should hide private prayer requests from public retrieval by default', () => {
      const privatePrayer = {
        id: `prayer-priv-${Date.now()}`,
        authorName: 'Confidential Member',
        cityState: 'Columbia, MS',
        requestText: 'Deep personal healing and family intervention.',
        date: 'Today',
        isPrivate: true,
        prayedCount: 1
      };

      dbQueries.createPrayer(privatePrayer);

      // Public call (includePrivate = false)
      const publicPrayers = dbQueries.getAllPrayers(false);
      expect(publicPrayers.some(p => p.id === privatePrayer.id)).toBe(false);

      // Staff call (includePrivate = true)
      const staffPrayers = dbQueries.getAllPrayers(true);
      expect(staffPrayers.some(p => p.id === privatePrayer.id)).toBe(true);
    });

    it('should increment prayer counter atomically', () => {
      const publicPrayer = {
        id: `prayer-pub-${Date.now()}`,
        authorName: 'Sister Debra',
        cityState: 'Hattiesburg, MS',
        requestText: 'Praying for our church elder’s recovery.',
        date: 'Today',
        isPrivate: false,
        prayedCount: 5
      };

      dbQueries.createPrayer(publicPrayer);
      const newCount = dbQueries.incrementPrayerCount(publicPrayer.id);
      expect(newCount).toBe(6);

      const fetched = dbQueries.getAllPrayers(true).find(p => p.id === publicPrayer.id);
      expect(fetched?.prayedCount).toBe(6);
    });
  });

  describe('Donation Funds & Receipts', () => {
    it('should return available donation funds', () => {
      const funds = dbQueries.getAllFunds();
      expect(Array.isArray(funds)).toBe(true);
      expect(funds.length).toBeGreaterThanOrEqual(1);
      expect(funds[0]).toHaveProperty('name');
    });

    it('should record donations with receipt IDs', () => {
      const receiptId = `SHR-${Math.floor(100000 + Math.random() * 900000)}`;
      const donation = {
        id: `don-${Date.now()}`,
        receiptId,
        fundId: 'fund-prison',
        fundName: 'Prison & Reentry Support',
        amount: 250,
        frequency: 'monthly',
        donorName: 'Anonymous Supporter',
        donorEmail: 'partner@example.com',
        dedicationNote: 'In memory of Pastor Johnson Sr.',
        dateStr: 'September 2026'
      };

      const saved = dbQueries.recordDonation(donation);
      expect(saved.receiptId).toBe(receiptId);
      expect(saved.amount).toBe(250);

      const submissions = dbQueries.getAdminSubmissions();
      const recorded = submissions.donations.find((d: any) => d.receipt_id === receiptId);
      expect(recorded).toBeDefined();
      expect(recorded.amount).toBe(250);
    });
  });

  describe('Submissions Inboxes & Leads', () => {
    it('should record volunteer applications', () => {
      const vol = {
        id: `vol-test-${Date.now()}`,
        fullName: 'Sarah Jenkins',
        phone: '601-555-0199',
        email: 'sarah.j@example.org',
        city: 'Columbia, MS',
        interests: ['Prison Ministry', 'Community Food Drive'],
        availability: 'Weekends',
        notes: 'Ready to serve.'
      };

      const saved = dbQueries.addVolunteerApplication(vol);
      expect(saved.fullName).toBe('Sarah Jenkins');

      const submissions = dbQueries.getAdminSubmissions();
      expect(submissions.volunteers.some((v: any) => v.id === vol.id)).toBe(true);
    });

    it('should record coaching inquiries and vitality assessment scores', () => {
      const inquiry = {
        id: `coach-test-${Date.now()}`,
        fullName: 'Elder Timothy Green',
        phone: '601-555-0144',
        coachingFormat: '1on1',
        primaryGoal: 'Restoring physical stamina and joint mobility',
        energyScore: 4,
        hydrationLevel: 'Moderate',
        movementLevel: 'Walking daily'
      };

      const saved = dbQueries.addCoachingInquiry(inquiry);
      expect(saved.id).toBe(inquiry.id);

      const submissions = dbQueries.getAdminSubmissions();
      expect(submissions.coaching.some((c: any) => c.id === inquiry.id)).toBe(true);
    });

    it('should record devotional downloads and newsletter subscriptions', () => {
      const lead = {
        id: `lead-test-${Date.now()}`,
        fullName: 'Grace Miller',
        email: 'grace.miller@example.org'
      };
      dbQueries.addDevotionalLead(lead);

      const sub = {
        id: `sub-test-${Date.now()}`,
        email: 'grace.miller@example.org',
        preference: 'both'
      };
      dbQueries.addNewsletterSubscriber(sub);

      const contact = {
        id: `msg-test-${Date.now()}`,
        name: 'Grace Miller',
        email: 'grace.miller@example.org',
        phone: '601-555-0100',
        inquiryType: 'speaking',
        message: 'Requesting Pastor Ella Ruth to speak at our women conference.'
      };
      dbQueries.addContactInquiry(contact);

      const submissions = dbQueries.getAdminSubmissions();
      expect(submissions.leads.some((l: any) => l.email === lead.email)).toBe(true);
      expect(submissions.subscribers.some((s: any) => s.email === sub.email)).toBe(true);
      expect(submissions.contacts.some((c: any) => c.email === contact.email)).toBe(true);
    });
  });
});
