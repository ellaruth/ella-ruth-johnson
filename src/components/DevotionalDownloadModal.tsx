import React, { useState } from 'react';
import { X, BookOpen, Download, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

interface DevotionalDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadComplete?: (lead: any) => void;
}

export const DevotionalDownloadModal: React.FC<DevotionalDownloadModalProps> = ({
  isOpen,
  onClose,
  onDownloadComplete
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const daysOverview = [
    { day: 1, title: 'Waking the Temple: Breath, Water & Consecration' },
    { day: 2, title: 'Casting Down Weariness: Speaking Life Over Your Bones' },
    { day: 3, title: 'The Miracle of Daily Locomotion: Why Legs Were Made to Move' },
    { day: 4, title: 'Cleansing the Vessel: Pure Foods That Honor God' },
    { day: 5, title: 'Uprooting Secret Bitterness: Forgiveness as Cellular Healing' },
    { day: 6, title: 'Laughter as Medicine: Cultivating Holy Joy in Your Household' },
    { day: 7, title: 'Wisdom in Motion: Running Your Race with Stamina at Any Age' }
  ];

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const lead = await api.submitDevotionalDownload({
        fullName: name.trim(),
        email: email.trim()
      });
      setDownloaded(true);
      if (onDownloadComplete) {
        onDownloadComplete(lead);
      }
    } catch (err) {
      console.error('Failed to register lead:', err);
      setDownloaded(true);
    }
  };

  const handleReset = () => {
    setDownloaded(false);
    setName('');
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#FDFCFB] rounded-3xl shadow-xl border border-[#E8E2D8] overflow-hidden my-8">
        <div className="px-6 py-5 flex items-center justify-between border-b border-[#E8E2D8]">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#002366]">Free Devotional Guide</h3>
            <p className="text-xs text-[#1A1A1A]/60">Coach Ella Ruth's 7-Day Morning Vitality Blueprint</p>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-full text-[#1A1A1A]/40 hover:text-[#1A1A1A] hover:bg-[#F5F2ED] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {downloaded ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-[#002366]">
                Your Devotional is on Its Way!
              </h4>
              <p className="text-xs text-[#1A1A1A]/70 max-w-md mx-auto">
                We've sent the PDF download to <strong className="text-[#002366]">{email}</strong>.
              </p>

              <div className="bg-[#F5F2ED] border border-[#E8E2D8] rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="font-semibold text-[#002366]">
                  7-Day Morning Plan Preview:
                </div>
                {daysOverview.map(d => (
                  <div key={d.day} className="flex items-start gap-2 text-[#1A1A1A]/80 py-1 border-b border-[#E8E2D8] last:border-0">
                    <span className="font-medium text-[#002366] text-[11px] shrink-0">Day {d.day}:</span>
                    <span className="text-[11px] text-[#1A1A1A]/70">{d.title}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="w-full py-2.5 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white text-xs font-medium transition-colors border border-[#D4AF37]/30"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDownload} className="space-y-4 text-xs">
              <div className="bg-[#F5F2ED] border border-[#E8E2D8] rounded-2xl p-4">
                <p className="font-serif italic text-xs text-[#002366] leading-relaxed mb-1">
                  “I start every morning before sunrise with hydration, scripture, and joyful movement. At 85, this routine keeps me vibrant and full of life.”
                </p>
                <span className="font-semibold text-[#D4AF37] text-[11px]">— Ella Ruth Johnson</span>
              </div>

              <div>
                <label className="block text-[#1A1A1A] font-medium mb-1">
                  Your First Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Carolyn"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D8] text-[#1A1A1A] bg-white focus:outline-hidden focus:border-[#002366]"
                />
              </div>

              <div>
                <label className="block text-[#1A1A1A] font-medium mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="carolyn@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D8] text-[#1A1A1A] bg-white focus:outline-hidden focus:border-[#002366]"
                />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full py-2.5 px-6 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs shadow-xs transition-colors flex items-center justify-center gap-2 border border-[#D4AF37]/30"
                >
                  <Download className="w-4 h-4" />
                  <span>Get Free 7-Day Guide</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
