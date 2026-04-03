import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

// ─── Tour helpers ────────────────────────────────────────────────────────────

type Lang = 'en' | 'vi' | 'zh' | 'ru';

function mapTour(row: any, translation?: any) {
  const cover = row.tour_images?.find((img: any) => img.is_cover)?.url ?? null;
  const tr = translation ?? null;
  return {
    id: row.id,
    name: tr?.name ?? row.name,
    slug: row.slug,
    shortDescription: tr?.short_description ?? row.short_description,
    description: tr?.description ?? row.description,
    duration: row.duration,
    departureTime: row.departure_time,
    returnTime: row.return_time,
    priceVnd: Number(row.price_vnd),
    maxGroupSize: row.max_group_size,
    category: row.category,
    difficulty: row.difficulty,
    highlights: tr?.highlights ?? row.highlights ?? [],
    included: tr?.included ?? row.included ?? [],
    excluded: tr?.excluded ?? row.excluded ?? [],
    meetingPoint: tr?.meeting_point ?? row.meeting_point,
    thumbGradient: row.thumb_gradient ?? ['#0B4C5C', '#1a7a8c'],
    isActive: row.is_active,
    coverImageUrl: cover,
  };
}

export async function fetchTours(lang: Lang = 'en') {
  if (lang === 'en') {
    const { data, error } = await supabase
      .from('tours')
      .select('*, tour_images(url, alt, is_cover)')
      .eq('is_active', true)
      .order('name');
    if (error) throw error;
    return (data ?? []).map((row) => mapTour(row));
  }

  const { data, error } = await supabase
    .from('tours')
    .select('*, tour_images(url, alt, is_cover), tour_translations!left(name, short_description, description, highlights, included, excluded, meeting_point, language)')
    .eq('is_active', true)
    .order('name');
  if (error) throw error;
  return (data ?? []).map((row) => {
    const tr = row.tour_translations?.find((t: any) => t.language === lang) ?? null;
    return mapTour(row, tr);
  });
}

export async function fetchTourBySlug(slug: string, lang: Lang = 'en') {
  if (lang === 'en') {
    const { data, error } = await supabase
      .from('tours')
      .select('*, tour_images(url, alt, is_cover)')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return mapTour(data);
  }

  const { data, error } = await supabase
    .from('tours')
    .select('*, tour_images(url, alt, is_cover), tour_translations!left(name, short_description, description, highlights, included, excluded, meeting_point, language)')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  const tr = data.tour_translations?.find((t: any) => t.language === lang) ?? null;
  return mapTour(data, tr);
}

// ─── Booking helpers ─────────────────────────────────────────────────────────

function generateBookingRef(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = 'TT-';
  for (let i = 0; i < 8; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return ref;
}

export async function createBooking(booking: {
  tourId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  travelDate: string;
  numAdults: number;
  numChildren: number;
  totalPriceVnd: number;
  specialRequests?: string;
  userId?: string;
}) {
  const bookingRef = generateBookingRef();

  const { error } = await supabase
    .from('bookings')
    .insert({
      booking_ref: bookingRef,
      tour_id: booking.tourId,
      user_id: booking.userId ?? null,
      guest_name: booking.guestName,
      guest_email: booking.guestEmail,
      guest_phone: booking.guestPhone,
      travel_date: booking.travelDate,
      num_adults: booking.numAdults,
      num_children: booking.numChildren,
      total_price_vnd: booking.totalPriceVnd,
      special_requests: booking.specialRequests ?? null,
      status: 'pending',
    });
  if (error) throw error;

  return {
    id: '',
    bookingRef,
    tourId: booking.tourId,
    userId: booking.userId ?? null,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    guestPhone: booking.guestPhone,
    travelDate: booking.travelDate,
    numAdults: booking.numAdults,
    numChildren: booking.numChildren,
    totalPriceVnd: booking.totalPriceVnd,
    status: 'pending',
    specialRequests: booking.specialRequests ?? null,
    stripePaymentIntentId: null,
    createdAt: new Date().toISOString(),
    tourName: booking.tourId,
  };
}

export async function fetchBookingByRef(ref: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, tours(*)')
    .eq('booking_ref', ref)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchBookingsByEmail(email: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, tours(*)')
    .eq('guest_email', email)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
