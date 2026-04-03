# TT Tours

Tour booking web app for a travel company operating in Central Vietnam (Da Nang / Hoi An / Hue region). Built with React Native / Expo for web, backed by Supabase, with Stripe payments and Brevo transactional email.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Client (Web)                    │
│  Expo + React Native Web · Expo Router · Zustand    │
│  React Hook Form · i18next (en / vi / zh / ru)      │
└──────────────┬──────────────────────────┬───────────┘
               │                          │
        REST / Realtime            Stripe.js (web)
               │                          │
┌──────────────▼──────────┐   ┌───────────▼───────────┐
│        Supabase          │   │         Stripe         │
│  PostgreSQL + RLS        │   │  PaymentIntents (VND)  │
│  Edge Functions (Deno)   │   │  PaymentElement UI     │
│  Auth (optional)         │   └───────────────────────┘
└──────────────┬───────────┘
               │ Edge Functions call
       ┌───────▼────────┐
       │     Brevo       │
       │  Transactional  │
       │  email API      │
       └────────────────┘

Hosting & DNS
┌──────────────────────────────────────────┐
│  Vercel  ←  GitHub (auto-deploy on push) │
│  Domain: tt-tours.online (Namecheap)     │
│  DNS / email routing: Cloudflare         │
└──────────────────────────────────────────┘
```

### Key design decisions

| Concern | Choice | Reason |
|---|---|---|
| Routing | Expo Router (file-based) | Works for web static export and future native |
| Database | Supabase PostgreSQL + RLS | Row-level security keeps anon bookings safe |
| Payments | Stripe PaymentIntents | VND zero-decimal, supports card/Apple Pay/Google Pay |
| Email | Brevo SMTP API | Reliable transactional delivery, free tier |
| i18n | i18next + `tour_translations` table | Both UI strings and tour content translated |
| Currency | Vietnamese Dong (VND) | Local currency, no conversion needed |

---

## Integrations

### Supabase
- **Console:** https://supabase.com/dashboard
- **Database:** PostgreSQL with Row Level Security
- **Tables:** `tours`, `tour_images`, `tour_translations`, `bookings`, `payments`
- **Edge Functions:** `create-payment-intent`, `send-booking-email` (Deno runtime)
- **Auth:** optional user accounts; guest booking supported without login

### Stripe
- **Dashboard:** https://dashboard.stripe.com
- **Currency:** VND (zero-decimal — amounts in whole dong)
- **Flow:** client calls Supabase Edge Function → Edge Function creates PaymentIntent → client renders Stripe PaymentElement

### Brevo (transactional email)
- **Console:** https://app.brevo.com
- **From address:** contact@tt-tours.online
- **Trigger:** Supabase Edge Function `send-booking-email` called after successful payment
- **API endpoint:** `https://api.brevo.com/v3/smtp/email`

### Cloudflare
- **Console:** https://dash.cloudflare.com
- **Role:** DNS management for tt-tours.online, MX routing for Brevo email deliverability (SPF / DKIM records)

### Vercel
- **Console:** https://vercel.com/dashboard
- **Live URL:** https://tt-tours.online
- **Deploy:** automatic on every push to `main`
- **Build:** `npm run build:web` → outputs to `dist/`
- **Config:** `vercel.json` — SPA rewrites so all routes resolve to `index.html`

### Namecheap
- **Console:** https://www.namecheap.com/domains
- **Domain:** tt-tours.online
- **Nameservers:** delegated to Cloudflare

---

## Environment variables

Create a `.env` file in the project root (never commit this):

```env
EXPO_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

Supabase Edge Function secrets (set via `supabase secrets set`):

```
STRIPE_SECRET_KEY=sk_live_...
BREVO_API_KEY=xkeysib-...
```

---

## Local development

**Prerequisites:** Node.js 18+, nvm recommended.

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file and fill in values
cp .env.example .env

# 3. Start the web dev server (opens at http://localhost:8081)
npm run web

# 4. (Optional) Start Expo dev server for native
npm start
```

### Supabase CLI

```bash
# Link to your project (one-time)
supabase link --project-ref <project-ref>

# Apply schema and seed data
supabase db push                        # or run SQL files in the Supabase SQL editor

# Deploy Edge Functions
supabase functions deploy create-payment-intent
supabase functions deploy send-booking-email

# Set secrets for Edge Functions
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set BREVO_API_KEY=xkeysib-...
```

---

## Database setup

Run the following SQL files in order in the Supabase SQL editor (or via `supabase db push`):

1. `supabase/schema.sql` — tables, RLS policies, triggers
2. `supabase/seed.sql` — 14 tour records
3. `supabase/tour_translations.sql` — Vietnamese, Chinese, Russian translations
4. `supabase/images_seed.sql` — cover images (Unsplash URLs)

---

## Hosting setup

This section documents the full hosting stack so it can be reproduced from scratch if needed.

### 1. Domain — Namecheap

1. Register `tt-tours.online` at https://www.namecheap.com
2. In Namecheap **Domain > Nameservers**, select **Custom DNS** and enter the two Cloudflare nameservers (provided during Cloudflare onboarding, e.g. `aria.ns.cloudflare.com` / `cole.ns.cloudflare.com`)

### 2. DNS & email records — Cloudflare

1. Add the site `tt-tours.online` at https://dash.cloudflare.com → **Add a site**
2. Cloudflare scans existing DNS records automatically
3. Add the following DNS records:

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| CNAME | `@` | `cname.vercel-dns.com` | Points root domain to Vercel |
| CNAME | `www` | `cname.vercel-dns.com` | Points www to Vercel |
| TXT | `@` | `v=spf1 include:spf.brevo.com ~all` | SPF record for Brevo email |
| TXT | `mail._domainkey` | _(value from Brevo dashboard)_ | DKIM record for Brevo |
| MX | `@` | `inbound-smtp.brevo.com` (priority 10) | Inbound mail (optional) |

4. In Cloudflare **SSL/TLS**, set encryption mode to **Full**

### 3. Hosting — Vercel

1. Go to https://vercel.com → **Add New Project** → import the GitHub repository
2. Framework preset: **Other** (Expo handles its own build)
3. Build settings:
   - **Build command:** `npm run build:web`
   - **Output directory:** `dist`
4. Add environment variables (Settings > Environment Variables):
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
5. Add the custom domain: **Settings > Domains** → add `tt-tours.online` and `www.tt-tours.online`
6. Vercel auto-provisions an SSL certificate via Let's Encrypt

### 4. Email sender — Brevo

1. Create account at https://app.brevo.com
2. **Senders & IPs > Domains** → add `tt-tours.online`
3. Brevo generates SPF and DKIM values — add them to Cloudflare DNS (see table above)
4. Click **Verify** in Brevo once the DNS records propagate
5. Copy the API key from **SMTP & API > API Keys** and set it as a Supabase secret:
   ```bash
   supabase secrets set BREVO_API_KEY=xkeysib-...
   ```

### 5. Verify end-to-end

- Visit https://tt-tours.online — should load the app
- Complete a test booking — Stripe test card `4242 4242 4242 4242`, any future date, any CVC
- Check that the confirmation email arrives from `contact@tt-tours.online`

---

## Deployment

Deployment is automatic via Vercel's GitHub integration — every push to `main` triggers a new build.

**Manual deploy (if needed):**

```bash
npx vercel --prod
```

---

## GitHub — update repository

```bash
# Stage all changes
git add .

# Commit with a message
git commit -m "your message here"

# Push to main (triggers Vercel deploy automatically)
git push origin main
```

---

## Project structure

```
app/
  (tabs)/         # Tab screens: home, tours, bookings, profile
  booking/        # [tourSlug].tsx booking form, confirmation
  tour/           # [slug].tsx tour detail page
components/
  ui/             # Button, TourCard, DatePicker, …
constants/
  theme.ts        # Colors, typography tokens
lib/
  supabase.ts     # Supabase client + tour/booking helpers
  stripe.ts       # Stripe helper (PaymentIntent, currency utils)
  format.ts       # formatVnd() currency formatter
locales/
  en/ vi/ zh/ ru/ # i18next translation JSON files
store/
  booking-store.ts
  auth-store.ts
  language-store.ts
supabase/
  schema.sql
  seed.sql
  tour_translations.sql
  images_seed.sql
  functions/
    create-payment-intent/
    send-booking-email/
```
