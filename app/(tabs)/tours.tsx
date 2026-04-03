import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { TourCard } from '@/components/ui/TourCard';
import { TourCategory, Tour } from '@/types';
import { fetchTours } from '@/lib/supabase';
import { useLanguageStore } from '@/store/language-store';

const CATEGORY_IDS: { id: TourCategory | 'all'; emoji: string }[] = [
  { id: 'all', emoji: '🗺' },
  { id: 'cultural', emoji: '🏛' },
  { id: 'adventure', emoji: '⛰' },
  { id: 'water', emoji: '🤿' },
  { id: 'nature', emoji: '🌿' },
  { id: 'food', emoji: '🍜' },
];

export default function ToursScreen() {
  const { t } = useTranslation('tours');
  const language = useLanguageStore((s) => s.language);
  const [activeCategory, setActiveCategory] = useState<TourCategory | 'all'>('all');
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  useEffect(() => {
    setLoading(true);
    fetchTours(language).then(setTours).finally(() => setLoading(false));
  }, [language]);

  const filtered =
    activeCategory === 'all' ? tours : tours.filter((t) => t.category === activeCategory);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.teal }} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAccent} />
          <Text style={styles.headerTitle}>{t('header.title').toUpperCase()}</Text>
        </View>
        <Text style={styles.headerCount}>{t('header.count', { count: filtered.length })}</Text>
      </View>

      {/* Category filter */}
      <View style={{ backgroundColor: Colors.tealMid }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}
        >
          {CATEGORY_IDS.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveCategory(cat.id as TourCategory | 'all')}
              style={[
                styles.filterChip,
                activeCategory === cat.id && styles.filterChipActive,
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.filterEmoji}>{cat.emoji}</Text>
              <Text
                style={[
                  styles.filterLabel,
                  activeCategory === cat.id && styles.filterLabelActive,
                ]}
              >
                {t(`categories.${cat.id}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tour list */}
      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.cream }}
        contentContainerStyle={[
          styles.list,
          isWide && { flexDirection: 'row', flexWrap: 'wrap' },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color={Colors.orange} style={{ marginTop: 60 }} />
        ) : filtered.map((tour, i) => (
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.teal,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerAccent: { width: 4, height: 22, backgroundColor: Colors.orange },
  headerTitle: {
    fontFamily: 'BarlowCondensed_700Bold_Italic',
    fontSize: 26,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerCount: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  filterBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  filterChipActive: {
    backgroundColor: Colors.orange,
    borderColor: Colors.orange,
  },
  filterEmoji: { fontSize: 13 },
  filterLabel: {
    fontFamily: 'SpaceGrotesk_500Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
  },
  filterLabelActive: { color: Colors.white },
  list: {
    padding: 14,
    gap: 14,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 2,
  },
});
