import React, { useState } from 'react';
import { PageTab, EventItem } from '../../types';
import { PAST_EVENTS_RECAP } from '../../data/initialData';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle2, 
  X
} from 'lucide-react';

import { api } from '../../services/api';

interface EventsPageProps {
  onNavigate: (tab: PageTab) => void;
  events: EventItem[];
  onOpenDonate: () => void;
  onRsvpComplete?: (data: any) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  events,
  onRsvpComplete
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [rsvpEvent, setRsvpEvent] = useState<EventItem | null>(null);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpGuests, setRsvpGuests] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const upcomingEvents = events.filter(e => e.isUpcoming);

  const filteredUpcoming = selectedCategory === 'all'
    ? upcomingEvents
    : upcomingEvents.filter(e => e.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpEvent || !rsvpName.trim() || !rsvpEmail.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await api.submitRsvp(rsvpEvent.id, {
        fullName: rsvpName.trim(),
        email: rsvpEmail.trim(),
        guestsCount: parseInt(rsvpGuests, 10) || 1
      });
      setRsvpSuccess(true);
      if (onRsvpComplete) {
        onRsvpComplete(res);
      }
    } catch (err) {
      console.error('Failed to submit RSVP:', err);
      setRsvpSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadIcsCalendar = (event: EventItem) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Safe Haven Out Reach Ministries//Ella Ruth Johnson//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\r?\n/g, ' ')}`,
      `LOCATION:${event.location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeRsvpModal = () => {
    setRsvpEvent(null);
    setRsvpSuccess(false);
    setRsvpName('');
    setRsvpEmail('');
    setRsvpGuests('1');
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-20 pt-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Clean Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2ED] text-[#002366] text-xs font-medium border border-[#D4AF37]/40">
          <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Community & Ministry Calendar</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#002366]">
          Upcoming Gatherings
        </h1>
        <p className="text-[#1A1A1A]/75 text-base leading-relaxed">
          Join Ella Ruth for upcoming conferences, vitality walks, and fellowship services at Safe Haven Ministries in Columbia, MS.
        </p>
      </section>

      {/* Filter Tabs */}
      <section className="space-y-8">
        <div className="flex flex-wrap justify-center gap-2">
          {['all', 'Conference', 'Community Dinner', 'Youth & Family', 'Outreach'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#002366] text-white shadow-xs border border-[#D4AF37]/30'
                  : 'bg-[#F5F2ED] text-[#002366] hover:bg-[#EFEBE4] border border-[#E8E2D8]'
              }`}
            >
              {cat === 'all' ? 'All Gatherings' : cat}
            </button>
          ))}
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredUpcoming.map(event => (
            <div
              key={event.id}
              className="bg-[#FDFCFB] rounded-3xl overflow-hidden border border-[#E8E2D8] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 overflow-hidden bg-[#F5F2ED]">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#FDFCFB]/95 backdrop-blur-xs text-[#002366] text-xs font-semibold px-3 py-1 rounded-full shadow-xs border border-[#D4AF37]/40">
                    {event.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#002366]">
                    {event.title}
                  </h3>
                  <div className="space-y-1.5 text-xs text-[#1A1A1A]/60">
                    <div className="flex items-center gap-2 text-[#002366] font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#1A1A1A]/40" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#1A1A1A]/40" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <p className="text-sm text-[#1A1A1A]/75 leading-relaxed pt-1">
                    {event.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-[#E8E2D8] mt-4">
                <div className="text-xs text-[#1A1A1A]/60 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{event.attendeesCount || 200}+ Expected</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadIcsCalendar(event)}
                    title="Add to Calendar (.ics)"
                    className="p-2 rounded-full text-[#002366] bg-[#F5F2ED] hover:bg-[#EFEBE4] border border-[#E8E2D8] transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </button>
                  <button
                    onClick={() => setRsvpEvent(event)}
                    className="px-5 py-2 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white text-xs font-medium transition-colors border border-[#D4AF37]/30 shadow-xs"
                  >
                    Reserve Seat / RSVP
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Past Event Recaps */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
            Previous Celebrations
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#002366]">
            Past Milestones & Banquets
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PAST_EVENTS_RECAP.map(past => (
            <div
              key={past.id}
              className="bg-[#FDFCFB] rounded-2xl overflow-hidden border border-[#E8E2D8] shadow-xs space-y-3"
            >
              <img
                src={past.image}
                alt={past.title}
                className="w-full h-44 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-5 pt-0 space-y-1 text-xs">
                <span className="text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider block">
                  {past.date}
                </span>
                <h4 className="font-serif text-base font-bold text-[#002366]">
                  {past.title}
                </h4>
                <p className="text-[#1A1A1A]/75 leading-relaxed pt-1">
                  {past.recapNotes}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RSVP Modal */}
      {rsvpEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#FDFCFB] rounded-3xl shadow-xl border border-[#E8E2D8] overflow-hidden my-8">
            <div className="p-6 border-b border-[#E8E2D8] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#002366]">Event RSVP</h3>
                <p className="text-xs text-[#1A1A1A]/60 truncate max-w-[280px]">{rsvpEvent.title}</p>
              </div>
              <button onClick={closeRsvpModal} className="p-1 rounded-full text-[#1A1A1A]/40 hover:text-[#1A1A1A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {rsvpSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-[#002366]">
                    Seat Reserved
                  </h4>
                  <p className="text-xs text-[#1A1A1A]/70">
                    We saved your place for {rsvpEvent.title}. A confirmation has been sent to {rsvpEmail}.
                  </p>
                  <button
                    onClick={closeRsvpModal}
                    className="w-full py-2.5 rounded-full bg-[#002366] text-white font-medium text-xs mt-2"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-medium text-[#1A1A1A] mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Angela Coleman"
                      value={rsvpName}
                      onChange={e => setRsvpName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-white text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#1A1A1A] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="angela@example.com"
                      value={rsvpEmail}
                      onChange={e => setRsvpEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-white text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#1A1A1A] mb-1">Number of Attendees</label>
                    <select
                      value={rsvpGuests}
                      onChange={e => setRsvpGuests(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-white text-[#1A1A1A]"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3">3 People</option>
                      <option value="4">4 People</option>
                      <option value="5+">5+ People</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs transition-colors mt-2 border border-[#D4AF37]/30"
                  >
                    Confirm Attendance
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
