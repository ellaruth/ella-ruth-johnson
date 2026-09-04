import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactPage } from './ContactPage';
import { EventsPage } from './EventsPage';
import { CoachingPage } from './CoachingPage';
import { TeachingPage } from './TeachingPage';
import { api } from '../../services/api';

vi.mock('../../services/api', () => ({
  api: {
    submitContact: vi.fn(),
    submitRsvp: vi.fn(),
    submitCoachingInquiry: vi.fn(),
    prayForRequest: vi.fn()
  }
}));

describe('Page Components Integration Tests (src/components/pages)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ContactPage', () => {
    it('renders contact information and form inputs', () => {
      render(
        <ContactPage
          onNavigate={() => {}}
          onOpenPrayer={() => {}}
          onOpenDonate={() => {}}
        />
      );

      expect(screen.getByText(/Columbia, Mississippi 39429/i)).toBeInTheDocument();
      expect(screen.getByText(/director@safehavenoutreach\.org/i)).toBeInTheDocument();
      expect(screen.getByText(/How Can We Help You\?/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Brenda Jackson/i)).toBeInTheDocument();
    });

    it('submits contact message and displays confirmation card', async () => {
      (api.submitContact as any).mockResolvedValueOnce({ id: 'msg-1' });

      render(
        <ContactPage
          onNavigate={() => {}}
          onOpenPrayer={() => {}}
          onOpenDonate={() => {}}
        />
      );

      const nameInput = screen.getByPlaceholderText(/Brenda Jackson/i);
      const emailInput = screen.getByPlaceholderText(/brenda@example\.com/i);
      const messageInput = screen.getByPlaceholderText(/Share how we can partner/i);

      fireEvent.change(nameInput, { target: { value: 'Sister Teresa' } });
      fireEvent.change(emailInput, { target: { value: 'teresa@example.org' } });
      fireEvent.change(messageInput, { target: { value: 'Interested in partnering for youth ministry.' } });

      const submitBtn = screen.getByRole('button', { name: /Send Message/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(api.submitContact).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Sister Teresa',
            email: 'teresa@example.org',
            message: 'Interested in partnering for youth ministry.'
          })
        );
        expect(screen.getByText(/Message Sent/i)).toBeInTheDocument();
      });
    });
  });

  describe('EventsPage', () => {
    const mockEvents = [
      {
        id: 'evt-100',
        title: 'Community Honor Banquet',
        category: 'Community Dinner',
        date: 'November 20, 2026',
        time: '6:00 PM',
        location: 'Columbia Civic Center',
        description: 'An annual night honoring local volunteers.',
        image: 'https://example.com/dinner.jpg',
        isUpcoming: true,
        registrationRequired: true,
        attendeesCount: 150
      }
    ];

    it('renders event cards with details and RSVP button', () => {
      render(
        <EventsPage
          events={mockEvents}
          onNavigate={() => {}}
          onOpenDonate={() => {}}
        />
      );

      expect(screen.getByText(/Community Honor Banquet/i)).toBeInTheDocument();
      expect(screen.getByText(/November 20, 2026/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reserve Seat \/ RSVP/i })).toBeInTheDocument();
    });

    it('opens RSVP modal and completes registration', async () => {
      (api.submitRsvp as any).mockResolvedValueOnce({ success: true });

      render(
        <EventsPage
          events={mockEvents}
          onNavigate={() => {}}
          onOpenDonate={() => {}}
        />
      );

      const rsvpBtn = screen.getByRole('button', { name: /Reserve Seat \/ RSVP/i });
      fireEvent.click(rsvpBtn);

      expect(screen.getByText(/Event RSVP/i)).toBeInTheDocument();

      const nameInput = screen.getByPlaceholderText(/Angela Coleman/i);
      const emailInput = screen.getByPlaceholderText(/angela@example\.com/i);

      fireEvent.change(nameInput, { target: { value: 'Daniel Vance' } });
      fireEvent.change(emailInput, { target: { value: 'daniel@example.org' } });

      const confirmBtn = screen.getByRole('button', { name: /Confirm Attendance/i });
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(api.submitRsvp).toHaveBeenCalledWith(
          'evt-100',
          expect.objectContaining({
            fullName: 'Daniel Vance',
            email: 'daniel@example.org'
          })
        );
        expect(screen.getByText(/Seat Reserved/i)).toBeInTheDocument();
      });
    });
  });

  describe('CoachingPage', () => {
    it('renders vitality assessment and coaching consultation form', () => {
      render(
        <CoachingPage
          onNavigate={() => {}}
          onOpenDevotional={() => {}}
        />
      );

      expect(screen.getByText(/60-Second Vitality Check-In/i)).toBeInTheDocument();
      expect(screen.getByText(/Inquire About Coaching or Speaking/i)).toBeInTheDocument();
    });

    it('submits consultation inquiry and displays confirmation', async () => {
      (api.submitCoachingInquiry as any).mockResolvedValueOnce({ fullName: 'Brenda Washington' });

      render(
        <CoachingPage
          onNavigate={() => {}}
          onOpenDevotional={() => {}}
        />
      );

      const nameInput = screen.getByPlaceholderText(/Brenda Washington/i);
      const phoneInput = screen.getByPlaceholderText(/\(601\) 555-0199/i);

      fireEvent.change(nameInput, { target: { value: 'Brenda Washington' } });
      fireEvent.change(phoneInput, { target: { value: '601-555-9999' } });

      const submitBtn = screen.getByRole('button', { name: /Submit Consultation Request/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(api.submitCoachingInquiry).toHaveBeenCalledWith(
          expect.objectContaining({
            fullName: 'Brenda Washington',
            phone: '601-555-9999'
          })
        );
        expect(screen.getByText(/Inquiry Received/i)).toBeInTheDocument();
      });
    });
  });

  describe('TeachingPage', () => {
    const mockSermons = [
      {
        id: 'sermon-10',
        title: 'Restoring What Was Lost',
        scripture: 'Joel 2:25',
        series: 'Restoration',
        date: 'September 2026',
        duration: '45 min',
        summary: 'God can restore the years the locusts have eaten.',
        corePoints: ['Renewal of hope', 'Faith in dry seasons'],
        reflectionPrayer: 'Lord, restore our strength.',
        featuredQuote: '“He is faithful to restore.”',
        audioPreviewAvailable: true
      }
    ];

    const mockPrayers = [
      {
        id: 'pr-55',
        authorName: 'Brother Thomas',
        cityState: 'Columbia, MS',
        requestText: 'Pray for our young adults seeking guidance.',
        date: '2 hours ago',
        isPrivate: false,
        prayedCount: 12
      }
    ];

    it('renders sermon message, prayer wall, and increments prayer counter', () => {
      const onPrayMock = vi.fn();

      render(
        <TeachingPage
          sermons={mockSermons}
          prayerRequests={mockPrayers}
          onNavigate={() => {}}
          onOpenPrayer={() => {}}
          onPrayForRequest={onPrayMock}
        />
      );

      expect(screen.getAllByText(/Restoring What Was Lost/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/Community Prayer Wall/i)).toBeInTheDocument();
      expect(screen.getByText(/Brother Thomas/i)).toBeInTheDocument();

      const prayBtn = screen.getByRole('button', { name: /Prayed \(12\)/i });
      fireEvent.click(prayBtn);

      expect(onPrayMock).toHaveBeenCalledWith('pr-55');
    });
  });
});
