export interface Room {
  id: string;
  name: string;
  type: 'double' | 'triple' | 'quadruple';
  description: string;
  renovationStatus: 'fully' | 'partially';
  renovationYear: number;
  capacity: number;
  pricePerNight: number;
  size: string;
  bedType: string;
  amenities: string[];
  imageUrl: string;
  images?: string[];
}

export interface Amenity {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  roomId: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guestsCount: number;
  totalPrice: number;
  status: 'confirmed' | 'pending';
  paymentMethod?: 'card' | 'bank_transfer' | 'arrival';
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  category: 'rooms' | 'garden' | 'beach' | 'exterior';
}

export interface PageSection {
  id: string;
  label: string;
  title: string;
  sub?: string;
  content?: string;
  imageUrl?: string;
  visible: boolean;
  isCustom?: boolean;
}

