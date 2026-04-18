const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
};

export async function sendEmail({ to, subject, html, text, from }: SendEmailArgs) {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY missing — skipping send');
    return { ok: false, skipped: true };
  }

  const res = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: from ?? 'Mornings <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error('[email] Resend error', res.status, body);
    return { ok: false, status: res.status, body };
  }

  const data = await res.json();
  return { ok: true, id: data?.id as string | undefined };
}

export function welcomeEmailHtml(launchDateIso: string) {
  const launch = new Date(launchDateIso);
  const nice = launch.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f5ebdc;font-family:Georgia,serif;color:#3a2618;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5ebdc;padding:40px 16px;">
      <tr>
        <td align="center">
          <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fffaf0;border:2px solid #3a2618;border-radius:40px 8px 36px 8px;padding:40px;">
            <tr>
              <td align="center" style="padding-bottom:8px;">
                <div style="font-family:Georgia,serif;font-size:36px;letter-spacing:-0.02em;color:#3a2618;">mornings<span style="color:#a85a3a;">.</span></div>
                <div style="font-family:cursive;font-size:22px;color:#a85a3a;margin-top:-6px;">welcome to the early crowd</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 0;font-size:17px;line-height:1.6;">
                <p style="margin:0 0 14px;">Hey —</p>
                <p style="margin:0 0 14px;">You're officially on the Mornings waitlist. Thank you. Genuinely.</p>
                <p style="margin:0 0 14px;">We're a small roastery obsessed with one thing: the first cup of the day. Single-origin beans we've actually tasted at the farm, roasted in tiny batches, shipped within 48 hours of the roast.</p>
                <p style="margin:0 0 14px;"><strong>Launch day:</strong> ${nice}. You'll get a heads-up 24 hours before, plus a founder's-crew discount code that won't go out to anyone else.</p>
                <p style="margin:0 0 14px;">Until then — enjoy your mornings.</p>
                <p style="margin:24px 0 0;font-family:cursive;font-size:22px;color:#a85a3a;">— the Mornings team</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="border-top:1px dashed #a85a3a;padding-top:18px;font-size:12px;color:#5a3c28;">
                You're getting this because you signed up at mornings. We only email about the launch. Reply to unsubscribe.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
