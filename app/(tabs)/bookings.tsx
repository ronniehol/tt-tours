import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { fetchBookingByRef } from '@/lib/supabase';
import { Colors } from '@/constants/theme';
import { formatVnd } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Booking } from '@/types';

const STATUS_CONFIG = {
  pending: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  confirmed: { color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  cancelled: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  completed: { color: Colors.teal, bg: 'rgba(11,76,92,0.1)' },
};

export default function BookingsScreen() {
  const router = useRouter();
  const { t } = useTranslation('bookings');
  const [ref, setRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState('');

  const lookup = async () => {
    const trimmed = ref.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    setBooking(null);
    try {
      const data = await fetchBookingByRef(trimmed);
      setBooking(data as unknown as Booking);
    } catch {
      setError(t('lookup.notFound'));
    } finally {
      setLoading(false);
    }
  };

  const statusCfg = booking ? STATUS_CONFIG[booking.status] : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.teal }} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAccent} />
          <Text style={styles.headerTitle}>{t('header').toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.cream }}
        contentContainerStyle={{ padding: 20, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Lookup card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('lookup.title')}</Text>
          <Text style={styles.cardSub}>{t('lookup.sub')}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={ref}
              onChangeText={setRef}
              placeholder={t('lookup.placeholder')}
              placeholderTextColor={Colors.muted}
              autoCapitalize="characters"
              autoCorrect={false}
              onSubmitEditing={lookup}
            />
            <Button title={t('lookup.button')} onPress={lookup} loading={loading} size="md" />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {/* Result card */}
        {booking && statusCfg && (
          <View style={styles.card}>
            <View style={styles.resultHeader}>
              <View>
                <Text style={styles.refLabel}>{t('labels.bookingReference')}</Text>
                <Text style={styles.refValue}>{booking.bookingRef}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                <Text style={[styles.statusText, { color: statusCfg.color }]}>
                  {t(`status.${booking.status}`)}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsGrid}>
              <DetailRow label={t('labels.tour')} value={(booking as any).tours?.name ?? booking.tourId} />
              <DetailRow label={t('labels.name')} value={booking.guestName} />
              <DetailRow label={t('labels.email')} value={booking.guestEmail} />
              <DetailRow label={t('labels.date')} value={booking.travelDate} />
              <DetailRow
                label={t('labels.guests')}
                value={`${t('labels.adults', { count: booking.numAdults })}${booking.numChildren ? `, ${t('labels.children', { count: booking.numChildren })}` : ''}`}
              />
              <DetailRow label={t('labels.total')} value={formatVnd((booking as any).total_price_vnd ?? 0)} />
            </View>

            {booking.status === 'confirmed' && (
              <View style={styles.confirmedNote}>
                <Text style={styles.confirmedNoteText}>{t('confirmedNote')}</Text>
              </View>
            )}
          </View>
        )}

        {/* Promo to book */}
        <View style={styles.promoCard}>
          <Text style={styles.promoTitle}>{t('promo.title').toUpperCase()}</Text>
          <Text style={styles.promoSub}>{t('promo.sub')}</Text>
          <Button
            title={t('promo.button')}
            onPress={() => router.push('/(tabs)/tours')}
            size="md"
            style={{ marginTop: 16, alignSelf: 'flex-start' }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
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
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
  },
  cardTitle: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16, color: Colors.ink, marginBottom: 6 },
  cardSub: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 13, color: Colors.muted, lineHeight: 19, marginBottom: 16 },
  inputRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'SpaceGrotesk_500Medium',
    fontSize: 15,
    color: Colors.ink,
    borderRadius: 6,
  },
  errorText: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 13,
    color: '#EF4444',
    marginTop: 10,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  refLabel: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 11, color: Colors.muted, textTransform: 'uppercase', letterSpacing: 1 },
  refValue: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 18, color: Colors.ink, marginTop: 3 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 4 },
  statusText: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 16 },
  detailsGrid: { gap: 10 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  detailLabel: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 13, color: Colors.muted, flex: 1 },
  detailValue: { fontFamily: 'SpaceGrotesk_600SemiBold', fontSize: 13, color: Colors.ink, flex: 2, textAlign: 'right' },
  confirmedNote: {
    marginTop: 16,
    backgroundColor: 'rgba(16,185,129,0.08)',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  confirmedNoteText: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 13, color: '#065F46', lineHeight: 19 },
  promoCard: {
    backgroundColor: Colors.teal,
    borderRadius: 12,
    padding: 24,
  },
  promoTitle: {
    fontFamily: 'BarlowCondensed_700Bold_Italic',
    fontSize: 36,
    color: Colors.white,
    textTransform: 'uppercase',
    lineHeight: 36,
  },
  promoSub: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 6 },
});
