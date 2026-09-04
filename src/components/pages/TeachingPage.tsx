import React, { useState } from 'react';
import { PageTab, SermonTeaching, PrayerRequest } from '../../types';
import { 
  BookOpen, 
  Play, 
  Pause, 
  Sparkles, 
  Heart, 
  Plus
} from 'lucide-react';

interface TeachingPageProps {
  onNavigate: (tab: PageTab) => void;
  sermons: SermonTeaching[];
  prayerRequests: PrayerRequest[];
  onOpenPrayer: () => void;
  onPrayForRequest: (id: string) => void;
}

export const TeachingPage: React.FC<TeachingPageProps> = ({
  sermons,
  prayerRequests,
  onOpenPrayer,
  onPrayForRequest
}) => {
  const [selectedSermonId, setSelectedSermonId] = useState<string>(sermons[0]?.id || '');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const activeSermon = sermons.find(s => s.id === selectedSermonId) || sermons[0];

  const filteredSermons = sermons.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.scripture.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-16 sm:space-y-20 pb-20 pt-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Clean Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2ED] text-[#002366] text-xs font-medium border border-[#D4AF37]/40">
          <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Faith Teachings & Devotionals</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#002366]">
          Teachings & Sermons
        </h1>
        <p className="text-[#1A1A1A]/75 text-base leading-relaxed">
          Biblical encouragement, healing, and spiritual stamina shared by Ella Ruth through devotionals, conference keynotes, and scripture studies.
        </p>
      </section>

      {/* Featured Sermon Reader & Player */}
      {activeSermon && (
        <section className="bg-[#FDFCFB] rounded-3xl border border-[#E8E2D8] shadow-xs overflow-hidden">
          {/* Audio Player Bar */}
          <div className="bg-[#F5F2ED] border-b border-[#E8E2D8] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                id="sermon-audio-toggle"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="w-12 h-12 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 border border-[#D4AF37]/40 cursor-pointer"
                title={isPlayingAudio ? 'Pause message preview' : 'Play message preview'}
              >
                {isPlayingAudio ? (
                  <Pause className="w-5 h-5 fill-white" />
                ) : (
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                )}
              </button>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${isPlayingAudio ? 'bg-emerald-500 animate-pulse' : 'bg-[#D4AF37]'}`} />
                  <span className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider block">
                    {isPlayingAudio ? 'Streaming Message' : 'Audio Message Preview'} • {activeSermon.duration}
                  </span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#002366] leading-tight">
                  {activeSermon.title}
                </h3>
              </div>
            </div>

            {/* Audio Progress Scrubber Simulation */}
            <div className="w-full md:w-64 space-y-1.5">
              <div className="w-full h-2 bg-[#E8E2D8] rounded-full overflow-hidden relative">
                <div 
                  className={`h-full bg-gradient-to-r from-[#002366] to-[#D4AF37] rounded-full transition-all duration-500 ${
                    isPlayingAudio ? 'w-3/5' : 'w-1/12'
                  }`}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#1A1A1A]/50 font-medium font-mono">
                <span>{isPlayingAudio ? '16:48' : '01:15'}</span>
                <span>{activeSermon.duration}</span>
              </div>
            </div>

            <button
              onClick={onOpenPrayer}
              className="px-5 py-2.5 rounded-full bg-[#FDFCFB] hover:bg-[#EFEBE4] text-[#002366] text-xs font-medium border border-[#E8E2D8] transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Heart className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Request Prayer on This Word</span>
            </button>
          </div>

          {/* Sermon Study Notes & Archive Selector */}
          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                  {activeSermon.series} • {activeSermon.date}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#002366] mt-1">
                  {activeSermon.title}
                </h2>
                <div className="inline-block mt-2 px-3 py-1 rounded-full bg-[#F5F2ED] text-[#002366] text-xs font-medium border border-[#E8E2D8]">
                  Scripture: {activeSermon.scripture}
                </div>
              </div>

              {/* Quote */}
              <div className="bg-[#F5F2ED] border-l-4 border-[#D4AF37] p-5 rounded-r-2xl">
                <p className="font-serif italic text-sm text-[#002366] leading-relaxed">
                  {activeSermon.featuredQuote}
                </p>
                <p className="text-xs text-[#1A1A1A]/60 font-medium mt-2">
                  — Ella Ruth
                </p>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#002366]">
                  Message Overview:
                </h4>
                <p className="text-sm text-[#1A1A1A]/75 leading-relaxed">
                  {activeSermon.summary}
                </p>
              </div>

              {/* Core Points */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#002366]">
                  Key Takeaways:
                </h4>
                <div className="space-y-2 text-xs sm:text-sm text-[#1A1A1A]/80">
                  {activeSermon.corePoints.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F5F2ED]/70 border border-[#E8E2D8]">
                      <span className="w-5 h-5 rounded-full bg-[#002366] text-white text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prayer */}
              <div className="bg-[#F5F2ED] rounded-2xl p-5 border border-[#E8E2D8] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#002366]">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Personal Reflection Prayer</span>
                </div>
                <p className="font-serif italic text-xs sm:text-sm text-[#002366] leading-relaxed">
                  “{activeSermon.reflectionPrayer}”
                </p>
              </div>
            </div>

            {/* Archive Selector */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#002366]">
                Sermon Archive
              </h3>

              <input
                type="text"
                placeholder="Search sermons..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D8] bg-white text-[#1A1A1A] text-xs placeholder-[#1A1A1A]/40 focus:outline-hidden focus:border-[#002366]"
              />

              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {filteredSermons.map(s => {
                  const isCurrent = s.id === activeSermon.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSermonId(s.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'border-[#002366] bg-[#F5F2ED] shadow-2xs'
                          : 'border-[#E8E2D8] bg-[#FDFCFB] hover:bg-[#F5F2ED]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 text-[11px] text-[#D4AF37] font-medium mb-1">
                        <span>{s.scripture}</span>
                        <span className="text-[#1A1A1A]/50">{s.duration}</span>
                      </div>
                      <h4 className="font-serif text-sm font-bold text-[#002366] line-clamp-1">
                        {s.title}
                      </h4>
                      <p className="text-[11px] text-[#1A1A1A]/65 line-clamp-2 mt-1">
                        {s.summary}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Community Prayer Wall */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
              Intercessory Circle
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#002366]">
              Community Prayer Wall
            </h2>
          </div>
          <button
            onClick={onOpenPrayer}
            className="px-5 py-2.5 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs shadow-xs transition-colors flex items-center gap-2 border border-[#D4AF37]/30"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Prayer Petition</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {prayerRequests.filter(r => !r.isPrivate).map(req => (
            <div
              key={req.id}
              className="bg-[#FDFCFB] rounded-2xl p-6 border border-[#E8E2D8] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#1A1A1A]/60">
                  <span className="font-semibold text-[#002366]">{req.authorName}</span>
                  <span>{req.cityState}</span>
                </div>
                <p className="font-serif italic text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed">
                  “{req.requestText}”
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8E2D8] flex items-center justify-between">
                <span className="text-[11px] text-[#1A1A1A]/50">{req.date}</span>
                <button
                  onClick={() => onPrayForRequest(req.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F2ED] hover:bg-[#EFEBE4] text-[#002366] text-xs font-medium border border-[#E8E2D8] transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                  <span>Prayed ({req.prayedCount})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
