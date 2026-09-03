import React, { useState, useEffect } from 'react';
import { 
  PageTab, 
  EventItem, 
  SermonTeaching, 
  AnnouncementItem, 
  PrayerRequest 
} from './types';
import { 
  UPCOMING_EVENTS, 
  SERMON_TEACHINGS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_PRAYER_REQUESTS 
} from './data/initialData';
import { api } from './services/api';

// Layout Components
import { BannerAnnouncement } from './components/BannerAnnouncement';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Modals
import { DonationModal } from './components/DonationModal';
import { VolunteerModal } from './components/VolunteerModal';
import { DevotionalDownloadModal } from './components/DevotionalDownloadModal';
import { PrayerModal } from './components/PrayerModal';
import { AdminCMSModal } from './components/AdminCMSModal';

// Pages
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { MinistryPage } from './components/pages/MinistryPage';
import { CoachingPage } from './components/pages/CoachingPage';
import { TeachingPage } from './components/pages/TeachingPage';
import { EventsPage } from './components/pages/EventsPage';
import { GalleryPage } from './components/pages/GalleryPage';
import { GetInvolvedPage } from './components/pages/GetInvolvedPage';
import { ContactPage } from './components/pages/ContactPage';

// Toast Notification Icon
import { CheckCircle2, Heart, Sparkles, X } from 'lucide-react';

export default function App() {
  // Navigation Routing State
  const [currentTab, setCurrentTab] = useState<PageTab>('home');

  // Interactive Live Data State (Backed by SQLite Database as Source of Truth)
  const [events, setEvents] = useState<EventItem[]>(UPCOMING_EVENTS);
  const [sermons, setSermons] = useState<SermonTeaching[]>(SERMON_TEACHINGS);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(INITIAL_PRAYER_REQUESTS);
  const [isLoading, setIsLoading] = useState(true);

  // Modals Visibility State
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [donationFundId, setDonationFundId] = useState<string | undefined>('fund-general');
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false);
  const [isDevotionalOpen, setIsDevotionalOpen] = useState(false);
  const [isPrayerOpen, setIsPrayerOpen] = useState(false);
  const [isAdminCMSOpen, setIsAdminCMSOpen] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ message: string; sub?: string } | null>(null);

  const showToast = (message: string, sub?: string) => {
    setToast({ message, sub });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // 1. Initial Page Bootstrap from SQLite Database
  useEffect(() => {
    async function loadData() {
      try {
        const bootstrap = await api.getBootstrap();
        if (bootstrap.events && bootstrap.events.length > 0) setEvents(bootstrap.events);
        if (bootstrap.sermons && bootstrap.sermons.length > 0) setSermons(bootstrap.sermons);
        if (bootstrap.announcements && bootstrap.announcements.length > 0) setAnnouncements(bootstrap.announcements);
        if (bootstrap.prayerRequests && bootstrap.prayerRequests.length > 0) setPrayerRequests(bootstrap.prayerRequests);
      } catch (err) {
        console.error('Failed to load bootstrap data from SQLite:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  // Modal Triggers
  const handleOpenDonate = (fundId?: string) => {
    setDonationFundId(fundId || 'fund-general');
    setIsDonationOpen(true);
  };

  const handleOpenVolunteer = () => {
    setIsVolunteerOpen(true);
  };

  const handleOpenDevotional = () => {
    setIsDevotionalOpen(true);
  };

  const handleOpenPrayer = () => {
    setIsPrayerOpen(true);
  };

  const handleOpenAdmin = () => {
    setIsAdminCMSOpen(true);
  };

  // Prayer Wall Handlers
  const handleAddPrayer = async (newReq: PrayerRequest) => {
    try {
      const saved = await api.submitPrayer(newReq);
      setPrayerRequests(prev => [saved, ...prev]);
      showToast('Prayer petition received', 'Pastor Ella Ruth and our prayer circle hold your request before God.');
    } catch (err) {
      console.error('Prayer submission error:', err);
      setPrayerRequests(prev => [newReq, ...prev]);
    }
  };

  const handlePrayForRequest = async (id: string) => {
    try {
      const newCount = await api.prayForRequest(id);
      setPrayerRequests(prev =>
        prev.map(r => (r.id === id ? { ...r, prayedCount: newCount } : r))
      );
      showToast('Prayer recorded', 'Thank you for standing in intercession with our community.');
    } catch (err) {
      console.error('Pray count error:', err);
      setPrayerRequests(prev =>
        prev.map(r => (r.id === id ? { ...r, prayedCount: r.prayedCount + 1 } : r))
      );
    }
  };

  // Completion Callbacks with Feedback
  const handleDonationComplete = (receipt: any) => {
    showToast(`Donation of $${receipt.amount} Confirmed`, `Tax receipt ${receipt.receiptId} generated. Thank you for your support!`);
  };

  const handleVolunteerComplete = (data: any) => {
    showToast('Volunteer Application Received', `Thank you ${data.fullName}! Our coordinator will reach out to you.`);
  };

  const handleDevotionalComplete = () => {
    showToast('Vitality Blueprint Sent', "Coach Ella Ruth's 7-Day Morning Vitality Guide is ready for you.");
  };

  const handleRsvpComplete = (res: any) => {
    showToast('Seat Reserved', 'Your RSVP has been confirmed in our community registry.');
    // Refresh events from DB to reflect attendee increment
    api.getBootstrap().then(b => {
      if (b.events) setEvents(b.events);
    });
  };

  const handleContactComplete = () => {
    showToast('Message Received', 'Our ministry team in Columbia, MS has received your message.');
  };

  const handleResetDefaults = () => {
    api.getBootstrap().then(b => {
      setEvents(b.events);
      setSermons(b.sermons);
      setAnnouncements(b.announcements);
      setPrayerRequests(b.prayerRequests);
      showToast('Database Reset', 'All SQLite records reset to baseline seed data.');
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFB] text-[#1A1A1A] font-sans selection:bg-[#D4AF37]/30 selection:text-[#002366]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300 max-w-sm">
          <div className="bg-[#002366] text-white p-4 rounded-2xl shadow-xl border border-[#D4AF37]/40 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <div className="font-semibold text-white text-sm leading-tight">{toast.message}</div>
              {toast.sub && <div className="text-white/80 mt-0.5 leading-relaxed">{toast.sub}</div>}
            </div>
            <button 
              onClick={() => setToast(null)}
              className="text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Global Announcement Ticker */}
      <BannerAnnouncement
        announcements={announcements}
        onNavigate={(tab) => setCurrentTab(tab)}
      />

      {/* 2. Main Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenDonate={handleOpenDonate}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* 3. Main Page Content View */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenDonate={handleOpenDonate}
            onOpenDevotional={handleOpenDevotional}
            onOpenPrayer={handleOpenPrayer}
            events={events}
            sermons={sermons}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenDonate={handleOpenDonate}
          />
        )}

        {currentTab === 'ministry' && (
          <MinistryPage
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenDonate={handleOpenDonate}
            onOpenVolunteer={handleOpenVolunteer}
          />
        )}

        {currentTab === 'coaching' && (
          <CoachingPage
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenDevotional={handleOpenDevotional}
            onInquiryComplete={() => showToast('Coaching Consultation Inquired', 'Coach Ella Ruth’s staff will contact you shortly.')}
          />
        )}

        {currentTab === 'teaching' && (
          <TeachingPage
            onNavigate={(tab) => setCurrentTab(tab)}
            sermons={sermons}
            prayerRequests={prayerRequests}
            onOpenPrayer={handleOpenPrayer}
            onPrayForRequest={handlePrayForRequest}
          />
        )}

        {currentTab === 'events' && (
          <EventsPage
            onNavigate={(tab) => setCurrentTab(tab)}
            events={events}
            onOpenDonate={handleOpenDonate}
            onRsvpComplete={handleRsvpComplete}
          />
        )}

        {currentTab === 'gallery' && (
          <GalleryPage
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenDonate={handleOpenDonate}
          />
        )}

        {currentTab === 'get-involved' && (
          <GetInvolvedPage
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenDonate={handleOpenDonate}
            onOpenVolunteer={handleOpenVolunteer}
          />
        )}

        {currentTab === 'contact' && (
          <ContactPage
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenPrayer={handleOpenPrayer}
            onOpenDonate={handleOpenDonate}
            onContactComplete={handleContactComplete}
          />
        )}
      </main>

      {/* 4. Global Footer */}
      <Footer
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenDonate={handleOpenDonate}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* 5. Modals & Overlays */}
      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
        initialFundId={donationFundId}
        onDonationComplete={handleDonationComplete}
      />

      <VolunteerModal
        isOpen={isVolunteerOpen}
        onClose={() => setIsVolunteerOpen(false)}
        onVolunteerComplete={handleVolunteerComplete}
      />

      <DevotionalDownloadModal
        isOpen={isDevotionalOpen}
        onClose={() => setIsDevotionalOpen(false)}
        onDownloadComplete={handleDevotionalComplete}
      />

      <PrayerModal
        isOpen={isPrayerOpen}
        onClose={() => setIsPrayerOpen(false)}
        onSubmitPrayer={handleAddPrayer}
      />

      <AdminCMSModal
        isOpen={isAdminCMSOpen}
        onClose={() => setIsAdminCMSOpen(false)}
        events={events}
        sermons={sermons}
        announcements={announcements}
        onUpdateEvents={setEvents}
        onUpdateSermons={setSermons}
        onUpdateAnnouncements={setAnnouncements}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
