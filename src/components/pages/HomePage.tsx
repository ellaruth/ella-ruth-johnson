import React from 'react';
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
  HandHeart
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

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 pt-4 sm:pt-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. CLEAN & WELCOMING HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Narrative & Clear Actions */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2ED] text-[#002366] text-xs font-medium border border-[#D4AF37]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Ella Ruth • Faith, Vitality & Devotion</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#002366] tracking-tight leading-[1.18]">
            Walking in Faith, Living in Vitality.
          </h1>

          <p className="text-[#1A1A1A]/75 text-base sm:text-lg leading-relaxed max-w-xl">
            Welcome to the personal ministry and wellness home of Ella Ruth — author, speaker, certified vitality coach, and devoted worshipper at Safe Haven Ministries. Guiding you into vibrant health, biblical stewardship, and joyful living.
          </p>

          {/* Clean Primary Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="hero-donate-cta"
              onClick={() => onNavigate('coaching')}
              className="px-6 py-3 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2 border border-[#D4AF37]/30"
            >
              <Activity className="w-4 h-4 text-[#D4AF37]" />
              <span>Explore Vitality Coaching</span>
            </button>

            <button
              id="hero-about-cta"
              onClick={() => onNavigate('about')}
              className="px-6 py-3 rounded-full bg-[#F5F2ED] hover:bg-[#EFEBE4] text-[#002366] font-medium text-sm border border-[#E8E2D8] transition-colors flex items-center gap-1.5"
            >
              <span>About Ella Ruth</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </div>

          {/* Subtle Trust Indicators */}
          <div className="pt-4 border-t border-[#E8E2D8] flex flex-wrap items-center gap-6 text-xs text-[#1A1A1A]/60 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Certified Vitality Coach</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#002366]" />
              <span>Faithful Worshipper at Safe Haven Ministries</span>
            </div>
          </div>
        </div>

        {/* Right Column: Clean, Warm Visual Card */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl overflow-hidden bg-[#F5F2ED] shadow-md border border-[#E8E2D8] aspect-[4/5] max-w-md mx-auto">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop"
              alt="Ella Ruth"
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Inspiring Floating Quote Card */}
            <div className="absolute bottom-5 left-5 right-5 bg-[#FDFCFB]/95 backdrop-blur-md rounded-2xl p-4 shadow-md border border-[#D4AF37]/30 space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                85 Years Young & Living Longer
              </div>
              <p className="text-xs text-[#1A1A1A] italic leading-snug">
                “Age is not a slow retreat; for a child of God, it is an accumulation of wisdom, stamina, and sacred purpose.”
              </p>
              <p className="text-[11px] text-[#1A1A1A]/60 font-medium pt-0.5">
                — Ella Ruth
              </p>
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
      <section className="py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 bg-[#FDFCFB] rounded-2xl border border-[#E8E2D8] shadow-xs space-y-1">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#002366]">23+</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/60">Years of Service</div>
            <p className="text-xs text-[#1A1A1A]/45 pt-1">Serving Mississippi since 2001</p>
          </div>

          <div className="p-6 bg-[#FDFCFB] rounded-2xl border border-[#E8E2D8] shadow-xs space-y-1">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#002366]">12,000+</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/60">Hot Meals Served</div>
            <p className="text-xs text-[#1A1A1A]/45 pt-1">Community banquets & street feeds</p>
          </div>

          <div className="p-6 bg-[#FDFCFB] rounded-2xl border border-[#E8E2D8] shadow-xs space-y-1">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#002366]">450+</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/60">Returning Citizens</div>
            <p className="text-xs text-[#1A1A1A]/45 pt-1">Mentorship & dignity care kits</p>
          </div>

          <div className="p-6 bg-[#FDFCFB] rounded-2xl border border-[#E8E2D8] shadow-xs space-y-1">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#002366]">Mombasa</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/60">Children Supported</div>
            <p className="text-xs text-[#1A1A1A]/45 pt-1">School feeding in Kenya</p>
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
      <section className="bg-gradient-to-r from-[#002366] via-[#001f5c] to-[#4B0082] text-white rounded-3xl p-8 sm:p-12 shadow-sm text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#D4AF37]/30">
        <div className="space-y-2 max-w-xl">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold">
            Need prayer or looking to connect with Ella Ruth?
          </h3>
          <p className="text-sm text-white/80 leading-relaxed">
            Our hearts are open. Reach out to request prayer, inquire about vitality coaching, or invite Ella Ruth to speak at your gathering.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onOpenPrayer}
            className="px-6 py-3 rounded-full bg-white text-[#002366] hover:bg-[#F5F2ED] font-semibold text-sm transition-colors shadow-xs"
          >
            Submit Prayer Request
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#e0bb45] text-[#002366] font-semibold text-sm transition-colors shadow-xs"
          >
            Get In Touch
          </button>
        </div>
      </section>
    </div>
  );
};
