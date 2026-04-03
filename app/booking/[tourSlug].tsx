import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useBookingStore } from '@/store/booking-store';
import { createBooking, fetchTourBySlug } from '@/lib/supabase';
import { formatVnd } from '@/lib/format';
import { useAuthStore } from '@/store/auth-store';
import { createPaymentIntent, toSmallestUnit, getStripe } from '@/lib/stripe';
import { Tour } from '@/types';

// Stripe Elements — web only import
let Elements: any = null;
let PaymentElement: any = null;
let useStripe: any = null;
let useElements: any = null;
if (Platform.OS === 'web') {
  const stripeReact = require('@stripe/react-stripe-js');
  Elements = stripeReact.Elements;
  PaymentElement = stripeReact.PaymentElement;
  useStripe = stripeReact.useStripe;
  useElements = stripeReact.useElements;
}

// ─── Validation schema ────────────────────────────────────────────────────────

const schema = z.object({
  guestName: z.string().min(2, 'Full name required'),
  guestEmail: z.string().email('Valid email required'),
  guestPhone: z.string().min(7, 'Phone number required'),
  travelDate: z.string().min(1, 'Travel date required'),
  numAdults: z.number().min(1, 'At least 1 adult').max(20),
  numChildren: z.number().min(0).max(20),
  specialRequests: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// STEPS computed inside component to support translations

// ─── Stripe Payment form (inner — must be inside <Elements>) ─────────────────

function StripePaymentForm({
  total,
  bookingRef,
  onSuccess,
  onError,
}: {
  total: number;
  bookingRef: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe?.();
  const elements = useElements?.();
  const { t: paymentT } = useTranslation('booking');
  const [paying, setPaying] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setPaying(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // We handle redirect ourselves
          return_url: Platform.OS === 'web' ? window.location.origin + '/booking/confirmation' : '',
        },
        redirect: 'if_required',
      });
      if (error) {
        onError(error.message ?? 'Payment failed. Please try again.');
      } else {
        onSuccess();
      }
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Payment failed.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <View>
      {/* Stripe's PaymentElement renders card / Apple Pay / Google Pay etc. */}
      <View style={styles.stripeElementWrap}>
        {PaymentElement && <PaymentElement />}
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>{paymentT('payment.totalDue').toUpperCase()}</Text>
        <Text style={styles.totalValue}>{formatVnd(total)}</Text>
      </View>
      <Button
        title={paying ? paymentT('payment.processing') : paymentT('payment.pay', { amount: formatVnd(total) })}
        onPress={handlePay}
        loading={paying}
        fullWidth
        style={{ marginTop: 16 }}
      />
      <Text style={styles.secureNote}>{paymentT('payment.secure')}</Text>
    </View>
  );
}

// ─── Main booking screen ──────────────────────────────────────────────────────

export default function BookingScreen() {
  const { tourSlug } = useLocalSearchParams<{ tourSlug: string }>();
  const router = useRouter();
  const { t } = useTranslation('booking');
  const user = useAuthStore((s) => s.user);
  const { setConfirmedBooking } = useBookingStore();

  const STEPS = [t('steps.details'), t('steps.review'), t('steps.payment')];

  const [tour, setTour] = useState<Tour | null>(null);
  const [tourLoading, setTourLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Stripe state
  const [stripePromise] = useState(() => (Platform.OS === 'web' ? getStripe() : null));
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [pendingBookingRef, setPendingBookingRef] = useState<string | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);

  // Fetch tour from Supabase
  useEffect(() => {
    if (tourSlug) {
      fetchTourBySlug(tourSlug)
        .then(setTour)
        .catch(() => setTour(null))
        .finally(() => setTourLoading(false));
    }
  }, [tourSlug]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      guestName: user?.name ?? '',
      guestEmail: user?.email ?? '',
      guestPhone: '',
      travelDate: '',
      numAdults: 1,
      numChildren: 0,
      specialRequests: '',
    },
  });

  const watched = watch();
  const total = tour ? tour.priceVnd * (watched.numAdults + watched.numChildren * 0.5) : 0;

  const showError = (msg: string) => {
    if (Platform.OS === 'web') window.alert(msg);
    else Alert.alert('Error', msg);
  };

  const onSubmitDetails = handleSubmit(() => setStep(1));

  // Step 2 → Step 3: create booking + PaymentIntent
  const onProceedToPayment = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      // 1. Create the booking in Supabase (status: pending)
      const booking = await createBooking({
        tourId: tour!.id,
        guestName: values.guestName,
        guestEmail: values.guestEmail,
        guestPhone: values.guestPhone,
        travelDate: values.travelDate,
        numAdults: values.numAdults,
        numChildren: values.numChildren,
        totalPriceVnd: total,
        specialRequests: values.specialRequests,
        userId: user?.id,
      });
      setPendingBookingRef(booking.bookingRef);
      setConfirmedBooking({ ...booking, tourName: tour!.name } as any);

      // 2. Create Stripe PaymentIntent
      setStripeLoading(true);
      const { clientSecret: cs } = await createPaymentIntent(
        toSmallestUnit(total, 'vnd'),
        booking.bookingRef,
        'vnd'
      );
      setClientSecret(cs);
      setStep(2);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
      setStripeLoading(false);
    }
  });

  const onPaymentSuccess = useCallback(async () => {
    // Send confirmation email (fire and forget — don't block navigation)
    try {
      const currentBooking = useBookingStore.getState().confirmedBooking;
      if (currentBooking) {
        fetch(
          `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/send-booking-email`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              booking: currentBooking,
              tourName: tour?.name ?? '',
            }),
          }
        );
      }
    } catch (_) {
      // Email failure shouldn't block confirmation
    }
    router.replace('/booking/confirmation');
  }, [router, tour]);

  const onPaymentError = useCallback((msg: string) => {
    showError(msg);
  }, []);

  // ── Loading / not found states ──
  if (tourLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.cream, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.orange} />
      </SafeAreaView>
    );
  }

  if (!tour) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.cream, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16 }}>{t('header.notFound')}</Text>
        <Button title={t('review.editDetails')} onPress={() => router.back()} style={{ marginTop: 12 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.cream }} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => (step > 0 ? setStep(step - 1) : router.back())} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{t('header.title').toUpperCase()}</Text>
          <Text style={styles.headerSub}>{tour.name}</Text>
        </View>
      </View>

      {/* Step indicator */}
      <View style={styles.stepBar}>
        {STEPS.map((s, i) => (
          <View key={s} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={[styles.stepDot, i <= step && styles.stepDotActive]}>
              <Text style={[styles.stepDotText, i <= step && { color: Colors.white }]}>{i + 1}</Text>
            </View>
            <Text style={[styles.stepLabel, i === step && { color: Colors.orange }]}>{s}</Text>
            {i < STEPS.length - 1 && (
              <View style={[styles.stepConnector, i < step && { backgroundColor: Colors.orange }]} />
            )}
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Step 0: Guest details ── */}
        {step === 0 && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>{t('form.title').toUpperCase()}</Text>

            <Field label={t('form.fullName')} error={errors.guestName?.message}>
              <Controller control={control} name="guestName"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput style={[styles.input, errors.guestName && styles.inputError]}
                    value={value} onChangeText={onChange} onBlur={onBlur}
                    placeholder="Jane Smith" placeholderTextColor={Colors.muted} />
                )} />
            </Field>

            <Field label={t('form.email')} error={errors.guestEmail?.message}>
              <Controller control={control} name="guestEmail"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput style={[styles.input, errors.guestEmail && styles.inputError]}
                    value={value} onChangeText={onChange} onBlur={onBlur}
                    placeholder="jane@email.com" placeholderTextColor={Colors.muted}
                    keyboardType="email-address" autoCapitalize="none" />
                )} />
            </Field>

            <Field label={t('form.phone')} error={errors.guestPhone?.message}>
              <Controller control={control} name="guestPhone"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput style={[styles.input, errors.guestPhone && styles.inputError]}
                    value={value} onChangeText={onChange} onBlur={onBlur}
                    placeholder="+84 90 123 4567" placeholderTextColor={Colors.muted}
                    keyboardType="phone-pad" />
                )} />
            </Field>

            <Field label={t('form.travelDate')} error={errors.travelDate?.message}>
              <Controller control={control} name="travelDate"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput style={[styles.input, errors.travelDate && styles.inputError]}
                    value={value} onChangeText={onChange} onBlur={onBlur}
                    placeholder="YYYY-MM-DD" placeholderTextColor={Colors.muted} />
                )} />
            </Field>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Field label={t('form.adults')} error={errors.numAdults?.message} style={{ flex: 1 }}>
                <Controller control={control} name="numAdults"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput style={[styles.input, errors.numAdults && styles.inputError]}
                      value={String(value)} onChangeText={(v) => onChange(parseInt(v, 10) || 1)}
                      onBlur={onBlur} keyboardType="number-pad" />
                  )} />
              </Field>
              <Field label={t('form.children')} error={errors.numChildren?.message} style={{ flex: 1 }}>
                <Controller control={control} name="numChildren"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput style={[styles.input, errors.numChildren && styles.inputError]}
                      value={String(value)} onChangeText={(v) => onChange(parseInt(v, 10) || 0)}
                      onBlur={onBlur} keyboardType="number-pad" />
                  )} />
              </Field>
            </View>

            <Field label={t('form.specialRequests')}>
              <Controller control={control} name="specialRequests"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                    value={value} onChangeText={onChange} onBlur={onBlur}
                    placeholder={t('form.specialRequestsPlaceholder')}
                    placeholderTextColor={Colors.muted} multiline />
                )} />
            </Field>

            <Button title={t('form.continueToReview')} onPress={onSubmitDetails} fullWidth style={{ marginTop: 8 }} />
          </View>
        )}

        {/* ── Step 1: Review ── */}
        {step === 1 && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>{t('review.title').toUpperCase()}</Text>

            {[
              { label: t('review.tour'), value: tour.name },
              { label: t('review.date'), value: watched.travelDate },
              { label: t('review.guests'), value: `${t('review.adults', { count: watched.numAdults })}${watched.numChildren ? `, ${t('review.children', { count: watched.numChildren })}` : ''}` },
              { label: t('review.name'), value: watched.guestName },
              { label: t('review.email'), value: watched.guestEmail },
              { label: t('review.phone'), value: watched.guestPhone },
            ].map((row) => (
              <View key={row.label} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{row.label}</Text>
                <Text style={styles.summaryValue}>{row.value}</Text>
              </View>
            ))}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t('review.total').toUpperCase()}</Text>
              <Text style={styles.totalValue}>{formatVnd(total)}</Text>
            </View>

            <Button
              title={t('review.proceedToPayment')}
              onPress={onProceedToPayment}
              loading={submitting || stripeLoading}
              fullWidth
              style={{ marginTop: 8 }}
            />
            <Button title={t('review.editDetails')} variant="outline-teal" onPress={() => setStep(0)} fullWidth style={{ marginTop: 10 }} />
          </View>
        )}

        {/* ── Step 2: Payment (Stripe Elements) ── */}
        {step === 2 && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>{t('payment.title').toUpperCase()}</Text>
            <Text style={styles.paymentSub}>{t('payment.sub')}</Text>

            {stripeLoading || !clientSecret ? (
              <ActivityIndicator size="large" color={Colors.orange} style={{ marginVertical: 32 }} />
            ) : Platform.OS === 'web' && Elements && stripePromise ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: Colors.orange,
                      colorBackground: '#ffffff',
                      colorText: Colors.ink,
                      borderRadius: '6px',
                      fontFamily: 'SpaceGrotesk, system-ui, sans-serif',
                    },
                  },
                }}
              >
                <StripePaymentForm
                  total={total}
                  bookingRef={pendingBookingRef ?? ''}
                  onSuccess={onPaymentSuccess}
                  onError={onPaymentError}
                />
              </Elements>
            ) : (
              // Mobile fallback — redirect to Stripe hosted page (Phase 3)
              <View style={styles.mobileFallback}>
                <Text style={styles.mobileFallbackText}>{t('payment.mobileFallback')}</Text>
              </View>
            )}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Field helper ─────────────────────────────────────────────────────────────

function Field({ label, error, children, style }: {
  label: string; error?: string; children: React.ReactNode; style?: object;
}) {
  return (
    <View style={[{ marginBottom: 16 }, style]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
      {error && <Text style={styles.fieldError}>{error}</Text>}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.teal,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  backBtn: { padding: 6 },
  backBtnText: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 20, color: Colors.white },
  headerTitle: { fontFamily: 'BarlowCondensed_700Bold_Italic', fontSize: 22, color: Colors.white, textTransform: 'uppercase' },
  headerSub: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 1 },

  stepBar: {
    backgroundColor: Colors.tealMid,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 6,
  },
  stepDot: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  stepDotActive: { backgroundColor: Colors.orange },
  stepDotText: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  stepLabel: { fontFamily: 'SpaceGrotesk_500Medium', fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  stepConnector: { width: 20, height: 1.5, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 4 },

  scroll: { padding: 16, paddingBottom: 40 },

  formCard: { backgroundColor: Colors.white, borderRadius: 12, padding: 20 },
  formTitle: {
    fontFamily: 'BarlowCondensed_700Bold_Italic',
    fontSize: 24, color: Colors.teal,
    textTransform: 'uppercase',
    marginBottom: 20, letterSpacing: 1,
  },

  fieldLabel: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 11, color: Colors.ink,
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6,
  },
  input: {
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 12,
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 15, color: Colors.ink, borderRadius: 6,
  },
  inputError: { borderColor: '#EF4444' },
  fieldError: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 12, color: '#EF4444', marginTop: 4 },

  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  summaryLabel: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 13, color: Colors.muted },
  summaryValue: { fontFamily: 'SpaceGrotesk_600SemiBold', fontSize: 13, color: Colors.ink, maxWidth: '60%', textAlign: 'right' },

  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 16, marginTop: 8,
    borderTopWidth: 2, borderTopColor: Colors.orange,
  },
  totalLabel: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 13, color: Colors.ink, letterSpacing: 1.5, textTransform: 'uppercase' },
  totalValue: { fontFamily: 'BarlowCondensed_700Bold_Italic', fontSize: 28, color: Colors.orange, textTransform: 'uppercase' },

  paymentSub: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 13, color: Colors.muted, lineHeight: 20, marginBottom: 20 },

  stripeElementWrap: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    minHeight: 120,
  },

  mobileFallback: {
    padding: 24, alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 8, marginBottom: 20,
  },
  mobileFallbackText: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 14, color: Colors.muted, textAlign: 'center', lineHeight: 22 },

  secureNote: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 12, color: Colors.muted, textAlign: 'center', marginTop: 12 },
});
