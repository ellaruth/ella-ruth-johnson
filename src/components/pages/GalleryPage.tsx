import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PageTab, GalleryPhoto } from '../../types';
import { GALLERY_PHOTOS } from '../../data/initialData';
import {
  Image as ImageIcon,
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ZoomIn,
  Grid3X3,
  LayoutGrid,
  Camera,
  Maximize2
} from 'lucide-react';

interface GalleryPageProps {
  onNavigate: (tab: PageTab) => void;
  onOpenDonate: () => void;
}

const ALBUMS = [
  { id: 'all',          label: 'All Moments',    emoji: '✨' },
  { id: 'family',       label: 'Family',          emoji: '👨‍👩‍👧' },
  { id: 'grandchildren',label: 'Grandchildren',   emoji: '👶' },
  { id: 'milestones',   label: 'Milestones',      emoji: '🎂' },
  { id: 'heritage',     label: 'Heritage',        emoji: '🌳' },
  { id: 'ministry',     label: 'Ministry',        emoji: '🙏' },
  { id: 'conferences',  label: 'Conferences',     emoji: '🎤' },
  { id: 'celebrations', label: 'Celebrations',    emoji: '💍' },
  { id: 'travel',       label: 'Travel',          emoji: '✈️' },
  { id: 'social',       label: 'Friends',         emoji: '🍽️' },
];

export const GalleryPage: React.FC<GalleryPageProps> = ({ onOpenDonate }) => {
  // ── Selected Album Filter ────────────────────────────────────────────────
  const [selectedAlbum, setSelectedAlbum] = useState<string>('all');
  const [isCompact, setIsCompact] = useState(false);
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  const filteredPhotos = selectedAlbum === 'all'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter(p => p.album === selectedAlbum);

  // ── HKM 3D Coverflow Slideshow State ─────────────────────────────────────
  // We use the full gallery photos (or filtered set) for the coverflow
  const coverflowPhotos = selectedAlbum === 'all'
    ? GALLERY_PHOTOS
    : filteredPhotos;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number>(0);
  const dragDeltaX = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Safety check on index if filtered photos length changes
  useEffect(() => {
    if (activeIndex >= coverflowPhotos.length) {
      setActiveIndex(0);
    }
  }, [coverflowPhotos.length, activeIndex]);

  const goToSlide = useCallback((newIdx: number) => {
    const len = coverflowPhotos.length;
    if (len === 0) return;
    setActiveIndex((newIdx % len + len) % len);
  }, [coverflowPhotos.length]);

  const nextSlide = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  // Autoplay (5000ms delay, paused on drag or when user pauses)
  useEffect(() => {
    if (!isPlaying || isDragging || coverflowPhotos.length <= 1) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    timerRef.current = setTimeout(() => {
      goToSlide(activeIndex + 1);
    }, 5000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, isDragging, activeIndex, coverflowPhotos.length, goToSlide]);

  // ── Touch & Mouse Drag Handlers ──────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
    dragDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    dragDeltaX.current = e.touches[0].clientX - dragStartX.current;
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragDeltaX.current > 45) {
      prevSlide();
    } else if (dragDeltaX.current < -45) {
      nextSlide();
    }
    dragDeltaX.current = 0;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragDeltaX.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    dragDeltaX.current = e.clientX - dragStartX.current;
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragDeltaX.current > 50) {
      prevSlide();
    } else if (dragDeltaX.current < -50) {
      nextSlide();
    }
    dragDeltaX.current = 0;
  };

  // Keyboard navigation for coverflow
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhoto) return; // let lightbox handle its own keys
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhoto, prevSlide, nextSlide]);

  // ── Lightbox Navigation ──────────────────────────────────────────────────
  const handleLightboxNav = (dir: 1 | -1) => {
    if (!activePhoto) return;
    const idx = filteredPhotos.findIndex(p => p.id === activePhoto.id);
    setActivePhoto(filteredPhotos[(idx + dir + filteredPhotos.length) % filteredPhotos.length]);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!activePhoto) return;
      if (e.key === 'ArrowRight') handleLightboxNav(1);
      if (e.key === 'ArrowLeft')  handleLightboxNav(-1);
      if (e.key === 'Escape')     setActivePhoto(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activePhoto, filteredPhotos]);

  const currentCoverPhoto = coverflowPhotos[activeIndex] || coverflowPhotos[0];

  return (
    <div className="min-h-screen bg-[#0B0A09] text-white">

      {/* ═══════════════════════════════════════════════════════════════════
          1. HKM-STYLE MEDIA GALLERY HEADER BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-[#001740] via-[#002366] to-[#0B0A09] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Living Archive & Highlights</span>
            <span className="text-white/60">·</span>
            <span className="text-white">{GALLERY_PHOTOS.length} Photographs</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-white">
            Media <span className="text-[#D4AF37]">Gallery</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Highlights from the life, preaching ministry, conference appearances, and precious multi-generational family milestones of <strong>Pastor Ella Ruth Johnson</strong>.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2. HKM 3D COVERFLOW SHOWCASE SLIDESHOW (Replica of hkm-coverflow)
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        id="hkm-coverflow-showcase"
        aria-label="3D Coverflow photo slideshow"
        className="relative bg-[#0B0A09] pt-6 pb-12 px-4 sm:px-6 overflow-hidden select-none"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        {/* Subtle Ambient Glow Behind 3D Stage */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-[#002366]/30 rounded-full blur-[80px] pointer-events-none" />

        {/* 3D Coverflow Stage */}
        <div
          className="hkm-coverflow"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div className="hkm-coverflow__stage">
            {coverflowPhotos.map((photo, idx) => {
              const total = coverflowPhotos.length;
              // Calculate shortest circular difference (-total/2 to total/2)
              let diff = idx - activeIndex;
              if (diff > total / 2) diff -= total;
              if (diff < -total / 2) diff += total;

              // Only render slides within 3 steps of center for performance & 3D aesthetics
              const isVisible = Math.abs(diff) <= 3;
              if (!isVisible) return null;

              const isCenter = diff === 0;

              // Coverflow 3D Math matching HKM:
              // Center: scale 1, rotateY 0, translateZ 0, blur 0, opacity 1
              // Side 1: translateX +/- 68%, translateZ -220px, rotateY -/+ 32deg, scale 0.85, blur 1.5px, opacity 0.65
              // Side 2: translateX +/- 118%, translateZ -420px, rotateY -/+ 48deg, scale 0.70, blur 3.5px, opacity 0.30
              // Side 3: translateX +/- 155%, translateZ -580px, rotateY -/+ 55deg, scale 0.58, blur 5px, opacity 0.10
              let translateX = 0;
              let translateZ = 0;
              let rotateY = 0;
              let scale = 1;
              let opacity = 1;
              let blurPx = 0;
              let zIndex = 30;

              if (isCenter) {
                translateX = 0;
                translateZ = 0;
                rotateY = 0;
                scale = 1;
                opacity = 1;
                blurPx = 0;
                zIndex = 30;
              } else {
                const sign = diff > 0 ? 1 : -1;
                const absD = Math.abs(diff);

                if (absD === 1) {
                  translateX = sign * 68;
                  translateZ = -220;
                  rotateY = -sign * 32;
                  scale = 0.85;
                  opacity = 0.65;
                  blurPx = 1.5;
                  zIndex = 20;
                } else if (absD === 2) {
                  translateX = sign * 118;
                  translateZ = -420;
                  rotateY = -sign * 48;
                  scale = 0.70;
                  opacity = 0.30;
                  blurPx = 3.5;
                  zIndex = 10;
                } else {
                  translateX = sign * 155;
                  translateZ = -580;
                  rotateY = -sign * 55;
                  scale = 0.58;
                  opacity = 0.10;
                  blurPx = 5;
                  zIndex = 5;
                }
              }

              return (
                <div
                  key={photo.id}
                  onClick={() => {
                    if (isCenter) {
                      setActivePhoto(photo);
                    } else {
                      goToSlide(idx);
                    }
                  }}
                  className={`hkm-coverflow__card group ${
                    isCenter
                      ? 'ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-black cursor-pointer'
                      : 'cursor-pointer'
                  }`}
                  style={{
                    transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    filter: `blur(${blurPx}px)`,
                    zIndex,
                  }}
                  title={photo.caption}
                >
                  {/* Photo Image */}
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    loading={isCenter ? 'eager' : 'lazy'}
                  />

                  {/* Three-tier Gradient Overlay for HKM Cinematic Feel */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Top Badge: Tag & Milestone */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#D4AF37] text-[11px] font-bold tracking-wide uppercase border border-[#D4AF37]/30">
                      <Camera className="w-3 h-3" />
                      {photo.tag}
                    </span>
                    <span className="text-[11px] font-medium text-white/80 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                      {photo.dateStr}
                    </span>
                  </div>

                  {/* Bottom Caption Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 pointer-events-none">
                    <p className="text-white text-xs sm:text-sm font-serif italic line-clamp-2 drop-shadow-md mb-2">
                      “{photo.caption}”
                    </p>

                    {/* Action Button on Center Slide */}
                    {isCenter && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">
                          Slide {idx + 1} of {total}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePhoto(photo);
                          }}
                          className="pointer-events-auto touch-sm inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4AF37] hover:bg-[#c9a430] text-[#0B0A09] text-xs font-bold transition-all shadow-md active:scale-95"
                          aria-label="View full image in lightbox"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>View Full Photo</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Slideshow Controls Bar (HKM Layout) ─────────────────────────── */}
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 mt-4">
          {/* Navigation Controls: Prev, Play/Pause, Next */}
          <div className="flex items-center justify-center gap-4 z-40">
            {/* Previous Slide Arrow */}
            <button
              onClick={prevSlide}
              aria-label="Previous photo slide"
              className="p-3 sm:p-3.5 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white backdrop-blur-md border border-white/15 transition-all shadow-lg active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Play / Pause Toggle */}
            <button
              onClick={() => setIsPlaying(p => !p)}
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              className="p-3 sm:p-3.5 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white backdrop-blur-md border border-white/15 transition-all shadow-lg active:scale-95 flex items-center gap-2 px-4"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-semibold hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-[#D4AF37] fill-current" />
                  <span className="text-xs font-semibold hidden sm:inline">Play</span>
                </>
              )}
            </button>

            {/* Next Slide Arrow */}
            <button
              onClick={nextSlide}
              aria-label="Next photo slide"
              className="p-3 sm:p-3.5 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white backdrop-blur-md border border-white/15 transition-all shadow-lg active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Active Photo Pro Description Box */}
          {currentCoverPhoto && (
            <div className="w-full max-w-2xl bg-[#002366]/40 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 shadow-xl text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  {currentCoverPhoto.tag}
                </span>
                <span className="text-white/40 text-xs">·</span>
                <span className="text-white/60 text-xs">{currentCoverPhoto.dateStr}</span>
              </div>
              <p className="text-white/90 text-sm sm:text-base font-serif italic leading-relaxed">
                “{currentCoverPhoto.caption}”
              </p>
            </div>
          )}

          {/* Clickable Pagination Bullets (matching HKM coverflow pagination) */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-sm sm:max-w-md pt-2">
            {coverflowPhotos.slice(0, 24).map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Jump to slide ${i + 1}`}
                className={`hkm-coverflow-bullet ${i === activeIndex ? 'active' : ''}`}
              />
            ))}
            {coverflowPhotos.length > 24 && (
              <span className="text-white/40 text-[11px] ml-1">+{coverflowPhotos.length - 24} more</span>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. ALBUM FILTER BAR (Sticky Category Pills)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#0B0A09]/95 backdrop-blur-md sticky top-0 z-30 border-t border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
            {ALBUMS.map(alb => {
              const count = alb.id === 'all'
                ? GALLERY_PHOTOS.length
                : GALLERY_PHOTOS.filter(p => p.album === alb.id).length;
              if (count === 0) return null;
              const isSelected = selectedAlbum === alb.id;

              return (
                <button
                  key={alb.id}
                  id={`gallery-filter-${alb.id}`}
                  onClick={() => {
                    setSelectedAlbum(alb.id);
                    setActiveIndex(0);
                  }}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#002366] text-white ring-2 ring-[#D4AF37] shadow-lg shadow-[#002366]/40'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  <span>{alb.emoji}</span>
                  <span>{alb.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-white/60'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}

            {/* Layout Toggle (Large Grid vs Compact Grid) */}
            <div className="ml-auto flex-shrink-0 flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
              <button
                onClick={() => setIsCompact(false)}
                aria-label="Large grid view"
                className={`p-1.5 rounded-full transition-all ${
                  !isCompact ? 'bg-[#D4AF37] text-black shadow-xs' : 'text-white/40 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsCompact(true)}
                aria-label="Compact grid view"
                className={`p-1.5 rounded-full transition-all ${
                  isCompact ? 'bg-[#D4AF37] text-black shadow-xs' : 'text-white/40 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          4. PHOTO GRID (With Hover Zoom & Captions matching HKM)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0B0A09] min-h-[400px] py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Subheading */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                {selectedAlbum === 'all'
                  ? 'All Photo Archives'
                  : ALBUMS.find(a => a.id === selectedAlbum)?.label || 'Album'}{' '}
                <span className="text-[#D4AF37]">({filteredPhotos.length})</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Click on any photograph to enlarge and read its full historical background.
              </p>
            </div>
          </div>

          <div
            className={`grid gap-4 sm:gap-6 ${
              isCompact
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}
          >
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                id={`gallery-photo-${photo.id}`}
                onClick={() => setActivePhoto(photo)}
                className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer bg-[#141210] border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-black/80"
              >
                {/* Photo Image Container */}
                <div className={`relative overflow-hidden ${isCompact ? 'aspect-square' : 'aspect-[4/3]'}`}>
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
                    <div className="flex items-center justify-between">
                      <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-[#D4AF37]/40">
                        {photo.tag}
                      </span>
                      <ZoomIn className="w-5 h-5 text-white drop-shadow-md" />
                    </div>
                    <p className="text-white text-xs font-serif italic line-clamp-3 drop-shadow-md">
                      “{photo.caption}”
                    </p>
                  </div>

                  {/* Tag badge when not hovering */}
                  {!isCompact && (
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#D4AF37] text-[10px] font-bold uppercase border border-white/10 group-hover:opacity-0 transition-opacity">
                      {photo.tag}
                    </div>
                  )}

                  {photo.featured && (
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-wider shadow-md">
                      Featured
                    </div>
                  )}
                </div>

                {/* Permanent Card Description Footer (Large Grid) */}
                {!isCompact && (
                  <div className="p-4 bg-[#141210] space-y-1.5 border-t border-white/5">
                    <p className="text-white/80 text-xs leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
                      {photo.caption}
                    </p>
                    <span className="text-[#D4AF37]/80 text-[10px] font-semibold block">
                      {photo.dateStr}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredPhotos.length === 0 && (
            <div className="text-center py-24 text-white/40">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="text-sm">No photographs found in this album.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          5. DONATION & OUTREACH SUPPORT BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-[#0B0A09] to-[#001740] border-t border-white/10 py-14 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-5">
          <h3 className="text-2xl font-serif font-bold text-white">
            Honoring a Lifetime of <span className="text-[#D4AF37]">Generous Service</span>
          </h3>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            These photographs celebrate seven decades of faith, community upliftment, and love. Join Pastor Ella Ruth Johnson in advancing life-changing community outreach.
          </p>
          <button
            onClick={onOpenDonate}
            id="gallery-donate-btn"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#c9a430] text-[#0B0A09] font-bold text-sm shadow-xl shadow-[#D4AF37]/20 transition-all hover:scale-105 active:scale-95"
          >
            <Heart className="w-4 h-4 fill-current" />
            Support Safe Haven Community Outreach
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          6. FULLSCREEN LIGHTBOX MODAL (With Full Resolution & Pro Details)
      ══════════════════════════════════════════════════════════════════════ */}
      {activePhoto && (
        <div
          id="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo Lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-3 sm:p-6"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-[#141210] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col lg:flex-row max-h-[92vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePhoto(null)}
              aria-label="Close photo preview"
              className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lightbox Image Container */}
            <div className="relative w-full lg:w-2/3 bg-black flex items-center justify-center min-h-[280px] sm:min-h-[380px] lg:min-h-[500px] overflow-hidden">
              <img
                src={activePhoto.url}
                alt={activePhoto.caption}
                className="max-w-full max-h-[60vh] sm:max-h-[75vh] object-contain select-none"
              />

              {/* Prev / Next Buttons */}
              <button
                onClick={() => handleLightboxNav(-1)}
                aria-label="Previous photo in album"
                className="touch-sm absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#D4AF37] hover:text-black text-white border border-white/20 transition-all shadow-lg active:scale-95"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => handleLightboxNav(1)}
                aria-label="Next photo in album"
                className="touch-sm absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#D4AF37] hover:text-black text-white border border-white/20 transition-all shadow-lg active:scale-95"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Lightbox Sidebar: Pro Description, Album & Metadata */}
            <div className="w-full lg:w-1/3 p-6 sm:p-8 flex flex-col justify-between gap-6 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#161412] overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wide border border-[#D4AF37]/30">
                    {activePhoto.tag}
                  </span>
                  <span className="text-white/60 text-xs font-medium">
                    {activePhoto.dateStr}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                    Historical Record & Context
                  </h4>
                  <p className="text-white text-sm sm:text-base font-serif italic leading-relaxed">
                    “{activePhoto.caption}”
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 text-xs text-white/50 space-y-1">
                  <p><strong>Archived Under:</strong> {activePhoto.album.charAt(0).toUpperCase() + activePhoto.album.slice(1)} Collection</p>
                  <p><strong>Subject:</strong> Pastor Ella Ruth Johnson & Community</p>
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-white/40">
                  <span>Photo Index</span>
                  <span className="font-mono font-bold text-white">
                    {filteredPhotos.findIndex(p => p.id === activePhoto.id) + 1} / {filteredPhotos.length}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setActivePhoto(null);
                    onOpenDonate();
                  }}
                  id="lightbox-donate-btn"
                  className="w-full py-3 rounded-full bg-[#D4AF37] hover:bg-[#c9a430] text-[#0B0A09] font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  Support Safe Haven Ministries
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
