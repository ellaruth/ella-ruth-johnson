import React, { useState } from 'react';
import { PageTab } from '../types';
import { 
  Heart, 
  Menu, 
  X, 
  Sparkles, 
  Church, 
  Activity, 
  BookOpen, 
  Calendar, 
  Image as ImageIcon, 
  PhoneCall, 
  Lock, 
  ChevronRight,
  HandHeart
} from 'lucide-react';

interface NavbarProps {
  currentTab: PageTab;
  onNavigate: (tab: PageTab) => void;
  onOpenDonate: (fundId?: string) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenDonate,
  onOpenAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Streamlined, clear, friendly navigation items
  const navItems: { id: PageTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Church className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'ministry', label: 'Ministry', icon: <Heart className="w-4 h-4" /> },
    { id: 'coaching', label: '85 & Thriving', icon: <Activity className="w-4 h-4" /> },
    { id: 'teaching', label: 'Sermons', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <PhoneCall className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: PageTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFCFB]/95 backdrop-blur-md border-b border-[#E8E2D8] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 lg:h-20">
          {/* Clean, Friendly Brand Identity */}
          <button 
            id="brand-logo-button"
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-3 text-left group focus:outline-hidden"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#002366] to-[#4B0082] flex items-center justify-center text-[#D4AF37] shadow-xs group-hover:from-[#001a4e] group-hover:to-[#380062] transition-all shrink-0 border border-[#D4AF37]/30">
              <Church className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="font-serif font-bold text-lg sm:text-xl tracking-tight text-[#002366] leading-tight">
                Ella Ruth Johnson
              </div>
              <p className="text-[11px] sm:text-xs text-[#1A1A1A]/70 font-medium tracking-wide">
                Safe Haven Out Reach Ministries
              </p>
            </div>
          </button>

          {/* Desktop Navigation - Clean, Airy, Minimal */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-full text-sm transition-all relative ${
                    isActive
                      ? 'text-[#002366] font-semibold bg-[#F5F2ED]'
                      : 'text-[#1A1A1A]/75 hover:text-[#002366] hover:bg-[#F5F2ED]/70'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-[#D4AF37] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs - Uncluttered and Welcoming */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="header-nav-volunteer-btn"
              onClick={() => handleNavClick('get-involved')}
              className={`px-3.5 py-2 text-sm font-medium transition-colors rounded-full ${
                currentTab === 'get-involved'
                  ? 'text-[#002366] font-semibold bg-[#F5F2ED]'
                  : 'text-[#1A1A1A]/75 hover:text-[#002366] hover:bg-[#F5F2ED]/70'
              }`}
            >
              Get Involved
            </button>

            <button
              id="header-nav-donate-btn"
              onClick={() => onOpenDonate()}
              className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[#002366] hover:bg-[#001a4e] text-white shadow-xs hover:shadow-sm transition-all flex items-center gap-2 border border-[#D4AF37]/30"
            >
              <Heart className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
              <span>Donate</span>
            </button>

            {/* Discreet Staff Portal Button */}
            <button
              id="cms-admin-portal-button"
              onClick={onOpenAdmin}
              title="Ministry Staff Portal"
              className="p-2 rounded-full text-[#1A1A1A]/40 hover:text-[#002366] hover:bg-[#F5F2ED] transition-colors"
              aria-label="Staff Portal"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu & Donate Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-nav-donate-pill"
              onClick={() => onOpenDonate()}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#002366] text-white flex items-center gap-1.5 shadow-xs border border-[#D4AF37]/30"
            >
              <Heart className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
              <span>Donate</span>
            </button>

            <button
              id="mobile-nav-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-[#1A1A1A] hover:bg-[#F5F2ED] focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Clean Mobile Drawer with Generous Touch Targets */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FDFCFB] border-b border-[#E8E2D8] px-4 pt-3 pb-6 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-base transition-colors ${
                    isActive
                      ? 'bg-[#F5F2ED] text-[#002366] font-semibold'
                      : 'text-[#1A1A1A]/80 hover:bg-[#F5F2ED]/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-[#D4AF37]' : 'text-[#1A1A1A]/40'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#1A1A1A]/20" />
                </button>
              );
            })}

            <button
              onClick={() => handleNavClick('get-involved')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-base transition-colors ${
                currentTab === 'get-involved'
                  ? 'bg-[#F5F2ED] text-[#002366] font-semibold'
                  : 'text-[#1A1A1A]/80 hover:bg-[#F5F2ED]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <HandHeart className="w-4 h-4 text-[#1A1A1A]/40" />
                <span>Get Involved & Volunteer</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#1A1A1A]/20" />
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-[#E8E2D8] flex items-center justify-between gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDonate();
              }}
              className="flex-1 py-3 px-4 rounded-full text-sm font-semibold bg-[#002366] text-white flex items-center justify-center gap-2 shadow-xs border border-[#D4AF37]/30"
            >
              <Heart className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
              <span>Make a Donation</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="py-3 px-4 rounded-full text-xs font-medium text-[#1A1A1A]/70 hover:text-[#002366] bg-[#F5F2ED] flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#1A1A1A]/50" />
              <span>Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
