import React, { useState } from 'react';
import { useCustomizer, SiteSettings, ThemeSettings, BackgroundPatternType } from '../context/CustomizerContext';
import { Room, GalleryItem, Booking } from '../types';
import {
  Sliders,
  X,
  RefreshCw,
  LayoutGrid,
  Palette,
  Bed,
  Image as ImageIcon,
  Calendar,
  Save,
  Trash2,
  Plus,
  Home,
  Check,
  ChevronRight,
  Info,
  DollarSign,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  MapPin,
  Star,
  CreditCard,
  Building,
  Banknote,
  Mail,
  Lock
} from 'lucide-react';

interface ColorPreset {
  name: string;
  nameEl: string;
  brandColor: string;
  brandLight: string;
  brandDark: string;
  warmBgColor: string;
  warmBorderColor: string;
  accentGoldColor: string;
}

const colorPresets: ColorPreset[] = [
  {
    name: 'Sithonia Olive',
    nameEl: 'Πράσινο Ελιάς',
    brandColor: '#4D7E7B',
    brandLight: '#A5D7D2',
    brandDark: '#3D6663',
    warmBgColor: '#FAF7F2',
    warmBorderColor: '#E6E0D5',
    accentGoldColor: '#8C7B65',
  },
  {
    name: 'Aegean Dream',
    nameEl: 'Μπλε Αιγαίου',
    brandColor: '#3D6E8A',
    brandLight: '#A4CDDB',
    brandDark: '#1F4A63',
    warmBgColor: '#FAF9F5',
    warmBorderColor: '#D9E6EB',
    accentGoldColor: '#CFAF7B',
  },
  {
    name: 'Clay Terracotta',
    nameEl: 'Τερακότα',
    brandColor: '#9E6751',
    brandLight: '#D9B4A0',
    brandDark: '#733F2B',
    warmBgColor: '#FBF9F1',
    warmBorderColor: '#EADEC9',
    accentGoldColor: '#A79277',
  },
  {
    name: 'Chios Mastic',
    nameEl: 'Μαστίχα Χίου',
    brandColor: '#5C8374',
    brandLight: '#9EC8B9',
    brandDark: '#1B4242',
    warmBgColor: '#FAF8F5',
    warmBorderColor: '#E2ECE9',
    accentGoldColor: '#C0A080',
  },
  {
    name: 'Luxurious Slate',
    nameEl: 'Μαύρο Γκρίζο',
    brandColor: '#1E293B',
    brandLight: '#94A3B8',
    brandDark: '#0F172A',
    warmBgColor: '#F8FAFC',
    warmBorderColor: '#E2E8F0',
    accentGoldColor: '#78350F',
  },
];

export default function SiteCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'pages' | 'rooms' | 'gallery' | 'bookings'>('content');
  const [showExportModal, setShowExportModal] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);
  const {
    siteSettings,
    updateSiteSettings,
    themeSettings,
    updateThemeSettings,
    rooms,
    updateRoom,
    addRoom,
    deleteRoom,
    galleryItems,
    updateGalleryItem,
    addGalleryItem,
    deleteGalleryItem,
    bookings,
    addBooking,
    cancelBooking,
    resetAll,
    sections,
    updateSection,
    addSection,
    deleteSection,
    reorderSections,
  } = useCustomizer();

  // Local states for custom page builder
  const [customPageLabel, setCustomPageLabel] = useState('');
  const [customPageTitle, setCustomPageTitle] = useState('');
  const [customPageSub, setCustomPageSub] = useState('');
  const [customPageContent, setCustomPageContent] = useState('');
  const [customPageImageUrl, setCustomPageImageUrl] = useState('');

  // Reordering handlers
  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const reordered = [...sections];
    const temp = reordered[index];
    reordered[index] = reordered[index - 1];
    reordered[index - 1] = temp;
    reorderSections(reordered);
  };

  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    const reordered = [...sections];
    const temp = reordered[index];
    reordered[index] = reordered[index + 1];
    reordered[index + 1] = temp;
    reorderSections(reordered);
  };

  const handleAddCustomPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPageLabel || !customPageTitle) return;
    const slug = customPageLabel.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const cleanId = `custom-${slug}-${Date.now()}`;
    addSection({
      id: cleanId,
      label: customPageLabel,
      title: customPageTitle,
      sub: customPageSub || undefined,
      content: customPageContent || undefined,
      imageUrl: customPageImageUrl || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
      visible: true,
      isCustom: true
    });
    // Reset local states
    setCustomPageLabel('');
    setCustomPageTitle('');
    setCustomPageSub('');
    setCustomPageContent('');
    setCustomPageImageUrl('');
  };

  // Temporary local states for adding elements dynamically
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    name: '',
    type: 'double',
    description: '',
    renovationStatus: 'fully',
    renovationYear: 2026,
    capacity: 2,
    pricePerNight: 80,
    size: '22 m²',
    bedType: '1 Double Bed',
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
    amenities: ['Wi-Fi', 'Air Conditioning', 'Kitchenette']
  });
  const [newGallery, setNewGallery] = useState<Partial<GalleryItem>>({
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
    title: '',
    category: 'rooms'
  });
  const [newBooking, setNewBooking] = useState<Partial<Booking>>({
    guestName: '',
    guestEmail: '',
    roomId: rooms[0]?.id || 'double-renovated',
    checkIn: '2026-07-01',
    checkOut: '2026-07-06',
    guestsCount: 2,
    totalPrice: 400,
  });

  const [newReview, setNewReview] = useState({
    guest: '',
    text: '',
    score: 5,
    date: 'Summer 2026'
  });

  const handleApplyPreset = (preset: ColorPreset) => {
    updateThemeSettings({
      brandColor: preset.brandColor,
      brandLight: preset.brandLight,
      brandDark: preset.brandDark,
      warmBgColor: preset.warmBgColor,
      warmBorderColor: preset.warmBorderColor,
      accentGoldColor: preset.accentGoldColor,
    });
  };

  const handleAddRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.name || !newRoom.pricePerNight) return;
    const generatedId = `room-${Date.now()}`;
    const roomToCreate: Room = {
      id: generatedId,
      name: newRoom.name || 'Unnamed Suite',
      type: newRoom.type || 'double',
      description: newRoom.description || '',
      renovationStatus: newRoom.renovationStatus || 'fully',
      renovationYear: Number(newRoom.renovationYear) || 2026,
      capacity: Number(newRoom.capacity) || 2,
      pricePerNight: Number(newRoom.pricePerNight) || 80,
      size: newRoom.size || '22 m²',
      bedType: newRoom.bedType || '1 Double Bed',
      imageUrl: newRoom.imageUrl || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
      amenities: newRoom.amenities || ['Wi-Fi', 'Air Conditioning']
    };
    addRoom(roomToCreate);
    // Reset room form state
    setNewRoom({
      name: '',
      type: 'double',
      description: '',
      renovationStatus: 'fully',
      renovationYear: 2026,
      capacity: 2,
      pricePerNight: 80,
      size: '22 m²',
      bedType: '1 Double Bed',
      imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
      amenities: ['Wi-Fi', 'Air Conditioning', 'Kitchenette']
    });
  };

  const handleAddGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGallery.title || !newGallery.imageUrl) return;
    const itemToCreate: GalleryItem = {
      id: `gal-${Date.now()}`,
      imageUrl: newGallery.imageUrl || '',
      title: newGallery.title || '',
      category: newGallery.category || 'rooms'
    };
    addGalleryItem(itemToCreate);
    setNewGallery({
      imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
      title: '',
      category: 'rooms'
    });
  };

  const handleCreateBlockBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.guestName || !newBooking.checkIn || !newBooking.checkOut) return;
    
    // calculate a mock total price
    const r = rooms.find(room => room.id === newBooking.roomId) || rooms[0];
    const nights = Math.max(1, Math.ceil((new Date(newBooking.checkOut!).getTime() - new Date(newBooking.checkIn!).getTime()) / (1000 * 60 * 60 * 24)));
    const calculatedPrice = (r?.pricePerNight || 80) * nights;

    const block: Booking = {
      id: `block-${Date.now()}`,
      guestName: newBooking.guestName || 'Operator Block',
      guestEmail: newBooking.guestEmail || 'operator@saltandsea-rooms.com',
      roomId: newBooking.roomId || rooms[0]?.id || 'double-renovated',
      checkIn: newBooking.checkIn || '2026-07-01',
      checkOut: newBooking.checkOut || '2026-07-06',
      guestsCount: Number(newBooking.guestsCount) || 2,
      totalPrice: calculatedPrice,
      status: 'confirmed'
    };
    addBooking(block);
    setNewBooking({
      guestName: '',
      guestEmail: '',
      roomId: rooms[0]?.id || 'double-renovated',
      checkIn: '2026-07-01',
      checkOut: '2026-07-06',
      guestsCount: 2,
    });
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.guest || !newReview.text) return;
    const reviewId = `rev-${Date.now()}`;
    const cleanList = [
      ...(siteSettings.customReviews || []),
      {
        id: reviewId,
        guest: newReview.guest,
        text: newReview.text,
        score: Number(newReview.score) || 5,
        date: newReview.date || 'Summer 2026'
      }
    ];
    updateSiteSettings({ customReviews: cleanList });
    setNewReview({
      guest: '',
      text: '',
      score: 5,
      date: 'Summer 2026'
    });
  };

  const handleDeleteReview = (id: string) => {
    const cleanList = (siteSettings.customReviews || []).filter((r: any) => r.id !== id);
    updateSiteSettings({ customReviews: cleanList });
  };

  return (
    <>
      {/* Floating Gear Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-brand hover:bg-brand-dark text-white font-sans text-xs font-bold uppercase tracking-widest px-5 py-4 rounded shadow-lg transition-all duration-200 cursor-pointer flex items-center space-x-2 border border-warm-border/20 group animate-pulse"
        >
          <Sliders className="h-4.5 w-4.5 animate-spin-slow group-hover:rotate-45" />
          <span>Επεξεργασία Σελίδας / Customize 🛠️</span>
        </button>
      </div>

      {/* Slide-out Customizer Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop lock dial */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col h-full border-l border-warm-border">
              
              {/* Customizer Drawer Header */}
              <div className="bg-slate-950 px-6 py-5 flex items-center justify-between text-white border-b border-warm-border/10">
                <div className="flex items-center space-x-2.5">
                  <Sliders className="h-5 w-5 text-brand-light" />
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">
                      Πίνακας Παραμετροποίησης
                    </h2>
                    <p className="text-[10px] text-slate-400 capitalize">
                      Customize Rooms, Colors, and Occupancy Blocks
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer text-slate-300 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Tab Selector Links */}
              <div className="grid grid-cols-5 bg-slate-900 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-warm-border/15">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`py-3 text-center border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'content'
                      ? 'border-brand-light text-white bg-slate-800/50'
                      : 'border-transparent hover:text-white hover:bg-slate-850'
                  }`}
                >
                  🎨 Design
                </button>
                <button
                  onClick={() => setActiveTab('pages')}
                  className={`py-3 text-center border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'pages'
                      ? 'border-brand-light text-white bg-slate-800/50'
                      : 'border-transparent hover:text-white hover:bg-slate-850'
                  }`}
                >
                  📄 Σελίδες
                </button>
                <button
                  onClick={() => setActiveTab('rooms')}
                  className={`py-3 text-center border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'rooms'
                      ? 'border-brand-light text-white bg-slate-800/50'
                      : 'border-transparent hover:text-white hover:bg-slate-850'
                  }`}
                >
                  🛏️ Δωμάτια
                </button>
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`py-3 text-center border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'gallery'
                      ? 'border-brand-light text-white bg-slate-800/50'
                      : 'border-transparent hover:text-white hover:bg-slate-850'
                  }`}
                >
                  🖼️ Gallery
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`py-3 text-center border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'bookings'
                      ? 'border-brand-light text-white bg-slate-800/50'
                      : 'border-transparent hover:text-white hover:bg-slate-850'
                  }`}
                >
                  📅 Κρατήσεις
                </button>
              </div>

              {/* Dynamic Workspace (Scrollable) */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                
                {/* Pages Tab - Custom Scaffolding and Section Layouts */}
                {activeTab === 'pages' && (
                  <div className="space-y-6 text-left">
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs text-slate-600 font-sans leading-relaxed flex items-start space-x-2.5">
                      <Layers className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-800 mb-1">Διαχείριση Διάταξης & Σελίδων</p>
                        <p>
                          Ορίστε ποια μενού θα εμφανίζονται, αλλάξτε τη σειρά (reordering) με τα κουμπιά ↑/↓, ή προσθέστε τις δικές σας προσαρμοσμένες σελίδες. Όλες οι αλλαγές εφαρμόζονται άμεσα!
                        </p>
                      </div>
                    </div>

                    {/* Section list container */}
                    <div className="space-y-3.5">
                      <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider flex items-center space-x-1">
                        <Layers className="h-3.5 w-3.5 text-brand" />
                        <span>Ενεργές Ενότητες & Σειρά Εμφάνισης ({sections.length})</span>
                      </span>

                      <div className="space-y-3 font-sans">
                        {sections.map((sec, idx) => (
                          <div 
                            key={sec.id} 
                            className={`p-4 rounded-xl border bg-white ${
                              sec.visible ? 'border-warm-border/70 shadow-xs' : 'border-slate-200 bg-slate-50/70 opacity-75'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              {/* Left reorder buttons */}
                              <div className="flex items-center space-x-3">
                                <div className="flex flex-col space-y-1">
                                  <button
                                    onClick={() => moveSectionUp(idx)}
                                    disabled={idx === 0}
                                    title="Μετακίνηση Πάνω"
                                    className="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-20 cursor-pointer"
                                  >
                                    <ArrowUp className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => moveSectionDown(idx)}
                                    disabled={idx === sections.length - 1}
                                    title="Μετακίνηση Κάτω"
                                    className="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-20 cursor-pointer"
                                  >
                                    <ArrowDown className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs font-bold text-slate-800">
                                      {sec.label}
                                    </span>
                                    {sec.isCustom ? (
                                      <span className="text-[10px] bg-brand-light/30 text-brand font-medium px-1.5 py-0.5 rounded">
                                        Custom
                                      </span>
                                    ) : (
                                      <span className="text-[9px] bg-slate-100 text-slate-500 font-medium px-1.5 py-0.5 rounded">
                                        Κεντρική
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-mono block">
                                    ID: #{sec.id}
                                  </span>
                                </div>
                              </div>

                              {/* Right toggle controls */}
                              <div className="flex items-center space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => updateSection(sec.id, { visible: !sec.visible })}
                                  title={sec.visible ? "Απόκρυψη" : "Εμφάνιση"}
                                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                    sec.visible 
                                      ? 'border-brand/20 bg-brand/5 text-brand hover:bg-brand/10' 
                                      : 'border-slate-300 bg-slate-100 text-slate-400 hover:bg-slate-200'
                                  }`}
                                >
                                  {sec.visible ? (
                                    <Eye className="h-4 w-4" />
                                  ) : (
                                    <EyeOff className="h-4 w-4" />
                                  )}
                                </button>

                                {sec.isCustom && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε τη σελίδα "${sec.label}";`)) {
                                        deleteSection(sec.id);
                                      }
                                    }}
                                    title="Διαγραφή Σελίδας"
                                    className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Section content quick edit toggler */}
                            <div className="mt-3 pt-3 border-t border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                                Επεξεργασία Τίτλων & Επικεφαλίδων
                              </span>
                              <div className="space-y-2.5">
                                <div>
                                  <label className="text-[10px] text-slate-500 font-bold block mb-1">
                                    Όνομα στο Μενού (Menu Label):
                                  </label>
                                  <input
                                    type="text"
                                    value={sec.label}
                                    onChange={(e) => updateSection(sec.id, { label: e.target.value })}
                                    className="w-full text-xs p-2 border border-warm-border rounded bg-slate-50 focus:bg-white focus:outline-brand"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-500 font-bold block mb-1">
                                    Κύριος Τίτλος (Section Title):
                                  </label>
                                  <input
                                    type="text"
                                    value={sec.title}
                                    onChange={(e) => updateSection(sec.id, { title: e.target.value })}
                                    className="w-full text-xs p-2 border border-warm-border rounded bg-slate-50 focus:bg-white focus:outline-brand"
                                  />
                                </div>
                                {sec.sub !== undefined && (
                                  <div>
                                    <label className="text-[10px] text-slate-500 font-bold block mb-1">
                                      Υπότιτλος/Περιγραφή (Subtitle/Description):
                                    </label>
                                    <textarea
                                      value={sec.sub}
                                      onChange={(e) => updateSection(sec.id, { sub: e.target.value })}
                                      rows={2}
                                      className="w-full text-xs p-2 border border-warm-border rounded bg-slate-50 focus:bg-white focus:outline-brand resize-y"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add Custom Page Form */}
                    <div className="bg-slate-50 border border-warm-border rounded-xl p-5 mt-6 text-left space-y-4">
                      <div className="flex items-center space-x-1.5 border-b border-warm-border pb-2.5">
                        <Sparkles className="h-4 w-4 text-brand-dark" />
                        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                          Προσθήκη Νέας Σελίδας
                        </h3>
                      </div>

                      <form onSubmit={handleAddCustomPage} className="space-y-3 text-xs">
                        <div>
                          <label className="font-bold text-slate-600 block mb-1">
                            Όνομα στο Μενού (π.χ. Breakfast): *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="π.χ. Πρωινό"
                            value={customPageLabel}
                            onChange={(e) => setCustomPageLabel(e.target.value)}
                            className="w-full p-2.5 border border-warm-border rounded bg-white"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-600 block mb-1">
                            Κύριος Τίτλος Σελίδας: *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="π.χ. Το Παραδοσιακό Ελληνικό Πρωινό Μας"
                            value={customPageTitle}
                            onChange={(e) => setCustomPageTitle(e.target.value)}
                            className="w-full p-2.5 border border-warm-border rounded bg-white"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-600 block mb-1">
                            Υπότιτλος:
                          </label>
                          <input
                            type="text"
                            placeholder="π.χ. Βιολογικά προϊόντα από τον κήπο μας"
                            value={customPageSub}
                            onChange={(e) => setCustomPageSub(e.target.value)}
                            className="w-full p-2.5 border border-warm-border rounded bg-white"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-600 block mb-1">
                            Κύριο Κείμενο & Περιεχόμενο:
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Γράψτε αναλυτικές πληροφορίες για αυτήν τη σελίδα..."
                            value={customPageContent}
                            onChange={(e) => setCustomPageContent(e.target.value)}
                            className="w-full p-2.5 border border-warm-border rounded bg-white resize-y"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-600 block mb-1">
                            Σύνδεσμος Εικόνας (Image URL):
                          </label>
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/..."
                            value={customPageImageUrl}
                            onChange={(e) => setCustomPageImageUrl(e.target.value)}
                            className="w-full p-2.5 border border-warm-border rounded bg-white"
                          />
                          <span className="text-[10px] text-slate-400 block mt-1">
                            Αφήστε κενό για αυτόματη λήψη προεπιλεγμένης εικόνας Unsplash.
                          </span>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-brand hover:bg-brand-dark text-white font-bold p-3 rounded transition-colors text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center space-x-1.5 mt-4"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Δημιουργία Νέας Σελίδας</span>
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* 1. Tab: Visual Customizations & Basic Info */}
                {activeTab === 'content' && (
                  <div className="space-y-6 text-left">
                    
                    {/* Presets Grid */}
                    <div className="space-y-3">
                      <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider flex items-center space-x-1">
                        <Palette className="h-3.5 w-3.5 text-brand" />
                        <span>Visual Theme Palette Presets (Χρώματα)</span>
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {colorPresets.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => handleApplyPreset(preset)}
                            className={`p-3 rounded border text-left text-xs transition-colors flex flex-col justify-between cursor-pointer group ${
                              themeSettings.brandColor === preset.brandColor
                                ? 'border-brand bg-warm-bg'
                                : 'border-warm-border hover:border-brand/40 bg-white'
                            }`}
                          >
                            <span className="font-bold text-slate-800">{preset.nameEl}</span>
                            <span className="text-[9px] text-slate-400 font-mono mb-2">{preset.name}</span>
                            <div className="flex space-x-1.5 pt-1">
                              <span
                                className="h-3 w-3 rounded-full border border-slate-300"
                                style={{ backgroundColor: preset.brandColor }}
                              />
                              <span
                                className="h-3 w-3 rounded-full border border-slate-300"
                                style={{ backgroundColor: preset.accentGoldColor }}
                              />
                              <span
                                className="h-3 w-3 rounded-full border border-slate-300"
                                style={{ backgroundColor: preset.warmBgColor }}
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Background Pattern Selectors */}
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider flex items-center space-x-1">
                        <LayoutGrid className="h-3.5 w-3.5 text-brand" />
                        <span>Background Pattern Designs (Φόντο & Σχέδια)</span>
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'dots', label: 'Dots (Τελείες)' },
                          { id: 'grid', label: 'Grid (Πλέγμα)' },
                          { id: 'waves', label: 'Waves (Κύματα)' },
                          { id: 'stripes', label: 'Stripes (Ρίγες)' },
                          { id: 'tiles', label: 'Tiles (Σχέδια/Πλακάκια)' },
                          { id: 'meander', label: 'Meander (Μαίανδρος)' },
                          { id: 'clean', label: 'No Pattern (Καθαρό)' }
                        ].map((pat) => (
                          <button
                            key={pat.id}
                            type="button"
                            onClick={() => updateThemeSettings({ selectedPattern: pat.id as any })}
                            className={`p-2 rounded border text-center text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                              themeSettings.selectedPattern === pat.id
                                ? 'border-brand bg-brand text-white shadow-sm'
                                : 'border-warm-border hover:border-brand bg-white text-slate-600'
                            }`}
                          >
                            {pat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Color Pickers */}
                    <div className="bg-slate-50 border border-warm-border rounded-xl p-4 space-y-4 text-left">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center space-x-1">
                        <Palette className="h-3.5 w-3.5 text-brand" />
                        <span>Εξατομίκευση Χρωμάτων (Custom Hex & Color Picker)</span>
                      </span>
                      
                      <div className="grid grid-cols-2 gap-3.5 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Κύριο Χρώμα (Brand Color):</label>
                          <div className="flex items-center space-x-1.5">
                            <input
                              type="color"
                              value={themeSettings.brandColor}
                              onChange={(e) => updateThemeSettings({ brandColor: e.target.value })}
                              className="w-8 h-8 rounded border border-warm-border cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={themeSettings.brandColor}
                              onChange={(e) => updateThemeSettings({ brandColor: e.target.value })}
                              className="w-full text-[11px] p-2 border border-warm-border rounded bg-white font-mono text-slate-800"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Χρώμα Brand Light:</label>
                          <div className="flex items-center space-x-1.5">
                            <input
                              type="color"
                              value={themeSettings.brandLight || '#A5D7D2'}
                              onChange={(e) => updateThemeSettings({ brandLight: e.target.value })}
                              className="w-8 h-8 rounded border border-warm-border cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={themeSettings.brandLight || '#A5D7D2'}
                              onChange={(e) => updateThemeSettings({ brandLight: e.target.value })}
                              className="w-full text-[11px] p-2 border border-warm-border rounded bg-white font-mono text-slate-800"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Χρώμα Brand Dark:</label>
                          <div className="flex items-center space-x-1.5">
                            <input
                              type="color"
                              value={themeSettings.brandDark || '#3D6663'}
                              onChange={(e) => updateThemeSettings({ brandDark: e.target.value })}
                              className="w-8 h-8 rounded border border-warm-border cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={themeSettings.brandDark || '#3D6663'}
                              onChange={(e) => updateThemeSettings({ brandDark: e.target.value })}
                              className="w-full text-[11px] p-2 border border-warm-border rounded bg-white font-mono text-slate-800"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Φόντο (Warm Bg Color):</label>
                          <div className="flex items-center space-x-1.5">
                            <input
                              type="color"
                              value={themeSettings.warmBgColor}
                              onChange={(e) => updateThemeSettings({ warmBgColor: e.target.value })}
                              className="w-8 h-8 rounded border border-warm-border cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={themeSettings.warmBgColor}
                              onChange={(e) => updateThemeSettings({ warmBgColor: e.target.value })}
                              className="w-full text-[11px] p-2 border border-warm-border rounded bg-white font-mono text-slate-800"
                            />
                          </div>
                        </div>

                        <div className="col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Χρυσό Accent (Accent Gold Colors):</label>
                          <div className="flex items-center space-x-1.5">
                            <input
                              type="color"
                              value={themeSettings.accentGoldColor}
                              onChange={(e) => updateThemeSettings({ accentGoldColor: e.target.value })}
                              className="w-8 h-8 rounded border border-warm-border cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={themeSettings.accentGoldColor}
                              onChange={(e) => updateThemeSettings({ accentGoldColor: e.target.value })}
                              className="w-full text-[11px] p-2 border border-warm-border rounded bg-white font-mono text-slate-800"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Background Pattern Controls & Textures */}
                    <div className="bg-slate-50 border border-warm-border rounded-xl p-4 space-y-4 text-left">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center space-x-1">
                        <Layers className="h-3.5 w-3.5 text-brand" />
                        <span>Υφές & Διαφάνεια Σχεδίων (Textures & Opacity)</span>
                      </span>

                      <div className="space-y-4 text-xs">
                        {themeSettings.selectedPattern !== 'clean' && (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-[10px] font-bold text-slate-500 block">Διαφάνεια Μοτίβου / Σχεδίου: {(themeSettings.patternOpacity !== undefined ? themeSettings.patternOpacity : 40)}%</label>
                            </div>
                            <input
                              type="range"
                              min="5"
                              max="100"
                              step="5"
                              value={(themeSettings.patternOpacity !== undefined ? themeSettings.patternOpacity : 40)}
                              onChange={(e) => updateThemeSettings({ patternOpacity: parseInt(e.target.value) })}
                              className="w-full accent-brand h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                            />
                          </div>
                        )}

                        <div className="border-t border-warm-border/60 pt-3 space-y-2.5">
                          <span className="font-bold text-slate-700 block text-[10px] uppercase tracking-wider">Ψηφιακή Υφή / Ανάγλυφο Φόντου (Tactile Texture)</span>
                          
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'grain', label: 'Άμμος (Grain/Sand)' },
                              { id: 'linen', label: 'Λινό (Greek Linen)' },
                              { id: 'plaster', label: 'Σοβάς (Aegean Plaster)' },
                              { id: 'none', label: 'Χωρίς Υφή (No Texture)' },
                            ].map((tex) => {
                              const isSelected = (themeSettings.selectedTexture || (themeSettings.useGrainTexture !== false ? 'grain' : 'none')) === tex.id;
                              return (
                                <button
                                  key={tex.id}
                                  type="button"
                                  onClick={() => {
                                    updateThemeSettings({
                                      selectedTexture: tex.id as any,
                                      useGrainTexture: tex.id !== 'none'
                                    });
                                  }}
                                  className={`p-2 text-[10px] font-bold border rounded text-center cursor-pointer transition-colors ${
                                    isSelected
                                      ? 'border-brand bg-brand/5 text-brand text-brand-dark'
                                      : 'border-warm-border hover:border-brand bg-white text-slate-600'
                                  }`}
                                >
                                  {tex.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {(themeSettings.selectedTexture !== 'none' && themeSettings.useGrainTexture !== false) && (
                          <div className="border-t border-warm-border/60 pt-3">
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-[10px] font-bold text-slate-500 block">Ένταση & Διαφάνεια Υφής (Texture Intensity): {(themeSettings.textureOpacity !== undefined ? themeSettings.textureOpacity : 6)}%</label>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="20"
                              step="1"
                              value={(themeSettings.textureOpacity !== undefined ? themeSettings.textureOpacity : 6)}
                              onChange={(e) => updateThemeSettings({ textureOpacity: parseInt(e.target.value) })}
                              className="w-full accent-brand h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                            />
                            <p className="text-[9px] text-slate-400 mt-1 italic font-sans leading-relaxed">
                              Μικρές τιμές (2% έως 8%) προσφέρουν το πιο κομψό, σοφιστικέ αποτέλεσμα.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Integrated Map & Real Location Settings */}
                    <div className="bg-slate-50 border border-warm-border rounded-xl p-4 space-y-4 text-left">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center space-x-1">
                        <MapPin className="h-3.5 w-3.5 text-brand" />
                        <span>Ρυθμίσεις Χάρτη & Πραγματικής Τοποθεσίας (Google Map Settings)</span>
                      </span>

                      <div className="space-y-3 text-xs text-left">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Google Maps Embed URL (iframe src):</label>
                          <textarea
                            rows={3}
                            value={siteSettings.mapIframeUrl || ""}
                            onChange={(e) => updateSiteSettings({ mapIframeUrl: e.target.value })}
                            placeholder="Επικολλήστε το src του Google Maps iframe..."
                            className="w-full text-xs p-2.5 border border-warm-border rounded focus:outline-none focus:border-brand bg-white font-mono text-slate-800"
                          />
                          <span className="text-[9px] text-slate-400 block mt-1">
                            Μπορείτε να πάρετε αυτόν τον σύνδεσμο από το Google Maps &quot;Κοινοποίηση &gt; Ενσωμάτωση χάρτη&quot;.
                          </span>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Σύνδεσμος Οδηγιών (Directions Link):</label>
                          <input
                            type="text"
                            value={siteSettings.googleMapsLink || ""}
                            onChange={(e) => updateSiteSettings({ googleMapsLink: e.target.value })}
                            placeholder="https://maps.google.com/?q=..."
                            className="w-full text-xs p-2.5 border border-warm-border rounded focus:outline-none focus:border-brand bg-white font-mono text-slate-800"
                          />
                        </div>

                        <div className="flex items-center justify-between border-t border-warm-border/60 pt-3">
                          <div>
                            <span className="font-bold text-slate-700 block">Προεπιλογή Διαδραστικού Χάρτη Google</span>
                            <span className="text-[10px] text-slate-450 font-sans">Εμφανίζει απευθείας τον πραγματικό χάρτη Google με πινέζα</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={!!siteSettings.useRealMap}
                              onChange={(e) => updateSiteSettings({ useRealMap: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand font-bold"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <hr className="border-warm-border/60" />

                    {/* Site Information Inputs */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-slate-800 border-b border-warm-border/50 pb-1.5">
                        Site Meta Data Constants
                      </h3>
                      
                      <div className="space-y-3.5">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Accommodation Brand Name</label>
                          <input
                            type="text"
                            value={siteSettings.siteName}
                            onChange={(e) => updateSiteSettings({ siteName: e.target.value })}
                            className="w-full text-xs p-2.5 border border-warm-border rounded focus:outline-none focus:border-brand bg-white font-sans text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Contact Phone Number</label>
                          <input
                            type="text"
                            value={siteSettings.sitePhone}
                            onChange={(e) => updateSiteSettings({ sitePhone: e.target.value })}
                            className="w-full text-xs p-2.5 border border-warm-border rounded focus:outline-none focus:border-brand bg-white font-mono text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Contact Email Address</label>
                          <input
                            type="email"
                            value={siteSettings.siteEmail}
                            onChange={(e) => updateSiteSettings({ siteEmail: e.target.value })}
                            className="w-full text-xs p-2.5 border border-warm-border rounded focus:outline-none focus:border-brand bg-white font-mono text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">HQ Address Location</label>
                          <input
                            type="text"
                            value={siteSettings.siteAddress}
                            onChange={(e) => updateSiteSettings({ siteAddress: e.target.value })}
                            className="w-full text-xs p-2.5 border border-warm-border rounded focus:outline-none focus:border-brand bg-white font-sans text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Main Hero Title Text</label>
                          <input
                            type="text"
                            value={siteSettings.heroTitle}
                            onChange={(e) => updateSiteSettings({ heroTitle: e.target.value })}
                            className="w-full text-xs p-2.5 border border-warm-border rounded focus:outline-none focus:border-brand bg-white font-sans text-slate-800 uppercase tracking-wider"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Hero Subtitle / Description</label>
                          <textarea
                            value={siteSettings.heroSub}
                            onChange={(e) => updateSiteSettings({ heroSub: e.target.value })}
                            rows={3}
                            className="w-full text-xs p-2.5 border border-warm-border rounded focus:outline-none focus:border-brand bg-white font-sans text-slate-800 leading-normal"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">About Us Title</label>
                          <input
                            type="text"
                            value={siteSettings.aboutTitle}
                            onChange={(e) => updateSiteSettings({ aboutTitle: e.target.value })}
                            className="w-full text-xs p-2.5 border border-warm-border rounded focus:outline-none focus:border-brand bg-white font-sans text-slate-800 uppercase"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">About Us Subtitle</label>
                          <input
                            type="text"
                            value={siteSettings.aboutSub}
                            onChange={(e) => updateSiteSettings({ aboutSub: e.target.value })}
                            className="w-full text-xs p-2.5 border border-warm-border rounded focus:outline-none focus:border-brand bg-white font-serif text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">About Content - Para 1</label>
                          <textarea
                            value={siteSettings.aboutContent1}
                            onChange={(e) => updateSiteSettings({ aboutContent1: e.target.value })}
                            rows={4}
                            className="w-full text-xs p-2.5 border border-warm-border rounded focus:outline-none focus:border-brand bg-white font-sans text-slate-800 leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">About Content - Para 2</label>
                          <textarea
                            value={siteSettings.aboutContent2}
                            onChange={(e) => updateSiteSettings({ aboutContent2: e.target.value })}
                            rows={4}
                            className="w-full text-xs p-2.5 border border-warm-border rounded focus:outline-none focus:border-brand bg-white font-sans text-slate-800 leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Guest Testimonials / Reviews Category Administration */}
                    <div className="space-y-4 pt-4 border-t border-warm-border/60">
                      <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-slate-800 border-b border-warm-border/50 pb-1.5 text-left">
                        Διαχείριση Κριτικών (Manage Guest Testimonials)
                      </h3>

                      {/* Add New Review form */}
                      <form onSubmit={handleAddReviewSubmit} className="bg-slate-50 border border-warm-border rounded-xl p-4 space-y-3 text-left">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center space-x-1 mb-1">
                          <Plus className="h-3.5 w-3.5 text-brand" />
                          <span>Προσθήκη Νέας Κριτικής</span>
                        </span>

                        <div className="text-xs space-y-2.5">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Όνομα Επισκέπτη & Χώρα / Origin</label>
                            <input
                              type="text"
                              value={newReview.guest}
                              onChange={(e) => setNewReview({ ...newReview, guest: e.target.value })}
                              placeholder="π.χ. Γιώργος Μ. (Ελλάδα)"
                              className="w-full text-xs p-2.5 border border-warm-border rounded focus:outline-none focus:border-brand bg-white text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Ημερομηνία / Μήνας Διαμονής</label>
                            <input
                              type="text"
                              value={newReview.date}
                              onChange={(e) => setNewReview({ ...newReview, date: e.target.value })}
                              placeholder="π.χ. Ιούλιος 2026"
                              className="w-full text-xs p-2.5 border border-warm-border rounded focus:outline-none focus:border-brand bg-white text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Βαθμολογία (Αστέρια): {newReview.score} ★</label>
                            <select
                              value={newReview.score}
                              onChange={(e) => setNewReview({ ...newReview, score: parseInt(e.target.value) })}
                              className="w-full text-xs p-2.5 border border-warm-border rounded focus:outline-none focus:border-brand bg-white text-slate-800"
                            >
                              <option value="5">5 / 5 ★ Excellent</option>
                              <option value="4">4 / 5 ★ Great</option>
                              <option value="3">3 / 5 ★ Average</option>
                              <option value="2">2 / 5 ★ Poor</option>
                              <option value="1">1 / 5 ★ Terrible</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Κείμενο Σχολίου / Κριτικής</label>
                            <textarea
                              rows={3}
                              value={newReview.text}
                              onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                              placeholder="Γράψτε εδώ την εμπειρία του επισκέπτη..."
                              className="w-full text-xs p-2.5 border border-warm-border rounded focus:outline-none focus:border-brand bg-white text-slate-800 leading-normal"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-brand hover:bg-brand-dark text-white font-bold p-3 rounded transition-colors text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center space-x-1.5 mt-2"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Προσθήκη Κριτικής</span>
                          </button>
                        </div>
                      </form>

                      {/* List custom reviews */}
                      {(siteSettings.customReviews || []).length > 0 && (
                        <div className="space-y-2 mt-4 text-left">
                          <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Προσαρμοσμένες Κριτικές ({siteSettings.customReviews.length})</span>
                          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                            {siteSettings.customReviews.map((rev: any) => (
                              <div key={rev.id} className="p-3 bg-white border border-warm-border rounded-lg flex items-start justify-between gap-4 text-xs">
                                <div>
                                  <div className="flex items-center space-x-1.5">
                                    <span className="font-bold text-slate-800">{rev.guest}</span>
                                    <span className="text-[10px] text-slate-400 font-mono">({rev.date})</span>
                                  </div>
                                  <div className="flex py-0.5 text-amber-400 text-[10px]">
                                    {Array.from({ length: rev.score }).map((_, i) => (
                                      <Star key={i} className="h-3 w-3 fill-current" />
                                    ))}
                                  </div>
                                  <p className="text-slate-600 font-serif leading-relaxed mt-1 text-[11px] italic">{rev.text}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteReview(rev.id)}
                                  className="text-[10px] text-red-500 font-bold hover:text-red-700 hover:underline shrink-0 cursor-pointer"
                                >
                                  Διαγραφή
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* --- PAYMENT METHOD CUSTOMIZATION --- */}
                    <div className="border-t border-slate-700/55 pt-5 space-y-4 text-left">
                      <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider flex items-center space-x-1.5">
                        <DollarSign className="h-4 w-4" />
                        <span>Στοιχεία Πληρωμών / Payment Config</span>
                      </span>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        Προσαρμόστε τους λογαριασμούς τραπέζης, το IBAN, καθώς και τις πληροφορίες για πληρωμή με κάρτα ή κατά την άφιξη.
                      </p>

                      <div className="space-y-3 bg-slate-800/40 border border-slate-700 p-3.5 rounded-xl font-sans text-xs">
                        {/* Bank Details */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-300 block uppercase">Στοιχεία Τραπεζικής Κατάθεσης</label>
                          <input
                            type="text"
                            placeholder="Όνομα Τράπεζας (π.χ. Alpha Bank)"
                            value={siteSettings.payment_bank_name || ''}
                            onChange={(e) => updateSiteSettings({ payment_bank_name: e.target.value })}
                            className="w-full text-xs p-2.5 border border-slate-700 rounded bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-light"
                          />
                          <input
                            type="text"
                            placeholder="IBAN Λογαριασμού"
                            value={siteSettings.payment_bank_iban || ''}
                            onChange={(e) => updateSiteSettings({ payment_bank_iban: e.target.value })}
                            className="w-full text-xs p-2.5 border border-slate-700 rounded bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-light"
                          />
                          <input
                            type="text"
                            placeholder="Όνομα Δικαιούχου"
                            value={siteSettings.payment_bank_holder || ''}
                            onChange={(e) => updateSiteSettings({ payment_bank_holder: e.target.value })}
                            className="w-full text-xs p-2.5 border border-slate-700 rounded bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-light"
                          />
                          <textarea
                            rows={2}
                            placeholder="Οδηγίες Κατάθεσης (π.χ. Καταθέστε 30%...)"
                            value={siteSettings.payment_bank_instructions || ''}
                            onChange={(e) => updateSiteSettings({ payment_bank_instructions: e.target.value })}
                            className="w-full text-xs p-2.5 border border-slate-700 rounded bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-light font-sans"
                          />
                        </div>

                        {/* On Arrival Notes */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-700/50">
                          <label className="text-[10px] font-bold text-slate-300 block uppercase">Πληρωμή κατά την Άφιξη</label>
                          <textarea
                            rows={2}
                            placeholder="Οδηγίες Πληρωμής στην Άφιξη (π.χ. Δεν απαιτείται προκαταβολή...)"
                            value={siteSettings.payment_arrival_instructions || ''}
                            onChange={(e) => updateSiteSettings({ payment_arrival_instructions: e.target.value })}
                            className="w-full text-xs p-2.5 border border-slate-700 rounded bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-light"
                          />
                        </div>

                        {/* Card Notes */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-700/50">
                          <label className="text-[10px] font-bold text-slate-300 block uppercase">Πληρωμή με Κάρτα (Simulated)</label>
                          <textarea
                            rows={1}
                            placeholder="Λεκτικό Κάρτας (π.χ. Ασφαλής Πληρωμή...)"
                            value={siteSettings.payment_card_instructions || ''}
                            onChange={(e) => updateSiteSettings({ payment_card_instructions: e.target.value })}
                            className="w-full text-xs p-2.5 border border-slate-700 rounded bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-light"
                          />
                        </div>
                      </div>
                    </div>

                    {/* --- EMAILJS INTEGRATION --- */}
                    <div className="border-t border-slate-700/55 pt-5 space-y-4 text-left">
                      <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider flex items-center space-x-1.5">
                        <Mail className="h-4 w-4" />
                        <span>EmailJS Integration (Ειδοποιήσεις Email)</span>
                      </span>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        Συνδέστε το EmailJS για να λαμβάνετε αυτόματα email ειδοποιήσεις όταν κάποιος επισκέπτης ολοκληρώνει μια κράτηση!
                      </p>

                      <div className="space-y-3 bg-slate-800/40 border border-slate-700 p-3.5 rounded-xl font-sans text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Ενεργοποίηση EmailJS</span>
                          <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={!!siteSettings.emailjs_enabled}
                              onChange={(e) => updateSiteSettings({ emailjs_enabled: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                          </label>
                        </div>

                        {siteSettings.emailjs_enabled && (
                          <div className="space-y-2 pt-2 border-t border-slate-700/40">
                            <div>
                              <label className="text-[9px] font-medium text-slate-400 block mb-0.5">Service ID</label>
                              <input
                                type="text"
                                placeholder="Service ID (service_xxxxx)"
                                value={siteSettings.emailjs_service_id || ''}
                                onChange={(e) => updateSiteSettings({ emailjs_service_id: e.target.value })}
                                className="w-full text-xs p-2 border border-slate-700 rounded bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-light"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-medium text-slate-400 block mb-0.5">Template ID</label>
                              <input
                                type="text"
                                placeholder="Template ID (template_xxxxx)"
                                value={siteSettings.emailjs_template_id || ''}
                                onChange={(e) => updateSiteSettings({ emailjs_template_id: e.target.value })}
                                className="w-full text-xs p-2 border border-slate-700 rounded bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-light"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-medium text-slate-400 block mb-0.5">Public Key (User ID)</label>
                              <input
                                type="text"
                                placeholder="Public Key"
                                value={siteSettings.emailjs_public_key || ''}
                                onChange={(e) => updateSiteSettings({ emailjs_public_key: e.target.value })}
                                className="w-full text-xs p-2 border border-slate-700 rounded bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-light"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-medium text-slate-400 block mb-0.5">Email Παραλήπτη (Ενημέρωσης)</label>
                              <input
                                type="email"
                                placeholder="Email παραλήπτη (π.χ. info@saltsea.gr)"
                                value={siteSettings.emailjs_to_email || ''}
                                onChange={(e) => updateSiteSettings({ emailjs_to_email: e.target.value })}
                                className="w-full text-xs p-2 border border-slate-700 rounded bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-light"
                              />
                            </div>
                            <div className="p-2.5 bg-slate-900/65 rounded border border-slate-750 text-[10px] text-slate-400 leading-normal font-mono space-y-1">
                              <p className="font-bold text-slate-300 text-[9px] uppercase">Διαθέσιμες Μεταβλητές (Variables):</p>
                              <div>• <span className="text-brand-light">{"{{booking_id}}"}</span> - Κωδικός κράτησης</div>
                              <div>• <span className="text-brand-light">{"{{guest_name}}"}</span> - Όνομα επισκέπτη</div>
                              <div>• <span className="text-brand-light">{"{{guest_email}}"}</span> - Email επισκέπτη</div>
                              <div>• <span className="text-brand-light">{"{{room_name}}"}</span> - Όνομα δωματίου</div>
                              <div>• <span className="text-brand-light">{"{{check_in}}"}</span> - Άφιξη</div>
                              <div>• <span className="text-brand-light">{"{{check_out}}"}</span> - Αναχώρηση</div>
                              <div>• <span className="text-brand-light">{"{{total_price}}"}</span> - Συνολικό ποσό</div>
                              <div>• <span className="text-brand-light">{"{{payment_method}}"}</span> - Τρόπος πληρωμής</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* --- ADMIN ACCESS PASSCODE CONFIG --- */}
                    <div className="border-t border-slate-700/55 pt-5 space-y-4 text-left pb-4">
                      <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider flex items-center space-x-1.5">
                        <Lock className="h-4 w-4" />
                        <span>Κωδικός Ασφαλείας Διαχειριστή / Passcode</span>
                      </span>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        Προστατέψτε το site σας από μη εξουσιοδοτημένες αλλαγές. Αλλάξτε τον κωδικό που ζητείται όταν ανοίγει το ?edit=true.
                      </p>

                      <div className="space-y-2 bg-slate-800/40 border border-slate-700 p-3.5 rounded-xl font-sans text-xs">
                        <label className="text-[10px] font-bold text-slate-300 block uppercase">Κωδικός Πρόσβασης (Passcode)</label>
                        <input
                          type="text"
                          placeholder="Εισάγετε νέο κωδικό πρόσβασης (π.χ. rooms2026)"
                          value={siteSettings.adminPasscode || ''}
                          onChange={(e) => updateSiteSettings({ adminPasscode: e.target.value })}
                          className="w-full text-xs p-2 border border-slate-700 rounded bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-light"
                        />
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-[9px] text-slate-500 font-mono">Default: rooms2026</span>
                          <button
                            type="button"
                            onClick={() => {
                              localStorage.removeItem('salt_sea_admin_authenticated');
                              window.location.reload();
                            }}
                            className="bg-red-950/40 hover:bg-red-950 border border-red-900/60 text-red-400 text-[9px] uppercase tracking-wider font-bold py-1 px-2.5 rounded transition-colors cursor-pointer"
                          >
                            Κλείδωμα / Lock Editor
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Tab: Suite & Rooms Administration */}
                {activeTab === 'rooms' && (
                  <div className="space-y-6 text-left">
                    
                    {/* List Existing Rooms */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-slate-800 border-b border-warm-border/50 pb-1.5 flex justify-between items-center">
                        <span>Active Suites & Rooms</span>
                        <span className="text-[10px] font-mono bg-slate-150 px-2 py-0.5 rounded text-slate-500">{rooms.length} Units</span>
                      </h3>
                      
                      <div className="space-y-4">
                        {rooms.map((room) => (
                          <div key={room.id} className="p-4 rounded border border-warm-border bg-slate-50 relative space-y-3 shadow-2xs">
                            <button
                              onClick={() => deleteRoom(room.id)}
                              className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer hover:bg-white rounded border border-transparent hover:border-red-100"
                              title="Delete Room Listing"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                            <div className="flex gap-3">
                              <img
                                src={room.imageUrl}
                                alt={room.name}
                                className="w-16 h-16 rounded object-cover border border-warm-border/50 shrink-0"
                              />
                              <div>
                                <span className="text-[8px] uppercase tracking-widest font-extrabold text-brand bg-white px-1.5 py-0.5 rounded border border-warm-border">
                                  {room.type} Suite
                                </span>
                                <h4 className="font-serif font-bold text-xs text-slate-800 mt-1 uppercase">
                                  {room.name}
                                </h4>
                                <span className="text-[10px] font-bold text-slate-500 block">
                                  €{room.pricePerNight} / Night • Size: {room.size} ({room.capacity} Guests Max)
                                </span>
                              </div>
                            </div>

                            {/* Editing Inputs for existing room */}
                            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                              <div>
                                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Room Title</label>
                                <input
                                  type="text"
                                  value={room.name}
                                  onChange={(e) => updateRoom(room.id, { ...room, name: e.target.value })}
                                  className="w-full text-xs p-1.5 border border-warm-border rounded bg-white text-slate-800"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Price / Night (€)</label>
                                <input
                                  type="number"
                                  value={room.pricePerNight}
                                  onChange={(e) => updateRoom(room.id, { ...room, pricePerNight: Number(e.target.value) })}
                                  className="w-full text-xs p-1.5 border border-warm-border rounded bg-white font-mono text-slate-800"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Capacity (Guests)</label>
                                <input
                                  type="number"
                                  value={room.capacity}
                                  onChange={(e) => updateRoom(room.id, { ...room, capacity: Number(e.target.value) })}
                                  className="w-full text-xs p-1.5 border border-warm-border rounded bg-white font-mono text-slate-800"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Photo URL</label>
                                <input
                                  type="text"
                                  value={room.imageUrl}
                                  onChange={(e) => updateRoom(room.id, { ...room, imageUrl: e.target.value })}
                                  className="w-full text-xs p-1.5 border border-warm-border rounded bg-white text-slate-800 text-ellipsis overflow-hidden"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add New Room Form */}
                    <form onSubmit={handleAddRoomSubmit} className="p-4 rounded border border-brand/20 bg-warm-bg/35 space-y-3.5 text-left transition-all">
                      <span className="text-[10px] uppercase font-bold text-brand tracking-widest flex items-center space-x-1.5 border-b border-brand/20 pb-1.5">
                        <Plus className="h-4 w-4" />
                        <span>Create New Room Suite</span>
                      </span>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Suite Name (Greek / English)</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Sarti Horizon Deluxe Double"
                            value={newRoom.name}
                            onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                            className="w-full text-xs p-2 border border-warm-border rounded bg-white text-slate-800"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Suite Type</label>
                            <select
                              value={newRoom.type}
                              onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value as any })}
                              className="w-full text-xs p-2 border border-warm-border rounded bg-white text-slate-800"
                            >
                              <option value="double">Double Room</option>
                              <option value="triple">Triple Studio</option>
                              <option value="quadruple">Quadruple Family</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Price Per Night (€)</label>
                            <input
                              type="number"
                              required
                              min="1"
                              value={newRoom.pricePerNight}
                              onChange={(e) => setNewRoom({ ...newRoom, pricePerNight: Number(e.target.value) })}
                              className="w-full text-xs p-2 border border-warm-border rounded bg-white font-mono text-slate-800"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Size Label</label>
                            <input
                              type="text"
                              value={newRoom.size}
                              onChange={(e) => setNewRoom({ ...newRoom, size: e.target.value })}
                              className="w-full text-xs p-2 border border-warm-border rounded bg-white text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Bedding Config Description</label>
                            <input
                              type="text"
                              value={newRoom.bedType}
                              onChange={(e) => setNewRoom({ ...newRoom, bedType: e.target.value })}
                              className="w-full text-xs p-2 border border-warm-border rounded bg-white text-slate-800"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Description Summary</label>
                          <textarea
                            placeholder="A Cycladic masterpiece offering pristine..."
                            value={newRoom.description}
                            onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                            rows={2}
                            className="w-full text-xs p-2 border border-warm-border rounded bg-white text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Image Link URL</label>
                          <input
                            type="text"
                            value={newRoom.imageUrl}
                            onChange={(e) => setNewRoom({ ...newRoom, imageUrl: e.target.value })}
                            className="w-full text-xs p-2 border border-warm-border rounded bg-white text-slate-800"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-brand hover:bg-brand-dark text-white font-sans text-[10px] font-bold uppercase tracking-widest py-2 rounded cursor-pointer transition-colors mt-2"
                      >
                        Create Suite Listing ✔
                      </button>
                    </form>
                  </div>
                )}

                {/* 3. Tab: Large Photo Gallery Editor */}
                {activeTab === 'gallery' && (
                  <div className="space-y-6 text-left font-sans">
                    
                    {/* List Existing Gallery items */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-slate-800 border-b border-warm-border/50 pb-1.5 flex justify-between items-center">
                        <span>Photo Portfolio Items</span>
                        <span className="text-[10px] font-mono bg-slate-150 px-2 py-0.5 rounded text-slate-500">{galleryItems.length} photos</span>
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-3" id="gallery-scroller-elements">
                        {galleryItems.map((item) => (
                          <div key={item.id} className="p-3 bg-slate-50 border border-warm-border rounded space-y-2 relative shadow-3xs flex flex-col justify-between">
                            <button
                              onClick={() => deleteGalleryItem(item.id)}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer bg-white rounded border border-transparent hover:border-red-100"
                              title="Delete Photo"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>

                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-24 rounded object-cover border border-warm-border/20"
                            />
                            
                            <div className="space-y-1 text-left">
                              <span className="text-[8px] uppercase tracking-widest font-extrabold text-brand bg-white px-1.5 py-0.5 rounded border border-warm-border">
                                {item.category}
                              </span>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateGalleryItem(item.id, { ...item, title: e.target.value })}
                                className="w-full text-[10px] p-1 border border-warm-border rounded bg-white text-slate-850 truncate text-left"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add Gallery Item form */}
                    <form onSubmit={handleAddGallerySubmit} className="p-4 rounded border border-brand/20 bg-warm-bg/35 space-y-3.5 text-left transition-all">
                      <span className="text-[10px] uppercase font-bold text-brand tracking-widest flex items-center space-x-1.5 border-b border-brand/20 pb-1.5">
                        <Plus className="h-4 w-4" />
                        <span>Add New Photo to Portfolio</span>
                      </span>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Photo Title Caption (e.g. Lavender Garden)</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Sunset view over Lavender beds"
                            value={newGallery.title}
                            onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                            className="w-full text-xs p-2 border border-warm-border rounded bg-white text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Filter Category</label>
                          <select
                            value={newGallery.category}
                            onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value as any })}
                            className="w-full text-xs p-2 border border-warm-border rounded bg-white text-slate-800"
                          >
                            <option value="rooms">Rooms & Interiors</option>
                            <option value="garden">Lush Garden & BBQ</option>
                            <option value="beach">Golden Beaches</option>
                            <option value="exterior">Exterior Grounds</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Image Link URL</label>
                          <input
                            type="text"
                            required
                            value={newGallery.imageUrl}
                            onChange={(e) => setNewGallery({ ...newGallery, imageUrl: e.target.value })}
                            className="w-full text-xs p-2 border border-warm-border rounded bg-white text-slate-800"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-brand hover:bg-brand-dark text-white font-sans text-[10px] font-bold uppercase tracking-widest py-2 rounded cursor-pointer transition-colors mt-2"
                      >
                        Upload Gallery Photo ✔
                      </button>
                    </form>
                  </div>
                )}

                {/* 4. Tab: Bookings occupancy calendar blocks dashboard */}
                {activeTab === 'bookings' && (
                  <div className="space-y-6 text-left font-sans">
                    
                    {/* Block/Unblock Reservation List */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-slate-800 border-b border-warm-border/50 pb-1.5 flex justify-between items-center">
                        <span>Availability & Blocked Dates List</span>
                        <span className="text-[10px] font-mono bg-slate-150 px-2 py-0.5 rounded text-slate-500">{bookings.length} reservations</span>
                      </h3>
                      
                      <p className="text-[11px] text-slate-500 leading-normal mb-1.5 text-left">
                        These reservations represent active blockages on the visual scheduler calendar. Cancel or delete any block below to immediately set those dates "Free" (free slots) instantly!
                      </p>

                      <div className="space-y-3.5">
                        {bookings.map((b) => {
                          const associatedSuite = rooms.find(r => r.id === b.roomId);
                          return (
                            <div key={b.id} className="p-3.5 bg-slate-50 border border-warm-border rounded relative flex flex-col justify-between hover:bg-white transition-colors duration-150">
                              <button
                                onClick={() => cancelBooking(b.id)}
                                className="absolute top-3.5 right-3.5 text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer bg-white/90 border border-transparent hover:border-red-100 rounded"
                                title="Release blocked dates"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>

                              <div className="space-y-1 text-left">
                                <span className={`text-[8px] uppercase tracking-widest font-extrabold px-1.5 py-0.5 rounded ${b.id.startsWith('block-') ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                  {b.id.startsWith('block-') ? 'Operator Blackout Block' : 'Guest Reservation'}
                                </span>
                                
                                <h4 className="font-serif font-bold text-xs text-slate-800 mt-1 uppercase">
                                  {b.guestName}
                                </h4>
                                
                                <div className="text-[11px] text-slate-500 font-mono space-y-0.5">
                                  <div>🏨 Suite: <strong>{associatedSuite?.name || b.roomId}</strong></div>
                                  <div>📅 Duration: <strong>{b.checkIn}</strong> to <strong>{b.checkOut}</strong></div>
                                  {b.guestEmail && <div>✉ Email: {b.guestEmail}</div>}
                                  <div>👤 Group size: {b.guestsCount} adults • Price: €{b.totalPrice}</div>
                                  {b.paymentMethod && (
                                    <div className="mt-1 leading-normal">
                                      💳 Payment: <strong className="uppercase text-slate-700 bg-slate-200/50 px-1.5 py-0.5 rounded text-[10px]">{b.paymentMethod.replace('_', ' ')}</strong>
                                      <span className="mx-1">•</span> Status: <strong className={`uppercase px-1.5 py-0.5 rounded text-[10px] ${b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>{b.status}</strong>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* operator date block form */}
                    <form onSubmit={handleCreateBlockBooking} className="p-4 rounded border border-brand/20 bg-warm-bg/35 space-y-3.5 text-left transition-all">
                      <span className="text-[10px] uppercase font-bold text-brand tracking-widest flex items-center space-x-1.5 border-b border-brand/20 pb-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>Insert Blackout Date Block (Operator Block)</span>
                      </span>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Internal Block Label / Name (e.g. Maintenance)</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Garden Refubishing Block"
                            value={newBooking.guestName}
                            onChange={(e) => setNewBooking({ ...newBooking, guestName: e.target.value })}
                            className="w-full text-xs p-2 border border-warm-border rounded bg-white text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Select Targeted Room</label>
                          <select
                            value={newBooking.roomId}
                            onChange={(e) => setNewBooking({ ...newBooking, roomId: e.target.value })}
                            className="w-full text-xs p-2 border border-warm-border rounded bg-white text-slate-800"
                          >
                            {rooms.map(r => (
                              <option key={r.id} value={r.id}>{r.name} (Capacity: {r.capacity})</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Check-In block (YYYY-MM-DD)</label>
                            <input
                              type="text"
                              required
                              placeholder="2026-07-01"
                              value={newBooking.checkIn}
                              onChange={(e) => setNewBooking({ ...newBooking, checkIn: e.target.value })}
                              className="w-full text-xs p-2 border border-warm-border rounded bg-white font-mono text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Check-Out block (YYYY-MM-DD)</label>
                            <input
                              type="text"
                              required
                              placeholder="2026-07-06"
                              value={newBooking.checkOut}
                              onChange={(e) => setNewBooking({ ...newBooking, checkOut: e.target.value })}
                              className="w-full text-xs p-2 border border-warm-border rounded bg-white font-mono text-slate-800"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-brand hover:bg-brand-dark text-white font-sans text-[10px] font-bold uppercase tracking-widest py-2 rounded cursor-pointer transition-colors mt-2"
                      >
                        Block Selected Calendar Dates ✔
                      </button>
                    </form>
                  </div>
                )}

              </div>

              {/* Permanent save helper bar */}
              <div className="bg-slate-900 border-t border-slate-800/80 px-6 py-4.5 space-y-2.5 text-left shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-white">
                    <Sparkles className="h-4 w-4 text-brand-light animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-wide">Μόνιμη Αποθήκευση για Πελάτες;</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowExportModal(true)}
                    className="px-3 py-1.5 bg-brand hover:bg-brand-dark hover:brightness-110 text-white text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer flex items-center space-x-1 shadow-md"
                  >
                    <Save className="h-3 w-3" />
                    <span>Εξαγωγή για AI</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                  Οι αλλαγές σας τώρα αποθηκεύονται τοπικά στον υπολογιστή σας. Πατήστε "Εξαγωγή για AI" για να τις στείλετε στο AI chat και να μπουν μόνιμα στη σελίδα για όλους!
                </p>
              </div>

              {/* Drawer Footer controls */}
              <div className="p-4 bg-slate-950 border-t border-warm-border/15 flex justify-between space-x-2 text-xs">
                <button
                  onClick={resetAll}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 hover:text-white rounded text-slate-300 font-bold uppercase tracking-wider transition-colors flex items-center space-x-1 cursor-pointer border border-transparent hover:border-slate-650"
                  title="Wipe custom items and boot default Greek parameters"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Επαναφορά Defaults</span>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 bg-brand hover:bg-brand-dark text-white font-bold uppercase tracking-wider rounded transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Τέλος Επεξεργασίας</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Export Modal Overlay */}
      {showExportModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-warm-border flex flex-col max-h-[85vh]">
            <div className="bg-slate-950 px-6 py-5 flex items-center justify-between text-white border-b border-warm-border/10">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-brand-light" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-100">
                  Εξαγωγή Ρυθμίσεων για τον AI Assistant
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowExportModal(false);
                  setCopiedExport(false);
                }}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4 text-left text-sm text-slate-600 leading-relaxed">
              <p>
                Οι αλλαγές που κάνατε σε <strong>χρώματα, τίτλους, δωμάτια, και εικόνες</strong> έχουν προσωρινά αποθηκευτεί στη συσκευή σας.
              </p>
              <div className="bg-brand/5 border border-brand/10 p-3.5 rounded-xl text-xs text-brand-dark space-y-1.5 font-medium">
                <p className="font-bold">💡 Πώς θα τις δουν μόνιμα όλοι οι πελάτες;</p>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-600 leading-relaxed font-normal">
                  <li>Πατήστε το κουμπί <strong>"Αντιγραφή Κώδικα"</strong> παρακάτω.</li>
                  <li>Επικολλήστε (Paste) τον κώδικα στο <strong>Chat με τον AI Assistant</strong>.</li>
                  <li>Ζητήστε του: <em>«Πέρασε αυτές τις αλλαγές μόνιμα στον κώδικα»</em>.</li>
                </ol>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider block">Κώδικας Ρυθμίσεων (JSON)</label>
                <textarea
                  readOnly
                  value={JSON.stringify({
                    siteSettings,
                    themeSettings,
                    sections,
                    rooms,
                    galleryItems
                  }, null, 2)}
                  className="w-full h-44 p-3 bg-slate-900 text-slate-200 font-mono text-[10px] rounded-xl border border-slate-800 focus:outline-none resize-none"
                  onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowExportModal(false);
                    setCopiedExport(false);
                  }}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-750 bg-slate-100 hover:bg-slate-200 transition-colors rounded cursor-pointer"
                >
                  Ακύρωση
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const payload = {
                      siteSettings,
                      themeSettings,
                      sections,
                      rooms,
                      galleryItems
                    };
                    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
                    setCopiedExport(true);
                    setTimeout(() => setCopiedExport(false), 3000);
                  }}
                  className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer flex items-center space-x-1.5 ${
                    copiedExport ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-brand hover:bg-brand-dark text-white'
                  }`}
                >
                  {copiedExport ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                  <span>{copiedExport ? 'Αντιγράφηκε!' : 'Αντιγραφή Κώδικα'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
