import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Plus, 
  Trash2, 
  Calendar, 
  BookOpen, 
  Megaphone, 
  CheckCircle2, 
  RefreshCw,
  Inbox,
  Heart,
  HandHeart,
  Sparkles,
  Mail,
  UserCheck,
  Database
} from 'lucide-react';
import { EventItem, SermonTeaching, AnnouncementItem } from '../types';
import { api, AdminSubmissions } from '../services/api';

interface AdminCMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventItem[];
  sermons: SermonTeaching[];
  announcements: AnnouncementItem[];
  onUpdateEvents: (events: EventItem[]) => void;
  onUpdateSermons: (sermons: SermonTeaching[]) => void;
  onUpdateAnnouncements: (announcements: AnnouncementItem[]) => void;
  onResetDefaults: () => void;
}

export const AdminCMSModal: React.FC<AdminCMSModalProps> = ({
  isOpen,
  onClose,
  events,
  sermons,
  announcements,
  onUpdateEvents,
  onUpdateSermons,
  onUpdateAnnouncements,
  onResetDefaults
}) => {
  const [activeTab, setActiveTab] = useState<'events' | 'sermons' | 'announcements' | 'submissions'>('events');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [submissions, setSubmissions] = useState<AdminSubmissions | null>(null);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Conference' as const,
    date: '',
    time: '10:00 AM',
    location: 'Columbia, MS',
    description: ''
  });

  // New sermon form state
  const [newSermon, setNewSermon] = useState({
    title: '',
    scripture: '',
    series: 'Divine Transformation',
    summary: '',
    quote: ''
  });

  // New announcement form state
  const [newAnnouncement, setNewAnnouncement] = useState({
    highlight: 'Ministry Update',
    text: '',
    linkTab: 'events' as const
  });

  // Fetch DB submissions whenever the modal opens or switching to submissions tab
  useEffect(() => {
    if (isOpen && activeTab === 'submissions') {
      loadSubmissions();
    }
  }, [isOpen, activeTab]);

  const loadSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const data = await api.getAdminSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to load admin submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  if (!isOpen) return null;

  const triggerSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;
    setIsProcessing(true);
    try {
      const created = await api.createEvent({
        title: newEvent.title,
        category: newEvent.category,
        date: newEvent.date,
        time: newEvent.time || '10:00 AM',
        location: newEvent.location || 'Columbia, MS',
        description: newEvent.description || 'Join us for this special Safe Haven gathering.',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=900&auto=format&fit=crop',
        isUpcoming: true,
        registrationRequired: true,
        attendeesCount: 50
      });
      onUpdateEvents([created, ...events]);
      setNewEvent({
        title: '',
        category: 'Conference',
        date: '',
        time: '10:00 AM',
        location: 'Columbia, MS',
        description: ''
      });
      triggerSuccess();
    } catch (err) {
      console.error('Failed to add event:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await api.deleteEvent(id);
      onUpdateEvents(events.filter(e => e.id !== id));
      triggerSuccess();
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  const handleAddSermon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSermon.title || !newSermon.scripture) return;
    setIsProcessing(true);
    try {
      const created = await api.createSermon({
        title: newSermon.title,
        scripture: newSermon.scripture,
        date: 'Recent Teaching',
        duration: '42 mins',
        series: newSermon.series || 'Ministry Message',
        summary: newSermon.summary || 'A teaching delivered by Pastor Ella Ruth Johnson.',
        featuredQuote: newSermon.quote || '“God is faithful in all things.”',
        reflectionPrayer: 'Lord, give us ears to hear and hearts to follow Your word in faith and obedience. Amen.',
        corePoints: [
          'Walking in spiritual and bodily obedience',
          'Daily renewal of mind and temple',
          'Faith anchored in action'
        ],
        audioPreviewAvailable: true
      });
      onUpdateSermons([created, ...sermons]);
      setNewSermon({
        title: '',
        scripture: '',
        series: 'Divine Transformation',
        summary: '',
        quote: ''
      });
      triggerSuccess();
    } catch (err) {
      console.error('Failed to add sermon:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSermon = async (id: string) => {
    try {
      await api.deleteSermon(id);
      onUpdateSermons(sermons.filter(s => s.id !== id));
      triggerSuccess();
    } catch (err) {
      console.error('Failed to delete sermon:', err);
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.text) return;
    setIsProcessing(true);
    try {
      const created = await api.createAnnouncement({
        highlight: newAnnouncement.highlight || 'Announcement',
        text: newAnnouncement.text,
        linkTab: newAnnouncement.linkTab,
        date: 'Just Now',
        active: true
      });
      onUpdateAnnouncements([created, ...announcements]);
      setNewAnnouncement({
        highlight: 'Ministry Update',
        text: '',
        linkTab: 'events'
      });
      triggerSuccess();
    } catch (err) {
      console.error('Failed to add announcement:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleAnnouncement = async (id: string) => {
    try {
      await api.toggleAnnouncement(id);
      onUpdateAnnouncements(announcements.map(a => a.id === id ? { ...a, active: !a.active } : a));
      triggerSuccess();
    } catch (err) {
      console.error('Failed to toggle announcement:', err);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await api.deleteAnnouncement(id);
      onUpdateAnnouncements(announcements.filter(a => a.id !== id));
      triggerSuccess();
    } catch (err) {
      console.error('Failed to delete announcement:', err);
    }
  };

  const handleResetToBaseline = async () => {
    if (!window.confirm('Reset all SQLite database tables back to baseline defaults?')) return;
    setIsProcessing(true);
    try {
      const res = await api.resetDatabaseDefaults();
      onUpdateEvents(res.events);
      onUpdateSermons(res.sermons);
      onUpdateAnnouncements(res.announcements);
      onResetDefaults();
      triggerSuccess();
    } catch (err) {
      console.error('Failed to reset defaults:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-[#FDFCFB] rounded-3xl shadow-2xl border border-[#E8E2D8] overflow-hidden my-4 sm:my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#E8E2D8] bg-[#F5F2ED] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#002366] text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/30">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#002366] flex items-center gap-2">
                <span>Safe Haven Staff Operations Portal</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-normal px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <Database className="w-3 h-3 text-emerald-700" />
                  <span>SQLite Source of Truth Active</span>
                </span>
              </h3>
              <p className="text-[11px] text-[#1A1A1A]/60 font-mono">
                data/database.sqlite • Live Relational Backend
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#1A1A1A]/40 hover:text-[#1A1A1A] hover:bg-[#E8E2D8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-nav tabs */}
        <div className="bg-[#F5F2ED] border-b border-[#E8E2D8] px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'events'
                  ? 'bg-white text-[#002366] shadow-xs border border-[#E8E2D8]'
                  : 'text-[#1A1A1A]/60 hover:text-[#002366]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Events ({events.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('sermons')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'sermons'
                  ? 'bg-white text-[#002366] shadow-xs border border-[#E8E2D8]'
                  : 'text-[#1A1A1A]/60 hover:text-[#002366]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Sermons ({sermons.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'announcements'
                  ? 'bg-white text-[#002366] shadow-xs border border-[#E8E2D8]'
                  : 'text-[#1A1A1A]/60 hover:text-[#002366]'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Banners ({announcements.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'submissions'
                  ? 'bg-[#002366] text-white shadow-xs'
                  : 'text-[#1A1A1A]/70 hover:text-[#002366]'
              }`}
            >
              <Inbox className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-semibold">Staff Inboxes</span>
            </button>
          </div>

          <button
            onClick={handleResetToBaseline}
            disabled={isProcessing}
            className="text-[11px] text-[#1A1A1A]/50 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors shrink-0 ml-2"
            title="Reset database tables to initial baseline defaults"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset DB</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>SQLite Database updated successfully! Changes are live across all pages.</span>
            </div>
          )}

          {/* TAB 1: EVENTS */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <form onSubmit={handleAddEvent} className="bg-[#F5F2ED] border border-[#E8E2D8] rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-semibold text-[#002366] flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Publish New Event to Database</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#1A1A1A] font-medium mb-1">Event Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Divine Transformation Revival 2026"
                      value={newEvent.title}
                      onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E2D8] text-xs text-[#1A1A1A] bg-white focus:outline-hidden focus:border-[#002366]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1A1A1A] font-medium mb-1">Category</label>
                    <select
                      value={newEvent.category}
                      onChange={e => setNewEvent({ ...newEvent, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E2D8] text-xs text-[#1A1A1A] bg-white focus:outline-hidden focus:border-[#002366]"
                    >
                      <option value="Conference">Conference</option>
                      <option value="Community Dinner">Community Dinner</option>
                      <option value="Youth & Family">Youth & Family</option>
                      <option value="Teaching Session">Teaching Session</option>
                      <option value="Outreach">Outreach</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#1A1A1A] font-medium mb-1">Date *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. October 18, 2026"
                      value={newEvent.date}
                      onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E2D8] text-xs text-[#1A1A1A] bg-white focus:outline-hidden focus:border-[#002366]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1A1A1A] font-medium mb-1">Time & Location</label>
                    <input
                      type="text"
                      placeholder="6:00 PM • Columbia Civic Center"
                      value={`${newEvent.time} • ${newEvent.location}`}
                      onChange={e => {
                        const parts = e.target.value.split('•');
                        setNewEvent({
                          ...newEvent,
                          time: parts[0]?.trim() || '6:00 PM',
                          location: parts[1]?.trim() || 'Columbia, MS'
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E2D8] text-xs text-[#1A1A1A] bg-white focus:outline-hidden focus:border-[#002366]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#1A1A1A] font-medium mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Event details, schedule notes, and invitation message..."
                    value={newEvent.description}
                    onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D8] text-xs text-[#1A1A1A] bg-white focus:outline-hidden focus:border-[#002366]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs flex items-center gap-1.5 transition-colors border border-[#D4AF37]/30 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{isProcessing ? 'Saving to Database...' : 'Add Event to Database'}</span>
                </button>
              </form>

              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-[#002366]">Current Database Events ({events.length})</h5>
                {events.map(evt => (
                  <div key={evt.id} className="p-3.5 rounded-2xl border border-[#E8E2D8] bg-white flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#002366]">{evt.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F2ED] text-[#1A1A1A]/70 font-medium">
                          {evt.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#1A1A1A]/60">
                        {evt.date} • {evt.time} • {evt.location} ({evt.attendeesCount || 0} RSVPs)
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="p-1.5 text-[#1A1A1A]/40 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors shrink-0"
                      title="Delete event from database"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SERMONS */}
          {activeTab === 'sermons' && (
            <div className="space-y-6">
              <form onSubmit={handleAddSermon} className="bg-[#F5F2ED] border border-[#E8E2D8] rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-semibold text-[#002366] flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Publish New Sermon / Message to Database</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#1A1A1A] font-medium mb-1">Sermon Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Walking in Divine Wholeness"
                      value={newSermon.title}
                      onChange={e => setNewSermon({ ...newSermon, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E2D8] text-xs text-[#1A1A1A] bg-white focus:outline-hidden focus:border-[#002366]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1A1A1A] font-medium mb-1">Key Scripture *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Isaiah 40:29-31 & John 8:32"
                      value={newSermon.scripture}
                      onChange={e => setNewSermon({ ...newSermon, scripture: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E2D8] text-xs text-[#1A1A1A] bg-white focus:outline-hidden focus:border-[#002366]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#1A1A1A] font-medium mb-1">Summary of Teaching</label>
                  <textarea
                    rows={2}
                    placeholder="Brief summary of spiritual core insights..."
                    value={newSermon.summary}
                    onChange={e => setNewSermon({ ...newSermon, summary: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D8] text-xs text-[#1A1A1A] bg-white focus:outline-hidden focus:border-[#002366]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs flex items-center gap-1.5 transition-colors border border-[#D4AF37]/30 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{isProcessing ? 'Saving to Database...' : 'Add Sermon to Database'}</span>
                </button>
              </form>

              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-[#002366]">Current Database Sermons ({sermons.length})</h5>
                {sermons.map(s => (
                  <div key={s.id} className="p-3.5 rounded-2xl border border-[#E8E2D8] bg-white flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-[#002366]">{s.title}</div>
                      <p className="text-[11px] text-[#1A1A1A]/60">{s.scripture} • {s.series} • {s.duration}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteSermon(s.id)}
                      className="p-1.5 text-[#1A1A1A]/40 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors shrink-0"
                      title="Delete sermon from database"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <form onSubmit={handleAddAnnouncement} className="bg-[#F5F2ED] border border-[#E8E2D8] rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-semibold text-[#002366] flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Add Global Ticker Alert to Database</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#1A1A1A] font-medium mb-1">Badge Highlight</label>
                    <input
                      type="text"
                      placeholder="e.g. Urgent Update"
                      value={newAnnouncement.highlight}
                      onChange={e => setNewAnnouncement({ ...newAnnouncement, highlight: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D8] text-xs text-[#1A1A1A] bg-white focus:outline-hidden focus:border-[#002366]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1A1A1A] font-medium mb-1">Destination Tab</label>
                    <select
                      value={newAnnouncement.linkTab}
                      onChange={e => setNewAnnouncement({ ...newAnnouncement, linkTab: e.target.value as any })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D8] text-xs text-[#1A1A1A] bg-white focus:outline-hidden focus:border-[#002366]"
                    >
                      <option value="events">Events</option>
                      <option value="ministry">Ministry</option>
                      <option value="coaching">Coaching</option>
                      <option value="teaching">Sermons</option>
                      <option value="get-involved">Get Involved</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#1A1A1A] font-medium mb-1">Announcement Text *</label>
                  <input
                    type="text"
                    required
                    placeholder="Registration is now open for Divine Transformation 2026!"
                    value={newAnnouncement.text}
                    onChange={e => setNewAnnouncement({ ...newAnnouncement, text: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D8] text-xs text-[#1A1A1A] bg-white focus:outline-hidden focus:border-[#002366]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs flex items-center gap-1.5 transition-colors border border-[#D4AF37]/30 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Post Banner</span>
                </button>
              </form>

              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-[#002366]">Active Banners in Database ({announcements.length})</h5>
                {announcements.map(ann => (
                  <div key={ann.id} className="p-3.5 rounded-2xl border border-[#E8E2D8] bg-white flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 flex-1">
                      <button
                        onClick={() => handleToggleAnnouncement(ann.id)}
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border transition-colors ${
                          ann.active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-stone-100 text-stone-500 border-stone-200 line-through'
                        }`}
                        title="Click to toggle visibility"
                      >
                        {ann.active ? 'Visible' : 'Hidden'}
                      </button>
                      <span className="text-[10px] font-medium text-[#002366] bg-[#F5F2ED] border border-[#E8E2D8] px-2 py-0.5 rounded-full">
                        {ann.highlight}
                      </span>
                      <span className="text-xs text-[#1A1A1A] truncate">{ann.text}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="p-1.5 text-[#1A1A1A]/40 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors shrink-0"
                      title="Remove banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SUBMISSIONS (STAFF INBOXES) */}
          {activeTab === 'submissions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm sm:text-base font-bold text-[#002366]">
                    Database Inboxes & Incoming Requests
                  </h4>
                  <p className="text-[11px] text-[#1A1A1A]/60">
                    Live records saved to SQLite from public visitor forms.
                  </p>
                </div>
                <button
                  onClick={loadSubmissions}
                  className="px-3 py-1.5 rounded-full bg-[#F5F2ED] hover:bg-[#E8E2D8] text-[#002366] text-xs font-medium flex items-center gap-1.5 border border-[#E8E2D8]"
                >
                  <RefreshCw className="w-3 h-3 text-[#D4AF37]" />
                  <span>Refresh Inboxes</span>
                </button>
              </div>

              {loadingSubmissions ? (
                <div className="p-8 text-center text-[#1A1A1A]/50">Loading database records...</div>
              ) : submissions ? (
                <div className="space-y-6">
                  {/* Donations */}
                  <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-2">
                      <div className="flex items-center gap-2 font-semibold text-[#002366]">
                        <Heart className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                        <span>Recent Donations & Receipts ({submissions.donations.length})</span>
                      </div>
                    </div>
                    {submissions.donations.length === 0 ? (
                      <p className="text-[#1A1A1A]/50 text-xs italic">No donation records yet.</p>
                    ) : (
                      <div className="divide-y divide-[#E8E2D8] max-h-48 overflow-y-auto">
                        {submissions.donations.map((don: any) => (
                          <div key={don.id} className="py-2 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-semibold text-[#002366]">${don.amount}</span>
                              <span className="text-[#1A1A1A]/60"> to {don.fund_name} by <strong>{don.donor_name}</strong></span>
                              <div className="text-[10px] text-[#1A1A1A]/40 font-mono">Receipt: {don.receipt_id} • {don.donor_email}</div>
                            </div>
                            <span className="text-[10px] text-[#1A1A1A]/50">{don.date_str}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Volunteer Applications */}
                  <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-2">
                      <div className="flex items-center gap-2 font-semibold text-[#002366]">
                        <HandHeart className="w-4 h-4 text-[#D4AF37]" />
                        <span>Volunteer Applications ({submissions.volunteers.length})</span>
                      </div>
                    </div>
                    {submissions.volunteers.length === 0 ? (
                      <p className="text-[#1A1A1A]/50 text-xs italic">No volunteer applications yet.</p>
                    ) : (
                      <div className="divide-y divide-[#E8E2D8] max-h-48 overflow-y-auto">
                        {submissions.volunteers.map((vol: any) => (
                          <div key={vol.id} className="py-2.5 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-[#002366]">{vol.full_name}</span>
                              <span className="text-[10px] text-[#1A1A1A]/50">{vol.city} • {vol.availability}</span>
                            </div>
                            <div className="text-[11px] text-[#1A1A1A]/70">
                              Phone: <span className="font-mono">{vol.phone}</span> • Email: <span className="font-mono">{vol.email}</span>
                            </div>
                            {vol.interests && vol.interests.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {vol.interests.map((int: string) => (
                                  <span key={int} className="px-2 py-0.5 rounded-full bg-[#F5F2ED] text-[#002366] text-[10px] border border-[#E8E2D8]">
                                    {int}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Coaching Inquiries */}
                  <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-2">
                      <div className="flex items-center gap-2 font-semibold text-[#002366]">
                        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                        <span>Coaching Consultations & Vitality Leads ({submissions.coaching.length})</span>
                      </div>
                    </div>
                    {submissions.coaching.length === 0 ? (
                      <p className="text-[#1A1A1A]/50 text-xs italic">No coaching inquiries yet.</p>
                    ) : (
                      <div className="divide-y divide-[#E8E2D8] max-h-48 overflow-y-auto">
                        {submissions.coaching.map((c: any) => (
                          <div key={c.id} className="py-2 text-xs space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-[#002366]">{c.full_name}</span>
                              <span className="font-mono text-[11px] text-[#1A1A1A]/60">{c.phone}</span>
                            </div>
                            <p className="text-[11px] text-[#1A1A1A]/75 italic">“{c.primary_goal}”</p>
                            <div className="text-[10px] text-[#1A1A1A]/50">
                              Format: {c.coaching_format} • Energy Score: {c.energy_score || 'N/A'}/5 • Hydration: {c.hydration_level || 'N/A'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* RSVPs */}
                  <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-2">
                      <div className="flex items-center gap-2 font-semibold text-[#002366]">
                        <UserCheck className="w-4 h-4 text-[#D4AF37]" />
                        <span>Confirmed Event RSVPs ({submissions.rsvps.length})</span>
                      </div>
                    </div>
                    {submissions.rsvps.length === 0 ? (
                      <p className="text-[#1A1A1A]/50 text-xs italic">No RSVPs recorded yet.</p>
                    ) : (
                      <div className="divide-y divide-[#E8E2D8] max-h-48 overflow-y-auto">
                        {submissions.rsvps.map((r: any) => (
                          <div key={r.id} className="py-2 text-xs flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-[#002366]">{r.full_name}</span>
                              <span className="text-[#1A1A1A]/60"> ({r.guests_count} guest{r.guests_count > 1 ? 's' : ''})</span>
                              <div className="text-[10px] text-[#1A1A1A]/50">{r.email} • {r.event_title || r.event_id}</div>
                            </div>
                            <span className="text-[10px] text-[#1A1A1A]/40">{new Date(r.created_at).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Contact Inquiries */}
                  <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-2">
                      <div className="flex items-center gap-2 font-semibold text-[#002366]">
                        <Mail className="w-4 h-4 text-[#D4AF37]" />
                        <span>Contact Messages ({submissions.contacts.length})</span>
                      </div>
                    </div>
                    {submissions.contacts.length === 0 ? (
                      <p className="text-[#1A1A1A]/50 text-xs italic">No messages yet.</p>
                    ) : (
                      <div className="divide-y divide-[#E8E2D8] max-h-48 overflow-y-auto">
                        {submissions.contacts.map((m: any) => (
                          <div key={m.id} className="py-2 text-xs space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-[#002366]">{m.name}</span>
                              <span className="text-[10px] text-[#1A1A1A]/40">{m.email}</span>
                            </div>
                            <p className="text-[11px] text-[#1A1A1A]/80">“{m.message}”</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#F5F2ED] border-t border-[#E8E2D8] px-6 py-3.5 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-[#1A1A1A]/50">
            Safe Haven Out Reach Ministries, Inc. • Columbia, MS
          </p>
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-full bg-white hover:bg-[#E8E2D8]/60 border border-[#E8E2D8] text-[#1A1A1A] text-xs font-medium transition-colors"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
};
