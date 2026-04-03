export type TourCategory =
  | 'cultural'
  | 'adventure'
  | 'nature'
  | 'water'
  | 'food'
  | 'transport';

export type TourDifficulty = 'Easy' | 'Moderate' | 'Challenging';

export interface Tour {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  duration: string;        // e.g. "4 hours", "Full day"
  departureTime: string;   // e.g. "07:30 AM"
  returnTime: string;      // e.g. "12:30 PM"
  priceVnd: number;
  maxGroupSize: number;
  category: TourCategory;
  difficulty: TourDifficulty;
  highlights: string[];
  included: string[];
  excluded: string[];
  meetingPoint: string;
  thumbGradient: string[]; // two hex colours for placeholder gradient
  isActive: boolean;
  coverImageUrl?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  bookingRef: string;
  tourId: string;
  tour?: Tour;
  userId?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  travelDate: string;       // ISO date string
  numAdults: number;
  numChildren: number;
  totalPriceVnd: number;
  status: BookingStatus;
  specialRequests?: string;
  stripePaymentIntentId?: string;
  createdAt: string;
}

export interface BookingFormValues {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  travelDate: string;
  numAdults: number;
  numChildren: number;
  specialRequests?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}
