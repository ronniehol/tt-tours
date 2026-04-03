import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useBookingStore } from '@/store/booking-store';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { formatVnd } from '@/lib/format';

export default function ConfirmationScreen() {
  const router = useRouter();
  const { t } = useTranslation('booking');
  const { confirmedBooking, clearConfirmedBooking, resetDraft } = useBookingStore();

  const handleDone = () => {
    clearConfirmedBooking();
    resetDraft();
    router.replace('/');
  };

  if (!confirmedBooking) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.cream, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16, color: Colors.ink, textAlign: 'center' }}>
          {t('confirmation.noBooking')}
        </Text>
        <Button title={t('promo.button', { ns: 'bookings' })} onPress={() => router.replace('/(tabs)/tours')} style={{ marginTop: 16 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.teal }} edges={['top']}>
      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.cream }}
        contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Success badge */}
        <View style={styles.successBadge}>
          <Text style={styles.successIcon}>✓</Text>
        </View>

        <Text style={styles.headline}>{t('confirmation.title').toUpperCase()}</Text>
        <Text style={styles.subline}>
          {t('confirmation.emailSent', { email: confirmedBooking.guestEmail })}
        </Text>

        {/* Booking card */}
        <View style={styles.card}>
          <View style={styles.refRow}>
            <Text style={styles.refLabel}>{t('confirmation.reference')}</Text>
            <Text style={styles.refValue}>{confirmedBooking.bookingRef}</Text>
          </View>

          <View style={styles.divider} />

          {[
            { label: t('confirmation.tour'), value: (confirmedBooking as any).tourName ?? confirmedBooking.tourId },
            { label: t('confirmation.date'), value: confirmedBooking.travelDate },
            { label: t('confirmation.name'), value: confirmedBooking.guestName },
            { label: t('confirmation.email'), value: confirmedBooking.guestEmail },
            {
              label: t('confirmation.guests'),
              value: `${t('confirmation.adults', { count: confirmedBooking.numAdults })}${confirmedBooking.numChildren ? `, ${t('confirmation.children', { count: confirmedBooking.numChildren })}` : ''}`,
            },
            { label: t('confirmation.totalPaid'), value: formatVnd(confirmedBooking.totalPriceVnd) },
          ].map((row) => (
            <View key={row.label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{row.label}</Text>
              <Text style={styles.detailValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* What's next */}
        <View style={styles.whatNextCard}>
          <Text style={styles.whatNextTitle}>{t('confirmation.whatNext').toUpperCase()}</Text>
          {[
            t('confirmation.step1'),
            t('confirmation.step2'),
            t('confirmation.step3'),
            t('confirmation.step4'),
          ].map((step) => (
            <Text key={step} style={styles.whatNextItem}>{step}</Text>
          ))}
        </View>

        <Button title={t('confirmation.backToHome')} onPress={handleDone} fullWidth style={{ marginTop: 8 }} />
        <Button
          title={t('confirmation.bookAnother')}
          variant="outline-teal"
          onPress={() => {
            clearConfirmedBooking();
            resetDraft();
            router.replace('/(tabs)/tours');
          }}
          fullWidth
          style={{ marginTop: 10 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  successBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#10B981',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  successIcon: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 36, color: Colors.white },
  headline: {
    fontFamily: 'BarlowCondensed_700Bold_Italic',
    fontSize: 52,
    color: Colors.teal,
    textTransform: 'uppercase',
    lineHeight: 50,
    textAlign: 'center',
    marginBottom: 12,
  },
  subline: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  refRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  refLabel: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 11,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  refValue: {
    fontFamily: 'BarlowCondensed_700Bold_Italic',
    fontSize: 32,
    color: Colors.orange,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 14 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 13, color: Colors.muted },
  detailValue: { fontFamily: 'SpaceGrotesk_600SemiBold', fontSize: 13, color: Colors.ink, maxWidth: '60%', textAlign: 'right' },
  whatNextCard: {
    backgroundColor: Colors.teal,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    gap: 10,
  },
  whatNextTitle: {
    fontFamily: 'BarlowCondensed_700Bold_Italic',
    fontSize: 18,
    color: Colors.orange,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  whatNextItem: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 21,
  },
});
