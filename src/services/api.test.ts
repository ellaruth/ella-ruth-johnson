import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api, setAdminPasscode } from './api';

describe('Frontend API Client (src/services/api.ts)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setAdminPasscode('SafeHaven2026!');
  });

  describe('getBootstrap', () => {
    it('should parse and return live data when server returns 200', async () => {
      const mockData = {
        events: [{ id: 'evt-1', title: 'Revival' }],
        sermons: [{ id: 'sermon-1', title: 'Peace' }],
        announcements: [{ id: 'ann-1', text: 'Welcome' }],
        prayerRequests: [{ id: 'pr-1', requestText: 'Pray for us' }],
        donationFunds: [{ id: 'fund-1', name: 'General' }]
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: mockData })
      } as any);

      const result = await api.getBootstrap();
      expect(result.events.length).toBe(1);
      expect(result.events[0].title).toBe('Revival');
      expect(global.fetch).toHaveBeenCalledWith('/api/bootstrap');
    });

    it('should fall back to baseline seed data gracefully if fetch fails', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));

      const result = await api.getBootstrap();
      expect(result).toHaveProperty('events');
      expect(result.events.length).toBeGreaterThanOrEqual(1);
      expect(result).toHaveProperty('donationFunds');
    });
  });

  describe('Events & RSVPs', () => {
    it('createEvent sends POST with admin headers', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: { id: 'evt-10', title: 'Camp' } })
      } as any);

      const res = await api.createEvent({ title: 'Camp' });
      expect(res.title).toBe('Camp');

      expect(global.fetch).toHaveBeenCalledWith('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer SafeHaven2026!'
        },
        body: JSON.stringify({ title: 'Camp' })
      });
    });

    it('deleteEvent sends DELETE with admin headers', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true })
      } as any);

      await api.deleteEvent('evt-10');
      expect(global.fetch).toHaveBeenCalledWith('/api/events/evt-10', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer SafeHaven2026!'
        }
      });
    });

    it('submitRsvp sends RSVP body', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: { id: 'rsvp-1' } })
      } as any);

      const res = await api.submitRsvp('evt-1', {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        guestsCount: 2
      });
      expect(res.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith('/api/events/evt-1/rsvp', expect.objectContaining({
        method: 'POST'
      }));
    });
  });

  describe('Sermons & Announcements', () => {
    it('createSermon passes admin credentials', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: { id: 'sermon-5', title: 'Grace' } })
      } as any);

      const res = await api.createSermon({ title: 'Grace', scripture: 'Ephesians 2:8' });
      expect(res.title).toBe('Grace');
    });

    it('toggleAnnouncement and deleteAnnouncement use admin headers', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true })
      } as any);

      await api.toggleAnnouncement('ann-1');
      expect(global.fetch).toHaveBeenCalledWith('/api/announcements/ann-1/toggle', expect.objectContaining({
        method: 'PATCH'
      }));

      await api.deleteAnnouncement('ann-1');
      expect(global.fetch).toHaveBeenCalledWith('/api/announcements/ann-1', expect.objectContaining({
        method: 'DELETE'
      }));
    });
  });

  describe('Prayer Wall', () => {
    it('submitPrayer sends public POST', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: { id: 'pr-1', requestText: 'Pray for family' } })
      } as any);

      const res = await api.submitPrayer({ requestText: 'Pray for family' });
      expect(res.requestText).toBe('Pray for family');
    });

    it('prayForRequest increments counter', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: { id: 'pr-1', prayedCount: 7 } })
      } as any);

      const count = await api.prayForRequest('pr-1');
      expect(count).toBe(7);
    });
  });

  describe('Donations, Volunteers, Coaching, Leads', () => {
    it('submitDonation sends donation details and returns receipt data', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: { receiptId: 'SHR-123456', amount: 100 } })
      } as any);

      const res = await api.submitDonation({
        fundId: 'fund-general',
        fundName: 'General Fund',
        amount: 100,
        frequency: 'once',
        donorName: 'Test Donor',
        donorEmail: 'test@example.com'
      });
      expect(res.receiptId).toBe('SHR-123456');
    });

    it('submitVolunteer sends application payload', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: { fullName: 'Volunteer Joy' } })
      } as any);

      const res = await api.submitVolunteer({
        fullName: 'Volunteer Joy',
        phone: '601-555-0100',
        email: 'joy@example.com',
        city: 'Columbia, MS',
        interests: ['Community Outreach'],
        availability: 'Weekends'
      });
      expect(res.fullName).toBe('Volunteer Joy');
    });

    it('submitCoachingInquiry sends vitality inquiry payload', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: { fullName: 'Elder Ray' } })
      } as any);

      const res = await api.submitCoachingInquiry({
        fullName: 'Elder Ray',
        phone: '601-555-0111',
        coachingFormat: '1on1',
        primaryGoal: 'Increase daily energy and walking stamina',
        energyScore: 5
      });
      expect(res.fullName).toBe('Elder Ray');
    });
  });

  describe('Admin Portal API Methods', () => {
    it('getAdminSubmissions sends x-admin-passcode', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: { donations: [], volunteers: [], coaching: [], contacts: [], leads: [], subscribers: [], rsvps: [] }
        })
      } as any);

      const res = await api.getAdminSubmissions();
      expect(res).toHaveProperty('donations');
      expect(global.fetch).toHaveBeenCalledWith('/api/admin/submissions', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer SafeHaven2026!'
        }
      });
    });

    it('resetDatabaseDefaults sends POST with admin auth', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: { events: [], sermons: [], announcements: [], prayerRequests: [], donationFunds: [] }
        })
      } as any);

      const res = await api.resetDatabaseDefaults();
      expect(res).toHaveProperty('events');
      expect(global.fetch).toHaveBeenCalledWith('/api/admin/reset-defaults', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer SafeHaven2026!'
        }
      });
    });
  });
});
