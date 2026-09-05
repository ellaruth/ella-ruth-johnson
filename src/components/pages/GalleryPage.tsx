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
  Maximize2,
  Sparkles
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
  const coverflowPhotos = selectedAlbum === 'all'
    ? GALLERY_PHOTOS
    : filteredPhotos;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number>(0);
  const dragDeltaX = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Responsive mobile screen detector for 3D physics
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 640 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keep index within bounds if filtered photos length changes
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

  // ── Auto-Advance on Opening: Automatically runs immediately on page load ──
  useEffect(() => {
    // If paused manually or actively dragging, stop timer
    if (!isPlaying || isDragging || isHovered || coverflowPhotos.length <= 1) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    timerRef.current = setTimeout(() => {
      goToSlide(activeIndex + 1);
    }, 4500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, isDragging, isHovered, activeIndex, coverflowPhotos.length, goToSlide]);

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
    if (dragDeltaX.current > 35) {
      prevSlide();
    } else if (dragDeltaX.current < -35) {
      nextSlide();
    }
    dragDeltaX.current = 0;
  };

  // Lightbox touch swiping
  const lightboxDragStartX = useRef<number>(0);
  const lightboxDragDeltaX = useRef<number>(0);

  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    lightboxDragStartX.current = e.touches[0].clientX;
    lightboxDragDeltaX.current = 0;
  };

  const handleLightboxTouchMove = (e: React.TouchEvent) => {
    lightboxDragDeltaX.current = e.touches[0].clientX - lightboxDragStartX.current;
  };

  const handleLightboxTouchEnd = () => {
    if (lightboxDragDeltaX.current > 45) {
      handleLightboxNav(-1);
    } else if (lightboxDragDeltaX.current < -45) {
      handleLightboxNav(1);
    }
    lightboxDragDeltaX.current = 0;
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
    if (dragDeltaX.current > 45) {
      prevSlide();
    } else if (dragDeltaX.current < -45) {
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
    <div className="min-h-screen bg-[#070605] text-white selection:bg-[#D4AF37] selection:text-black">

      {/* ═══════════════════════════════════════════════════════════════════
          1. HKM-STYLE MEDIA GALLERY HERO BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-b from-[#001333] via-[#002366] to-[#070605] text-white pt-10 pb-8 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-48 bg-gradient-to-r from-transparent via-[#D4AF37]/15 to-transparent blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Life & Ministry Archive</span>
            <span className="text-white/40">·</span>
            <span className="text-white font-mono">{GALLERY_PHOTOS.length} Photos</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-white drop-shadow-lg">
            Media <span className="text-[#D4AF37]">Gallery</span>
          </h1>

          <p className="text-gray-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Seven decades of faith, ministry leadership, conference addresses, and precious family memories of <strong>Pastor Ella Ruth Johnson</strong>.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2. REALISTIC 3D COVERFLOW SHOWCASE (Full Height & Sharp Focus)
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        id="hkm-coverflow-showcase"
        aria-label="3D Coverflow photo showcase"
        className="relative bg-[#070605] pt-6 pb-12 px-2 sm:px-6 overflow-hidden select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Dynamic Ambient Background Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[400px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#002366]/40 rounded-full blur-[90px] pointer-events-none" />

        {/* Status Pill: Autoplay status & quick pause toggle */}
        <div className="max-w-4xl mx-auto flex items-center justify-between px-3 sm:px-6 mb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${isPlaying && !isHovered ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-white/70 font-medium">
              {isPlaying && !isHovered ? 'Auto-Slideshow Active' : isHovered ? 'Paused (Hovering)' : 'Slideshow Paused'}
            </span>
          </div>

          <button
            onClick={() => setIsPlaying(p => !p)}
            className="touch-sm inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white/80 transition-all text-xs font-semibold"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Resume'}</span>
          </button>
        </div>

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
              // Circular difference (-total/2 to total/2)
              let diff = idx - activeIndex;
              if (diff > total / 2) diff -= total;
              if (diff < -total / 2) diff += total;

              // Render visible range (on mobile, only render center + 1 neighbor on each side to avoid GPU overhead & off-screen clipping)
              const maxVisible = isMobile ? 1 : 3;
              const isVisible = Math.abs(diff) <= maxVisible;
              if (!isVisible) return null;

              const isCenter = diff === 0;

              // ── Realistic 3D Coverflow Physics with High Distinction ──
              let translateX = 0;
              let translateZ = 0;
              let rotateY = 0;
              let scale = 1;
              let opacity = 1;
              let blurPx = 0;
              let brightness = 1;
              let zIndex = 40;
              let boxShadow = '0 25px 60px -10px rgba(212, 175, 55, 0.45), 0 20px 40px rgba(0, 0, 0, 0.95)';

              if (isCenter) {
                translateX = 0;
                translateZ = isMobile ? 40 : 80;
                rotateY = 0;
                scale = isMobile ? 1.02 : 1.06;
                opacity = 1;
                blurPx = 0;
                brightness = 1.05;
                zIndex = 40;
                boxShadow = '0 30px 70px -10px rgba(212, 175, 55, 0.5), 0 25px 50px rgba(0, 0, 0, 0.95)';
              } else {
                const sign = diff > 0 ? 1 : -1;
                const absD = Math.abs(diff);

                if (absD === 1) {
                  translateX = sign * (isMobile ? 52 : 74);
                  translateZ = isMobile ? -140 : -280;
                  rotateY = -sign * (isMobile ? 26 : 38);
                  scale = isMobile ? 0.86 : 0.82;
                  opacity = isMobile ? 0.55 : 0.60;
                  blurPx = isMobile ? 2 : 4;
                  brightness = 0.55;
                  zIndex = 20;
                  boxShadow = '0 15px 35px rgba(0, 0, 0, 0.85)';
                } else if (absD === 2) {
                  translateX = sign * 128;
                  translateZ = -520;
                  rotateY = -sign * 52;
                  scale = 0.68;
                  opacity = 0.25;
                  blurPx = 8;
                  brightness = 0.35;
                  zIndex = 10;
                  boxShadow = '0 10px 25px rgba(0, 0, 0, 0.9)';
                } else {
                  translateX = sign * 170;
                  translateZ = -750;
                  rotateY = -sign * 65;
                  scale = 0.55;
                  opacity = 0.08;
                  blurPx = 12;
                  brightness = 0.18;
                  zIndex = 5;
                  boxShadow = 'none';
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
                  className={`hkm-coverflow__card group relative overflow-hidden bg-[#001740] ${
                    isCenter
                      ? 'ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#070605] cursor-pointer'
                      : 'cursor-pointer'
                  }`}
                  style={{
                    transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    filter: `blur(${blurPx}px) brightness(${brightness})`,
                    zIndex,
                    boxShadow,
                  }}
                  title={photo.caption}
                >
                  {/* ── AMBIENT BLURRED BACKDROP: Fills entire card with matching colors ── */}
                  <img
                    src={photo.url}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-40 select-none pointer-events-none"
                  />

                  {/* ── CRISP UNCRIPPED PHOTO: 100% visible, landscape or portrait ── */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center p-3 sm:p-4">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="max-w-full max-h-full object-contain rounded-xl drop-shadow-2xl select-none pointer-events-none transition-transform duration-500"
                      loading={isCenter ? 'eager' : 'lazy'}
                    />
                  </div>

                  {/* Top Specular Sheen for 3D realism */}
                  {isCenter && (
                    <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/60 pointer-events-none z-15" />
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[#D4AF37] text-[10px] sm:text-xs font-bold tracking-wide uppercase border border-[#D4AF37]/40 shadow-md">
                      <Camera className="w-3 h-3" />
                      {photo.tag}
                    </span>
                    <span className="text-[10px] sm:text-xs font-medium text-white/90 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 shadow-md">
                      {photo.dateStr}
                    </span>
                  </div>

                  {/* Bottom Caption Overlay on Center Slide */}
                  {isCenter && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-20 pointer-events-none">
                      <p className="text-white text-xs sm:text-sm font-serif italic line-clamp-2 drop-shadow-md mb-2 leading-snug">
                        “{photo.caption}”
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] sm:text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider font-mono">
                          Slide {idx + 1} / {total}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePhoto(photo);
                          }}
                          className="pointer-events-auto touch-sm inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4AF37] hover:bg-[#c9a430] text-[#070605] text-xs font-bold transition-all shadow-lg active:scale-95"
                          aria-label="View full photo in lightbox"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>View Full Photo</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Slideshow Controls Bar (HKM Luxury Layout) ────────────────────── */}
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 mt-2">
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
              className="p-3 sm:p-3.5 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white backdrop-blur-md border border-white/15 transition-all shadow-lg active:scale-95 flex items-center gap-2 px-5"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-semibold">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-[#D4AF37] fill-current" />
                  <span className="text-xs font-semibold">Play</span>
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
            <div className="w-full max-w-2xl bg-[#001c4d]/50 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#D4AF37]/25 shadow-2xl text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  {currentCoverPhoto.tag}
                </span>
                <span className="text-white/40 text-xs">·</span>
                <span className="text-white/70 text-xs">{currentCoverPhoto.dateStr}</span>
              </div>
              <p className="text-white/95 text-sm sm:text-base font-serif italic leading-relaxed max-w-xl mx-auto">
                “{currentCoverPhoto.caption}”
              </p>
            </div>
          )}

          {/* Clickable Pagination Bullets */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-xs sm:max-w-md pt-2">
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
      <div className="bg-[#070605]/95 backdrop-blur-md sticky top-0 z-30 border-t border-b border-white/10 shadow-2xl">
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
                      ? 'bg-[#002366] text-white ring-2 ring-[#D4AF37] shadow-lg shadow-[#002366]/50'
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
          4. PHOTO GRID (Uncropped, Ambient Fit for Portrait & Landscape)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#070605] min-h-[400px] py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                {selectedAlbum === 'all'
                  ? 'Complete Photographic Archive'
                  : ALBUMS.find(a => a.id === selectedAlbum)?.label || 'Album'}{' '}
                <span className="text-[#D4AF37]">({filteredPhotos.length})</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Every photo is preserved uncropped in full frame — click any image to enlarge in high definition.
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
                className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer bg-[#100e0c] border border-white/10 hover:border-[#D4AF37]/60 transition-all duration-300 hover:shadow-2xl hover:shadow-black/90 hover:-translate-y-1"
              >
                {/* ── PHOTO CONTAINER: Ambient blurred fill + centered uncropped image ── */}
                <div className={`relative overflow-hidden bg-black/80 flex items-center justify-center ${isCompact ? 'aspect-square' : 'aspect-[4/3]'}`}>
                  {/* Blurred Ambient Fill */}
                  <img
                    src={photo.url}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-35 select-none pointer-events-none"
                  />

                  {/* Uncropped Main Photo */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      loading="lazy"
                      className="max-w-full max-h-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
                    <div className="flex items-center justify-between">
                      <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-[#D4AF37]/40">
                        {photo.tag}
                      </span>
                      <ZoomIn className="w-5 h-5 text-white drop-shadow-md" />
                    </div>
                    <p className="text-white text-xs font-serif italic line-clamp-3 drop-shadow-md">
                      “{photo.caption}”
                    </p>
                  </div>

                  {/* Permanent Tag badge when not hovering */}
                  {!isCompact && (
                    <div className="absolute top-2.5 left-2.5 z-20 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[#D4AF37] text-[10px] font-bold uppercase border border-white/10 group-hover:opacity-0 transition-opacity">
                      {photo.tag}
                    </div>
                  )}

                  {photo.featured && (
                    <div className="absolute top-2.5 right-2.5 z-20 px-2 py-0.5 rounded-full bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-wider shadow-md">
                      Featured
                    </div>
                  )}
                </div>

                {/* Permanent Card Description Footer (Large Grid) */}
                {!isCompact && (
                  <div className="p-4 bg-[#100e0c] space-y-1.5 border-t border-white/5">
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
      <section className="bg-gradient-to-b from-[#070605] to-[#001333] border-t border-white/10 py-14 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-5">
          <h3 className="text-2xl font-serif font-bold text-white">
            Honoring a Lifetime of <span className="text-[#D4AF37]">Generous Service</span>
          </h3>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            These photographs celebrate seven decades of faith, community upliftment, and unconditional love. Join Pastor Ella Ruth Johnson in advancing life-changing community outreach.
          </p>
          <button
            onClick={onOpenDonate}
            id="gallery-donate-btn"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#c9a430] text-[#070605] font-bold text-sm shadow-xl shadow-[#D4AF37]/20 transition-all hover:scale-105 active:scale-95"
          >
            <Heart className="w-4 h-4 fill-current" />
            Support Safe Haven Community Outreach
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          6. FULLSCREEN LIGHTBOX MODAL (Uncropped, Ambient Portrait/Landscape)
      ══════════════════════════════════════════════════════════════════════ */}
      {activePhoto && (
        <div
          id="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo Lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-6"
          onClick={() => setActivePhoto(null)}
          onTouchStart={handleLightboxTouchStart}
          onTouchMove={handleLightboxTouchMove}
          onTouchEnd={handleLightboxTouchEnd}
        >
          <div
            className="relative w-full max-w-5xl bg-[#100e0c] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/15 flex flex-col lg:flex-row max-h-[94dvh] overscroll-contain"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePhoto(null)}
              aria-label="Close photo preview"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2 sm:p-2.5 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 transition-all active:scale-95 touch-sm"
            >
              <X className="w-5 h-5" />
            </button>

            {/* ── LIGHTBOX IMAGE AREA: Uncropped with ambient blurred backdrop ── */}
            <div className="relative w-full lg:w-2/3 bg-black flex items-center justify-center min-h-[220px] max-h-[46vh] sm:max-h-[76vh] sm:min-h-[420px] lg:min-h-[520px] overflow-hidden p-2 sm:p-6">
              {/* Blurred Ambient Glow Layer */}
              <img
                src={activePhoto.url}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-3xl scale-125 opacity-35 select-none pointer-events-none"
              />

              {/* 100% Uncropped Original Image */}
              <img
                src={activePhoto.url}
                alt={activePhoto.caption}
                className="relative z-10 max-w-full max-h-[42vh] sm:max-h-[74vh] object-contain rounded-lg drop-shadow-2xl select-none"
              />

              {/* Prev / Next Buttons */}
              <button
                onClick={() => handleLightboxNav(-1)}
                aria-label="Previous photo in album"
                className="touch-sm absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/65 hover:bg-[#D4AF37] hover:text-black text-white border border-white/20 transition-all shadow-xl active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() => handleLightboxNav(1)}
                aria-label="Next photo in album"
                className="touch-sm absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/65 hover:bg-[#D4AF37] hover:text-black text-white border border-white/20 transition-all shadow-xl active:scale-95"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Lightbox Sidebar: Pro Description & Metadata */}
            <div className="w-full lg:w-1/3 p-4 sm:p-8 flex flex-col justify-between gap-4 sm:gap-6 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#141210] overflow-y-auto max-h-[46vh] lg:max-h-none">
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wide border border-[#D4AF37]/35">
                    {activePhoto.tag}
                  </span>
                  <span className="text-white/70 text-xs font-medium">
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

                <div className="pt-3 border-t border-white/10 text-xs text-white/60 space-y-1">
                  <p><strong>Archived Under:</strong> {activePhoto.album.charAt(0).toUpperCase() + activePhoto.album.slice(1)} Collection</p>
                  <p><strong>Subject:</strong> Pastor Ella Ruth Johnson & Loved Ones</p>
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-white/50 font-mono">
                  <span>PHOTO INDEX</span>
                  <span className="font-bold text-white">
                    {filteredPhotos.findIndex(p => p.id === activePhoto.id) + 1} / {filteredPhotos.length}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setActivePhoto(null);
                    onOpenDonate();
                  }}
                  id="lightbox-donate-btn"
                  className="w-full py-3 rounded-full bg-[#D4AF37] hover:bg-[#c9a430] text-[#070605] font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
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
