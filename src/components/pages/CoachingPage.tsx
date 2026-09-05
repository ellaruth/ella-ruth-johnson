import React, { useState } from 'react';
import { PageTab } from '../../types';
import { COACHING_PILLARS, TESTIMONIALS } from '../../data/initialData';
import { 
  Activity, 
  Sparkles, 
  Download, 
  Heart, 
  CheckCircle2, 
  Users, 
  Calendar, 
  Flame, 
  HelpCircle
} from 'lucide-react';

import { api } from '../../services/api';

interface CoachingPageProps {
  onNavigate: (tab: PageTab) => void;
  onOpenDevotional: () => void;
  onInquiryComplete?: (data: any) => void;
}

export const CoachingPage: React.FC<CoachingPageProps> = ({
  onOpenDevotional,
  onInquiryComplete
}) => {
  // Quick Assessment state
  const [quizEnergy, setQuizEnergy] = useState<number>(4);
  const [quizHydration, setQuizHydration] = useState<string>('moderate');
  const [quizMovement, setQuizMovement] = useState<string>('moderate');
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Inquiry form state
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryFormat, setInquiryFormat] = useState('1on1');
  const [inquiryGoal, setInquiryGoal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  const wellnessTestimonials = TESTIMONIALS.filter(t => t.category === 'wellness');

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuizSubmitted(true);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) return;
    setIsSubmitting(true);
    try {
      const saved = await api.submitCoachingInquiry({
        fullName: inquiryName.trim(),
        phone: inquiryPhone.trim(),
        coachingFormat: inquiryFormat,
        primaryGoal: inquiryGoal.trim() || 'Health and Longevity Transformation',
        energyScore: quizEnergy,
        hydrationLevel: quizHydration,
        movementLevel: quizMovement
      });
      setInquirySent(true);
      if (onInquiryComplete) {
        onInquiryComplete(saved);
      }
    } catch (err) {
      console.error('Failed to submit coaching inquiry:', err);
      setInquirySent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-20 pt-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. CLEAN HERO HEADER */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2ED] text-[#002366] text-xs font-medium border border-[#D4AF37]/40">
            <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>85 Years Young • Health & Longevity Coach</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#002366] tracking-tight leading-[1.18]">
            “I challenge women to live longer, healthier lives.”
          </h1>

          <p className="text-[#1A1A1A]/75 text-base leading-relaxed">
            Society often tells women that aging means resigning yourself to fatigue and medicine cabinets full of pills. At 85 years young, Coach Ella Ruth teaches how daily movement, hydration, faith, and nourishing foods restore natural energy.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="coaching-lead-magnet-cta"
              onClick={onOpenDevotional}
              className="px-6 py-3 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs shadow-xs transition-colors flex items-center gap-2 border border-[#D4AF37]/30"
            >
              <Download className="w-4 h-4 text-[#D4AF37]" />
              <span>Get Free 7-Day Morning Vitality Guide</span>
            </button>
            <a
              href="#inquiry-form"
              className="px-6 py-3 rounded-full bg-[#F5F2ED] hover:bg-[#EFEBE4] text-[#002366] font-medium text-xs border border-[#E8E2D8] transition-colors"
            >
              Inquire About Coaching
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-[#F5F2ED] border border-[#E8E2D8] shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop"
              alt="Coach Ella Ruth walking briskly in the morning sun"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-[#FDFCFB]/95 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-[#D4AF37]/30">
              <span className="text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider block">
                Living Proof
              </span>
              <p className="text-xs text-[#1A1A1A] font-medium pt-0.5">
                Daily 6:00 AM Walk & Prayer • Columbia, Mississippi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE FOUR PILLARS */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
            The Blueprint
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#002366]">
            Four Pillars of Wisdom in Motion
          </h2>
          <p className="text-sm text-[#1A1A1A]/70">
            Simple, sustainable daily habits rooted in faith and practical physiology.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COACHING_PILLARS.map((pillar) => (
            <div
              key={pillar.number}
              className="bg-[#FDFCFB] rounded-2xl p-6 border border-[#E8E2D8] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="font-serif text-2xl font-bold text-[#002366]/40 block">
                  {pillar.number}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#002366]">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
              <div className="pt-2 border-t border-[#E8E2D8] flex items-center gap-1.5 text-xs text-[#002366] font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Coach Ella Ruth Habit</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. COACHING FORMATS */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
            Engagement Options
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#002366]">
            Ways to Walk with Coach Ella Ruth
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Format 1 */}
          <div className="bg-[#FDFCFB] rounded-3xl p-7 border border-[#E8E2D8] shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5F2ED] flex items-center justify-center text-[#002366]">
                <Heart className="w-5 h-5 fill-[#002366]/10 text-[#002366]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#002366]">
                1:1 Longevity Mentorship
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                Bi-weekly phone or video sessions with Coach Ella Ruth. Personalized morning routines, whole foods guidance, and direct spiritual encouragement.
              </p>
              <div className="space-y-1.5 text-xs text-[#1A1A1A]/70 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Custom temple stewardship plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Direct prayer and check-in calls</span>
                </div>
              </div>
            </div>

            <a
              href="#inquiry-form"
              className="w-full py-2.5 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs text-center transition-colors block border border-[#D4AF37]/30"
            >
              Inquire for 1:1 Mentorship
            </a>
          </div>

          {/* Format 2 */}
          <div className="bg-[#FDFCFB] rounded-3xl p-7 border-2 border-[#D4AF37] shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5F2ED] flex items-center justify-center text-[#D4AF37]">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#002366]">
                6-Week Small Group Circle
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                A tight-knit cohort of women walking together. Weekly group video calls, shared daily accountability, and devotional check-ins.
              </p>
              <div className="space-y-1.5 text-xs text-[#1A1A1A]/70 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Cohort support & encouragement</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Weekly live Q&A with Ella Ruth</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenDevotional}
              className="w-full py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#e0bb45] text-[#002366] font-semibold text-xs text-center transition-colors block shadow-xs"
            >
              Download Guide & Join Waitlist
            </button>
          </div>

          {/* Format 3 */}
          <div className="bg-[#FDFCFB] rounded-3xl p-7 border border-[#E8E2D8] shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5F2ED] flex items-center justify-center text-[#4B0082]">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#002366]">
                Workshops & Keynotes
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                Invite Coach Ella Ruth to your women’s conference or church gathering. Inspiring, practical, and filled with joy and vitality.
              </p>
              <div className="space-y-1.5 text-xs text-[#1A1A1A]/70 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Interactive keynote address</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Mobility and posture guidance</span>
                </div>
              </div>
            </div>

            <a
              href="#inquiry-form"
              className="w-full py-2.5 rounded-full bg-[#F5F2ED] hover:bg-[#EFEBE4] text-[#002366] font-medium text-xs text-center border border-[#E8E2D8] transition-colors block"
            >
              Book Speaking Engagement
            </a>
          </div>
        </div>
      </section>

      {/* 4. 60-SECOND VITALITY CHECK-IN */}
      <section className="bg-[#F5F2ED] rounded-3xl p-8 sm:p-10 border border-[#E8E2D8] max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#FDFCFB] border border-[#E8E2D8] flex items-center justify-center text-[#002366]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#D4AF37]">
              Quick Self-Assessment
            </div>
            <h3 className="font-serif text-xl font-bold text-[#002366]">
              60-Second Vitality Check-In
            </h3>
          </div>
        </div>

        {quizSubmitted ? (
          <div className="bg-[#FDFCFB] border border-[#E8E2D8] rounded-2xl p-6 space-y-4">
            <div className="text-xs font-semibold text-[#002366]">
              Coach Ella Ruth’s Word for You:
            </div>
            <blockquote className="font-serif italic text-sm text-[#002366] leading-relaxed">
              “Sister, your body is ready for restoration! Start tomorrow morning with two full glasses of water before touching coffee or your phone, then step outside for a brisk 10-minute walk praising God. Small, faithful steps yield lasting stamina.”
            </blockquote>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={onOpenDevotional}
                className="px-5 py-2.5 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs flex items-center gap-2 border border-[#D4AF37]/30"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Download Free 7-Day Guide</span>
              </button>
              <button
                onClick={() => setQuizSubmitted(false)}
                className="px-5 py-2.5 rounded-full bg-[#F5F2ED] text-[#002366] border border-[#E8E2D8] font-medium text-xs"
              >
                Retake
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleQuizSubmit} className="space-y-5 text-xs">
            <div>
              <label className="block font-medium text-[#1A1A1A] mb-2">
                1. Afternoon Energy Level (1 = Low, 5 = High):
              </label>
              <div className="flex items-center justify-start sm:justify-start gap-2.5 sm:gap-3 flex-wrap">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuizEnergy(num)}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full font-semibold transition-all touch-sm ${
                      quizEnergy === num
                        ? 'bg-[#002366] text-white shadow-xs'
                        : 'bg-[#FDFCFB] border border-[#E8E2D8] text-[#1A1A1A] hover:bg-[#EFEBE4]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#1A1A1A] mb-2">
                2. Daily Water Intake:
              </label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {[
                  { id: 'low', label: '1–2 Glasses' },
                  { id: 'moderate', label: '3–5 Glasses' },
                  { id: 'high', label: '6+ Glasses' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setQuizHydration(item.id)}
                    className={`p-2.5 sm:p-3 rounded-xl border text-center transition-colors text-[11px] sm:text-xs leading-tight ${
                      quizHydration === item.id
                        ? 'border-[#002366] bg-[#FDFCFB] font-semibold text-[#002366] shadow-2xs'
                        : 'border-[#E8E2D8] bg-[#FDFCFB] text-[#1A1A1A]/70 hover:bg-[#EFEBE4]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#1A1A1A] mb-2">
                3. Daily Movement / Walking:
              </label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {[
                  { id: 'light', label: 'Under 15 Mins' },
                  { id: 'moderate', label: '20–30 Mins' },
                  { id: 'active', label: '45+ Mins' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setQuizMovement(item.id)}
                    className={`p-2.5 sm:p-3 rounded-xl border text-center transition-colors text-[11px] sm:text-xs leading-tight ${
                      quizMovement === item.id
                        ? 'border-[#002366] bg-[#FDFCFB] font-semibold text-[#002366] shadow-2xs'
                        : 'border-[#E8E2D8] bg-[#FDFCFB] text-[#1A1A1A]/70 hover:bg-[#EFEBE4]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs shadow-xs transition-colors border border-[#D4AF37]/30"
            >
              See Ella Ruth’s Recommendations
            </button>
          </form>
        )}
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
            Client Stories
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#002366]">
            Words from Women Coached by Ella Ruth
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wellnessTestimonials.map(t => (
            <div key={t.id} className="bg-[#FDFCFB] rounded-2xl p-6 border border-[#E8E2D8] shadow-xs space-y-3">
              <p className="font-serif italic text-sm text-[#002366] leading-relaxed">
                “{t.quote}”
              </p>
              <div className="pt-2 border-t border-[#E8E2D8] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#002366] block">{t.name}</span>
                  <span className="text-[#1A1A1A]/60 text-[11px]">{t.role} • {t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BOOKING FORM */}
      <section id="inquiry-form" className="max-w-2xl mx-auto scroll-mt-24">
        <div className="bg-[#FDFCFB] rounded-3xl p-8 sm:p-10 border border-[#E8E2D8] shadow-xs space-y-6">
          <div className="text-center space-y-1">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
              Consultation
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#002366]">
              Inquire About Coaching or Speaking
            </h3>
            <p className="text-xs text-[#1A1A1A]/60">
              Leave your contact details and our team will get in touch.
            </p>
          </div>

          {inquirySent ? (
            <div className="bg-[#F5F2ED] rounded-2xl p-6 text-center space-y-2 border border-[#E8E2D8]">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-serif text-lg font-bold text-[#002366]">Inquiry Received</h4>
              <p className="text-xs text-[#1A1A1A]/70">
                We will contact you shortly at {inquiryPhone} to discuss scheduling.
              </p>
              <button
                onClick={() => setInquirySent(false)}
                className="mt-2 px-4 py-2 rounded-full bg-[#EFEBE4] text-[#002366] text-xs font-medium border border-[#E8E2D8]"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1A1A1A] font-medium mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Brenda Washington"
                    value={inquiryName}
                    onChange={e => setInquiryName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-white text-[#1A1A1A] focus:outline-hidden focus:border-[#002366]"
                  />
                </div>
                <div>
                  <label className="block text-[#1A1A1A] font-medium mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="(601) 555-0199"
                    value={inquiryPhone}
                    onChange={e => setInquiryPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-white text-[#1A1A1A] focus:outline-hidden focus:border-[#002366]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1A1A1A] font-medium mb-1">Format of Interest</label>
                <select
                  value={inquiryFormat}
                  onChange={e => setInquiryFormat(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-white text-[#1A1A1A] focus:outline-hidden focus:border-[#002366]"
                >
                  <option value="1on1">1-on-1 Personal Longevity Mentorship</option>
                  <option value="group">6-Week Small Group Circle</option>
                  <option value="keynote">Speaking / Workshop for Church</option>
                </select>
              </div>

              <div>
                <label className="block text-[#1A1A1A] font-medium mb-1">Primary Goal or Topic</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Daily walking routine, morning energy, senior vitality talk..."
                  value={inquiryGoal}
                  onChange={e => setInquiryGoal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-white text-[#1A1A1A] focus:outline-hidden focus:border-[#002366]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs shadow-xs transition-colors border border-[#D4AF37]/30"
              >
                Submit Consultation Request
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
