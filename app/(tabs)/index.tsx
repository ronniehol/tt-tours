import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { TourCard } from '@/components/ui/TourCard';
import { Button } from '@/components/ui/Button';
import { fetchTours } from '@/lib/supabase';
import { useLanguageStore, AppLanguage } from '@/store/language-store';
import { Tour } from '@/types';

const FLAGS: { code: AppLanguage; flag: string }[] = [
  { code: 'en', flag: '🇬🇧' },
  { code: 'vi', flag: '🇻🇳' },
  { code: 'zh', flag: '🇨🇳' },
  { code: 'ru', flag: '🇷🇺' },
];

const FEATURED_SLUGS = ['ba-na-hill', 'cham-island', 'vespa-tour', 'my-son-sanctuary', 'diving-tour', 'hue-city-tour'];

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation('home');
  const { language, setLanguage } = useLanguageStore();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const [featured, setFeatured] = useState<Tour[]>([]);

  useEffect(() => {
    fetchTours(language).then((tours) => {
      setFeatured(tours.filter((t) => FEATURED_SLUGS.includes(t.slug)));
    });
  }, [language]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.teal }} edges={['top']}>
      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.cream }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          {/* Dot texture overlay (web only) */}
          {Platform.OS === 'web' && (
            <View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  opacity: 0.08,
                  // @ts-ignore — web-only CSS properties
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                },
              ]}
            />
          )}

          {/* Left orange accent bar */}
          <View style={styles.heroAccentBar} />

          <View style={[styles.heroInner, isWide && styles.heroInnerWide]}>
            <View style={styles.heroRow}>
              {/* Main content */}
              <View style={{ flex: 1 }}>
                {/* Eyebrow */}
                <View style={styles.heroEyebrow}>
                  <View style={styles.heroEyebrowLine} />
                  <Text style={styles.heroEyebrowText}>{t('hero.eyebrow')}</Text>
                </View>

                {/* Headline */}
                <Text style={[styles.heroH1, isWide && { fontSize: 84 }]}>
                  {t('hero.headline1') + '\n'}
                  <Text style={styles.heroH1Outline}>{t('hero.headline2') + '\n'}</Text>
                  {t('hero.headline3')}
                </Text>

                <Text style={styles.heroSub}>{t('hero.sub')}</Text>

                <View style={styles.heroCtas}>
                  <Button title={t('hero.cta1')} onPress={() => router.push('/(tabs)/tours')} size="lg" />
                  <Button
                    title={t('hero.cta2')}
                    variant="outline-white"
                    onPress={() => router.push('/(tabs)/tours')}
                    size="lg"
                  />
                </View>

                {/* Stats */}
                <View style={styles.heroStats}>
                  {[
                    { value: '14+', label: t('stats.tours'), orange: false },
                    { value: t('stats.departures_value'), label: t('stats.departures'), orange: true },
                    { value: '5★', label: t('stats.rated'), orange: false },
                  ].map((stat, i) => (
                    <View key={stat.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                      {i > 0 && <View style={styles.heroStatDivider} />}
                      <View style={styles.heroStat}>
                        <Text style={[styles.heroStatValue, stat.orange && { color: Colors.orange }]}>
                          {stat.value}
                        </Text>
                        <Text style={styles.heroStatLabel}>{stat.label}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Flag column */}
              <View style={styles.flagColumn}>
                {FLAGS.map((item) => {
                  const active = language === item.code;
                  return (
                    <TouchableOpacity
                      key={item.code}
                      onPress={() => setLanguage(item.code)}
                      activeOpacity={0.7}
                      style={[styles.flagBtn, active && styles.flagBtnActive]}
                    >
                      <Text style={styles.flagEmoji}>{item.flag}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Bottom orange strip */}
          <View style={styles.heroBottomStrip} />
        </View>

        {/* ── How it works ── */}
        <View style={styles.stepsBar}>
          {[
            { n: '01', title: t('steps.title1'), sub: t('steps.sub1') },
            { n: '02', title: t('steps.title2'), sub: t('steps.sub2') },
            { n: '03', title: t('steps.title3'), sub: t('steps.sub3') },
          ].map((step) => (
            <View key={step.n} style={styles.step}>
              <Text style={styles.stepNum}>{step.n}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepSub}>{step.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Featured Tours ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <View style={styles.sectionEyebrow}>
                <View style={styles.sectionEyebrowLine} />
                <Text style={styles.sectionEyebrowText}>{t('featured.eyebrow')}</Text>
              </View>
              <Text style={styles.sectionTitle}>{t('featured.title')}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/tours')}>
              <Text style={styles.viewAllLink}>{t('featured.viewAll')}</Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.cardGrid,
              isWide && { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' },
            ]}
          >
            {featured.map((tour, i) => (
              <TourCard
                key={tour.id}
                tour={tour}
                index={i}
                style={
                  isWide
                    ? { ...styles.card, width: '31%', marginHorizontal: '1%' }
                    : styles.card
                }
              />
            ))}
          </View>
        </View>

        {/* ── CTA Banner ── */}
        <View style={styles.cta}>
          <Text style={styles.ctaHeadline}>{t('cta.headline')}</Text>
          <Text style={styles.ctaSub}>{t('cta.sub')}</Text>
          <Button
            title={t('cta.button')}
            onPress={() => router.push('/(tabs)/tours')}
            size="lg"
            style={{ alignSelf: 'center', marginTop: 24, backgroundColor: Colors.white }}
            textStyle={{ color: Colors.teal }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: Colors.teal,
    position: 'relative',
    paddingBottom: 0,
  },
  heroAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: Colors.orange,
    zIndex: 1,
  },
  heroInner: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 48,
  },
  heroInnerWide: {
    maxWidth: 900,
    paddingHorizontal: 60,
  },
  heroEyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  heroEyebrowLine: { width: 28, height: 2, backgroundColor: Colors.orange },
  heroEyebrowText: {
    color: Colors.orange,
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 11,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  heroH1: {
    fontFamily: 'BarlowCondensed_700Bold_Italic',
    fontSize: 62,
    lineHeight: 58,
    color: Colors.white,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  heroH1Outline: {
    ...(Platform.OS === 'web'
      ? ({
          WebkitTextStroke: `3px ${Colors.orange}`,
          color: 'transparent',
        } as any)
      : { color: Colors.orange }),
  },
  heroSub: {
    color: 'rgba(255,255,255,0.6)',
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 420,
    marginBottom: 28,
  },
  heroCtas: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 32,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  heroStat: { alignItems: 'flex-start' },
  heroStatValue: {
    fontFamily: 'BarlowCondensed_700Bold_Italic',
    fontSize: 34,
    color: Colors.white,
    textTransform: 'uppercase',
  },
  heroStatLabel: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  heroStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  heroBottomStrip: { height: 4, backgroundColor: Colors.orange },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  flagColumn: {
    flexDirection: 'column',
    gap: 8,
    paddingTop: 4,
  },
  flagBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  flagBtnActive: {
    backgroundColor: Colors.orange,
  },
  flagEmoji: {
    fontSize: 22,
  },

  stepsBar: {
    backgroundColor: Colors.tealMid,
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 14,
  },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  stepNum: {
    fontFamily: 'BarlowCondensed_700Bold_Italic',
    fontSize: 34,
    color: 'rgba(249,115,22,0.45)',
    lineHeight: 34,
    minWidth: 40,
  },
  stepTitle: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 14, color: Colors.white },
  stepSub: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
    lineHeight: 17,
  },

  section: { paddingHorizontal: 16, paddingTop: 36, paddingBottom: 12 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  sectionEyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  sectionEyebrowLine: { width: 24, height: 3, backgroundColor: Colors.orange },
  sectionEyebrowText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 10,
    color: Colors.orange,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontFamily: 'BarlowCondensed_700Bold_Italic',
    fontSize: 36,
    color: Colors.teal,
    textTransform: 'uppercase',
    lineHeight: 36,
  },
  viewAllLink: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 13,
    color: Colors.teal,
    textDecorationLine: 'underline',
  },
  cardGrid: { gap: 14 },
  card: { borderRadius: 12, overflow: 'hidden' },

  cta: {
    backgroundColor: Colors.orange,
    marginHorizontal: 16,
    marginVertical: 24,
    padding: 32,
    alignItems: 'center',
  },
  ctaHeadline: {
    fontFamily: 'BarlowCondensed_700Bold_Italic',
    fontSize: 44,
    color: Colors.white,
    textTransform: 'uppercase',
    textAlign: 'center',
    lineHeight: 44,
  },
  ctaSub: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 10,
  },
});
