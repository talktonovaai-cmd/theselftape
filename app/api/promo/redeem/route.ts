import { NextResponse } from 'next/server';
import { requireOriginAndAuth } from '@/lib/selftape-launch-gate/guard';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const gate = await requireOriginAndAuth(request);
  if (!gate.ok) return gate.response;

  let promoCode = '';
  try {
    const body = (await request.json()) as { promoCode?: unknown };
    promoCode = typeof body.promoCode === 'string' ? body.promoCode.trim() : '';
  } catch {
    promoCode = '';
  }

  if (!promoCode) {
    return NextResponse.json({ error: 'Invalid promo code' }, { status: 400 });
  }

  return NextResponse.json({ error: 'Invalid promo code' }, { status: 400 });
}
