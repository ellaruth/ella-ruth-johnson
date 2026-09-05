import React, { useState } from 'react';
import { PageTab, EventItem, SermonTeaching } from '../../types';
import { 
  Heart, 
  Sparkles, 
  Activity, 
  BookOpen, 
  Calendar, 
  ArrowRight, 
  Play, 
  ShieldCheck, 
  Globe2, 
  Utensils, 
  KeyRound, 
  CheckCircle2,
  ChevronRight,
  HandHeart,
  Sun,
  Flame,
  MessageSquare,
  Volume2,
  VolumeX,
  Church,
  Download
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: PageTab) => void;
  onOpenDonate: (fundId?: string) => void;
  onOpenDevotional: () => void;
  onOpenPrayer: () => void;
  events: EventItem[];
  sermons: SermonTeaching[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenDonate,
  onOpenDevotional,
  onOpenPrayer,
  events,
  sermons
}) => {
  const nextEvent = events.find(e => e.isUpcoming) || events[0];
  const featuredSermon = sermons[0];

  // Interactive Hero Greetings Widget
  const [activeTab, setActiveTab] = useState<'welcome' | 'vitality' | 'scripture'>('welcome');
  const [copiedQuote, setCopiedQuote] = useState(false);

  const heroGreetings = {
    welcome: {
      tag: "Personal Welcome from Ella",
      icon: <Sparkles className="w-4 h-4 text-[#D4AF37]" />,
      heading: "“I’m 85 years young, and I want to tell you: God is not done with you yet!”",
      body: "Whether you need renewal for your physical body, encouragement for your spiritual walk, or are looking for a loving church home to worship in — you are warmly welcomed into this family.",
      actionLabel: "Read Ella's Story",
      action: () => onNavigate('about')
    },
    vitality: {
      tag: "Ella's Daily Vitality Habit",
      icon: <Flame className="w-4 h-4 text-[#D4AF37]" />,
      heading: "“Motion is lotion for the joints, and gratitude is medicine for the bones!”",
      body: "Before checking your phone in the morning, drink a tall glass of cool water, take deep diaphragmatic breaths, and take a purposeful 15-minute walk while speaking life over your day.",
      actionLabel: "Start 60-Sec Vitality Check",
      action: () => onNavigate('coaching')
    },
    scripture: {
      tag: "Today's Living Word",
      icon: <BookOpen className="w-4 h-4 text-[#D4AF37]" />,
      heading: "“Those who wait upon the Lord shall renew their strength; they shall mount up with wings like eagles.”",
      body: "Isaiah 40:31 — Age does not dictate your destiny. God’s supernatural strength lifts and carries you through every season of life.",
      actionLabel: "Read This Week's Devotional",
      action: () => onNavigate('teaching')
    }
  };

  const currentGreeting = heroGreetings[activeTab];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 pt-4 sm:pt-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. STUNNING, LIVELY & WELCOMING HERO SECTION */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#FDFCFB] via-[#FAF7F0] to-[#F3EDE2] border border-[#E8E2D8] shadow-sm p-6 sm:p-10 lg:p-14">
        {/* Subtle Ambient Radial Shimmers */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#002366]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Narrative, Interactive Inspiration & Clear Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDFCFB] text-[#002366] text-xs font-semibold border border-[#D4AF37]/40 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Ella Ruth · Author, Vitality Coach & Speaker</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#002366] tracking-tight leading-[1.14]">
              Walking in Faith, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#002366] via-[#2a1b54] to-[#7b5417] bg-clip-text text-transparent">
                Living in Vitality.
              </span>
            </h1>

            <p className="text-[#1A1A1A]/75 text-base sm:text-lg leading-relaxed max-w-xl">
              The official personal home of <strong>Ella Ruth</strong> — empowering women and men to live longer, healthier lives through biblical body stewardship, while faithfully worshipping and serving at Safe Haven Ministries in Columbia, Mississippi.
            </p>

            {/* Interactive Inspiration Switcher */}
            <div className="bg-[#FDFCFB]/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#E8E2D8] shadow-2xs space-y-3">
              {/* Tabs */}
              <div className="flex items-center gap-1.5 border-b border-[#E8E2D8] pb-2.5 overflow-x-auto scrollbar-none flex-nowrap">
                <button
                  onClick={() => setActiveTab('welcome')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                    activeTab === 'welcome'
                      ? 'bg-[#002366] text-white shadow-2xs'
                      : 'text-[#1A1A1A]/70 hover:text-[#002366] hover:bg-[#F5F2ED]'
                  }`}
                >
                  <span>💖 Welcome</span>
                </button>
                <button
                  onClick={() => setActiveTab('vitality')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                    activeTab === 'vitality'
                      ? 'bg-[#002366] text-white shadow-2xs'
                      : 'text-[#1A1A1A]/70 hover:text-[#002366] hover:bg-[#F5F2ED]'
                  }`}
                >
                  <span>⚡ Vitality Habit</span>
                </button>
                <button
                  onClick={() => setActiveTab('scripture')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                    activeTab === 'scripture'
                      ? 'bg-[#002366] text-white shadow-2xs'
                      : 'text-[#1A1A1A]/70 hover:text-[#002366] hover:bg-[#F5F2ED]'
                  }`}
                >
                  <span>🕊️ Word of the Day</span>
                </button>
              </div>

              {/* Dynamic Content Body */}
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-bold text-[#D4AF37]">
                  {currentGreeting.icon}
                  <span>{currentGreeting.tag}</span>
                </div>
                <p className="font-serif italic text-sm sm:text-base text-[#002366] font-medium leading-snug">
                  {currentGreeting.heading}
                </p>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                  {currentGreeting.body}
                </p>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <button
                  onClick={currentGreeting.action}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#002366] hover:text-[#D4AF37] transition-colors"
                >
                  <span>{currentGreeting.actionLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] text-[#1A1A1A]/40 font-mono">
                  Tap tabs above to explore
                </span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              <button
                id="hero-coaching-cta"
                onClick={() => onNavigate('coaching')}
                className="px-6 py-3.5 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 border border-[#D4AF37]/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Activity className="w-4 h-4 text-[#D4AF37]" />
                <span>Explore Vitality Coaching</span>
              </button>

              <button
                id="hero-devotional-guide-cta"
                onClick={onOpenDevotional}
                className="px-5 py-3.5 rounded-full bg-[#FDFCFB] hover:bg-[#EFEBE4] text-[#002366] font-semibold text-sm border border-[#E8E2D8] transition-all flex items-center justify-center gap-2 hover:border-[#D4AF37]/60"
              >
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>Free 7-Day Guide</span>
              </button>

              <button
                id="hero-church-home-cta"
                onClick={() => onNavigate('ministry')}
                className="px-5 py-3.5 rounded-full bg-transparent hover:bg-[#F5F2ED] text-[#002366] font-medium text-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <span>My Church Home</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-[#E8E2D8] flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-[#1A1A1A]/60 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Certified Vitality Coach</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Church className="w-4 h-4 text-[#002366] shrink-0" />
                <span>Safe Haven Ministries</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Columbia, Mississippi</span>
              </div>
            </div>
          </div>

          {/* Right Column: Portrait Display (Optimized for both mobile and desktop) */}
          <div className="flex lg:col-span-5 relative justify-center mt-2 lg:mt-0">
            {/* Ambient Multi-Ring Glow */}
            <div className="absolute inset-0 max-w-sm mx-auto rounded-[3rem] bg-gradient-to-tr from-[#D4AF37]/30 via-[#FDFCFB]/50 to-[#002366]/20 blur-2xl transform -rotate-2 pointer-events-none" />

            {/* Luxury Framed Card */}
            <div className="relative w-full max-w-[310px] sm:max-w-sm rounded-[2.25rem] sm:rounded-[2.75rem] overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#FAF7F0] to-[#F1ECE1] shadow-xl sm:shadow-2xl border-2 border-[#D4AF37]/40 p-4 sm:p-5 flex flex-col items-center text-center">
              
              {/* Floating Top Status Badge */}
              <div className="w-full flex items-center justify-between pb-3 px-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDFCFB] border border-[#D4AF37]/40 text-[11px] font-semibold text-[#002366] shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>85 & Thriving</span>
                </div>

                <div className="text-[11px] text-[#1A1A1A]/60 font-medium">
                  Columbia, MS
                </div>
              </div>

              {/* High-Resolution Portrait Display with Soft Circular Framing */}
              <div className="relative w-full aspect-square max-w-[260px] sm:max-w-[320px] rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-b from-[#F5F2ED] to-white border border-[#E8E2D8] flex items-center justify-center shadow-inner group">
                <img
                  src="/ellaruth.png"
                  alt="Ella Ruth - Author, Vitality Coach & Speaker"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 select-none"
                />

                {/* Subtle Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#002366]/40 via-transparent to-transparent opacity-60 pointer-events-none" />

                {/* Over-image Tag */}
                <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3 bg-[#FDFCFB]/95 backdrop-blur-md rounded-xl py-1 sm:py-1.5 px-3 border border-[#D4AF37]/40 shadow-xs flex items-center justify-between pointer-events-none">
                  <span className="font-serif font-bold text-xs text-[#002366]">Ella Ruth</span>
                  <span className="text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider">Living Testimony</span>
                </div>
              </div>

              {/* Bottom Quote & Personal Touch */}
              <div className="pt-3 sm:pt-4 space-y-2 w-full text-left px-1">
                <p className="text-xs text-[#1A1A1A]/80 italic leading-snug font-serif">
                  “Age is not a slow retreat; for a child of God, it is an accumulation of wisdom, stamina, and sacred purpose.”
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-[#E8E2D8]/80 text-[11px]">
                  <span className="font-medium text-[#002366]">— Ella Ruth Johnson</span>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="text-[#D4AF37] hover:text-[#002366] font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>Say Hello</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE CORE PILLARS (Clean, Minimal & Spacious) */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
            Our Primary Calling
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#002366]">
            Faith in action across three key areas
          </h2>
          <p className="text-sm text-[#1A1A1A]/70">
            Dedicated grassroots initiatives bringing tangible relief, spiritual nourishment, and vibrant health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Outreach */}
          <div className="bg-[#FDFCFB] rounded-2xl p-7 border border-[#E8E2D8] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#F5F2ED] flex items-center justify-center text-[#002366]">
                <Heart className="w-5 h-5 fill-[#002366]/20 text-[#002366]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#002366]">
                My Church Home
              </h3>
              <p className="text-sm text-[#1A1A1A]/70 leading-relaxed">
                Where I worship, fellowship, and serve in community outreach and prayer alongside our church family at Safe Haven Ministries in Columbia, MS.
              </p>
            </div>

            <button
              onClick={() => onNavigate('ministry')}
              className="text-sm font-semibold text-[#002366] hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors pt-2"
            >
              <span>Visit Safe Haven Ministries</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 2: 85 & Thriving */}
          <div className="bg-[#FDFCFB] rounded-2xl p-7 border border-[#E8E2D8] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#F5F2ED] flex items-center justify-center text-[#D4AF37]">
                <Activity className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#002366]">
                85 & Thriving Coaching
              </h3>
              <p className="text-sm text-[#1A1A1A]/70 leading-relaxed">
                Holistic longevity guidance for seniors and women seeking natural energy, daily movement, and spiritual vitality at any age.
              </p>
            </div>

            <button
              onClick={() => onNavigate('coaching')}
              className="text-sm font-semibold text-[#002366] hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors pt-2"
            >
              <span>Discover Coaching Plan</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 3: Preaching & Revivals */}
          <div className="bg-[#FDFCFB] rounded-2xl p-7 border border-[#E8E2D8] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#F5F2ED] flex items-center justify-center text-[#4B0082]">
                <BookOpen className="w-5 h-5 text-[#4B0082]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#002366]">
                Preaching & Teaching
              </h3>
              <p className="text-sm text-[#1A1A1A]/70 leading-relaxed">
                Inspiring revivals, healing services, and the annual Divine Transformation conference bringing communities together in worship.
              </p>
            </div>

            <button
              onClick={() => onNavigate('teaching')}
              className="text-sm font-semibold text-[#002366] hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors pt-2"
            >
              <span>Listen & Read Teachings</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. EVENT SPOTLIGHT (Clean & Friendly) */}
      {nextEvent && (
        <section className="bg-[#F5F2ED] rounded-3xl p-8 sm:p-10 border border-[#E8E2D8] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDFCFB] text-[#002366] text-xs font-semibold border border-[#D4AF37]/40">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Upcoming Gathering</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#002366]">
                {nextEvent.title}
              </h3>
              <p className="text-sm text-[#1A1A1A]/70 leading-relaxed max-w-2xl">
                {nextEvent.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#1A1A1A]/60 font-medium pt-1">
                <span>{nextEvent.date}</span>
                <span>•</span>
                <span>{nextEvent.location}</span>
                {nextEvent.time && (
                  <>
                    <span>•</span>
                    <span>{nextEvent.time}</span>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <button
                onClick={() => onNavigate('events')}
                className="px-6 py-3 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-semibold text-sm transition-colors text-center border border-[#D4AF37]/30"
              >
                View Event Details
              </button>
              <button
                onClick={onOpenPrayer}
                className="px-6 py-3 rounded-full bg-[#FDFCFB] hover:bg-[#EFEBE4] text-[#002366] font-medium text-sm border border-[#E8E2D8] transition-colors text-center"
              >
                Submit a Prayer Request
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 4. IMPACT AT A GLANCE (Airy, Minimal Numbers) */}
      <section className="py-4 sm:py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
          <div className="p-4 sm:p-6 bg-[#FDFCFB] rounded-2xl border border-[#E8E2D8] shadow-xs space-y-1">
            <div className="font-serif text-2xl sm:text-4xl font-bold text-[#002366]">23+</div>
            <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/60">Years of Service</div>
            <p className="text-[10px] sm:text-xs text-[#1A1A1A]/45 pt-1">Serving Mississippi since 2001</p>
          </div>

          <div className="p-4 sm:p-6 bg-[#FDFCFB] rounded-2xl border border-[#E8E2D8] shadow-xs space-y-1">
            <div className="font-serif text-2xl sm:text-4xl font-bold text-[#002366]">12,000+</div>
            <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/60">Hot Meals Served</div>
            <p className="text-[10px] sm:text-xs text-[#1A1A1A]/45 pt-1">Community banquets & street feeds</p>
          </div>

          <div className="p-4 sm:p-6 bg-[#FDFCFB] rounded-2xl border border-[#E8E2D8] shadow-xs space-y-1">
            <div className="font-serif text-2xl sm:text-4xl font-bold text-[#002366]">450+</div>
            <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/60">Returning Citizens</div>
            <p className="text-[10px] sm:text-xs text-[#1A1A1A]/45 pt-1">Mentorship & dignity care kits</p>
          </div>

          <div className="p-4 sm:p-6 bg-[#FDFCFB] rounded-2xl border border-[#E8E2D8] shadow-xs space-y-1">
            <div className="font-serif text-2xl sm:text-4xl font-bold text-[#002366]">Mombasa</div>
            <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/60">Children Supported</div>
            <p className="text-[10px] sm:text-xs text-[#1A1A1A]/45 pt-1">School feeding in Kenya</p>
          </div>
        </div>
      </section>

      {/* 5. FEATURED WORD OF THE WEEK (Clean & Easy to Read) */}
      <section className="bg-[#FDFCFB] rounded-3xl p-8 sm:p-10 border border-[#E8E2D8] shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F2ED] text-[#002366] text-xs font-medium border border-[#D4AF37]/40">
              <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Devotional Teaching from Ella Ruth</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#002366]">
              “{featuredSermon.title}”
            </h3>

            <p className="text-xs sm:text-sm font-medium text-[#D4AF37]">
              Scripture: {featuredSermon.scripture} • {featuredSermon.series}
            </p>

            <p className="text-sm text-[#1A1A1A]/75 leading-relaxed">
              {featuredSermon.summary}
            </p>

            <div className="bg-[#F5F2ED] p-4 rounded-xl border border-[#E8E2D8] text-sm text-[#1A1A1A] italic font-serif">
              {featuredSermon.featuredQuote}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('teaching')}
                className="px-5 py-2.5 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs shadow-xs transition-colors flex items-center gap-2 border border-[#D4AF37]/30"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                <span>Read Full Teaching</span>
              </button>
              <button
                onClick={onOpenDevotional}
                className="px-5 py-2.5 rounded-full bg-[#F5F2ED] hover:bg-[#EFEBE4] text-[#002366] text-xs font-medium border border-[#E8E2D8] transition-colors"
              >
                Free 7-Day Guide
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#F5F2ED] rounded-2xl p-6 border border-[#E8E2D8] space-y-3">
            <h4 className="font-serif font-bold text-[#002366] text-sm">
              Core Study Insights
            </h4>
            <div className="space-y-2.5 text-xs text-[#1A1A1A]/70">
              {featuredSermon.corePoints.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#002366] text-[#D4AF37] font-semibold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. CLEAN, WARM CALL TO ACTION */}
      <section className="bg-gradient-to-r from-[#002366] via-[#001f5c] to-[#4B0082] text-white rounded-3xl p-6 sm:p-12 shadow-sm text-center sm:text-left flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 border border-[#D4AF37]/30">
        <div className="space-y-2 max-w-xl">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold">
            Need prayer or looking to connect with Ella Ruth?
          </h3>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Our hearts are open. Reach out to request prayer, inquire about vitality coaching, or invite Ella Ruth to speak at your gathering.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={onOpenPrayer}
            className="px-6 py-3 rounded-full bg-white text-[#002366] hover:bg-[#F5F2ED] font-semibold text-sm transition-colors shadow-xs text-center"
          >
            Submit Prayer Request
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#e0bb45] text-[#002366] font-semibold text-sm transition-colors shadow-xs text-center"
          >
            Get In Touch
          </button>
        </div>
      </section>
    </div>
  );
};
