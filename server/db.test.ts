import { describe, it, expect, beforeEach } from 'vitest';
import { dbQueries, resetDatabaseToDefaults, initDatabase } from './db.js';

describe('SQLite Database Layer (dbQueries)', () => {
  beforeEach(async () => {
    await initDatabase();
    await resetDatabaseToDefaults();
  });

  describe('Events & RSVPs', () => {
    it('should retrieve all seeded events', async () => {
      const events = await dbQueries.getAllEvents();
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThanOrEqual(1);
      expect(events[0]).toHaveProperty('title');
      expect(events[0]).toHaveProperty('category');
    });

    it('should create a new event and retrieve it', async () => {
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

      const created = await dbQueries.createEvent(newEvent);
      expect(created.id).toBe(newEvent.id);

      const all = await dbQueries.getAllEvents();
      const found = all.find(e => e.id === newEvent.id);
      expect(found).toBeDefined();
      expect(found?.title).toBe('Community Fellowship Banquet');
      expect(found?.attendeesCount).toBe(25);
    });

    it('should delete an event by id', async () => {
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

      await dbQueries.createEvent(newEvent);
      expect((await dbQueries.getAllEvents()).some(e => e.id === newEvent.id)).toBe(true);

      await dbQueries.deleteEvent(newEvent.id);
      expect((await dbQueries.getAllEvents()).some(e => e.id === newEvent.id)).toBe(false);
    });

    it('should record an RSVP and increment event attendees count', async () => {
      const events = await dbQueries.getAllEvents();
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

      const saved = await dbQueries.addEventRsvp(rsvp);
      expect(saved.id).toBe(rsvp.id);

      const refreshed = (await dbQueries.getAllEvents()).find(e => e.id === targetEvent.id);
      expect(refreshed?.attendeesCount).toBe(initialAttendees + 3);
    });
  });

  describe('Sermons', () => {
    it('should retrieve seeded sermons', async () => {
      const sermons = await dbQueries.getAllSermons();
      expect(Array.isArray(sermons)).toBe(true);
      expect(sermons.length).toBeGreaterThanOrEqual(1);
      expect(sermons[0]).toHaveProperty('scripture');
      expect(sermons[0]).toHaveProperty('corePoints');
    });

    it('should create and delete a sermon message', async () => {
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

      await dbQueries.createSermon(sermon);
      const fetched = (await dbQueries.getAllSermons()).find(s => s.id === sermon.id);
      expect(fetched).toBeDefined();
      expect(fetched?.scripture).toBe('Psalm 23:1-6');
      expect(fetched?.corePoints).toContain('He leads beside still waters');

      await dbQueries.deleteSermon(sermon.id);
      expect((await dbQueries.getAllSermons()).some(s => s.id === sermon.id)).toBe(false);
    });
  });

  describe('Announcements Banner Ticker', () => {
    it('should retrieve active announcements', async () => {
      const items = await dbQueries.getAllAnnouncements();
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThanOrEqual(1);
    });

    it('should create, toggle active state, and delete an announcement', async () => {
      const ann = {
        id: `ann-test-${Date.now()}`,
        highlight: 'Special Alert',
        text: 'Youth rally meeting tonight at 6:30 PM.',
        linkTab: 'events',
        date: 'Today',
        active: true
      };

      await dbQueries.createAnnouncement(ann);
      let found = (await dbQueries.getAllAnnouncements()).find(a => a.id === ann.id);
      expect(found).toBeDefined();
      expect(found?.active).toBe(true);

      await dbQueries.toggleAnnouncement(ann.id);
      found = (await dbQueries.getAllAnnouncements()).find(a => a.id === ann.id);
      expect(found?.active).toBe(false);

      await dbQueries.deleteAnnouncement(ann.id);
      expect((await dbQueries.getAllAnnouncements()).some(a => a.id === ann.id)).toBe(false);
    });
  });

  describe('Prayer Wall & Privacy Guard', () => {
    it('should hide private prayer requests from public retrieval by default', async () => {
      const privatePrayer = {
        id: `prayer-priv-${Date.now()}`,
        authorName: 'Confidential Member',
        cityState: 'Columbia, MS',
        requestText: 'Deep personal healing and family intervention.',
        date: 'Today',
        isPrivate: true,
        prayedCount: 1
      };

      await dbQueries.createPrayer(privatePrayer);

      // Public call (includePrivate = false)
      const publicPrayers = await dbQueries.getAllPrayers(false);
      expect(publicPrayers.some(p => p.id === privatePrayer.id)).toBe(false);

      // Staff call (includePrivate = true)
      const staffPrayers = await dbQueries.getAllPrayers(true);
      expect(staffPrayers.some(p => p.id === privatePrayer.id)).toBe(true);
    });

    it('should increment prayer counter atomically', async () => {
      const publicPrayer = {
        id: `prayer-pub-${Date.now()}`,
        authorName: 'Sister Debra',
        cityState: 'Hattiesburg, MS',
        requestText: 'Praying for our church elder’s recovery.',
        date: 'Today',
        isPrivate: false,
        prayedCount: 5
      };

      await dbQueries.createPrayer(publicPrayer);
      const newCount = await dbQueries.incrementPrayerCount(publicPrayer.id);
      expect(newCount).toBe(6);

      const fetched = (await dbQueries.getAllPrayers(true)).find(p => p.id === publicPrayer.id);
      expect(fetched?.prayedCount).toBe(6);
    });
  });

  describe('Donation Funds & Receipts', () => {
    it('should return available donation funds', async () => {
      const funds = await dbQueries.getAllFunds();
      expect(Array.isArray(funds)).toBe(true);
      expect(funds.length).toBeGreaterThanOrEqual(1);
      expect(funds[0]).toHaveProperty('name');
    });

    it('should record donations with receipt IDs', async () => {
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

      const saved = await dbQueries.recordDonation(donation);
      expect(saved.receiptId).toBe(receiptId);
      expect(saved.amount).toBe(250);

      const submissions = await dbQueries.getAdminSubmissions();
      const recorded = submissions.donations.find((d: any) => d.receipt_id === receiptId);
      expect(recorded).toBeDefined();
      expect(Number(recorded.amount)).toBe(250);
    });
  });

  describe('Submissions Inboxes & Leads', () => {
    it('should record volunteer applications', async () => {
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

      const saved = await dbQueries.addVolunteerApplication(vol);
      expect(saved.fullName).toBe('Sarah Jenkins');

      const submissions = await dbQueries.getAdminSubmissions();
      expect(submissions.volunteers.some((v: any) => v.id === vol.id)).toBe(true);
    });

    it('should record coaching inquiries and vitality assessment scores', async () => {
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

      const saved = await dbQueries.addCoachingInquiry(inquiry);
      expect(saved.id).toBe(inquiry.id);

      const submissions = await dbQueries.getAdminSubmissions();
      expect(submissions.coaching.some((c: any) => c.id === inquiry.id)).toBe(true);
    });

    it('should record devotional downloads and newsletter subscriptions', async () => {
      const lead = {
        id: `lead-test-${Date.now()}`,
        fullName: 'Grace Miller',
        email: 'grace.miller@example.org'
      };
      await dbQueries.addDevotionalLead(lead);

      const sub = {
        id: `sub-test-${Date.now()}`,
        email: 'grace.miller@example.org',
        preference: 'both'
      };
      await dbQueries.addNewsletterSubscriber(sub);

      const contact = {
        id: `msg-test-${Date.now()}`,
        name: 'Grace Miller',
        email: 'grace.miller@example.org',
        phone: '601-555-0100',
        inquiryType: 'speaking',
        message: 'Requesting Pastor Ella Ruth to speak at our women conference.'
      };
      await dbQueries.addContactInquiry(contact);

      const submissions = await dbQueries.getAdminSubmissions();
      expect(submissions.leads.some((l: any) => l.email === lead.email)).toBe(true);
      expect(submissions.subscribers.some((s: any) => s.email === sub.email)).toBe(true);
      expect(submissions.contacts.some((c: any) => c.email === contact.email)).toBe(true);
    });
  });
});
