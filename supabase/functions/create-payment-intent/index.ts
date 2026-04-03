import Stripe from 'https://esm.sh/stripe@14?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
});

// Zero-decimal currencies — amount is already in the smallest unit (no cents)
const ZERO_DECIMAL = new Set(['vnd', 'jpy', 'krw', 'bif', 'gnf', 'mga', 'pyg', 'rwf', 'ugx', 'xaf', 'xof']);

// Minimum charge in smallest unit per currency
function minimumAmount(currency: string): number {
  return ZERO_DECIMAL.has(currency.toLowerCase()) ? 1000 : 50; // 1,000 VND | $0.50
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, currency = 'vnd', bookingRef } = await req.json();

    if (!amount || amount < minimumAmount(currency)) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { bookingRef: bookingRef ?? '' },
      automatic_payment_methods: { enabled: true },
    });

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
