import React from 'react';
import { PageTab } from '../../types';
import { MINISTRY_PROGRAMS } from '../../data/initialData';
import { 
  Heart, 
  ShieldCheck, 
  KeyRound, 
  HeartHandshake, 
  Sparkles, 
  Utensils, 
  Globe2, 
  CheckCircle2, 
  MapPin,
  HandHeart
} from 'lucide-react';

interface MinistryPageProps {
  onNavigate: (tab: PageTab) => void;
  onOpenDonate: (fundId?: string) => void;
  onOpenVolunteer: () => void;
}

export const MinistryPage: React.FC<MinistryPageProps> = ({
  onNavigate,
  onOpenDonate,
  onOpenVolunteer
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'KeyRound': return <KeyRound className="w-5 h-5" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Utensils': return <Utensils className="w-5 h-5" />;
      case 'Globe2': return <Globe2 className="w-5 h-5" />;
      default: return <Heart className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-20 pt-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Clean Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2ED] text-[#002366] text-xs font-medium border border-[#D4AF37]/40">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Where Ella Ruth Worships & Serves • Columbia, MS</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#002366]">
          My Church Home: Safe Haven Ministries
        </h1>
        <p className="text-[#1A1A1A]/75 text-base leading-relaxed">
          Ella Ruth is a faithful worshipper and active community servant at Safe Haven Ministries. Discover the heart of the church, our weekly fellowship services, and community outreach missions.
        </p>

        {/* Weekly Fellowship Times Card */}
        <div className="bg-[#F5F2ED] border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-5 text-left max-w-xl mx-auto my-3 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
            Weekly Fellowship & Worship Times
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#1A1A1A]/80">
            <div className="bg-[#FDFCFB] p-3 rounded-xl border border-[#E8E2D8]">
              <span className="font-semibold text-[#002366] block">Sunday Celebration Service</span>
              <span>10:00 AM CST • Worship & Preaching</span>
            </div>
            <div className="bg-[#FDFCFB] p-3 rounded-xl border border-[#E8E2D8]">
              <span className="font-semibold text-[#002366] block">Wednesday Word & Prayer</span>
              <span>6:30 PM CST • Bible Study & Fellowship</span>
            </div>
          </div>
          <p className="text-[11px] text-[#1A1A1A]/65 italic text-center pt-1">
            “You are always invited to sit, pray, and rejoice with us this coming Sunday!” — Ella Ruth
          </p>
        </div>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            id="ministry-donate-hero-cta"
            onClick={() => onOpenDonate('fund-general')}
            className="px-6 py-2.5 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-2 border border-[#D4AF37]/30"
          >
            <Heart className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
            <span>Support Church Outreach</span>
          </button>
          <button
            id="ministry-volunteer-hero-cta"
            onClick={onOpenVolunteer}
            className="px-6 py-2.5 rounded-full bg-[#F5F2ED] hover:bg-[#EFEBE4] text-[#002366] font-medium text-xs border border-[#E8E2D8] transition-colors flex items-center gap-2"
          >
            <HandHeart className="w-4 h-4 text-[#D4AF37]" />
            <span>Serve Alongside Us</span>
          </button>
        </div>
      </section>

      {/* Program Breakdowns (Clean, Airy Cards) */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
            Core Initiatives
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#002366]">
            Our Five Outreach Programs
          </h2>
        </div>

        <div className="space-y-8">
          {MINISTRY_PROGRAMS.map((program, index) => {
            const isReversed = index % 2 === 1;
            return (
              <div
                key={program.id}
                id={`program-${program.id}`}
                className="bg-[#FDFCFB] rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-xs hover:shadow-sm transition-all"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Visual */}
                  <div className={`lg:col-span-5 ${isReversed ? 'lg:order-2' : ''}`}>
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#F5F2ED]">
                      <img
                        src={program.image}
                        alt={program.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-[#FDFCFB]/95 backdrop-blur-xs text-[#002366] text-xs font-semibold px-3 py-1 rounded-full shadow-xs border border-[#D4AF37]/40">
                        {program.badge}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className={`lg:col-span-7 space-y-4 ${isReversed ? 'lg:order-1' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F5F2ED] text-[#002366] flex items-center justify-center">
                        {getIcon(program.icon)}
                      </div>
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#002366]">
                          {program.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-[#1A1A1A]/60">
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{program.location}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-[#1A1A1A]/75 leading-relaxed">
                      {program.fullDesc}
                    </p>

                    {/* Impact Metric Banner */}
                    <div className="bg-[#F5F2ED] border border-[#E8E2D8] p-3 rounded-xl flex items-center gap-2.5 text-xs text-[#002366] font-medium">
                      <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>{program.impactHighlight}</span>
                    </div>

                    {/* Key Services */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-xs font-semibold text-[#002366]">
                        Key Services Provided:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#1A1A1A]/75">
                        {program.keyServices.map((service, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => onOpenDonate(program.id === 'mombasa-kenya' ? 'fund-mombasa' : program.id === 'prison-reentry' ? 'fund-reentry' : program.id === 'community-dinners' ? 'fund-meals' : 'fund-general')}
                        className="px-5 py-2.5 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs shadow-xs transition-colors flex items-center gap-1.5 border border-[#D4AF37]/30"
                      >
                        <Heart className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                        <span>Sponsor This Program</span>
                      </button>
                      <button
                        onClick={onOpenVolunteer}
                        className="px-5 py-2.5 rounded-full bg-[#F5F2ED] hover:bg-[#EFEBE4] text-[#002366] font-medium text-xs border border-[#E8E2D8] transition-colors"
                      >
                        Volunteer Here
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stewardship & 501(c)(3) Note */}
      <section className="bg-[#F5F2ED] rounded-3xl p-8 sm:p-10 border border-[#E8E2D8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#002366] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Stewardship & Transparency</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#002366]">
              100% Tax-Deductible Public Charity
            </h3>
            <p className="text-sm text-[#1A1A1A]/75 leading-relaxed">
              Safe Haven Out Reach Ministries, Inc. is a registered 501(c)(3) nonprofit in Columbia, Mississippi. All donations directly support community meals, clothing drives, prison reentry kits, and our partner children's center in Kenya.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              onClick={() => onOpenDonate()}
              className="w-full py-3 px-6 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-semibold text-xs shadow-xs transition-all text-center flex items-center justify-center gap-2 border border-[#D4AF37]/30"
            >
              <Heart className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
              <span>Make a Gift</span>
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="w-full py-2.5 px-6 rounded-full bg-[#FDFCFB] hover:bg-[#EFEBE4] text-[#002366] font-medium text-xs border border-[#E8E2D8] text-center"
            >
              Contact Ministry Office
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
