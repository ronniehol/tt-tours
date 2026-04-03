import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// ── English ──────────────────────────────────────────────────────────────────
import en_common from '@/locales/en/common.json';
import en_home from '@/locales/en/home.json';
import en_tours from '@/locales/en/tours.json';
import en_tourDetail from '@/locales/en/tourDetail.json';
import en_booking from '@/locales/en/booking.json';
import en_bookings from '@/locales/en/bookings.json';
import en_auth from '@/locales/en/auth.json';
import en_profile from '@/locales/en/profile.json';

// ── Vietnamese ────────────────────────────────────────────────────────────────
import vi_common from '@/locales/vi/common.json';
import vi_home from '@/locales/vi/home.json';
import vi_tours from '@/locales/vi/tours.json';
import vi_tourDetail from '@/locales/vi/tourDetail.json';
import vi_booking from '@/locales/vi/booking.json';
import vi_bookings from '@/locales/vi/bookings.json';
import vi_auth from '@/locales/vi/auth.json';
import vi_profile from '@/locales/vi/profile.json';

// ── Chinese (Simplified) ──────────────────────────────────────────────────────
import zh_common from '@/locales/zh/common.json';
import zh_home from '@/locales/zh/home.json';
import zh_tours from '@/locales/zh/tours.json';
import zh_tourDetail from '@/locales/zh/tourDetail.json';
import zh_booking from '@/locales/zh/booking.json';
import zh_bookings from '@/locales/zh/bookings.json';
import zh_auth from '@/locales/zh/auth.json';
import zh_profile from '@/locales/zh/profile.json';

// ── Russian ───────────────────────────────────────────────────────────────────
import ru_common from '@/locales/ru/common.json';
import ru_home from '@/locales/ru/home.json';
import ru_tours from '@/locales/ru/tours.json';
import ru_tourDetail from '@/locales/ru/tourDetail.json';
import ru_booking from '@/locales/ru/booking.json';
import ru_bookings from '@/locales/ru/bookings.json';
import ru_auth from '@/locales/ru/auth.json';
import ru_profile from '@/locales/ru/profile.json';

const SUPPORTED = ['en', 'vi', 'zh', 'ru'];

const deviceCode = Localization.getLocales()[0]?.languageCode ?? 'en';
const deviceLang = SUPPORTED.includes(deviceCode) ? deviceCode : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en_common, home: en_home, tours: en_tours, tourDetail: en_tourDetail, booking: en_booking, bookings: en_bookings, auth: en_auth, profile: en_profile },
      vi: { common: vi_common, home: vi_home, tours: vi_tours, tourDetail: vi_tourDetail, booking: vi_booking, bookings: vi_bookings, auth: vi_auth, profile: vi_profile },
      zh: { common: zh_common, home: zh_home, tours: zh_tours, tourDetail: zh_tourDetail, booking: zh_booking, bookings: zh_bookings, auth: zh_auth, profile: zh_profile },
      ru: { common: ru_common, home: ru_home, tours: ru_tours, tourDetail: ru_tourDetail, booking: ru_booking, bookings: ru_bookings, auth: ru_auth, profile: ru_profile },
    },
    lng: deviceLang,
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });

export default i18n;
