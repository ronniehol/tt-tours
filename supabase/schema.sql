-- TT Tours — Supabase Database Schema
-- Run this in the Supabase SQL editor to set up all tables.

-- ─── EXTENSIONS ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── TOURS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tours (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  slug              text UNIQUE NOT NULL,
  short_description text,
  description       text,
  duration          text,           -- "4 hours", "Full day"
  departure_time    text,           -- "07:30 AM"
  return_time       text,
  price_vnd         numeric(12,0) NOT NULL,
  max_group_size    int DEFAULT 12,
  category          text DEFAULT 'cultural'
                      CHECK (category IN ('cultural','adventure','nature','water','food','transport')),
  difficulty        text DEFAULT 'Easy'
                      CHECK (difficulty IN ('Easy','Moderate','Challenging')),
  highlights        text[],
  included          text[],
  excluded          text[],
  meeting_point     text,
  thumb_gradient    text[],         -- two hex colours for placeholder
  is_active         boolean DEFAULT true,
  created_at        timestamptz DEFAULT now()
);

-- Tour images (optional, for when real photos are uploaded)
CREATE TABLE IF NOT EXISTS tour_images (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id     uuid REFERENCES tours(id) ON DELETE CASCADE,
  url         text NOT NULL,
  alt         text,
  is_cover    boolean DEFAULT false,
  sort_order  int DEFAULT 0
);

-- ─── BOOKINGS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref               text UNIQUE NOT NULL
                              DEFAULT 'TT-' || upper(left(replace(gen_random_uuid()::text, '-', ''), 8)),
  tour_id                   uuid REFERENCES tours(id),
  user_id                   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_name                text NOT NULL,
  guest_email               text NOT NULL,
  guest_phone               text NOT NULL,
  travel_date               date NOT NULL,
  num_adults                int NOT NULL DEFAULT 1 CHECK (num_adults >= 1),
  num_children              int NOT NULL DEFAULT 0 CHECK (num_children >= 0),
  total_price_vnd           numeric(12,0) NOT NULL,
  status                    text NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending','confirmed','cancelled','completed')),
  special_requests          text,
  stripe_payment_intent_id  text,
  stripe_payment_status     text,
  created_at                timestamptz DEFAULT now(),
  updated_at                timestamptz DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bookings_updated_at ON bookings;
CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── PAYMENTS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id                uuid REFERENCES bookings(id) ON DELETE CASCADE,
  stripe_payment_intent_id  text UNIQUE,
  amount_vnd                numeric(12,0),
  currency                  text DEFAULT 'vnd',
  status                    text,
  created_at                timestamptz DEFAULT now()
);

-- ─── CHAT (Post-MVP scaffold) ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_sessions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_email text,
  language    text DEFAULT 'en',
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role        text NOT NULL CHECK (role IN ('user','assistant')),
  content     text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

-- ─── FORUM (Post-MVP scaffold) ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS forum_topics (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  slug        text UNIQUE NOT NULL,
  tour_id     uuid REFERENCES tours(id) ON DELETE SET NULL,
  created_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS forum_posts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id    uuid REFERENCES forum_topics(id) ON DELETE CASCADE,
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  content     text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

-- ─── RESTAURANT (Post-MVP scaffold) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS restaurant_menus (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text,
  location    text,
  tour_id     uuid REFERENCES tours(id) ON DELETE SET NULL,
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS restaurant_menu_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id     uuid REFERENCES restaurant_menus(id) ON DELETE CASCADE,
  name        text NOT NULL,
  description text,
  price_vnd   numeric(10,0),
  category    text,
  is_available boolean DEFAULT true
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────

ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Tours: publicly readable
DROP POLICY IF EXISTS "Tours are publicly readable" ON tours;
CREATE POLICY "Tours are publicly readable"
  ON tours FOR SELECT USING (is_active = true);

-- Bookings: users can only read their own; anon can read by email match
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can create a booking" ON bookings;
CREATE POLICY "Anyone can create a booking"
  ON bookings FOR INSERT
  WITH CHECK (true);

GRANT INSERT ON bookings TO anon, authenticated;
GRANT SELECT ON bookings TO anon, authenticated;

-- Service role bypasses RLS for admin operations
