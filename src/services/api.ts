import { EventItem, SermonTeaching, AnnouncementItem, PrayerRequest, DonationFund } from '../types';
import { 
  UPCOMING_EVENTS, 
  SERMON_TEACHINGS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_PRAYER_REQUESTS,
  DONATION_FUNDS
} from '../data/initialData';

const BASE_URL = ''; // Relative path leverages Vite dev server & proxy
const ADMIN_PASSCODE = 'SafeHaven2026!';

function getAdminHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-admin-passcode': ADMIN_PASSCODE
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
  // 1. Initial Page Bootstrap (Reads all live records from SQLite)
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
    if (!json.success) throw new Error(json.error || 'Failed to update prayer count');
    return json.data.prayedCount;
  },

  // 6. Donations
  async submitDonation(donationData: {
    fundId: string;
    fundName: string;
    amount: number;
    frequency: string;
    donorName: string;
    donorEmail: string;
    dedicationNote?: string;
  }) {
    const res = await fetch(`${BASE_URL}/api/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donationData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to process donation');
    return json.data;
  },

  // 7. Volunteers
  async submitVolunteer(appData: {
    fullName: string;
    phone: string;
    email: string;
    city: string;
    interests: string[];
    availability: string;
    notes?: string;
  }) {
    const res = await fetch(`${BASE_URL}/api/volunteers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to submit volunteer application');
    return json.data;
  },

  // 8. Coaching Inquiries & Vitality Assessment
  async submitCoachingInquiry(inquiryData: {
    fullName: string;
    phone: string;
    coachingFormat: string;
    primaryGoal: string;
    energyScore?: number;
    hydrationLevel?: string;
    movementLevel?: string;
  }) {
    const res = await fetch(`${BASE_URL}/api/coaching/inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to submit coaching inquiry');
    return json.data;
  },

  // 9. Devotional Download Lead
  async submitDevotionalDownload(leadData: { fullName?: string; email: string }) {
    const res = await fetch(`${BASE_URL}/api/devotional/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to register devotional download');
    return json.data;
  },

  // 10. Newsletter
  async subscribeNewsletter(email: string, preference: string = 'both') {
    const res = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, preference })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to subscribe to newsletter');
    return json.data;
  },

  // 11. Contact Form
  async submitContact(contactData: {
    name: string;
    email: string;
    phone?: string;
    inquiryType: string;
    message: string;
  }) {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to send message');
    return json.data;
  },

  // 12. Admin Submissions Review (Authenticated staff only)
  async getAdminSubmissions(): Promise<AdminSubmissions> {
    const res = await fetch(`${BASE_URL}/api/admin/submissions`, {
      headers: getAdminHeaders()
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch admin submissions');
    return json.data;
  },

  // 13. Admin Reset to Defaults (Authenticated staff only)
  async resetDatabaseDefaults(): Promise<BootstrapData> {
    const res = await fetch(`${BASE_URL}/api/admin/reset-defaults`, {
      method: 'POST',
      headers: getAdminHeaders()
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to reset database defaults');
    return json.data;
  }
};
