import { loadStripe } from '@stripe/stripe-js';

const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

// Singleton Stripe instance (web only)
let stripePromise: ReturnType<typeof loadStripe> | null = null;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}

/**
 * Create a Stripe PaymentIntent via the Supabase Edge Function.
 * currency is ISO 4217 lowercase: 'usd', 'eur', 'vnd', 'aud', etc.
 * amount is already in the smallest currency unit (cents / pence / etc.)
 */
export async function createPaymentIntent(
  amountInSmallestUnit: number,
  bookingRef: string,
  currency: string = 'usd'
) {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/create-payment-intent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ amount: amountInSmallestUnit, currency, bookingRef }),
    }
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error ?? 'Failed to create payment intent');
  }
  return response.json() as Promise<{ clientSecret: string }>;
}

/**
 * Convert a USD price to the smallest unit for a given currency.
 * When you add multi-currency, apply an FX rate here before converting.
 */
export function toSmallestUnit(amountUsd: number, currency: string = 'usd'): number {
  // Zero-decimal currencies (no cents)
  const zeroDecimal = ['vnd', 'jpy', 'krw', 'bif', 'gnf', 'mga', 'pyg', 'rwf', 'ugx', 'xaf', 'xof'];
  if (zeroDecimal.includes(currency.toLowerCase())) {
    return Math.round(amountUsd); // apply FX conversion here in Phase 3
  }
  return Math.round(amountUsd * 100);
}
