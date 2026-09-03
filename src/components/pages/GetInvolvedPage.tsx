import React, { useState } from 'react';
import { PageTab } from '../../types';
import { DONATION_FUNDS } from '../../data/initialData';
import { 
  Heart, 
  HandHeart, 
  Users, 
  Building, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

interface GetInvolvedPageProps {
  onNavigate: (tab: PageTab) => void;
  onOpenDonate: (fundId?: string) => void;
  onOpenVolunteer: () => void;
}

export const GetInvolvedPage: React.FC<GetInvolvedPageProps> = ({
  onOpenDonate,
  onOpenVolunteer
}) => {
  const [partnerOrg, setPartnerOrg] = useState('');
  const [partnerContact, setPartnerContact] = useState('');
  const [partnerType, setPartnerType] = useState('church');
  const [partnerMessage, setPartnerMessage] = useState('');
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPartnerSubmitted(true);
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-20 pt-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Clean Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2ED] text-[#002366] text-xs font-medium border border-[#E8E2D8]">
          <HandHeart className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Support Our Mission</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#002366]">
          Get Involved with Safe Haven
        </h1>
        <p className="text-[#1A1A1A]/70 text-base leading-relaxed">
          Through prayer, volunteer service, and financial gifts, our partners help feed families, mentor returning citizens, and support children in Mississippi and Kenya.
        </p>
      </section>

      {/* Three Pathways */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Way 1: Donate */}
          <div className="bg-[#FDFCFB] rounded-3xl p-8 border border-[#E8E2D8] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5F2ED] border border-[#E8E2D8] flex items-center justify-center text-[#002366]">
                <Heart className="w-5 h-5 fill-[#002366]/15 text-[#002366]" />
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                Tax-Deductible Giving
              </div>
              <h3 className="font-serif text-xl font-bold text-[#002366]">
                Donate to Safe Haven
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                Choose the outreach fund closest to your heart — from prison reentry kits to community dinners or children’s school lunches in Kenya.
              </p>
              <div className="space-y-1.5 text-xs text-[#1A1A1A]/70 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>501(c)(3) instant tax receipt</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>One-time or recurring partner gifts</span>
                </div>
              </div>
            </div>
            <button
              id="get-involved-donate-btn"
              onClick={() => onOpenDonate()}
              className="w-full py-3 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs shadow-xs transition-colors flex items-center justify-center gap-2 border border-[#D4AF37]/30"
            >
              <Heart className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
              <span>Give Online Securely</span>
            </button>
          </div>

          {/* Way 2: Volunteer */}
          <div className="bg-[#FDFCFB] rounded-3xl p-8 border border-[#E8E2D8] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5F2ED] border border-[#E8E2D8] flex items-center justify-center text-[#002366]">
                <HandHeart className="w-5 h-5 text-[#002366]" />
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                Hands-On Service
              </div>
              <h3 className="font-serif text-xl font-bold text-[#002366]">
                Volunteer Your Time
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                Serve hot meals, organize clothes closet items, mentor youth, or assist with event setup and prayer support in Columbia, MS.
              </p>
              <div className="space-y-1.5 text-xs text-[#1A1A1A]/70 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Flexible weekend & weekday slots</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Warm, supportive community team</span>
                </div>
              </div>
            </div>
            <button
              id="get-involved-volunteer-btn"
              onClick={onOpenVolunteer}
              className="w-full py-3 rounded-full bg-[#F5F2ED] hover:bg-[#E8E2D8] text-[#002366] font-medium text-xs transition-colors flex items-center justify-center gap-2 border border-[#E8E2D8]"
            >
              <Users className="w-4 h-4 text-[#002366]" />
              <span>Sign Up to Volunteer</span>
            </button>
          </div>

          {/* Way 3: Sponsor */}
          <div className="bg-[#FDFCFB] rounded-3xl p-8 border border-[#E8E2D8] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5F2ED] border border-[#E8E2D8] flex items-center justify-center text-[#002366]">
                <Building className="w-5 h-5 text-[#002366]" />
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                Church & Corporate
              </div>
              <h3 className="font-serif text-xl font-bold text-[#002366]">
                Sponsor or Partner
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                Churches and businesses can sponsor tables at community honor banquets or underwrite conference materials and student supplies.
              </p>
              <div className="space-y-1.5 text-xs text-[#1A1A1A]/70 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Program and stage recognition</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Meaningful local impact connection</span>
                </div>
              </div>
            </div>
            <a
              href="#partner-form"
              className="w-full py-3 rounded-full bg-[#F5F2ED] hover:bg-[#E8E2D8] text-[#002366] font-medium text-xs transition-colors flex items-center justify-center gap-2 border border-[#E8E2D8]"
            >
              <span>Explore Sponsorship</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#002366]" />
            </a>
          </div>
        </div>
      </section>

      {/* Fund Designations */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
            Targeted Giving
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#002366]">
            Choose Where Your Gift Helps Most
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DONATION_FUNDS.map(fund => (
            <div
              key={fund.id}
              className="bg-[#FDFCFB] rounded-2xl p-6 border border-[#E8E2D8] shadow-xs flex flex-col justify-between space-y-4 hover:shadow-sm transition-all"
            >
              <div className="space-y-2">
                <h4 className="font-serif text-base font-bold text-[#002366]">
                  {fund.name}
                </h4>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                  {fund.description}
                </p>
                <div className="bg-[#F5F2ED] p-2.5 rounded-xl border border-[#E8E2D8] text-[11px] text-[#002366] font-serif italic">
                  {fund.impactQuote}
                </div>
              </div>
              <button
                onClick={() => onOpenDonate(fund.id)}
                className="w-full py-2.5 rounded-full bg-[#F5F2ED] hover:bg-[#E8E2D8] text-[#002366] font-medium text-xs transition-colors border border-[#E8E2D8]"
              >
                Donate to This Fund
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Partner Proposal Form */}
      <section id="partner-form" className="max-w-2xl mx-auto scroll-mt-24">
        <div className="bg-[#FDFCFB] rounded-3xl p-8 sm:p-10 border border-[#E8E2D8] shadow-xs space-y-6">
          <div className="text-center space-y-1">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
              Partnership Inquiry
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#002366]">
              Sponsor an Event or Partner with Us
            </h3>
            <p className="text-xs text-[#1A1A1A]/60">
              For church congregations, business allies, and community foundations.
            </p>
          </div>

          {partnerSubmitted ? (
            <div className="bg-[#F5F2ED] border border-[#E8E2D8] rounded-2xl p-6 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-serif text-lg font-bold text-[#002366]">Inquiry Received</h4>
              <p className="text-xs text-[#1A1A1A]/70">
                Thank you! Our liaison will follow up with {partnerContact} to discuss details.
              </p>
              <button
                onClick={() => setPartnerSubmitted(false)}
                className="mt-2 px-4 py-2 rounded-full bg-white text-[#002366] border border-[#E8E2D8] text-xs font-medium hover:bg-[#F5F2ED]"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handlePartnerSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1A1A1A] font-medium mb-1">Organization / Church Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. First Baptist Church"
                    value={partnerOrg}
                    onChange={e => setPartnerOrg(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-white text-[#1A1A1A] focus:outline-hidden focus:border-[#002366]"
                  />
                </div>
                <div>
                  <label className="block text-[#1A1A1A] font-medium mb-1">Contact Name & Info *</label>
                  <input
                    type="text"
                    required
                    placeholder="Pastor David Miller / (601) 555-0182"
                    value={partnerContact}
                    onChange={e => setPartnerContact(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-white text-[#1A1A1A] focus:outline-hidden focus:border-[#002366]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1A1A1A] font-medium mb-1">Partnership Interest</label>
                <select
                  value={partnerType}
                  onChange={e => setPartnerType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-white text-[#1A1A1A] focus:outline-hidden focus:border-[#002366]"
                >
                  <option value="church">Church Congregation Partnership (Mission & Outreach)</option>
                  <option value="conference-sponsor">Divine Transformation Conference Sponsor</option>
                  <option value="banquet-table">Community Honor Banquet Table Sponsor</option>
                  <option value="kenya-supplies">Mombasa School Supply & Feeding Sponsor</option>
                </select>
              </div>

              <div>
                <label className="block text-[#1A1A1A] font-medium mb-1">Message or Collaboration Idea</label>
                <textarea
                  rows={3}
                  placeholder="Share any thoughts or questions..."
                  value={partnerMessage}
                  onChange={e => setPartnerMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-white text-[#1A1A1A] focus:outline-hidden focus:border-[#002366]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs shadow-xs transition-colors border border-[#D4AF37]/30"
              >
                Submit Proposal
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
