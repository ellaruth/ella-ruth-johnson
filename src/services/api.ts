import { EventItem, SermonTeaching, AnnouncementItem, PrayerRequest, DonationFund } from '../types';
import { 
  UPCOMING_EVENTS, 
  SERMON_TEACHINGS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_PRAYER_REQUESTS,
  DONATION_FUNDS
} from '../data/initialData';

const BASE_URL = ''; // Relative path leverages Vite dev server & proxy

// In-memory + sessionStorage for authenticated admin JWT session token.
// The raw passcode is NEVER stored — only the short-lived signed token.
let inMemoryAdminToken: string | null = null;

export function setAdminToken(token: string | null): void {
  inMemoryAdminToken = token;
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      if (token) {
        sessionStorage.setItem('sh_admin_token', token);
      } else {
        sessionStorage.removeItem('sh_admin_token');
      }
    }
  } catch {
    // Ignore storage restrictions in iframe / private test environments
  }
}

// Kept for backward compatibility with tests and callers
export const setAdminPasscode = setAdminToken;

export function getAdminToken(): string | null {
  if (inMemoryAdminToken) return inMemoryAdminToken;
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return sessionStorage.getItem('sh_admin_token');
    }
  } catch {
    // Ignore
  }
  return null;
}

// Kept for backward compat — now clears JWT token
export function getAdminPasscode(): string | null {
  // Returns non-null if a token exists (used for auth-gate checks)
  return getAdminToken();
}

export function clearAdminPasscode(): void {
  setAdminToken(null);
  // Also clear legacy key from pre-JWT sessions
  try { sessionStorage.removeItem('sh_admin_passcode'); } catch { /* ignore */ }
}

function getAdminHeaders(): HeadersInit {
  const token = getAdminToken() || '';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

export interface BootstrapData {
  events: EventItem[];
  sermons: SermonTeaching[];
  announcements: AnnouncementItem[];
  prayerRequests: PrayerRequest[];
  donationFunds: DonationFund[];
}

export interface AdminSubmissions {
  donations: any[];
  volunteers: any[];
  coaching: any[];
  contacts: any[];
  leads: any[];
  subscribers: any[];
  rsvps: any[];
}

export const api = {
  // 0. Staff Authentication & Verification
  async verifyAdminPasscode(passcode: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      const json = await res.json();
      if (res.ok && json.success && json.token) {
        // Store the JWT token — never store the raw passcode
        setAdminToken(json.token);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Passcode verification failed:', err);
      return false;
    }
  },

  // 1. Initial Page Bootstrap (Reads all live records from database)
  async getBootstrap(): Promise<BootstrapData> {
    try {
      const res = await fetch(`${BASE_URL}/api/bootstrap`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
      throw new Error('Invalid response structure');
    } catch (err) {
      console.warn('API /api/bootstrap unavailable, using baseline data:', err);
      return {
        events: UPCOMING_EVENTS,
        sermons: SERMON_TEACHINGS,
        announcements: INITIAL_ANNOUNCEMENTS,
        prayerRequests: INITIAL_PRAYER_REQUESTS,
        donationFunds: DONATION_FUNDS
      };
    }
  },

  // 2. Events & RSVPs
  async createEvent(eventData: Partial<EventItem>): Promise<EventItem> {
    const res = await fetch(`${BASE_URL}/api/events`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(eventData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to create event');
    return json.data;
  },

  async deleteEvent(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/events/${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders()
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to delete event');
  },

  async submitRsvp(eventId: string, rsvpData: { fullName: string; email: string; guestsCount: number; notes?: string }) {
    const res = await fetch(`${BASE_URL}/api/events/${eventId}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rsvpData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to confirm RSVP');
    return json;
  },

  // 3. Sermons
  async createSermon(sermonData: Partial<SermonTeaching>): Promise<SermonTeaching> {
    const res = await fetch(`${BASE_URL}/api/sermons`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(sermonData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to create sermon');
    return json.data;
  },

  async deleteSermon(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/sermons/${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders()
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to delete sermon');
  },

  // 4. Announcements
  async createAnnouncement(annData: Partial<AnnouncementItem>): Promise<AnnouncementItem> {
    const res = await fetch(`${BASE_URL}/api/announcements`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(annData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to create announcement');
    return json.data;
  },

  async toggleAnnouncement(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/announcements/${id}/toggle`, {
      method: 'PATCH',
      headers: getAdminHeaders()
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to toggle announcement');
  },

  async deleteAnnouncement(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/announcements/${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders()
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to delete announcement');
  },

  // 5. Prayer Wall
  async submitPrayer(prayerData: Partial<PrayerRequest>): Promise<PrayerRequest> {
    const res = await fetch(`${BASE_URL}/api/prayers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prayerData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to submit prayer petition');
    return json.data;
  },

  async prayForRequest(id: string): Promise<number> {
    const res = await fetch(`${BASE_URL}/api/prayers/${id}/pray`, {
      method: 'POST'
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to record prayer');
    return json.data.prayedCount;
  },

  // 6. Donations & Impact
  async getDonationFunds(): Promise<DonationFund[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/donations/funds`);
      const json = await res.json();
      if (json.success && json.data) return json.data;
      return DONATION_FUNDS;
    } catch {
      return DONATION_FUNDS;
    }
  },

  async submitDonation(donationData: any) {
    const res = await fetch(`${BASE_URL}/api/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donationData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to record donation');
    return json.data || json;
  },

  // 7. Volunteers
  async submitVolunteerApplication(appData: any) {
    const res = await fetch(`${BASE_URL}/api/volunteers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to submit volunteer application');
    return json.data || json;
  },

  async submitVolunteer(appData: any) {
    return this.submitVolunteerApplication(appData);
  },

  // 8. Coaching
  async submitCoachingInquiry(inquiryData: any) {
    const res = await fetch(`${BASE_URL}/api/coaching/inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to submit coaching inquiry');
    return json.data || json;
  },

  // 9. Devotional Download Lead (Supports either (name, email) or ({ fullName, email }))
  async submitDevotionalDownload(param1: string | { fullName: string; email: string }, param2?: string) {
    const payload = typeof param1 === 'object'
      ? { fullName: param1.fullName, email: param1.email }
      : { fullName: param1, email: param2 || '' };

    const res = await fetch(`${BASE_URL}/api/devotional/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to process devotional request');
    return json;
  },

  // 10. Newsletter
  async subscribeNewsletter(email: string, preference: 'both' | 'ministry' | 'wellness') {
    const res = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, preference })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to subscribe');
    return json;
  },

  // 11. Contact Message
  async submitContactMessage(contactData: { name: string; email: string; phone?: string; inquiryType: string; message: string }) {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to submit message');
    return json;
  },

  async submitContact(contactData: any) {
    return this.submitContactMessage(contactData);
  },

  // 12. Admin Submissions Review
  async getAdminSubmissions(): Promise<AdminSubmissions> {
    const res = await fetch(`${BASE_URL}/api/admin/submissions`, {
      headers: getAdminHeaders()
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to load staff submissions');
    return json.data;
  },

  // 13. Admin Reset Defaults
  async resetDatabaseDefaults(): Promise<{ events: EventItem[]; sermons: SermonTeaching[]; announcements: AnnouncementItem[]; prayerRequests: PrayerRequest[] }> {
    const res = await fetch(`${BASE_URL}/api/admin/reset-defaults`, {
      method: 'POST',
      headers: getAdminHeaders()
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to reset database');
    return json.data;
  }
};
