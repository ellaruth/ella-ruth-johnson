import React, { useState } from 'react';
import { PageTab, AnnouncementItem } from '../types';
import { ArrowRight, X } from 'lucide-react';

interface BannerAnnouncementProps {
  announcements: AnnouncementItem[];
  onNavigate: (tab: PageTab) => void;
}

export const BannerAnnouncement: React.FC<BannerAnnouncementProps> = ({
  announcements,
  onNavigate
}) => {
  const [dismissed, setDismissed] = useState(false);

  const activeItems = announcements.filter(a => a.active);
  if (activeItems.length === 0 || dismissed) return null;

  const current = activeItems[0];

  return (
    <div className="bg-gradient-to-r from-[#002366] via-[#001f5c] to-[#4B0082] text-white/95 px-4 py-2 text-xs border-b border-[#D4AF37]/30 transition-all shadow-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#D4AF37]/25 text-[#F3E5AB] border border-[#D4AF37]/40 text-[11px] font-semibold tracking-wide">
            {current.highlight || 'Notice'}
          </span>
          <p className="truncate text-white/90 text-xs font-medium">
            {current.text}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate(current.linkTab)}
            className="inline-flex items-center gap-1 text-[#F3E5AB] hover:text-white transition-colors text-xs font-semibold"
          >
            <span>Learn More</span>
            <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Dismiss announcement"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

