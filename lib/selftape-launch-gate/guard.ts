import type { NextResponse } from 'next/server';
import { rejectIfUnauthenticated } from './auth';
import { rejectIfInvalidOrigin } from './origin';

export async function requireOriginAndAuth(
  request: Request,
): Promise<{ ok: true } | { ok: false; response: NextResponse }> {
  const origin = rejectIfInvalidOrigin(request);
  if (origin) return { ok: false, response: origin };
  const auth = await rejectIfUnauthenticated(request);
  if (auth) return { ok: false, response: auth };
  return { ok: true };
}
