import { NextResponse } from 'next/server';
import { requireOriginAndAuth } from '@/lib/selftape-launch-gate/guard';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const gate = await requireOriginAndAuth(request);
  if (!gate.ok) return gate.response;

  let body: { participants?: unknown } = {};
  try {
    body = (await request.json()) as { participants?: unknown };
  } catch {
    body = {};
  }

  const participants = Array.isArray(body.participants) ? body.participants : [];
  if (participants.length === 0) {
    return NextResponse.json({ error: 'At least one participant is required' }, { status: 400 });
  }

  return NextResponse.json({ error: 'PersonaPlex session is not available' }, { status: 503 });
}
