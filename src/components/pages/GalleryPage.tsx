import React, { useState } from 'react';
import { PageTab, GalleryPhoto } from '../../types';
import { GALLERY_PHOTOS } from '../../data/initialData';
import { 
  Image as ImageIcon, 
  Heart, 
  X, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

interface GalleryPageProps {
  onNavigate: (tab: PageTab) => void;
  onOpenDonate: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  onOpenDonate
}) => {
  const [selectedAlbum, setSelectedAlbum] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  const albums: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'All Photos', count: GALLERY_PHOTOS.length },
    { id: 'ministry', label: 'Ministry & Preaching', count: GALLERY_PHOTOS.filter(p => p.album === 'ministry').length },
    { id: 'banquets', label: 'Community Banquets', count: GALLERY_PHOTOS.filter(p => p.album === 'banquets').length },
    { id: 'youth', label: 'Youth Outreach', count: GALLERY_PHOTOS.filter(p => p.album === 'youth').length },
    { id: 'mombasa', label: 'Mombasa, Kenya', count: GALLERY_PHOTOS.filter(p => p.album === 'mombasa').length },
    { id: 'family', label: 'Faith & Vitality', count: GALLERY_PHOTOS.filter(p => p.album === 'family').length }
  ];

  const filteredPhotos = selectedAlbum === 'all'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter(p => p.album === selectedAlbum);

  const handleNext = () => {
    if (!activePhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === activePhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[nextIndex]);
  };

  const handlePrev = () => {
    if (!activePhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === activePhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[prevIndex]);
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-20 pt-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Clean Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2ED] text-[#002366] text-xs font-medium border border-[#E8E2D8]">
          <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Visual Testimonies</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#002366]">
          Ministry Photo Gallery
        </h1>
        <p className="text-[#1A1A1A]/70 text-base leading-relaxed">
          Moments from community banquets in Columbia, MS, youth mentorship, mission trips to Mombasa, Kenya, and vitality walks.
        </p>
      </section>

      {/* Album Pills */}
      <section>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {albums.map(alb => (
            <button
              key={alb.id}
              onClick={() => setSelectedAlbum(alb.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                selectedAlbum === alb.id
                  ? 'bg-[#002366] text-white shadow-xs'
                  : 'bg-[#F5F2ED] text-[#1A1A1A]/70 hover:bg-[#E8E2D8] border border-[#E8E2D8]'
              }`}
            >
              <span>{alb.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedAlbum === alb.id ? 'bg-[#D4AF37] text-[#002366] font-semibold' : 'bg-[#E8E2D8] text-[#1A1A1A]/70'
              }`}>
                {alb.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Photo Grid */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#E8E2D8] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F2ED]">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#002366] text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs border border-[#E8E2D8]">
                  {photo.tag}
                </div>
              </div>

              <div className="p-4 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#1A1A1A]/50">
                  <span>{photo.dateStr}</span>
                  <span className="capitalize font-medium text-[#D4AF37]">{photo.album}</span>
                </div>
                <p className="text-xs text-[#1A1A1A]/80 line-clamp-2 leading-relaxed">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl my-8">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setActivePhoto(null)}
                className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row items-stretch">
              {/* Image Preview */}
              <div className="relative w-full lg:w-2/3 h-72 sm:h-96 lg:h-[480px] bg-black flex items-center justify-center">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.caption}
                  className="max-w-full max-h-full object-contain"
                  referrerPolicy="no-referrer"
                />

                <button
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black text-white transition-colors"
                  title="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black text-white transition-colors"
                  title="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Context */}
              <div className="w-full lg:w-1/3 p-6 sm:p-8 space-y-4 bg-[#FDFCFB] flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#E8E2D8]">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F5F2ED] text-[#002366] border border-[#E8E2D8]">
                      {activePhoto.tag}
                    </span>
                    <span className="text-xs text-[#1A1A1A]/50">{activePhoto.dateStr}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#002366]">
                    Safe Haven Moment
                  </h3>

                  <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                    {activePhoto.caption}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8E2D8] space-y-2">
                  <button
                    onClick={() => {
                      setActivePhoto(null);
                      onOpenDonate();
                    }}
                    className="w-full py-2.5 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs shadow-xs transition-colors flex items-center justify-center gap-2 border border-[#D4AF37]/30"
                  >
                    <Heart className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                    <span>Support Outreach</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
