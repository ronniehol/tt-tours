# TT-Tours — Multilingual Implementation Plan
**Languages:** English (en) · Vietnamese (vi) · Chinese Simplified (zh) · Russian (ru)
**Stack:** Expo / React Native · Expo Router · Zustand · Supabase
**Date:** April 2026

---

## 1. Overview

The app currently has all UI strings hardcoded in English across 9 screens and ~10 shared components. The goal is to introduce a proper i18n layer that allows runtime language switching, persists the user's choice, and is easy to extend with more languages later.

---

## 2. Library Choice — `i18next` + `react-i18next` + `expo-localization`

| Option | Verdict |
|---|---|
| `i18next` + `react-i18next` | ✅ Recommended — mature, feature-rich, React hooks API, lazy-loading support |
| `expo-localization` | ✅ Used alongside i18next to detect device locale on first launch |
| `i18n-js` (Expo's own) | ❌ Lighter but lacks pluralisation, namespaces, and interpolation |
| `lingui` | ❌ Compile-time approach adds friction to Expo's hot-reload workflow |

**Install:**
```bash
npx expo install expo-localization
npm install i18next react-i18next
```

No Babel plugin required — works with Expo's default Metro bundler.

---

## 3. File & Folder Structure

```
TT-Tours/
├── locales/
│   ├── en/
│   │   ├── common.json       # Shared strings (nav labels, buttons, errors)
│   │   ├── home.json         # Home screen
│   │   ├── tours.json        # Tours listing + filter chips
│   │   ├── tourDetail.json   # Tour detail page
│   │   ├── booking.json      # Booking form + confirmation
│   │   ├── bookings.json     # Bookings lookup screen
│   │   ├── auth.json         # Login + Signup screens
│   │   └── profile.json      # Profile screen
│   ├── vi/                   # Same structure (Vietnamese)
│   ├── zh/                   # Same structure (Chinese Simplified)
│   └── ru/                   # Same structure (Russian)
├── lib/
│   └── i18n.ts               # NEW: i18next configuration + init
├── store/
│   └── language-store.ts     # NEW: Zustand store for active language + persistence
├── components/
│   └── ui/
│       └── LanguagePicker.tsx # NEW: Language switcher component
└── hooks/
    └── useTranslation.ts     # Re-export of react-i18next hook (optional convenience)
```

---

## 4. i18n Configuration (`lib/i18n.ts`)

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Import all namespace JSONs statically
// (dynamic import / lazy-loading possible later for bundle size)
import en_common from '@/locales/en/common.json';
import en_home from '@/locales/en/home.json';
// ... etc

import vi_common from '@/locales/vi/common.json';
// ... etc

const resources = {
  en: { common: en_common, home: en_home, /* ... */ },
  vi: { common: vi_common, /* ... */ },
  zh: { common: zh_common, /* ... */ },
  ru: { common: ru_common, /* ... */ },
};

const deviceLocale = Localization.getLocales()[0]?.languageCode ?? 'en';
const supportedLocales = ['en', 'vi', 'zh', 'ru'];
const fallbackLocale = supportedLocales.includes(deviceLocale) ? deviceLocale : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: fallbackLocale,       // overridden by language-store on hydration
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });

export default i18n;
```

Import `lib/i18n.ts` at the top of `app/_layout.tsx` before any screen renders.

---

## 5. Language Store (`store/language-store.ts`)

Uses Zustand with AsyncStorage persistence (already a project pattern with auth-store).

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/lib/i18n';

export type AppLanguage = 'en' | 'vi' | 'zh' | 'ru';

interface LanguageStore {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang) => {
        i18n.changeLanguage(lang);
        set({ language: lang });
      },
    }),
    {
      name: 'tt-tours-language',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

On app start, hydrate i18n from the persisted store before the first render.

---

## 6. String Inventory by Screen

### 6a. `common.json` (shared across all screens)
```json
{
  "nav": {
    "home": "Home",
    "tours": "Tours",
    "bookings": "Bookings",
    "profile": "Profile"
  },
  "actions": {
    "back": "Back",
    "close": "Close",
    "confirm": "Confirm",
    "cancel": "Cancel",
    "signIn": "Sign In",
    "signOut": "Sign Out",
    "signUp": "Sign Up",
    "loading": "Loading…",
    "tryAgain": "Try Again"
  },
  "errors": {
    "generic": "Something went wrong. Please try again.",
    "notFound": "Not found."
  }
}
```

### 6b. `home.json`
Key strings to extract: hero headline ("FEEL THE RUSH OF VIETNAM"), eyebrow label, subheading copy, CTA button labels ("Explore Tours", "View Schedule"), stats (14+, Daily, 5★ labels), the 3 "How it works" steps, section titles ("Our Experiences", "Choose Your Adventure"), footer CTA banner.

### 6c. `tours.json`
Category filter chip labels (All, Cultural, Adventure, Water, Nature, Food), header title "ALL TOURS", tour count format `"{{count}} tours"`.

### 6d. `tourDetail.json`
Labels: duration, group size, difficulty, includes/excludes lists, "Book This Tour" button, highlights section title, meeting point, departure time.

### 6e. `booking.json`
Form labels: date picker, guests, contact info fields, payment section, terms copy, "Confirm & Pay" button. Confirmation screen: success message, reference number label, "View Booking" link.

### 6f. `bookings.json`
Header "MY BOOKINGS", reference input placeholder, "Look Up" button, booking status labels (Pending, Confirmed, Cancelled, Completed), booking card field labels (Date, Guests, Total).

### 6g. `auth.json`
Login: "Welcome Back", "SIGN IN TO TT TOURS", Email/Password labels, placeholders, "Continue with Google", "Don't have an account? Sign up". Signup: mirror structure plus name field, T&C copy.

### 6h. `profile.json`
"MY PROFILE", "Traveller" fallback name, menu items (My Bookings, Account Settings, Support Chat, Look up a booking, WhatsApp us), guest hero headline "JOIN THE ADVENTURE", sign-in prompt copy, app version string.

---

## 7. Usage in Components

Replace hardcoded strings with the `useTranslation` hook:

```typescript
// Before
<Text style={styles.headerTitle}>ALL TOURS</Text>

// After
import { useTranslation } from 'react-i18next';
const { t } = useTranslation('tours');
<Text style={styles.headerTitle}>{t('header.title').toUpperCase()}</Text>
```

For interpolation (plurals, counts):
```typescript
// tours.json: "tourCount": "{{count}} tour"  (i18next handles plurals automatically)
t('tourCount', { count: filtered.length })
```

---

## 8. Language Picker UI

Add a `LanguagePicker` component to the **Profile screen** (and optionally the onboarding/first-launch flow). Display as a row of flag+label chips:

| Flag | Code | Label |
|---|---|---|
| 🇬🇧 | en | English |
| 🇻🇳 | vi | Tiếng Việt |
| 🇨🇳 | zh | 中文 |
| 🇷🇺 | ru | Русский |

On tap → calls `useLanguageStore().setLanguage(code)` → i18n updates instantly across all mounted screens.

---

## 9. Font Considerations

| Language | Script | Current Fonts | Action needed |
|---|---|---|---|
| English | Latin | SpaceGrotesk, BarlowCondensed | ✅ Already loaded |
| Vietnamese | Latin + diacritics | SpaceGrotesk, BarlowCondensed | ✅ Both support full Vietnamese Unicode |
| Russian | Cyrillic | SpaceGrotesk, BarlowCondensed | ✅ Space Grotesk covers Cyrillic; Barlow Condensed does **not** — headings will need a fallback or swap |
| Chinese | CJK | Neither font covers CJK | ⚠️ Add `@expo-google-fonts/noto-sans-sc` for Chinese body text |

**Recommended approach for headlines in Chinese/Russian:** detect language and conditionally apply a system font or Noto Sans fallback for display-size text that uses BarlowCondensed.

---

## 10. Database Content (Tour Descriptions)

Tour names, descriptions, highlights, and meeting points are stored in Supabase. Two options:

**Option A — JSON columns (recommended for MVP)**
Add `name_vi`, `name_zh`, `name_ru`, `description_vi`, `description_zh`, `description_ru` columns to the `tours` table. The fetch query selects the column matching the active language, falling back to the English column.

```sql
ALTER TABLE tours
  ADD COLUMN name_vi text,
  ADD COLUMN name_zh text,
  ADD COLUMN name_ru text,
  ADD COLUMN description_vi text,
  ADD COLUMN description_zh text,
  ADD COLUMN description_ru text;
-- Repeat for highlights, includes, excludes
```

**Option B — Separate translations table (scalable)**
```sql
CREATE TABLE tour_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid REFERENCES tours(id),
  locale text NOT NULL,  -- 'en' | 'vi' | 'zh' | 'ru'
  name text,
  description text,
  highlights jsonb,
  includes jsonb,
  excludes jsonb,
  UNIQUE (tour_id, locale)
);
```
Option B is cleaner at scale but requires a join on every tour fetch.

**Recommendation:** Start with Option A (column per locale) for speed, plan migration to Option B if more languages are added beyond 4–5.

---

## 11. Number & Date Formatting

Use `Intl.NumberFormat` and `Intl.DateTimeFormat` (available in Hermes / React Native ≥0.70):

```typescript
// Price: format as USD in all locales (tour prices are in USD)
new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'USD' }).format(price)

// Date: booking date shown in user's locale format
new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
```

---

## 12. Phased Implementation Roadmap

### Phase 1 — Infrastructure (½ day)
1. Install `i18next`, `react-i18next`, `expo-localization`
2. Create `lib/i18n.ts` config
3. Create `store/language-store.ts`
4. Wire i18n init into `app/_layout.tsx`
5. Create all `locales/en/*.json` files with English strings extracted from current code

### Phase 2 — UI String Extraction (1 day)
Systematically replace hardcoded strings in all screens and shared components with `t()` calls, working screen by screen:
- `app/(tabs)/index.tsx`
- `app/(tabs)/tours.tsx`
- `app/(tabs)/bookings.tsx`
- `app/(tabs)/profile.tsx`
- `app/(auth)/login.tsx`
- `app/(auth)/signup.tsx`
- `app/tour/[slug].tsx`
- `app/booking/[tourSlug].tsx`
- `app/booking/confirmation.tsx`
- Shared components (`Button`, `TourCard`, `Badge`, tab bar labels in `_layout.tsx`)

### Phase 3 — Translations (1–2 days)
- Generate `vi`, `zh`, `ru` JSON files from the English source
- Can use Claude to produce initial translations for all namespaces
- Native speaker review recommended for Vietnamese (most important given the app's market)

### Phase 4 — Font Fallbacks (½ day)
- Add `@expo-google-fonts/noto-sans-sc` for Chinese
- Implement conditional font logic for Russian Cyrillic headlines

### Phase 5 — Language Picker UI (½ day)
- Build `LanguagePicker` component
- Add to Profile screen settings section

### Phase 6 — Database Content (1 day)
- Run Supabase migration to add locale columns (Option A)
- Update `fetchTours` and `fetchTourBySlug` in `lib/supabase.ts` to accept a locale param
- Populate Vietnamese translations for all 14 tours (priority — it's the local language)

### Phase 7 — QA & Polish (½ day)
- Test language switching on all screens
- Check text truncation for longer Russian/Chinese strings (Russian tends to be 30–40% longer than English)
- Verify date/currency formatting in each locale
- Test device locale auto-detection on first launch

---

## 13. Estimated Total Effort

| Phase | Effort |
|---|---|
| Infrastructure | 4 hrs |
| String extraction | 8 hrs |
| Translations (AI-assisted) | 4 hrs |
| Font fallbacks | 2 hrs |
| Language picker UI | 2 hrs |
| Database migration | 4 hrs |
| QA | 4 hrs |
| **Total** | **~28 hrs** |

---

## 14. Key Decisions to Confirm

1. **Option A vs B for DB translations** — columns vs separate table
2. **Chinese variant** — Simplified (zh-Hans, mainland China) vs Traditional (zh-Hant, Taiwan/HK)? Simplified assumed here.
3. **First-launch flow** — auto-detect device language and show a one-time language selection prompt, or silently default to device locale?
4. **Tour content priority** — will Vietnamese content be human-translated or AI-translated + reviewed?
5. **BarlowCondensed fallback for Russian** — swap to system font, or replace with a Cyrillic-compatible display font (e.g., Oswald)?

---

*This plan was prepared in Cowork mode and should be reviewed with the development team before implementation begins.*
