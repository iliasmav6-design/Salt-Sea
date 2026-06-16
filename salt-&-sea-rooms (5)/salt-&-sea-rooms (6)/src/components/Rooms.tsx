import { useState, useEffect } from 'react';
import { Room } from '../types';
import { useCustomizer } from '../context/CustomizerContext';
import { 
  Tv, Sparkles, Check, Users, ShieldAlert, Coffee, HelpCircle,
  ChevronLeft, ChevronRight, Plus, Trash2, Pencil 
} from 'lucide-react';
import { EditableText, EditableImage } from './Editable';
import { motion, AnimatePresence } from 'motion/react';

interface RoomsProps {
  onSelectRoomForBooking: (roomId: string) => void;
}

export default function Rooms({ onSelectRoomForBooking }: RoomsProps) {
  const { rooms, updateRoom, isEditingMode, setSelectedEditElement } = useCustomizer();
  const [filterType, setFilterType] = useState<'all' | 'double' | 'triple' | 'quadruple'>('all');
  const [selectedRoomDetails, setSelectedRoomDetails] = useState<Room | null>(null);
  const [activeSlideIndices, setActiveSlideIndices] = useState<Record<string, number>>({});
  const [modalActivePhotoIndex, setModalActivePhotoIndex] = useState<number>(0);
  const [slideTicks, setSlideTicks] = useState<Record<string, number>>({});

  // Auto-play room images slideshow to rotate images automatically every 3 seconds
  useEffect(() => {
    const intervals = rooms.map(room => {
      const roomImages = room.images && room.images.length > 0 ? room.images : [room.imageUrl];
      
      return setInterval(() => {
        setActiveSlideIndices(prev => {
          const curr = prev[room.id] || 0;
          const next = (curr + 1) % (roomImages.length || 1);
          return { ...prev, [room.id]: next };
        });
        setSlideTicks(prev => {
          const curr = prev[room.id] || 0;
          return { ...prev, [room.id]: curr + 1 };
        });
      }, 3000); // changes every 3 seconds
    });

    return () => {
      intervals.forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, [rooms]);

  const filteredRooms = filterType === 'all' 
    ? rooms 
    : rooms.filter(r => r.type === filterType);

  return (
    <section
      id="rooms"
      className="py-24 bg-white border-b border-warm-border/50 animate-fadeIn"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand block mb-2">Our Accommodations</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-slate-800 tracking-tight uppercase">
            Charming Beachfront Rooms
          </h2>
          <div className="h-px w-16 bg-accent-gold mx-auto mt-4"></div>
          
          <p className="text-slate-600 mt-5 font-sans text-sm leading-relaxed max-w-2xl mx-auto">
            Every room at <strong>Salt & Sea Rooms</strong> is crafted with soft pastel palettes representing our beautiful Greek sand and water. 
            Two of our rooms are <strong>fully renovated in 2026</strong>, while the remaining rooms are <strong>partially renovated in 2026</strong>. 
            All rooms offer private kitchen facilities, cookware, and private dining options.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-16" id="rooms-filters">
          {[
            { label: 'All Summer Rooms', value: 'all' },
            { label: 'Double Rooms', value: 'double' },
            { label: 'Triple Rooms', value: 'triple' },
            { label: 'Quadruple Bedrooms', value: 'quadruple' },
          ].map((btn) => (
            <button
              key={btn.value}
              id={`filter-${btn.value}`}
              onClick={() => setFilterType(btn.value as any)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                filterType === btn.value
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-warm-bg border border-warm-border'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="rooms-grid">
          {filteredRooms.map((room) => {
            return (
              <div
                key={room.id}
                id={`room-card-${room.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-warm-border flex flex-col group"
              >
                {/* Image & Badges with multi-photo slider */}
                <div className="relative h-64 overflow-hidden bg-slate-100 group/slider">
                  {(() => {
                    const roomImages = room.images && room.images.length > 0 ? room.images : [room.imageUrl];
                    const activeIndex = activeSlideIndices[room.id] || 0;
                    const safeIndex = activeIndex < roomImages.length ? activeIndex : 0;
                    const currentImg = roomImages[safeIndex];

                    return (
                      <>
                        <div className="absolute inset-0 overflow-hidden bg-slate-950">
                          <AnimatePresence initial={false} mode="popLayout">
                            <motion.div
                              key={`${room.id}-${safeIndex}-${slideTicks[room.id] || 0}`}
                              initial={{ opacity: 0, y: "20%" }}
                              animate={{ opacity: 1, y: "0%" }}
                              exit={{ opacity: 0, y: "-20%" }}
                              transition={{ duration: 0.8, ease: "easeInOut" }}
                              className="absolute inset-0 w-full h-full"
                            >
                              <motion.img
                                src={currentImg}
                                alt={room.name}
                                initial={{ y: "8%", scale: 1.15 }}
                                animate={{ y: "-8%", scale: 1.15 }}
                                transition={{ duration: 3.2, ease: "linear" }}
                                className="w-full h-full object-cover filter brightness-[0.98]"
                                referrerPolicy="no-referrer"
                              />
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        {/* Left arrow */}
                        {roomImages.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setActiveSlideIndices((prev) => {
                                const curr = prev[room.id] || 0;
                                const nextIdx = curr === 0 ? roomImages.length - 1 : curr - 1;
                                return { ...prev, [room.id]: nextIdx };
                              });
                            }}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-1.5 rounded-full border border-warm-border opacity-0 group-hover/slider:opacity-100 transition-all duration-200 z-10 cursor-pointer shadow-md hover:scale-105"
                            title="Προηγούμενη φωτογραφία"
                          >
                            <ChevronLeft className="h-4 w-4 text-brand" />
                          </button>
                        )}

                        {/* Right arrow */}
                        {roomImages.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setActiveSlideIndices((prev) => {
                                const curr = prev[room.id] || 0;
                                const nextIdx = curr === roomImages.length - 1 ? 0 : curr + 1;
                                return { ...prev, [room.id]: nextIdx };
                              });
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-1.5 rounded-full border border-warm-border opacity-0 group-hover/slider:opacity-100 transition-all duration-200 z-10 cursor-pointer shadow-md hover:scale-105"
                            title="Επόμενη φωτογραφία"
                          >
                            <ChevronRight className="h-4 w-4 text-brand" />
                          </button>
                        )}

                        {/* Navigation dots */}
                        {roomImages.length > 1 && (
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10 bg-slate-900/40 py-1 px-2.5 rounded-full backdrop-blur-xs">
                            {roomImages.map((_, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  setActiveSlideIndices((prev) => ({ ...prev, [room.id]: i }));
                                }}
                                className={`h-1.5 w-1.5 rounded-full transition-all cursor-pointer ${
                                  i === safeIndex ? 'bg-brand w-3.5' : 'bg-white/50 hover:bg-white'
                                }`}
                                title={`Μετάβαση στη φωτογραφία ${i + 1}`}
                              />
                            ))}
                          </div>
                        )}

                        {/* Slide Indicator Overlay */}
                        <span className="absolute bottom-3 left-3 bg-slate-950/65 backdrop-blur-md text-white text-[9px] font-mono px-2 py-0.5 rounded block z-10 select-none uppercase tracking-widest font-bold">
                          📸 {safeIndex + 1} / {roomImages.length}
                        </span>

                        {/* Admin Inline Actions */}
                        {isEditingMode && (
                          <div className="absolute top-2.5 right-2.5 flex space-x-1 z-20">
                            {/* Add Photo Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setSelectedEditElement({
                                  id: `add-photo-room-${room.id}`,
                                  label: `Προσθήκη Νέας Φωτογραφίας: ${room.name}`,
                                  value: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
                                  type: 'image',
                                  onSave: (newUrl) => {
                                    if (newUrl) {
                                      const currentImages = room.images || [room.imageUrl];
                                      const updatedImages = [...currentImages, newUrl];
                                      updateRoom(room.id, {
                                        ...room,
                                        images: updatedImages,
                                        imageUrl: room.imageUrl || newUrl
                                      });
                                      setActiveSlideIndices(prev => ({
                                        ...prev,
                                        [room.id]: updatedImages.length - 1
                                      }));
                                    }
                                  }
                                });
                              }}
                              className="bg-brand/95 text-white py-1 px-2.5 rounded shadow-md cursor-pointer hover:bg-brand transition-all flex items-center space-x-1 text-[9px] font-sans font-bold uppercase tracking-widest h-7"
                              title="Προσθήκη Φωτογραφίας"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Add Photo</span>
                            </button>

                            {/* Edit Photo URL Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setSelectedEditElement({
                                  id: `edit-photo-room-${room.id}-${safeIndex}`,
                                  label: `Αλλαγή Φωτογραφίας ${safeIndex + 1} για: ${room.name}`,
                                  value: currentImg,
                                  type: 'image',
                                  onSave: (newUrl) => {
                                    if (newUrl) {
                                      const currentImages = room.images || [room.imageUrl];
                                      const updatedImages = [...currentImages];
                                      updatedImages[safeIndex] = newUrl;
                                      updateRoom(room.id, {
                                        ...room,
                                        images: updatedImages,
                                        imageUrl: safeIndex === 0 ? newUrl : room.imageUrl
                                      });
                                    }
                                  }
                                });
                              }}
                              className="bg-white text-slate-700 py-1 px-2 rounded shadow-md border border-warm-border hover:bg-slate-50 transition-all cursor-pointer h-7"
                              title="Επεξεργασία URL"
                            >
                              <Pencil className="h-3 w-3 text-brand" />
                            </button>

                            {/* Delete Photo Button */}
                            {roomImages.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  if (window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή τη φωτογραφία από το δωμάτιο;')) {
                                    const currentImages = room.images || [room.imageUrl];
                                    const updatedImages = currentImages.filter((_, idx) => idx !== safeIndex);
                                    
                                    setActiveSlideIndices((prev) => {
                                      const curr = prev[room.id] || 0;
                                      return {
                                        ...prev,
                                        [room.id]: Math.max(0, curr - 1)
                                      };
                                    });

                                    updateRoom(room.id, {
                                      ...room,
                                      images: updatedImages,
                                      imageUrl: updatedImages[0]
                                    });
                                  }
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded shadow-md transition-all cursor-pointer h-7"
                                title="Διαγραφή Φωτογραφίας"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </>
                    );
                  })()}

                  {/* Renovation badge */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2 z-10 pointer-events-none select-none">
                    {room.renovationStatus === 'fully' ? (
                      <span className="inline-flex items-center space-x-1.5 bg-brand/90 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded uppercase tracking-wider shadow-sm font-sans">
                        <Sparkles className="h-3 w-3 text-white fill-current" />
                        <span>Fully Renovated 2026</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 bg-accent-gold/90 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded uppercase tracking-wider shadow-sm font-sans">
                        <Sparkles className="h-3 w-3 text-white" />
                        <span>Partially Renovated 2026</span>
                      </span>
                    )}
                  </div>

                  {/* Price tag */}
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm py-1.5 px-4 rounded border border-warm-border text-right shadow-sm z-10">
                    <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider font-sans">From</span>
                    <span className="text-lg font-medium font-serif text-slate-800">
                      €
                      <EditableText
                        fieldKey={`room-price-${room.id}`}
                        label={`Τιμή Δωματίου: ${room.name}`}
                        value={String(room.pricePerNight)}
                        onSave={(val) => updateRoom(room.id, { ...room, pricePerNight: Number(val) || 0 })}
                      />
                    </span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-sans">/ night</span>
                  </div>
                </div>

                {/* Attributes and Specs row */}
                <div className="bg-warm-bg/60 px-6 py-2.5 border-b border-warm-border flex justify-between text-[11px] text-slate-600 font-medium font-sans uppercase tracking-wider items-center">
                  <span className="flex items-center space-x-1.5">
                    <Users className="h-3.5 w-3.5 text-brand" />
                    <span>
                      Up to{' '}
                      <EditableText
                        fieldKey={`room-capacity-${room.id}`}
                        label={`Χωρητικότητα Δωματίου: ${room.name}`}
                        value={String(room.capacity)}
                        onSave={(val) => updateRoom(room.id, { ...room, capacity: Number(val) || 2 })}
                      />{' '}
                      Guests
                    </span>
                  </span>
                  <span>•</span>
                  <span>
                    <EditableText
                      fieldKey={`room-size-${room.id}`}
                      label={`Τετραγωνικά Δωματίου: ${room.name}`}
                      value={room.size}
                      onSave={(val) => updateRoom(room.id, { ...room, size: val })}
                    />
                  </span>
                  <span>•</span>
                  <span>
                    <EditableText
                      fieldKey={`room-bed-${room.id}`}
                      label={`Τύπος Κρεβατιών: ${room.name}`}
                      value={room.bedType}
                      onSave={(val) => updateRoom(room.id, { ...room, bedType: val })}
                    />
                  </span>
                </div>

                {/* Content Body */}
                <div className="p-6 flex-grow flex flex-col justify-between text-left">
                  <div className="space-y-3">
                    <h3 className="font-serif text-xl font-light text-slate-800 group-hover:text-brand transition-colors uppercase tracking-wide">
                      <EditableText
                        fieldKey={`room-name-${room.id}`}
                        label={`Όνομα Δωματίου: ${room.name}`}
                        value={room.name}
                        onSave={(val) => updateRoom(room.id, { ...room, name: val })}
                      />
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                      <EditableText
                        fieldKey={`room-desc-${room.id}`}
                        label={`Περιγραφή Δωματίου: ${room.name}`}
                        value={room.description}
                        onSave={(val) => updateRoom(room.id, { ...room, description: val })}
                        type="textarea"
                      />
                    </p>

                    <div className="pt-3">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center space-x-1">
                        <span>Room Highlights & Features</span>
                      </h4>
                      
                      {/* Highlight Box for TV in fully renovated rooms */}
                      {room.renovationStatus === 'fully' && (
                        <div className="mb-3 p-2.5 bg-accent-gold-light/40 rounded border border-warm-border flex items-center space-x-2 text-slate-700 text-xs text-left">
                          <Tv className="h-4 w-4 shrink-0 text-accent-gold" />
                          <span><strong>Premium:</strong> Brand new 50-inch Smart LED TV with preconfigured accounts!</span>
                        </div>
                      )}

                      {/* Compact Amenities Icons/Chips */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-left">
                        {room.amenities.slice(1, 7).map((amenity, idx) => (
                          <div key={idx} className="flex items-center space-x-1.5 text-xs text-slate-600">
                            <Check className="h-3.5 w-3.5 text-brand shrink-0" />
                            <span className="truncate">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="mt-8 pt-4 border-t border-warm-border flex items-center justify-between gap-4">
                    <button
                      id={`details-btn-${room.id}`}
                      onClick={() => {
                        setSelectedRoomDetails(room);
                        setModalActivePhotoIndex(0);
                      }}
                      className="text-[10px] font-bold text-brand hover:text-brand-dark underline uppercase tracking-wider cursor-pointer font-sans"
                    >
                      View All Details
                    </button>
                    
                    <button
                      id={`book-room-${room.id}`}
                      onClick={() => onSelectRoomForBooking(room.id)}
                      className="bg-brand hover:bg-brand-dark text-white font-bold text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-full shadow-sm transition-transform hover:scale-[1.02] cursor-pointer font-sans"
                    >
                      Select & Book Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Kitchenette details banner */}
        <div className="mt-16 bg-warm-bg/70 p-6 sm:p-8 rounded-xl border border-warm-border text-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <h3 className="font-serif text-lg font-light text-slate-800 flex items-center gap-2 uppercase tracking-wide">
              <Coffee className="h-5 w-5 text-accent-gold" />
              <span>Full Kitchen Equipment in All Units</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              We know clean, family cooking makes holidays feel perfect. That is why <strong>every single room</strong> includes a refrigerator, cooker hubs, pots, frying pans, cookware, dining dishes, glasses, and a full cutlery set.
            </p>
          </div>
          <div className="bg-white py-2.5 px-4 rounded border border-warm-border text-[10px] text-center font-sans font-bold uppercase tracking-widest text-brand">
            🍳 Save on eating out • Perfect for kids
          </div>
        </div>

        {/* Modal Room Details View */}
        {selectedRoomDetails && (
          <div id="room-modal" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn font-sans">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 sm:p-8 relative shadow-lg border border-warm-border">
              <button
                id="close-modal-btn"
                onClick={() => setSelectedRoomDetails(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus:outline-none p-1.5 bg-warm-bg hover:bg-warm-border/50 border border-warm-border rounded-full transition-colors cursor-pointer text-xs"
              >
                ✕
              </button>

              <div className="space-y-6 text-left">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-brand block mb-1">Detailed Specifications</span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-slate-800 uppercase tracking-wide">
                    {selectedRoomDetails.name}
                  </h3>
                </div>

                {/* Big Active Image Display in Modal with Controls */}
                {(() => {
                  const modalImages = selectedRoomDetails.images && selectedRoomDetails.images.length > 0 
                    ? selectedRoomDetails.images 
                    : [selectedRoomDetails.imageUrl];
                  const safeModalIndex = modalActivePhotoIndex < modalImages.length ? modalActivePhotoIndex : 0;

                  return (
                    <div className="space-y-3">
                      <div className="relative rounded-lg overflow-hidden h-56 sm:h-72 border border-warm-border bg-slate-50 flex items-center justify-center">
                        <img
                          src={modalImages[safeModalIndex]}
                          alt={selectedRoomDetails.name}
                          className="w-full h-full object-cover filter brightness-[0.98] transition-all"
                          referrerPolicy="no-referrer"
                        />

                        {/* Admin actions overlay inside modal main image */}
                        {isEditingMode && (
                          <div className="absolute top-3 right-3 flex space-x-1.5 z-20">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedEditElement({
                                  id: `modal-edit-photo-${selectedRoomDetails.id}-${safeModalIndex}`,
                                  label: `Αλλαγή Φωτογραφίας ${safeModalIndex + 1} (Modal) για: ${selectedRoomDetails.name}`,
                                  value: modalImages[safeModalIndex],
                                  type: 'image',
                                  onSave: (newUrl) => {
                                    if (newUrl) {
                                      const updated = [...modalImages];
                                      updated[safeModalIndex] = newUrl;
                                      const updatedRoomDetails = {
                                        ...selectedRoomDetails,
                                        images: updated,
                                        imageUrl: safeModalIndex === 0 ? newUrl : selectedRoomDetails.imageUrl
                                      };
                                      updateRoom(selectedRoomDetails.id, updatedRoomDetails);
                                      setSelectedRoomDetails(updatedRoomDetails);
                                    }
                                  }
                                });
                              }}
                              className="bg-white/95 text-slate-800 border border-warm-border px-2 py-1 select-none font-bold text-[9px] uppercase tracking-wider rounded-md hover:bg-slate-100 flex items-center space-x-1 shadow-sm cursor-pointer"
                            >
                              <Pencil className="h-3 w-3 text-brand" />
                              <span>Αλλαγή URL / Preset</span>
                            </button>

                            {modalImages.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm('Θέλετε σίγουρα να διαγράψετε αυτή τη φωτογραφία από το δωμάτιο;')) {
                                    const updated = modalImages.filter((_, idx) => idx !== safeModalIndex);
                                    const updatedRoomDetails = {
                                      ...selectedRoomDetails,
                                      images: updated,
                                      imageUrl: updated[0]
                                    };
                                    updateRoom(selectedRoomDetails.id, updatedRoomDetails);
                                    setSelectedRoomDetails(updatedRoomDetails);
                                    setModalActivePhotoIndex(Math.max(0, safeModalIndex - 1));
                                  }
                                }}
                                className="bg-red-500 text-white px-2 py-1 select-none font-bold text-[9px] uppercase tracking-wider rounded-md hover:bg-red-600 flex items-center space-x-1 shadow-sm cursor-pointer"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Διαγραφή</span>
                              </button>
                            )}
                          </div>
                        )}

                        {/* Modal slider arrows */}
                        {modalImages.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setModalActivePhotoIndex(curr => curr === 0 ? modalImages.length - 1 : curr - 1);
                              }}
                              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-slate-800 p-2 rounded-full border border-warm-border cursor-pointer shadow-md hover:scale-105 transition-transform"
                            >
                              <ChevronLeft className="h-4 w-4 text-brand" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setModalActivePhotoIndex(curr => curr === modalImages.length - 1 ? 0 : curr + 1);
                              }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-slate-800 p-2 rounded-full border border-warm-border cursor-pointer shadow-md hover:scale-105 transition-transform"
                            >
                              <ChevronRight className="h-4 w-4 text-brand" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Thumbnail ribbon */}
                      <div className="flex flex-wrap items-center gap-2 py-1">
                        {modalImages.map((imgUrl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setModalActivePhotoIndex(idx)}
                            className={`relative rounded-lg overflow-hidden h-12 w-16 border-2 cursor-pointer transition-all ${
                              idx === safeModalIndex ? 'border-brand scale-95 shadow-sm' : 'border-warm-border hover:border-brand/40'
                            }`}
                          >
                            <img
                              src={imgUrl}
                              className="h-full w-full object-cover"
                              alt={`Thumbnail ${idx + 1}`}
                              referrerPolicy="no-referrer"
                            />
                          </button>
                        ))}

                        {/* Admin Add New Photo direct ribbon target */}
                        {isEditingMode && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEditElement({
                                id: `modal-add-photo-${selectedRoomDetails.id}`,
                                label: `Προσθήκη Νέας Φωτογραφίας (Modal) για: ${selectedRoomDetails.name}`,
                                value: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80',
                                type: 'image',
                                onSave: (newUrl) => {
                                  if (newUrl) {
                                    const updated = [...modalImages, newUrl];
                                    const updatedRoomDetails = {
                                      ...selectedRoomDetails,
                                      images: updated,
                                      imageUrl: selectedRoomDetails.imageUrl || newUrl
                                    };
                                    updateRoom(selectedRoomDetails.id, updatedRoomDetails);
                                    setSelectedRoomDetails(updatedRoomDetails);
                                    setModalActivePhotoIndex(updated.length - 1);
                                  }
                                }
                              });
                            }}
                            className="h-12 w-16 rounded-lg border-2 border-dashed border-brand/50 hover:border-brand bg-brand/5 flex flex-col justify-center items-center text-brand font-bold text-[9px] uppercase tracking-wider transition-colors cursor-pointer"
                            title="Προσθήκη νέας φωτογραφίας"
                          >
                            <Plus className="h-4 w-4 text-brand animate-pulse mb-0.5" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-warm-bg rounded border border-warm-border">
                    <span className="text-[9px] text-slate-500 uppercase font-bold block mb-1 tracking-wider">Area</span>
                    <span className="font-medium text-slate-800 text-xs sm:text-sm uppercase tracking-wide font-sans">{selectedRoomDetails.size}</span>
                  </div>
                  <div className="p-3 bg-warm-bg rounded border border-warm-border">
                    <span className="text-[9px] text-slate-500 uppercase font-bold block mb-1 tracking-wider">Mattress</span>
                    <span className="font-medium text-slate-800 text-xs sm:text-sm uppercase tracking-wide font-sans">{selectedRoomDetails.bedType}</span>
                  </div>
                  <div className="p-3 bg-warm-bg rounded border border-warm-border">
                    <span className="text-[9px] text-slate-500 uppercase font-bold block mb-1 tracking-wider">Capacity</span>
                    <span className="font-medium text-slate-800 text-xs sm:text-sm uppercase tracking-wide font-sans">{selectedRoomDetails.capacity} Adults</span>
                  </div>
                  <div className="p-3 bg-warm-bg rounded border border-warm-border">
                    <span className="text-[9px] text-slate-500 uppercase font-bold block mb-1 tracking-wider font-sans">Price</span>
                    <span className="font-bold text-brand text-xs sm:text-sm uppercase tracking-wide font-sans">€{selectedRoomDetails.pricePerNight}/n</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-widest mb-3">All Amenities Installed:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 text-xs font-sans">
                    {selectedRoomDetails.amenities.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-brand shrink-0"></div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-warm-border space-x-3">
                  <button
                    id="modal-cancel-btn"
                    onClick={() => setSelectedRoomDetails(null)}
                    className="bg-warm-bg hover:bg-warm-border/50 text-slate-700 font-bold uppercase tracking-wider text-[10px] px-5 py-2.5 rounded-full border border-warm-border cursor-pointer font-sans"
                  >
                    Close
                  </button>
                  <button
                    id="modal-select-btn"
                    onClick={() => {
                      onSelectRoomForBooking(selectedRoomDetails.id);
                      setSelectedRoomDetails(null);
                    }}
                    className="bg-brand hover:bg-brand-dark text-white font-bold uppercase tracking-wider text-[10px] px-6 py-2.5 rounded-full cursor-pointer shadow-sm font-sans"
                  >
                    Select this Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
