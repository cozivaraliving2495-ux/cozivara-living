const ADSENSE_CLIENT_ID = import.meta.env.PUBLIC_ADSENSE_CLIENT_ID?.trim() || '';
const publisherId = ADSENSE_CLIENT_ID.match(/^ca-pub-(\d{16})$/)?.[1];

export const prerender = true;

export function GET() {
  const body = publisherId
    ? `google.com, pub-${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : '';

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
