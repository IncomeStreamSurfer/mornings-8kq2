import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { sendEmail, welcomeEmailHtml } from '../../lib/email';
import { getLaunchDate } from '../../lib/config';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let payload: { email?: string; source?: string } = {};
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  const email = (payload.email ?? '').trim().toLowerCase();
  const source = (payload.source ?? 'home').slice(0, 40);
  const ua = request.headers.get('user-agent')?.slice(0, 300) ?? null;

  if (!email || !EMAIL_RE.test(email)) {
    return json({ error: 'Please enter a valid email address.' }, 400);
  }

  const { error } = await supabase
    .from('mornings_waitlist')
    .insert({ email, source, user_agent: ua });

  if (error) {
    const isDuplicate = (error as { code?: string }).code === '23505' ||
      /duplicate key|already exists|unique/i.test(error.message ?? '');

    if (!isDuplicate) {
      console.error('[waitlist] supabase insert failed', error);
      return json({ error: 'Could not save your spot — try again shortly.' }, 500);
    }

    return json({
      ok: true,
      alreadyOnList: true,
      message: "You're already on the list — see you launch day ☕",
    });
  }

  try {
    await sendEmail({
      to: email,
      subject: "You're on the Mornings waitlist ☕",
      html: welcomeEmailHtml(getLaunchDate().toISOString()),
      text: "You're on the Mornings waitlist. We'll email you 24h before launch with a founder's-crew discount code. — the Mornings team",
    });
  } catch (err) {
    console.error('[waitlist] email send failed', err);
  }

  return json({
    ok: true,
    message: "You're on the list — check your inbox ☕",
  });
};

export const GET: APIRoute = () =>
  json({ error: 'Method not allowed.' }, 405);
