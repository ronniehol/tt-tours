import { create } from 'zustand';
import { Tour, Booking } from '@/types';

interface BookingDraft {
  tour: Tour | null;
  travelDate: string;
  numAdults: number;
  numChildren: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;
}

interface BookingStore {
  draft: BookingDraft;
  confirmedBooking: Booking | null;

  setDraftTour: (tour: Tour) => void;
  setDraftField: <K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) => void;
  resetDraft: () => void;
  setConfirmedBooking: (booking: Booking) => void;
  clearConfirmedBooking: () => void;

  totalPrice: () => number;
}

const initialDraft: BookingDraft = {
  tour: null,
  travelDate: '',
  numAdults: 1,
  numChildren: 0,
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  specialRequests: '',
};

export const useBookingStore = create<BookingStore>((set, get) => ({
  draft: initialDraft,
  confirmedBooking: null,

  setDraftTour: (tour) =>
    set((state) => ({ draft: { ...state.draft, tour } })),

  setDraftField: (key, value) =>
    set((state) => ({ draft: { ...state.draft, [key]: value } })),

  resetDraft: () => set({ draft: initialDraft }),

  setConfirmedBooking: (booking) => set({ confirmedBooking: booking }),

  clearConfirmedBooking: () => set({ confirmedBooking: null }),

  totalPrice: () => {
    const { draft } = get();
    if (!draft.tour) return 0;
    return draft.tour.priceUsd * (draft.numAdults + draft.numChildren * 0.5);
  },
}));
