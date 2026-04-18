// Launch date — defaults to 14 days from first build if env not set.
// Override in production by setting PUBLIC_LAUNCH_DATE to an ISO string.
const FALLBACK_LAUNCH = new Date();
FALLBACK_LAUNCH.setUTCDate(FALLBACK_LAUNCH.getUTCDate() + 14);
FALLBACK_LAUNCH.setUTCHours(8, 0, 0, 0);

export function getLaunchDate(): Date {
  const fromEnv = import.meta.env.PUBLIC_LAUNCH_DATE;
  if (fromEnv) {
    const parsed = new Date(fromEnv);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return FALLBACK_LAUNCH;
}

export const SITE = {
  name: 'Mornings',
  tagline: 'Small-batch coffee. Built for the first cup.',
  description:
    'Mornings is a new small-batch coffee roastery launching soon. Join the waitlist for a founder\'s-crew discount and launch-day early access.',
  twitter: '@morningscoffee',
};
