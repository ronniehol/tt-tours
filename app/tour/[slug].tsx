import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  useWindowDimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { fetchTourBySlug } from '@/lib/supabase';
import { formatVnd } from '@/lib/format';
import { useLanguageStore } from '@/store/language-store';
import { Tour } from '@/types';

export default function TourDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { t } = useTranslation('tourDetail');
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const language = useLanguageStore((s) => s.language);
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      fetchTourBySlug(slug, language).then(setTour).finally(() => setLoading(false));
    }
  }, [slug, language]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.cream, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.orange} />
      </SafeAreaView>
    );
  }

  if (!tour) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.cream, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 18, color: Colors.ink }}>{t('cta.notFound')}</Text>
        <Button title={t('cta.backToTours')} onPress={() => router.back()} style={{ marginTop: 16 }} />
      </SafeAreaView>
    );
  }

  const [c1, c2] = tour.thumbGradient;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.cream }} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Hero image */}
        <View
          style={[
            styles.heroImage,
            tour.coverImageUrl
              ? { backgroundColor: c1 }
              : Platform.OS === 'web'
              ? ({ background: `linear-gradient(145deg, ${c1} 0%, ${c2} 100%)` } as any)
              : { backgroundColor: c1 },
          ]}
        >
          {tour.coverImageUrl && (
            <Image
              source={{ uri: `${tour.coverImageUrl}&w=1200&q=80&fit=crop` }}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
            />
          )}
          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>

          {/* Overlay gradient */}
          <View style={[StyleSheet.absoluteFillObject, styles.heroOverlay]} />

          {/* Hero content */}
          <View style={styles.heroContent}>
            <Badge label={tour.duration.includes('Full') ? t('labels.fullDay') : t('labels.halfDay')} variant="white" />
            <Text style={styles.heroTitle}>{tour.name.toUpperCase()}</Text>
            <View style={styles.heroMeta}>
              <Text style={styles.heroMetaText}>🕐 {tour.departureTime}</Text>
              <Text style={styles.heroMetaText}>👥 {t('labels.maxGroup', { count: tour.maxGroupSize })}</Text>
              <Text style={styles.heroMetaText}>⏱ {tour.duration}</Text>
            </View>
          </View>

          {/* Bottom orange strip */}
          <View style={styles.heroStrip} />
        </View>

        {/* Content */}
        <View style={[styles.content, isWide && { maxWidth: 860, alignSelf: 'center', width: '100%' }]}>

          {/* Price + CTA row */}
          <View style={styles.priceCta}>
            <View>
              <Text style={styles.priceLabel}>{t('labels.from')}</Text>
              <Text style={styles.priceValue}>{formatVnd(tour.priceVnd)}</Text>
              <Text style={styles.pricePp}>{t('labels.perPerson')}</Text>
            </View>
            <Button
              title={t('cta.book')}
              onPress={() => router.push(`/booking/${tour.slug}`)}
              size="lg"
              style={{ flex: 1, alignItems: 'center' }}
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <SectionHeading number="01" title={t('sections.about')} />
            <Text style={styles.bodyText}>{tour.description}</Text>
          </View>

          {/* Highlights */}
          <View style={styles.section}>
            <SectionHeading number="02" title={t('sections.highlights')} />
            {tour.highlights.map((h) => (
              <View key={h} style={styles.bulletRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>{h}</Text>
              </View>
            ))}
          </View>

          {/* Included / Excluded */}
          <View style={styles.section}>
            <SectionHeading number="03" title={t('sections.whatsIncluded')} />
            <View style={[styles.inclExclGrid, isWide && { flexDirection: 'row', gap: 16 }]}>
              <View style={[styles.inclCard, { flex: isWide ? 1 : undefined }]}>
                <Text style={styles.inclCardTitle}>{t('sections.included')}</Text>
                {tour.included.map((item) => (
                  <Text key={item} style={styles.inclItem}>• {item}</Text>
                ))}
              </View>
              <View style={[styles.exclCard, { flex: isWide ? 1 : undefined, marginTop: isWide ? 0 : 10 }]}>
                <Text style={styles.exclCardTitle}>{t('sections.notIncluded')}</Text>
                {tour.excluded.map((item) => (
                  <Text key={item} style={styles.exclItem}>• {item}</Text>
                ))}
              </View>
            </View>
          </View>

          {/* Meeting point */}
          <View style={styles.section}>
            <SectionHeading number="04" title={t('sections.meetingPoint')} />
            <View style={styles.meetingCard}>
              <Text style={styles.meetingIcon}>📍</Text>
              <Text style={styles.meetingText}>{tour.meetingPoint}</Text>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Sticky CTA footer */}
      <View style={styles.stickyFooter}>
        <View>
          <Text style={styles.stickyPrice}>{formatVnd(tour.priceVnd)}+</Text>
          <Text style={styles.stickyPriceLabel}>{t('labels.perPerson')}</Text>
        </View>
        <Button
          title={t('cta.bookNow')}
          onPress={() => router.push(`/booking/${tour.slug}`)}
          size="lg"
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
}

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionNumber}>{number}</Text>
      <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    height: 300,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  heroOverlay: {
    background: undefined,
    backgroundColor: 'rgba(0,0,0,0.35)',
  } as any,
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    zIndex: 10,
  },
  backBtnText: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 13,
    color: Colors.white,
  },
  heroContent: { padding: 20, zIndex: 2 },
  heroTitle: {
    fontFamily: 'BarlowCondensed_700Bold_Italic',
    fontSize: 42,
    color: Colors.white,
    textTransform: 'uppercase',
    lineHeight: 42,
    marginTop: 8,
    marginBottom: 10,
  },
  heroMeta: { flexDirection: 'row', gap: 14, flexWrap: 'wrap' },
  heroMetaText: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },
  heroStrip: { height: 4, backgroundColor: Colors.orange },

  content: { padding: 20 },

  priceCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.white,
    padding: 16,
    marginBottom: 20,
    borderRadius: 10,
  },
  priceLabel: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 11, color: Colors.muted, textTransform: 'uppercase', letterSpacing: 1 },
  priceValue: { fontFamily: 'BarlowCondensed_700Bold_Italic', fontSize: 34, color: Colors.orange, textTransform: 'uppercase' },
  pricePp: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 11, color: Colors.muted },

  section: { marginBottom: 24 },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: Colors.orange,
  },
  sectionNumber: {
    fontFamily: 'BarlowCondensed_700Bold_Italic',
    fontSize: 22,
    color: 'rgba(249,115,22,0.4)',
  },
  sectionTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 13,
    color: Colors.ink,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  bodyText: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 14, color: '#4B5563', lineHeight: 22 },

  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.orange,
    marginTop: 7,
  },
  bulletText: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 14, color: Colors.ink, flex: 1, lineHeight: 21 },

  inclExclGrid: {},
  inclCard: { backgroundColor: 'rgba(16,185,129,0.06)', padding: 14, borderRadius: 8, borderLeftWidth: 3, borderLeftColor: '#10B981' },
  inclCardTitle: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 12, color: '#065F46', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  inclItem: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 13, color: '#065F46', lineHeight: 21 },
  exclCard: { backgroundColor: 'rgba(239,68,68,0.06)', padding: 14, borderRadius: 8, borderLeftWidth: 3, borderLeftColor: '#EF4444' },
  exclCardTitle: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 12, color: '#991B1B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  exclItem: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 13, color: '#991B1B', lineHeight: 21 },

  meetingCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  meetingIcon: { fontSize: 20 },
  meetingText: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 14, color: Colors.ink, flex: 1, lineHeight: 21 },

  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.teal,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  stickyPrice: {
    fontFamily: 'BarlowCondensed_700Bold_Italic',
    fontSize: 28,
    color: Colors.orange,
    textTransform: 'uppercase',
  },
  stickyPriceLabel: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
});
