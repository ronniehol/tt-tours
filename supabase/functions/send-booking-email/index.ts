const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const FROM_EMAIL = 'TT Tours <onboarding@resend.dev>'; // swap for your domain once verified

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { booking, tourName } = await req.json();

    if (!booking?.guestEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing booking data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const html = buildEmailHtml(booking, tourName);

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [booking.guestEmail],
        subject: `Booking Confirmed — ${tourName} · ${booking.bookingRef}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message ?? 'Failed to send email');
    }

    return new Response(
      JSON.stringify({ sent: true }),
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

function buildEmailHtml(booking: any, tourName: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- Header -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B4C5C;">
    <tr>
      <td style="padding:0 0 0 8px;width:5px;background:#F97316;">&nbsp;</td>
      <td style="padding:28px 32px;">
        <p style="margin:0;font-size:11px;color:#F97316;letter-spacing:3px;text-transform:uppercase;">Vietnam · Central Region</p>
        <h1 style="margin:6px 0 0;font-size:36px;font-weight:900;font-style:italic;color:#ffffff;text-transform:uppercase;letter-spacing:1px;">TT TOURS</h1>
      </td>
    </tr>
    <tr><td colspan="2" style="height:4px;background:#F97316;"></td></tr>
  </table>

  <!-- Body -->
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding:40px 24px;max-width:600px;margin:0 auto;">

        <!-- Success badge -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <div style="width:64px;height:64px;border-radius:50%;background:#10B981;display:inline-block;text-align:center;line-height:64px;font-size:28px;color:white;">✓</div>
            </td>
          </tr>
          <tr>
            <td align="center">
              <h2 style="margin:0 0 8px;font-size:40px;font-weight:900;font-style:italic;color:#0B4C5C;text-transform:uppercase;letter-spacing:1px;">BOOKING CONFIRMED!</h2>
              <p style="margin:0 0 32px;font-size:15px;color:#6B7280;line-height:1.6;">
                Hi ${booking.guestName}, your spot is locked in. Get ready for an incredible experience.
              </p>
            </td>
          </tr>
        </table>

        <!-- Booking reference -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B4C5C;border-radius:8px;margin-bottom:24px;">
          <tr>
            <td align="center" style="padding:24px;">
              <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:2px;text-transform:uppercase;">Your Booking Reference</p>
              <p style="margin:0;font-size:36px;font-weight:900;font-style:italic;color:#F97316;text-transform:uppercase;letter-spacing:2px;">${booking.bookingRef}</p>
              <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.4);">Keep this reference for your records</p>
            </td>
          </tr>
        </table>

        <!-- Booking details -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;margin-bottom:24px;">
          <tr><td style="padding:20px 20px 0;border-bottom:2px solid #F97316;">
            <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#111827;letter-spacing:2px;text-transform:uppercase;">Booking Details</p>
          </td></tr>
          ${[
            ['Tour', tourName],
            ['Travel Date', booking.travelDate],
            ['Guests', `${booking.numAdults} adult${booking.numAdults > 1 ? 's' : ''}${booking.numChildren ? `, ${booking.numChildren} child${booking.numChildren > 1 ? 'ren' : ''}` : ''}`],
            ['Name', booking.guestName],
            ['Email', booking.guestEmail],
            ['Phone', booking.guestPhone],
            ['Total Paid', `$${Number(booking.totalPriceUsd).toFixed(2)} USD`],
          ].map(([label, value]) => `
          <tr>
            <td style="padding:12px 20px;border-bottom:1px solid #F3F4F6;">
              <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td style="font-size:13px;color:#6B7280;">${label}</td>
                <td align="right" style="font-size:13px;font-weight:600;color:#111827;">${value}</td>
              </tr></table>
            </td>
          </tr>`).join('')}
        </table>

        <!-- What's next -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B4C5C;border-radius:8px;margin-bottom:32px;">
          <tr><td style="padding:20px 20px 4px;">
            <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#F97316;letter-spacing:2px;text-transform:uppercase;">What Happens Next</p>
            ${[
              '📞 We will call or WhatsApp you 24 hours before departure with full pickup details.',
              '📍 Your guide will meet you at the agreed pickup point — no need to find your own way.',
              '🌟 After your tour, we\'d love a review — it helps other travellers find us!',
            ].map(step => `<p style="margin:0 0 12px;font-size:14px;color:rgba(255,255,255,0.75);line-height:1.6;">${step}</p>`).join('')}
          </td></tr>
        </table>

        <!-- Contact -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <p style="margin:0;font-size:13px;color:#6B7280;">Questions? Reply to this email or WhatsApp us any time.</p>
              <p style="margin:4px 0 0;font-size:13px;color:#0B4C5C;font-weight:600;">bookings@tt-tours.com</p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

  <!-- Footer -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B4C5C;">
    <tr><td style="height:4px;background:#F97316;"></td></tr>
    <tr>
      <td align="center" style="padding:20px;font-size:12px;color:rgba(255,255,255,0.4);">
        © TT Tours · Hoi An, Vietnam
      </td>
    </tr>
  </table>

</body>
</html>`;
}
