import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ site }) => {
  const host = (site ?? new URL('https://mornings.vercel.app')).origin;
  const body = `User-agent: *
Allow: /

Sitemap: ${host}/sitemap.xml
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
