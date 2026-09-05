import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app, ADMIN_PASSCODE } from '../server.ts';
import { resetDatabaseToDefaults } from './db.ts';

describe('REST API Endpoints & Security (server.ts)', () => {
  beforeEach(async () => {
    await resetDatabaseToDefaults();
  });

  describe('OWASP Security Headers', () => {
    it('should include nosniff, SAMEORIGIN, and Referrer-Policy on responses', async () => {
      const res = await request(app).get('/api/bootstrap');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
      expect(res.headers['x-xss-protection']).toBe('1; mode=block');
      expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    });
  });

  describe('GET /api/bootstrap', () => {
    it('should return all core collections for instant initial render', async () => {
      const res = await request(app).get('/api/bootstrap');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.events)).toBe(true);
      expect(Array.isArray(res.body.data.sermons)).toBe(true);
      expect(Array.isArray(res.body.data.announcements)).toBe(true);
      expect(Array.isArray(res.body.data.prayerRequests)).toBe(true);
      expect(Array.isArray(res.body.data.donationFunds)).toBe(true);
    });
  });

  describe('Events Endpoints', () => {
    it('GET /api/events should return an array of events', async () => {
      const res = await request(app).get('/api/events');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('POST /api/events should block unauthorized callers with 401', async () => {
      const res = await request(app)
        .post('/api/events')
        .send({ title: 'Unauthorized Conference' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/events should allow staff with x-admin-passcode', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('x-admin-passcode', ADMIN_PASSCODE)
        .send({
          title: 'Authorized Staff Summit',
          category: 'Conference',
          date: 'Nov 1, 2026',
          time: '9:00 AM',
          location: 'Columbia Sanctuary'
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Authorized Staff Summit');
    });

    it('POST /api/events should validate title is provided', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('x-admin-passcode', ADMIN_PASSCODE)
        .send({});
      expect(res.status).toBe(400);
    });

    it('DELETE /api/events/:id should require admin authentication', async () => {
      const res = await request(app).delete('/api/events/evt-1');
      expect(res.status).toBe(401);

      const authedRes = await request(app)
        .delete('/api/events/evt-1')
        .set('x-admin-passcode', ADMIN_PASSCODE);
      expect(authedRes.status).toBe(200);
      expect(authedRes.body.success).toBe(true);
    });

    it('POST /api/events/:id/rsvp should record RSVP and validate fields', async () => {
      const badRes = await request(app)
        .post('/api/events/evt-2/rsvp')
        .send({ fullName: '' });
      expect(badRes.status).toBe(400);

      const goodRes = await request(app)
        .post('/api/events/evt-2/rsvp')
        .send({
          fullName: 'Deacon Paul White',
          email: 'paul.white@example.org',
          guestsCount: 2
        });
      expect(goodRes.status).toBe(201);
      expect(goodRes.body.success).toBe(true);
      expect(goodRes.body.data.fullName).toBe('Deacon Paul White');
    });
  });

  describe('Sermons Endpoints', () => {
    it('GET /api/sermons should return sermons list', async () => {
      const res = await request(app).get('/api/sermons');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('POST /api/sermons should reject non-admin and accept admin with valid body', async () => {
      const unauth = await request(app).post('/api/sermons').send({ title: 'Test' });
      expect(unauth.status).toBe(401);

      const auth = await request(app)
        .post('/api/sermons')
        .set('x-admin-passcode', ADMIN_PASSCODE)
        .send({
          title: 'Walking in Light',
          scripture: '1 John 1:7',
          series: 'Divine Transformation',
          summary: 'Living honestly before God and community.'
        });
      expect(auth.status).toBe(201);
      expect(auth.body.data.scripture).toBe('1 John 1:7');
    });

    it('DELETE /api/sermons/:id requires admin passcode', async () => {
      const res = await request(app)
        .delete('/api/sermons/sermon-1')
        .set('x-admin-passcode', ADMIN_PASSCODE);
      expect(res.status).toBe(200);
    });
  });

  describe('Announcements Ticker Endpoints', () => {
    it('POST /api/announcements creates announcement with admin auth', async () => {
      const res = await request(app)
        .post('/api/announcements')
        .set('x-admin-passcode', ADMIN_PASSCODE)
        .send({
          highlight: 'Urgent Update',
          text: 'Food pantry distribution is moved to Thursday.'
        });
      expect(res.status).toBe(201);
      expect(res.body.data.highlight).toBe('Urgent Update');
    });

    it('PATCH /api/announcements/:id/toggle toggles status with auth', async () => {
      const res = await request(app)
        .patch('/api/announcements/ann-1/toggle')
        .set('x-admin-passcode', ADMIN_PASSCODE);
      expect(res.status).toBe(200);
    });

    it('DELETE /api/announcements/:id deletes announcement with auth', async () => {
      const res = await request(app)
        .delete('/api/announcements/ann-1')
        .set('x-admin-passcode', ADMIN_PASSCODE);
      expect(res.status).toBe(200);
    });
  });

  describe('Prayer Wall Endpoints', () => {
    it('GET /api/prayers returns public prayers without leaking private petitions', async () => {
      // Create private prayer
      await request(app)
        .post('/api/prayers')
        .send({
          authorName: 'Secret Member',
          requestText: 'Personal private medical battle',
          isPrivate: true
        });

      const res = await request(app).get('/api/prayers');
      expect(res.status).toBe(200);
      const hasPrivate = res.body.data.some((p: any) => p.isPrivate === true);
      expect(hasPrivate).toBe(false);
    });

    it('POST /api/prayers validates requestText', async () => {
      const res = await request(app).post('/api/prayers').send({ authorName: 'John' });
      expect(res.status).toBe(400);
    });

    it('POST /api/prayers/:id/pray increments counter', async () => {
      const createRes = await request(app)
        .post('/api/prayers')
        .send({ requestText: 'Strength for our youth group.', isPrivate: false });
      const prayerId = createRes.body.data.id;

      const prayRes = await request(app).post(`/api/prayers/${prayerId}/pray`);
      expect(prayRes.status).toBe(200);
      expect(prayRes.body.data.prayedCount).toBe(2);
    });
  });

  describe('Donations Endpoints', () => {
    it('GET /api/donations/funds returns available funds', async () => {
      const res = await request(app).get('/api/donations/funds');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('POST /api/donations rejects non-positive or out-of-range amounts', async () => {
      const zero = await request(app).post('/api/donations').send({ amount: 0 });
      expect(zero.status).toBe(400);

      const excessive = await request(app).post('/api/donations').send({ amount: 9999999 });
      expect(excessive.status).toBe(400);
    });

    it('POST /api/donations generates official SHR receipt number', async () => {
      const res = await request(app)
        .post('/api/donations')
        .send({
          fundId: 'fund-general',
          fundName: 'General Fund',
          amount: 150,
          frequency: 'once',
          donorName: 'Evelyn Carter',
          donorEmail: 'evelyn@example.org'
        });
      expect(res.status).toBe(201);
      expect(res.body.data.receiptId).toMatch(/^SHR-\d{6}$/);
    });
  });

  describe('Submissions: Volunteers, Coaching, Devotional, Newsletter, Contact', () => {
    it('POST /api/volunteers validates name and email', async () => {
      const bad = await request(app).post('/api/volunteers').send({ fullName: '' });
      expect(bad.status).toBe(400);

      const good = await request(app).post('/api/volunteers').send({
        fullName: 'Samuel Adams',
        email: 'samuel@example.org',
        interests: ['Prison Ministry']
      });
      expect(good.status).toBe(201);
    });

    it('POST /api/coaching/inquiry captures vitality score', async () => {
      const res = await request(app).post('/api/coaching/inquiry').send({
        fullName: 'Martha Vance',
        phone: '601-555-0188',
        coachingFormat: '1on1',
        energyScore: 5,
        movementLevel: 'Active daily walker'
      });
      expect(res.status).toBe(201);
      expect(res.body.data.energyScore).toBe(5);
    });

    it('POST /api/devotional/download requires valid email', async () => {
      const bad = await request(app).post('/api/devotional/download').send({ email: 'invalid' });
      expect(bad.status).toBe(400);

      const good = await request(app).post('/api/devotional/download').send({
        fullName: 'Esther Luke',
        email: 'esther@example.org'
      });
      expect(good.status).toBe(201);
    });

    it('POST /api/newsletter/subscribe requires valid email', async () => {
      const good = await request(app).post('/api/newsletter/subscribe').send({
        email: 'subscriber@example.org',
        preference: 'both'
      });
      expect(good.status).toBe(201);
    });

    it('POST /api/contact validates name, email, and message', async () => {
      const bad = await request(app).post('/api/contact').send({ name: 'Bob' });
      expect(bad.status).toBe(400);

      const good = await request(app).post('/api/contact').send({
        name: 'Pastor David Clark',
        email: 'david.clark@example.org',
        message: 'Blessings on the ministry team.'
      });
      expect(good.status).toBe(201);
    });
  });

  describe('Staff Admin Portal Endpoints', () => {
    it('GET /api/admin/submissions blocks public access and allows authenticated staff', async () => {
      const unauth = await request(app).get('/api/admin/submissions');
      expect(unauth.status).toBe(401);

      const auth = await request(app)
        .get('/api/admin/submissions')
        .set('x-admin-passcode', ADMIN_PASSCODE);
      expect(auth.status).toBe(200);
      expect(auth.body.data).toHaveProperty('donations');
      expect(auth.body.data).toHaveProperty('volunteers');
      expect(auth.body.data).toHaveProperty('coaching');
      expect(auth.body.data).toHaveProperty('contacts');
    });

    it('POST /api/admin/reset-defaults resets database safely with auth', async () => {
      const res = await request(app)
        .post('/api/admin/reset-defaults')
        .set('x-admin-passcode', ADMIN_PASSCODE);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.events.length).toBeGreaterThanOrEqual(1);
    });
  });
});
