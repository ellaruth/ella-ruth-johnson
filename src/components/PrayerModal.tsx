import React, { useState } from 'react';
import { X, Heart, CheckCircle2, BookOpen } from 'lucide-react';
import { PrayerRequest } from '../types';

interface PrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPrayer: (req: PrayerRequest) => void;
}

export const PrayerModal: React.FC<PrayerModalProps> = ({
  isOpen,
  onClose,
  onSubmitPrayer
}) => {
  const [name, setName] = useState('');
  const [cityState, setCityState] = useState('');
  const [requestText, setRequestText] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;

    const newReq: PrayerRequest = {
      id: `pr-${Date.now()}`,
      authorName: name.trim() || 'A Faithful Friend',
      cityState: cityState.trim() || 'Mississippi',
      requestText: requestText.trim(),
      date: 'Just now',
      isPrivate,
      prayedCount: 1
    };

    onSubmitPrayer(newReq);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setCityState('');
    setRequestText('');
    setIsPrivate(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#FDFCFB] rounded-3xl shadow-xl border border-[#E8E2D8] overflow-hidden my-8">
        <div className="px-6 py-5 flex items-center justify-between border-b border-[#E8E2D8]">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#002366]">Request Prayer</h3>
            <p className="text-xs text-[#1A1A1A]/60">Pastor Ella Ruth & Prayer Circle</p>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-full text-[#1A1A1A]/40 hover:text-[#1A1A1A] hover:bg-[#F5F2ED] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-[#002366]">
                Petition Received
              </h4>
              <p className="text-xs text-[#1A1A1A]/70 max-w-md mx-auto leading-relaxed">
                Pastor Ella Ruth and our prayer circle hold your request in intercession.
              </p>

              <div className="bg-[#F5F2ED] border border-[#E8E2D8] rounded-2xl p-4 text-left">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#002366] mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Scripture Promise:</span>
                </div>
                <blockquote className="font-serif italic text-xs text-[#002366] leading-relaxed">
                  “The prayer of a righteous person has great power as it is working.”
                </blockquote>
                <p className="text-[11px] text-[#1A1A1A]/60 font-medium mt-1">— James 5:16</p>
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
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1A1A1A] font-medium mb-1">
                    Your Name (or Anonymous):
                  </label>
                  <input
                    type="text"
                    placeholder="Patricia"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D8] text-xs text-[#1A1A1A] bg-white focus:outline-hidden focus:border-[#002366]"
                  />
                </div>
                <div>
                  <label className="block text-[#1A1A1A] font-medium mb-1">
                    City / State:
                  </label>
                  <input
                    type="text"
                    placeholder="Columbia, MS"
                    value={cityState}
                    onChange={e => setCityState(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D8] text-xs text-[#1A1A1A] bg-white focus:outline-hidden focus:border-[#002366]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1A1A1A] font-medium mb-1">
                  Your Prayer Petition *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share what you are believing God for..."
                  value={requestText}
                  onChange={e => setRequestText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] text-xs text-[#1A1A1A] bg-white focus:outline-hidden focus:border-[#002366]"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="privacy-check"
                  checked={isPrivate}
                  onChange={e => setIsPrivate(e.target.checked)}
                  className="mt-0.5 rounded text-[#002366] focus:ring-[#002366]"
                />
                <label htmlFor="privacy-check" className="text-xs text-[#1A1A1A]/60 cursor-pointer">
                  Keep this petition private (do not show on the public community prayer wall)
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-6 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs shadow-xs transition-colors flex items-center justify-center gap-2 border border-[#D4AF37]/30"
                >
                  <Heart className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Send Prayer Request</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
