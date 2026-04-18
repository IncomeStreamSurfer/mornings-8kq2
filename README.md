# Mornings ☕

A warm, hand-drawn coming-soon page for **Mornings** — a new small-batch coffee brand
launching in ~2 weeks. Waitlist stored in Supabase, welcome emails via Resend.

## What was built

- **Single-page Astro site** (server output, Vercel adapter) with Tailwind v4 via
  `@tailwindcss/vite`.
- **Hero + countdown timer** ticking to `PUBLIC_LAUNCH_DATE` (defaults to 14 days from
  deploy).
- **Email waitlist** — `POST /api/waitlist` writes to `mornings_waitlist` in Supabase
  and fires a Resend welcome email.
- **Hand-drawn feel** — Fraunces (display) + Caveat (hand) fonts, SVG coffee cup with
  animated steam, wobbly `border-radius` blobs, paper-grain overlay, warm cream +
  brown palette.
- **Programmatic SEO** — per-page `<title>`, OpenGraph/Twitter cards, canonical,
  `robots.txt`, `sitemap.xml`, Organization JSON-LD.
- **Harbor content hook** — `mornings_content` table in Supabase is live and seeded.

## Stack

| Layer | Choice |
|------|--------|
| Framework | Astro 6 (`output: 'server'`) |
| Adapter | `@astrojs/vercel` |
| Styles | Tailwind v4 via `@tailwindcss/vite` |
| DB / backend | Supabase (`mornings_waitlist`, `mornings_content`) |
| Email | Resend REST (`onboarding@resend.dev` sender by default) |

## Local dev

```bash
npm install
cp .env.example .env   # fill in keys
npm run dev
```

## Environment variables

| Var | Where |
|-----|-------|
| `PUBLIC_SUPABASE_URL` | Supabase project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/publishable key |
| `RESEND_API_KEY` | Resend API key |
| `PUBLIC_SITE_URL` | Canonical production URL |
| `PUBLIC_LAUNCH_DATE` | (optional) ISO date for the countdown; defaults to build+14d |

## Database

Two tables live in the connected Supabase project:

- `mornings_waitlist` — `id, email (unique), source, user_agent, created_at`
- `mornings_content` — `id, title, slug (unique), body, seo_description, published_at, created_at, updated_at`

RLS is on. Anons can only *insert* into the waitlist and *select* published content.

## Next steps (for you)

1. **Set your real launch date** — update `PUBLIC_LAUNCH_DATE` in Vercel to the exact
   launch moment (ISO, e.g. `2025-05-02T08:00:00Z`). Re-deploy.
2. **Verify your email domain in Resend** — until then sends come from
   `onboarding@resend.dev`. Add your domain in the Resend dashboard to send from
   `hello@mornings.coffee` (or wherever).
3. **Plug a custom domain** in Vercel when you're ready.
4. **Export waitlist** any time via the Supabase dashboard → Table Editor →
   `mornings_waitlist` → Export CSV.
