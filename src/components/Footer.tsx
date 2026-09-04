import React, { useState } from 'react';
import { PageTab } from '../types';
import { 
  Heart, 
  Sparkles, 
  MapPin, 
  Phone, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  Facebook,
  Youtube
} from 'lucide-react';

import { api } from '../services/api';

interface FooterProps {
  onNavigate: (tab: PageTab) => void;
  onOpenDonate: (fundId?: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenDonate,
  onOpenAdmin
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterChoice, setNewsletterChoice] = useState<'both' | 'ministry' | 'wellness'>('both');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    try {
      await api.subscribeNewsletter(newsletterEmail.trim(), newsletterChoice);
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setNewsletterEmail('');
      }, 5000);
    } catch (err) {
      console.error('Failed to subscribe:', err);
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-[#F5F2ED] text-[#1A1A1A]/80 border-t border-[#E8E2D8]">
      {/* Inspirational Quote Banner */}
      <div className="border-b border-[#E8E2D8] py-12 px-4 sm:px-6 lg:px-8 bg-[#FDFCFB]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F2ED] text-[#002366] text-xs font-medium border border-[#D4AF37]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Ella Ruth</span>
          </div>
          <p className="font-serif text-xl sm:text-2xl text-[#002366] italic font-normal leading-relaxed">
            “I’m 85 years young — challenging men and women to live longer, healthier lives through biblical vitality, while walking in devoted fellowship with our church and community.”
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
            <button
              id="footer-donate-cta-button"
              onClick={() => onOpenDonate()}
              className="px-5 py-2.5 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs shadow-xs transition-colors flex items-center gap-2 border border-[#D4AF37]/30"
            >
              <Heart className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
              <span>Support Outreach & Mission</span>
            </button>
            <button
              id="footer-coaching-cta-button"
              onClick={() => {
                onNavigate('coaching');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-full bg-[#FDFCFB] hover:bg-[#EFEBE4] text-[#002366] font-medium text-xs border border-[#E8E2D8] transition-colors flex items-center gap-1.5"
            >
              <span>Explore Wellness Coaching</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Links & Details */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Personal Info & Church Home */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#002366]">
                Ella Ruth
              </h2>
              <p className="text-xs text-[#1A1A1A]/60">Author • Vitality Coach • Speaker</p>
            </div>

            <p className="text-xs text-[#1A1A1A]/75 leading-relaxed">
              Inspiring believers to walk in vibrant physical vitality and spiritual wholeness. Faithful worshipper and active community servant at Safe Haven Ministries in Columbia, Mississippi.
            </p>

            <div className="space-y-1.5 text-xs text-[#1A1A1A]/75 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Columbia, MS 39429</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>(601) 736-SAFE (Ministry Center)</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#FDFCFB] hover:bg-[#002366] hover:text-white flex items-center justify-center text-[#002366] border border-[#E8E2D8] transition-colors"
                title="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#FDFCFB] hover:bg-[#002366] hover:text-white flex items-center justify-center text-[#002366] border border-[#E8E2D8] transition-colors"
                title="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#002366]">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => { onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#002366] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#002366] transition-colors"
                >
                  About Ella Ruth
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('ministry'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#002366] transition-colors"
                >
                  Safe Haven Ministry
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('coaching'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#002366] transition-colors"
                >
                  85 & Thriving Coaching
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('teaching'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#002366] transition-colors"
                >
                  Sermon Archives
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('events'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#002366] transition-colors"
                >
                  Calendar & Events
                </button>
              </li>
            </ul>
          </div>

          {/* Outreach Programs */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#002366]">
              Programs
            </h3>
            <ul className="space-y-2 text-xs text-[#1A1A1A]/70">
              <li>Prison & Reentry Support</li>
              <li>Homeless Street Outreach</li>
              <li>Youth Mentorship</li>
              <li>Community Honor Banquets</li>
              <li>Annual Thanksgiving Feasts</li>
              <li>Mombasa Children’s Centre</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#002366]">
              Stay Connected
            </h3>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
              Sign up for Safe Haven community updates and Coach Ella Ruth's weekly morning devotions.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you! You have been subscribed.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-1.5">
                  {(['both', 'ministry', 'wellness'] as const).map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setNewsletterChoice(option)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                        newsletterChoice === option
                          ? 'bg-[#002366] text-white border-[#002366]'
                          : 'bg-[#FDFCFB] text-[#1A1A1A]/75 border-[#E8E2D8] hover:border-[#D4AF37]'
                      }`}
                    >
                      {option === 'both' ? 'All' : option === 'ministry' ? 'Ministry' : 'Wellness'}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FDFCFB] border border-[#E8E2D8] text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-hidden focus:border-[#002366]"
                  />
                  <button
                    id="newsletter-subscribe-button"
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#002366] hover:bg-[#001a4e] text-white text-xs font-medium shrink-0 transition-colors border border-[#D4AF37]/30"
                  >
                    Join
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#E8E2D8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#1A1A1A]/60">
          <div>
            © {new Date().getFullYear()} Ella Ruth. All rights reserved. Faithful worshipper at Safe Haven Ministries.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => { onNavigate('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-[#002366] transition-colors"
            >
              Contact
            </button>
            <span>•</span>
            <button
              id="footer-admin-cms-trigger"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 hover:text-[#002366] transition-colors"
            >
              <Lock className="w-3 h-3 text-[#D4AF37]" />
              <span>Ministry CMS Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
