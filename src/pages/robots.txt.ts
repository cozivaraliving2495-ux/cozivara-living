const siteUrl = (
  import.meta.env.PUBLIC_SITE_URL?.trim() || 'https://cozivaraliving.netlify.app'
).replace(/\/+$/, '');

export const prerender = true;

export function GET() {
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap-index.xml\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
