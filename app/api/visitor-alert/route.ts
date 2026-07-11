import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

const claims = new Map<string, number>();
const TTL_MS = 12 * 60 * 60 * 1000;
const MAX_CLAIMS = 5000;
const BLOCKED_AGENT = /bot|crawl|spider|headless|preview|slurp|facebookexternalhit|whatsapp|uptime|monitor/i;

function response(result: 'sent' | 'duplicate' | 'suppressed' | 'failed') {
  return new NextResponse(null, { status: 204, headers: { 'cache-control': 'no-store', 'x-visitor-alert': result } });
}

function clean(value: string | null, max: number) {
  return (value || '').replace(/[^A-Za-z0-9 .,'-]/g, '').trim().slice(0, max);
}

function claim(token: string) {
  const now = Date.now();
  if (claims.size >= MAX_CLAIMS) {
    claims.forEach((expires, key) => {
      if (expires <= now || claims.size >= MAX_CLAIMS) claims.delete(key);
    });
  }
  const key = createHash('sha256').update(token).digest('hex');
  if ((claims.get(key) || 0) > now) return false;
  claims.set(key, now + TTL_MS);
  return true;
}

export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== request.nextUrl.origin) return response('suppressed');
  if (BLOCKED_AGENT.test(request.headers.get('user-agent') || '')) return response('suppressed');

  let body: { session?: unknown; path?: unknown };
  try { body = await request.json(); } catch { return response('suppressed'); }
  if (typeof body.session !== 'string' || !/^[A-Za-z0-9_-]{32,128}$/.test(body.session) || typeof body.path !== 'string' || body.path.startsWith('/api/')) return response('suppressed');

  const token = process.env.PUSHOVER_APP_TOKEN;
  const user = process.env.PUSHOVER_USER_KEY;
  if (!token || !user) return response('failed');
  if (!claim(body.session)) return response('duplicate');

  const location = [clean(request.headers.get('x-vercel-ip-city'), 80), clean(request.headers.get('x-vercel-ip-country-region'), 80), clean(request.headers.get('x-vercel-ip-country'), 2)].filter(Boolean).join(', ') || 'Location unavailable';
  try {
    const provider = await fetch('https://api.pushover.net/1/messages.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ token, user, title: process.env.VISITOR_ALERT_TITLE || 'The Selftape visitor', message: `New visitor\n${location}` }),
      signal: AbortSignal.timeout(5000),
    });
    return response(provider.ok ? 'sent' : 'failed');
  } catch {
    return response('failed');
  }
}
