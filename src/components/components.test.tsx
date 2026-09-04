import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DonationModal } from './DonationModal';
import { VolunteerModal } from './VolunteerModal';
import { PrayerModal } from './PrayerModal';
import { DevotionalDownloadModal } from './DevotionalDownloadModal';
import { BannerAnnouncement } from './BannerAnnouncement';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    submitDonation: vi.fn(),
    submitVolunteer: vi.fn(),
    submitPrayer: vi.fn(),
    submitDevotionalDownload: vi.fn(),
    subscribeNewsletter: vi.fn()
  }
}));

describe('Modal & Core Components (src/components)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('DonationModal', () => {
    it('does not render when isOpen is false', () => {
      const { container } = render(
        <DonationModal isOpen={false} onClose={() => {}} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders donation funds, presets, and allows choosing amounts', () => {
      render(<DonationModal isOpen={true} onClose={() => {}} />);
      expect(screen.getByText(/Support Safe Haven Ministries/i)).toBeInTheDocument();
      expect(screen.getByText(/Designate Your Gift/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^\$100$/i })).toBeInTheDocument();
    });

    it('submits donation and shows receipt confirmation', async () => {
      (api.submitDonation as any).mockResolvedValueOnce({
        id: 'don-1',
        receiptId: 'SHR-999888',
        amount: 100,
        fundName: 'General Fund',
        dateStr: 'September 2026'
      });

      render(<DonationModal isOpen={true} onClose={() => {}} />);

      const nameInput = screen.getByPlaceholderText(/Joyce Daniels/i);
      const emailInput = screen.getByPlaceholderText(/joyce@example\.com/i);

      fireEvent.change(nameInput, { target: { value: 'Hannah Abbott' } });
      fireEvent.change(emailInput, { target: { value: 'hannah@example.com' } });

      const submitBtn = screen.getByRole('button', { name: /Give \$100/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(api.submitDonation).toHaveBeenCalled();
        expect(screen.getByText(/SHR-999888/i)).toBeInTheDocument();
      });
    });
  });

  describe('VolunteerModal', () => {
    it('renders role options and validates inputs', async () => {
      render(<VolunteerModal isOpen={true} onClose={() => {}} />);
      expect(screen.getByText(/Volunteer with Safe Haven/i)).toBeInTheDocument();
      expect(screen.getByText(/Prison & Reentry Mentorship/i)).toBeInTheDocument();

      const submitBtn = screen.getByRole('button', { name: /Submit Volunteer Interest/i });
      fireEvent.click(submitBtn);
      expect(api.submitVolunteer).not.toHaveBeenCalled();
    });

    it('submits volunteer application when fields are filled', async () => {
      (api.submitVolunteer as any).mockResolvedValueOnce({ fullName: 'Caleb Vance' });

      render(<VolunteerModal isOpen={true} onClose={() => {}} />);

      const nameInput = screen.getByPlaceholderText(/Sister Angela/i);
      const phoneInput = screen.getByPlaceholderText(/\(601\) 555-0199/i);
      const emailInput = screen.getByPlaceholderText(/angela@example\.com/i);

      fireEvent.change(nameInput, { target: { value: 'Caleb Vance' } });
      fireEvent.change(phoneInput, { target: { value: '601-555-0123' } });
      fireEvent.change(emailInput, { target: { value: 'caleb@example.org' } });

      const submitBtn = screen.getByRole('button', { name: /Submit Volunteer Interest/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(api.submitVolunteer).toHaveBeenCalledWith(
          expect.objectContaining({
            fullName: 'Caleb Vance',
            email: 'caleb@example.org'
          })
        );
        expect(screen.getByText(/Thank You for Serving!/i)).toBeInTheDocument();
      });
    });
  });

  describe('PrayerModal', () => {
    it('calls onSubmitPrayer when prayer text is entered', () => {
      const mockSubmit = vi.fn();
      render(<PrayerModal isOpen={true} onClose={() => {}} onSubmitPrayer={mockSubmit} />);

      const textarea = screen.getByPlaceholderText(/Share what you are believing God for\.\.\./i);
      fireEvent.change(textarea, { target: { value: 'Please pray for my mother recovery.' } });

      const submitBtn = screen.getByRole('button', { name: /Send Prayer Request/i });
      fireEvent.click(submitBtn);

      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          requestText: 'Please pray for my mother recovery.'
        })
      );
      expect(screen.getByText(/Petition Received/i)).toBeInTheDocument();
    });
  });

  describe('DevotionalDownloadModal', () => {
    it('renders devotional form and triggers download lead on submit', async () => {
      (api.submitDevotionalDownload as any).mockResolvedValueOnce({ id: 'lead-1' });

      render(<DevotionalDownloadModal isOpen={true} onClose={() => {}} />);
      expect(screen.getByText(/Free Devotional Guide/i)).toBeInTheDocument();
      expect(screen.getByText(/Coach Ella Ruth's 7-Day Morning Vitality Blueprint/i)).toBeInTheDocument();

      const nameInput = screen.getByPlaceholderText(/^Carolyn$/i);
      const emailInput = screen.getByPlaceholderText(/carolyn@example\.com/i);
      fireEvent.change(nameInput, { target: { value: 'Carolyn Test' } });
      fireEvent.change(emailInput, { target: { value: 'devotional@example.com' } });

      const downloadBtn = screen.getByRole('button', { name: /Get Free 7-Day Guide/i });
      fireEvent.click(downloadBtn);

      await waitFor(() => {
        expect(api.submitDevotionalDownload).toHaveBeenCalled();
        expect(screen.getByText(/Your Devotional is on Its Way!/i)).toBeInTheDocument();
        expect(screen.getByText(/Waking the Temple: Breath, Water & Consecration/i)).toBeInTheDocument();
      });
    });
  });

  describe('BannerAnnouncement', () => {
    it('renders announcement and handles dismissal', () => {
      const announcements = [{
        id: 'ann-1',
        highlight: 'Special Notice',
        text: 'Prayer meeting at 7:00 PM.',
        linkTab: 'events' as const,
        date: 'Today',
        active: true
      }];

      const onNavigate = vi.fn();
      render(<BannerAnnouncement announcements={announcements} onNavigate={onNavigate} />);

      expect(screen.getByText(/Special Notice/i)).toBeInTheDocument();
      expect(screen.getByText(/Prayer meeting at 7:00 PM\./i)).toBeInTheDocument();

      const dismissBtn = screen.getByLabelText(/Dismiss announcement/i);
      fireEvent.click(dismissBtn);

      expect(screen.queryByText(/Prayer meeting at 7:00 PM\./i)).not.toBeInTheDocument();
    });
  });

  describe('Navbar', () => {
    it('renders all core navigation links', () => {
      render(
        <Navbar
          currentTab="home"
          onNavigate={() => {}}
          onOpenDonate={() => {}}
          onOpenAdmin={() => {}}
        />
      );

      expect(screen.getAllByText('Home')[0]).toBeInTheDocument();
      expect(screen.getAllByText('85 & Thriving')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Sermons')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Events')[0]).toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('handles newsletter subscription submit', async () => {
      (api.subscribeNewsletter as any).mockResolvedValueOnce({ id: 'sub-1' });

      render(
        <Footer
          onNavigate={() => {}}
          onOpenDonate={() => {}}
          onOpenAdmin={() => {}}
        />
      );

      const emailInput = screen.getByPlaceholderText(/Enter email address/i);
      fireEvent.change(emailInput, { target: { value: 'newsletter@example.com' } });

      const submitBtn = screen.getByRole('button', { name: /Join/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(api.subscribeNewsletter).toHaveBeenCalledWith('newsletter@example.com', 'both');
        expect(screen.getByText(/Thank you! You have been subscribed\./i)).toBeInTheDocument();
      });
    });
  });
});
