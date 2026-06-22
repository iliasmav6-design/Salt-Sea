import { Room, GalleryItem } from '../types';

export const HERO_IMAGE = '/src/assets/images/salt_sea_hero_1781346599247.jpg';
export const RENOVATED_ROOM_IMAGE = '/src/assets/images/salt_sea_room_1781346614614.jpg';
export const GARDEN_IMAGE = '/src/assets/images/salt_sea_garden_1781346628652.jpg';

export const ROOMS: Room[] = [
  {
    id: "double-renovated",
    name: "Aegean Breeze Double Room",
    type: "double",
    description: "A masterpiece of Cycladic minimal design, fully renovated in 2026. Features private veranda, sun-drenched interiors, and soothing pastel decor perfect for couples.",
    renovationStatus: "fully",
    renovationYear: 2026,
    capacity: 2,
    pricePerNight: 85,
    size: "24 m²",
    bedType: "1 King Size Bed",
    imageUrl: "/src/assets/images/salt_sea_room_1781346614614.jpg",
    images: [
      "/src/assets/images/salt_sea_room_1781346614614.jpg",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80"
    ],
    amenities: [
      "50-inch Smart TV with Netflix",
      "Fully equipped kitchen",
      "High-end refrigerator",
      "Deluxe Cookware & utensils",
      "Fine cutlery & porcelain dishes",
      "Premium Greek bath amenities",
      "Private garden-view balcony",
      "Free high-speed Wi-Fi",
      "Air conditioning"
    ]
  },
  {
    id: "triple-renovated",
    name: "Olive Grove Triple Room",
    type: "triple",
    description: "Spacious and breezy, fully renovated in 2026. Perfect for a couple with a child or three friends, offering pristine rustic furniture and views of our 4,000 m² olive grove garden.",
    renovationStatus: "fully",
    renovationYear: 2026,
    capacity: 3,
    pricePerNight: 110,
    size: "30 m²",
    bedType: "1 Double Bed + 1 Single Bed",
    imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80"
    ],
    amenities: [
      "50-inch Smart TV with Netflix",
      "Complete modern kitchenette",
      "Premium refrigerator & freezer",
      "Pots, pans & baking cookware",
      "Plates, glasses & cutlery",
      "Nespresso coffee maker",
      "Spacious bathroom with glass shower",
      "Furnished terrace facing gardens",
      "Air conditioning & flat-screen Wi-Fi"
    ]
  },
  {
    id: "quadruple-apartment",
    name: "Sands & Sea Family Quadruple",
    type: "quadruple",
    description: "Our most spacious accommodation, partially renovated in 2026 with new linens, mattresses, and premium decor. Designed for larger families seeking a restful summer in Halkidiki.",
    renovationStatus: "partially",
    renovationYear: 2026,
    capacity: 4,
    pricePerNight: 140,
    size: "42 m²",
    bedType: "1 Queen Bed + 2 Single Beds",
    imageUrl: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80"
    ],
    amenities: [
      "Full open-concept kitchen",
      "Large family-sized refrigerator",
      "Oven with dual stovetops",
      "Complete set of family cookware",
      "Dishes, bowls & cutlery for four",
      "Smart LED flat-screen TV",
      "Direct outdoor terrace access",
      "Dining table (indoor & outdoor)",
      "Free premium Wi-Fi & AC"
    ]
  },
  {
    id: "triple-garden",
    name: "Lavender Fields Triple Studio",
    type: "triple",
    description: "Comfortable ground-floor studio, partially renovated in 2026. Features private shaded patio with instant walks into the lawn and lavender beds.",
    renovationStatus: "partially",
    renovationYear: 2026,
    capacity: 3,
    pricePerNight: 95,
    size: "28 m²",
    bedType: "1 Double Bed + 1 Cozy Sofa Bed",
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80"
    ],
    amenities: [
      "Well-equipped kitchen block",
      "Under-counter refrigerator",
      "Essential cookware & frying pans",
      "Plates, mugs & dining cutlery",
      "Flat-screen cable TV",
      "Private flowery patio",
      "Shaded outdoor deckchair space",
      "Perfect for nature lovers",
      "Full air conditioning & Wi-Fi"
    ]
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    imageUrl: "/src/assets/images/salt_sea_hero_1781346599247.jpg",
    title: "Salt & Sea Rooms Exterior",
    category: "exterior"
  },
  {
    id: "g2",
    imageUrl: "/src/assets/images/salt_sea_room_1781346614614.jpg",
    title: "Modern Renovated Double Room Interior",
    category: "rooms"
  },
  {
    id: "g3",
    imageUrl: "/src/assets/images/salt_sea_garden_1781346628652.jpg",
    title: "4,000 m² Olive & Lavender Garden",
    category: "garden"
  },
  {
    id: "g4",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    title: "Sykia Beach - 5 Minutes Drive From Us",
    category: "beach"
  },
  {
    id: "g5",
    imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
    title: "Turquoise Waters in Sarti Beach",
    category: "beach"
  },
  {
    id: "g6",
    imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80",
    title: "Premium Linen and Lighting Details",
    category: "rooms"
  },
  {
    id: "g7",
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80",
    title: "Sarti Coastal Promenade & Boutiques",
    category: "beach"
  },
  {
    id: "g8",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
    title: "Sunbeams over the Garden Pergoland",
    category: "garden"
  }
];

export const REVIEWS = [
  {
    guest: 'Anna & Marc (Netherlands)',
    text: 'A heavenly place between Sarti and Sykia! The renovated room was spotless, the kitchen had quality pots and sharp knives, and the 50-inch TV was perfect for movie night. Highly recommend the garden and BBQ!',
    score: 5,
    date: 'July 2026',
  },
  {
    guest: 'Dimitris P. (Greece)',
    text: 'What a beautiful 4,000 m² garden! The kids played on the lawn safely every afternoon. Sykia beach is just 5 minutes away. Excellent free parking and peaceful nights.',
    score: 5,
    date: 'August 2026',
  },
  {
    guest: 'Elena K. (Germany)',
    text: 'The owners are incredibly warm. They welcomed us with fresh local fruit. Fully-equipped kitchen and beautiful pastel-colored design. We will definitely come back!',
    score: 5,
    date: 'June 2026',
  },
];
