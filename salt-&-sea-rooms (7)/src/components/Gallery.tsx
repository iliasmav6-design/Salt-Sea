import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { useCustomizer } from '../context/CustomizerContext';
import { ZoomIn, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { EditableText, EditableImage } from './Editable';

export default function Gallery() {
  const { galleryItems, updateGalleryItem, siteSettings, updateSiteSettings, isEditingMode } = useCustomizer();
  const [activeTab, setActiveTab] = useState<'all' | 'rooms' | 'garden' | 'beach' | 'exterior'>('all');
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState<number | null>(null);

  const filteredItems = activeTab === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeTab);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIdx === null) return;
    const prevIdx = selectedPhotoIdx === 0 ? filteredItems.length - 1 : selectedPhotoIdx - 1;
    setSelectedPhotoIdx(prevIdx);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIdx === null) return;
    const nextIdx = selectedPhotoIdx === filteredItems.length - 1 ? 0 : selectedPhotoIdx + 1;
    setSelectedPhotoIdx(nextIdx);
  };

  return (
    <section
      id="gallery"
      className="py-24 bg-white border-b border-warm-border/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 font-sans">
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand block mb-2">
            <EditableText
              fieldKey="gallerySub"
              label="Υπότιτλος 'Gallery'"
              value={siteSettings.gallerySub || "Summer Moments"}
              onSave={(val) => updateSiteSettings({ gallerySub: val })}
            />
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-slate-800 tracking-tight uppercase">
            <EditableText
              fieldKey="galleryTitle"
              label="Κύριος Τίτλος 'Gallery'"
              value={siteSettings.galleryTitle || "Our Gallery"}
              onSave={(val) => updateSiteSettings({ galleryTitle: val })}
            />
          </h2>
          <div className="h-px w-16 bg-accent-gold mx-auto mt-4"></div>
          <p className="text-slate-500 mt-4 font-sans text-xs sm:text-sm uppercase tracking-wider block">
            <EditableText
              fieldKey="galleryDesc"
              label="Περιγραφή Ενότητας Gallery"
              value={siteSettings.galleryDesc || "Take a virtual tour of our cozy apartments, lush relaxation garden, and crystal-clear golden shores."}
              onSave={(val) => updateSiteSettings({ galleryDesc: val })}
              type="textarea"
            />
          </p>
        </div>

        {/* Categories Tab selectors */}
        <div className="flex flex-wrap justify-center gap-2 mb-12" id="gallery-tabs">
          {[
            { label: 'All Photos', value: 'all' },
            { label: 'Rooms & Interiors', value: 'rooms' },
            { label: '4,000m² Garden', value: 'garden' },
            { label: 'Beaches & Area', value: 'beach' },
            { label: 'Exteriors', value: 'exterior' },
          ].map((tab) => (
            <button
              key={tab.value}
              id={`tab-${tab.value}`}
              onClick={() => setActiveTab(tab.value as any)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === tab.value
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-warm-bg border border-warm-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery grid layout */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          id="gallery-photo-grid"
        >
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group rounded-xl overflow-hidden bg-white border border-warm-border shadow-sm flex flex-col text-left transition-all hover:shadow-md"
            >
              {/* Photo Area */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-50">
                <EditableImage
                  fieldKey={`gallery-img-${item.id}`}
                  label={`Φωτογραφία Gallery: ${item.title}`}
                  src={item.imageUrl}
                  onSave={(val) => updateGalleryItem(item.id, { ...item, imageUrl: val })}
                  className="w-full h-full object-cover"
                  alt={item.title}
                  referrerPolicy="no-referrer"
                />
                
                {/* Expand trigger button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIdx(index);
                  }}
                  className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm p-1.5 rounded-full border border-warm-border text-slate-700 shadow-sm hover:scale-110 transition-transform cursor-pointer z-10"
                  title="Μεγέθυνση φωτογραφίας"
                >
                  <ZoomIn className="h-3.5 w-3.5 text-brand" />
                </button>
              </div>

              {/* Editable Label Footer on Image card */}
              <div className="p-3 bg-white border-t border-warm-border/50 flex flex-col justify-center">
                <span className="text-[8px] text-brand/80 font-bold uppercase tracking-widest font-sans mb-0.5">
                  {item.category}
                </span>
                <h4 className="font-serif text-slate-800 text-xs uppercase tracking-wide truncate">
                  <EditableText
                    fieldKey={`gallery-title-${item.id}`}
                    label={`Τίτλος Φωτογραφίας: ${item.id}`}
                    value={item.title}
                    onSave={(val) => updateGalleryItem(item.id, { ...item, title: val })}
                  />
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedPhotoIdx !== null && filteredItems[selectedPhotoIdx] && (
          <div
            id="lightbox-modal"
            onClick={() => setSelectedPhotoIdx(null)}
            className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col justify-between p-4 sm:p-6 animate-fadeIn font-sans"
          >
            {/* Lightbox header controls */}
            <div className="flex justify-between items-center w-full z-10">
              <div className="text-left text-white/85">
                <span className="text-[10px] uppercase tracking-widest text-brand-light font-bold block">
                  {filteredItems[selectedPhotoIdx].category}
                </span>
                <span className="font-serif font-light text-sm sm:text-lg uppercase tracking-wider text-white block">
                  {filteredItems[selectedPhotoIdx].title}
                </span>
              </div>
              <button
                onClick={() => setSelectedPhotoIdx(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Immersive Image Display Container */}
            <div className="relative flex-grow flex items-center justify-center max-w-5xl mx-auto w-full my-4">
              {/* Previous trigger button */}
              <button
                id="lightbox-prev-btn"
                onClick={handlePrev}
                className="absolute left-0 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 text-white z-20 hover:scale-105 transition-all cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
              </button>

              {/* Main Photo Render */}
              <img
                src={filteredItems[selectedPhotoIdx].imageUrl}
                alt={filteredItems[selectedPhotoIdx].title}
                className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl selection:bg-transparent"
                onClick={(e) => e.stopPropagation()}
                referrerPolicy="no-referrer"
              />

              {/* Next trigger button */}
              <button
                id="lightbox-next-btn"
                onClick={handleNext}
                className="absolute right-0 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 text-white z-20 hover:scale-105 transition-all cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
              </button>
            </div>

            {/* Lightbox Footer Indicators */}
            <div className="text-center text-xs font-bold tracking-widest font-sans text-white/40 uppercase pb-2">
              📸 {selectedPhotoIdx + 1} / {filteredItems.length}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
