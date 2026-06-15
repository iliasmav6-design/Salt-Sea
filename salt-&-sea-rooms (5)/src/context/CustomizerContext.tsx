import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, GalleryItem, Booking, PageSection } from '../types';
import { ROOMS, GALLERY_ITEMS } from '../data/staticData';

export interface SiteSettings {
  siteName: string;
  sitePhone: string;
  siteEmail: string;
  siteAddress: string;
  heroTitle: string;
  heroSub: string;
  aboutTitle: string;
  aboutSub: string;
  aboutContent1: string;
  aboutContent2: string;
  heroImage?: string;
  gardenImage?: string;
  [key: string]: any;
}

export type BackgroundPatternType = 'dots' | 'grid' | 'waves' | 'stripes' | 'tiles' | 'meander' | 'clean';
export type TextureStyleType = 'grain' | 'linen' | 'plaster' | 'none';

export interface ThemeSettings {
  brandColor: string; // Tailwind: var(--color-brand)
  brandLight: string; // Tailwind: var(--color-brand-light)
  brandDark: string; // Tailwind: var(--color-brand-dark)
  warmBgColor: string; // Tailwind: var(--color-warm-bg)
  warmBorderColor: string; // Tailwind: var(--color-warm-border)
  accentGoldColor: string; // Tailwind: var(--color-accent-gold)
  selectedPattern: BackgroundPatternType;
  sansFont?: string;
  serifFont?: string;
  patternOpacity?: number;
  useGrainTexture?: boolean;
  selectedTexture?: TextureStyleType;
  textureOpacity?: number;
}

export interface EditElement {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'textarea' | 'image' | 'color' | 'font';
  placeholder?: string;
  onSave: (value: string) => void;
}

export const defaultSections: PageSection[] = [
  { id: 'home', label: 'Home', title: 'Where Salt Meets the Sweet Seaside Sun', sub: 'Relaxed luxury in a secure 4,000 m² olive tree garden. Moments away from the golden sands of Sarti.', visible: true },
  { id: 'who-we-are', label: 'Who We Are', title: 'Our Greek Sanctuary', sub: 'A multi-generational family estate born out of Greek hospitality', visible: true },
  { id: 'rooms', label: 'Rooms', title: 'Our Handcrafted Guestrooms', sub: 'Designed for rest and premium local comfort', visible: true },
  { id: 'amenities', label: 'Amenities', title: 'Our Estate Amenities', sub: 'Space & Freedom', visible: true },
  { id: 'location', label: 'Location', title: 'Unspoiled Natural Neighbors', sub: 'Sarti & Sykia Corridor', visible: true },
  { id: 'gallery', label: 'Gallery', title: 'Summer Moments', sub: 'A glimpse into our serene estate life', visible: true },
  { id: 'reviews', label: 'Reviews', title: 'What Our Guests Love', sub: 'Guest Testimonials', visible: true },
  { id: 'booking', label: 'Booking', title: 'Book Your Sarti Escape', sub: 'Secure your dates instantly for Summer 2026', visible: true },
];

interface CustomizerContextType {
  siteSettings: SiteSettings;
  updateSiteSettings: (updates: Partial<SiteSettings>) => void;
  themeSettings: ThemeSettings;
  updateThemeSettings: (updates: Partial<ThemeSettings>) => void;
  rooms: Room[];
  updateRoom: (id: string, updatedRoom: Room) => void;
  addRoom: (newRoom: Room) => void;
  deleteRoom: (id: string) => void;
  galleryItems: GalleryItem[];
  updateGalleryItem: (id: string, updatedItem: GalleryItem) => void;
  addGalleryItem: (newItem: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  resetAll: () => void;
  
  // Dynamic Page Sections / Menu builder 
  sections: PageSection[];
  updateSection: (id: string, updatedSection: Partial<PageSection>) => void;
  addSection: (newSec: PageSection) => void;
  deleteSection: (id: string) => void;
  reorderSections: (newSections: PageSection[]) => void;
  
  // Visual click-to-edit additions
  isEditingMode: boolean;
  setIsEditingMode: (val: boolean) => void;
  selectedEditElement: EditElement | null;
  setSelectedEditElement: (val: EditElement | null) => void;
}

const defaultSiteSettings: SiteSettings = {
  siteName: 'Salt & Sea Rooms',
  sitePhone: '+30 23750 99999 • +30 697 123 4567',
  siteEmail: 'info@saltandsea-rooms.com',
  siteAddress: 'Sarti-Sykia Pass, Sithonia Peninsula, Halkidiki Greece, 63072',
  heroTitle: "SITHONIA'S COZY SANCTUARY",
  heroSub: 'Relaxed luxury in a secure 4,000 m² olive tree garden. Moments away from the golden sands of Sarti.',
  aboutTitle: 'Our Greek Sanctuary',
  aboutSub: 'A multi-generational family estate born out of Greek hospitality',
  aboutContent1: 'Salt & Sea Rooms represents our lifelong devotion to Sithonia\'s breathtaking nature. Our family constructed this sanctuary with a desire to offer guests the space, silence, and comfort that central hotels simply cannot guarantee. Surrounded by 4,000 m² of vibrant pesticide-free lawn and mature olive trees, we provide an absolute Greek estate experience.',
  aboutContent2: 'Completely reimagined with fresh Cycladic-inspired warm aesthetics, premium kitchen blocks, high-speed Wi-Fi, and top-tier smart amenities. We are located exactly on the Sarti-Sykia corridor, giving you instantaneous access to the most magnificent crystal waters of Halkidiki.',
  heroImage: '/src/assets/images/salt_sea_hero_1781346599247.jpg',
  gardenImage: '/src/assets/images/salt_sea_garden_1781346628652.jpg',
  mapIframeUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12224.512683838495!2d23.978250!3d40.091944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a8f94cb026dd95%3A0xc3fbc19c004c2780!2sSalt%20%26%20Sea%20Rooms!5e0!3m2!1sel!2s!4v1716999999999!5m2!1sel!2s',
  useRealMap: true,
  googleMapsLink: 'https://maps.google.com/?q=Sarti+Sykia+Sithonia+Halkidiki',
};

const defaultThemeSettings: ThemeSettings = {
  brandColor: '#4D7E7B',
  brandLight: '#A5D7D2',
  brandDark: '#3D6663',
  warmBgColor: '#e3d0b0',
  warmBorderColor: '#E6E0D5',
  accentGoldColor: '#8C7B65',
  selectedPattern: 'dots',
  sansFont: 'Inter',
  serifFont: 'Playfair Display',
  patternOpacity: 40,
  useGrainTexture: true,
  selectedTexture: 'grain',
  textureOpacity: 6,
};

const CustomizerContext = createContext<CustomizerContextType | undefined>(undefined);

export const CustomizerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultThemeSettings);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sections, setSections] = useState<PageSection[]>([]);

  // Visual click-to-edit interactive states initialized based on query option (?edit)
  const [isEditingMode, setIsEditingMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.has('edit') || params.get('edit') === 'true';
    }
    return false;
  });
  const [selectedEditElement, setSelectedEditElement] = useState<EditElement | null>(null);

  // Load from localStorage on mount (only if in editing mode)
  useEffect(() => {
    if (isEditingMode) {
      const savedSite = localStorage.getItem('salt_sea_custom_site');
      const savedTheme = localStorage.getItem('salt_sea_custom_theme');
      const savedRooms = localStorage.getItem('salt_sea_custom_rooms');
      const savedGallery = localStorage.getItem('salt_sea_custom_gallery');
      const savedSections = localStorage.getItem('salt_sea_custom_sections');

      if (savedSite) {
        try { setSiteSettings(JSON.parse(savedSite)); } catch(e) { console.error(e); }
      } else {
        setSiteSettings(defaultSiteSettings);
      }

      if (savedTheme) {
        try { setThemeSettings(JSON.parse(savedTheme)); } catch(e) { console.error(e); }
      } else {
        setThemeSettings(defaultThemeSettings);
      }

      if (savedRooms) {
        try { setRooms(JSON.parse(savedRooms)); } catch(e) { console.error(e); }
      } else {
        setRooms(ROOMS);
      }

      if (savedGallery) {
        try { setGalleryItems(JSON.parse(savedGallery)); } catch(e) { console.error(e); }
      } else {
        setGalleryItems(GALLERY_ITEMS);
      }

      if (savedSections) {
        try { setSections(JSON.parse(savedSections)); } catch(e) { console.error(e); }
      } else {
        setSections(defaultSections);
      }
    } else {
      // Direct high-performance configuration load for guest visits
      setSiteSettings(defaultSiteSettings);
      setThemeSettings(defaultThemeSettings);
      setRooms(ROOMS);
      setGalleryItems(GALLERY_ITEMS);
      setSections(defaultSections);
    }

    const savedBookings = localStorage.getItem('salt_sea_bookings');
    if (savedBookings) {
      try { setBookings(JSON.parse(savedBookings)); } catch(e) { console.error(e); }
    } else {
      // Default initial placeholder seed
      const placeholders: Booking[] = [
        {
          id: 'b-seed-1',
          guestName: 'Dieter Schmidt',
          guestEmail: 'dieter@example.de',
          roomId: 'double-renovated',
          checkIn: '2026-06-15',
          checkOut: '2026-06-20',
          guestsCount: 2,
          totalPrice: 425,
          status: 'confirmed',
        },
        {
          id: 'b-seed-2',
          guestName: 'Maria Popova',
          guestEmail: 'maria@example.bg',
          roomId: 'quadruple-apartment',
          checkIn: '2026-07-10',
          checkOut: '2026-07-16',
          guestsCount: 4,
          totalPrice: 840,
          status: 'confirmed',
        },
        {
          id: 'b-seed-3',
          guestName: 'John O\'Connor',
          guestEmail: 'john@example.ie',
          roomId: 'triple-renovated',
          checkIn: '2026-08-04',
          checkOut: '2026-08-11',
          guestsCount: 3,
          totalPrice: 770,
          status: 'confirmed',
        }
      ];
      setBookings(placeholders);
      localStorage.setItem('salt_sea_bookings', JSON.stringify(placeholders));
    }
  }, []);

  // Sync back to CSS Variables dynamically
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-brand', themeSettings.brandColor);
    root.style.setProperty('--color-brand-light', themeSettings.brandLight);
    root.style.setProperty('--color-brand-dark', themeSettings.brandDark);
    root.style.setProperty('--color-warm-bg', themeSettings.warmBgColor);
    root.style.setProperty('--color-warm-border', themeSettings.warmBorderColor);
    root.style.setProperty('--color-accent-gold', themeSettings.accentGoldColor);
    
    if (themeSettings.sansFont) {
      root.style.setProperty('--font-sans', themeSettings.sansFont.includes(',') ? themeSettings.sansFont : `"${themeSettings.sansFont}", ui-sans-serif, system-ui, sans-serif`);
    }
    if (themeSettings.serifFont) {
      root.style.setProperty('--font-serif', themeSettings.serifFont.includes(',') ? themeSettings.serifFont : `"${themeSettings.serifFont}", Georgia, ui-serif, serif`);
    }
  }, [themeSettings]);

  const updateSection = (id: string, updatedSection: Partial<PageSection>) => {
    setSections((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...updatedSection } : s));
      localStorage.setItem('salt_sea_custom_sections', JSON.stringify(next));
      return next;
    });
  };

  const addSection = (newSec: PageSection) => {
    setSections((prev) => {
      const next = [...prev, newSec];
      localStorage.setItem('salt_sea_custom_sections', JSON.stringify(next));
      return next;
    });
  };

  const deleteSection = (id: string) => {
    setSections((prev) => {
      const next = prev.filter((s) => s.id !== id);
      localStorage.setItem('salt_sea_custom_sections', JSON.stringify(next));
      return next;
    });
  };

  const reorderSections = (newSections: PageSection[]) => {
    setSections(newSections);
    localStorage.setItem('salt_sea_custom_sections', JSON.stringify(newSections));
  };

  const updateSiteSettings = (updates: Partial<SiteSettings>) => {
    setSiteSettings((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('salt_sea_custom_site', JSON.stringify(next));
      return next;
    });
  };

  const updateThemeSettings = (updates: Partial<ThemeSettings>) => {
    setThemeSettings((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('salt_sea_custom_theme', JSON.stringify(next));
      return next;
    });
  };

  const updateRoom = (id: string, updatedRoom: Room) => {
    setRooms((prev) => {
      const next = prev.map((r) => (r.id === id ? updatedRoom : r));
      localStorage.setItem('salt_sea_custom_rooms', JSON.stringify(next));
      return next;
    });
  };

  const addRoom = (newRoom: Room) => {
    setRooms((prev) => {
      const next = [...prev, newRoom];
      localStorage.setItem('salt_sea_custom_rooms', JSON.stringify(next));
      return next;
    });
  };

  const deleteRoom = (id: string) => {
    setRooms((prev) => {
      const next = prev.filter((r) => r.id !== id);
      localStorage.setItem('salt_sea_custom_rooms', JSON.stringify(next));
      return next;
    });
  };

  const updateGalleryItem = (id: string, updatedItem: GalleryItem) => {
    setGalleryItems((prev) => {
      const next = prev.map((g) => (g.id === id ? updatedItem : g));
      localStorage.setItem('salt_sea_custom_gallery', JSON.stringify(next));
      return next;
    });
  };

  const addGalleryItem = (newItem: GalleryItem) => {
    setGalleryItems((prev) => {
      const next = [...prev, newItem];
      localStorage.setItem('salt_sea_custom_gallery', JSON.stringify(next));
      return next;
    });
  };

  const deleteGalleryItem = (id: string) => {
    setGalleryItems((prev) => {
      const next = prev.filter((g) => g.id !== id);
      localStorage.setItem('salt_sea_custom_gallery', JSON.stringify(next));
      return next;
    });
  };

  const addBooking = (booking: Booking) => {
    setBookings((prev) => {
      const next = [...prev, booking];
      localStorage.setItem('salt_sea_bookings', JSON.stringify(next));
      return next;
    });
  };

  const cancelBooking = (id: string) => {
    setBookings((prev) => {
      const next = prev.filter((b) => b.id !== id);
      localStorage.setItem('salt_sea_bookings', JSON.stringify(next));
      return next;
    });
  };

  const resetAll = () => {
    localStorage.removeItem('salt_sea_custom_site');
    localStorage.removeItem('salt_sea_custom_theme');
    localStorage.removeItem('salt_sea_custom_rooms');
    localStorage.removeItem('salt_sea_custom_gallery');
    localStorage.removeItem('salt_sea_custom_sections');
    localStorage.removeItem('salt_sea_bookings');

    setSiteSettings(defaultSiteSettings);
    setThemeSettings(defaultThemeSettings);
    setRooms(ROOMS);
    setGalleryItems(GALLERY_ITEMS);
    setSections(defaultSections);
    
    // reset seed bookings
    const placeholders: Booking[] = [
      {
        id: 'b-seed-1',
        guestName: 'Dieter Schmidt',
        guestEmail: 'dieter@example.de',
        roomId: 'double-renovated',
        checkIn: '2026-06-15',
        checkOut: '2026-06-20',
        guestsCount: 2,
        totalPrice: 425,
        status: 'confirmed',
      },
      {
        id: 'b-seed-2',
        guestName: 'Maria Popova',
        guestEmail: 'maria@example.bg',
        roomId: 'quadruple-apartment',
        checkIn: '2026-07-10',
        checkOut: '2026-07-16',
        guestsCount: 4,
        totalPrice: 840,
        status: 'confirmed',
      },
      {
        id: 'b-seed-3',
        guestName: 'John O\'Connor',
        guestEmail: 'john@example.ie',
        roomId: 'triple-renovated',
        checkIn: '2026-08-04',
        checkOut: '2026-08-11',
        guestsCount: 3,
        totalPrice: 770,
        status: 'confirmed',
      }
    ];
    setBookings(placeholders);
  };

  return (
    <CustomizerContext.Provider
      value={{
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
        isEditingMode,
        setIsEditingMode,
        selectedEditElement,
        setSelectedEditElement,
      }}
    >
      {children}
    </CustomizerContext.Provider>
  );
};

export const useCustomizer = () => {
  const context = useContext(CustomizerContext);
  if (context === undefined) {
    throw new Error('useCustomizer must be used within a CustomizerProvider');
  }
  return context;
};
