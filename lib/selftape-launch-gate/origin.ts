import { NextResponse } from 'next/server';

const ALLOWED_ORIGINS = new Set([
  'https://www.selftape.ai',
  'https://selftape.ai',
  'http://localhost:3000',
]);

function headerOrigin(request: Request): { kind: 'missing' } | { kind: 'value'; value: string } {
  const origin = request.headers.get('origin');
  if (origin === 'null' || origin === '') return { kind: 'missing' };
  if (origin) return { kind: 'value', value: origin };

  const referer = request.headers.get('referer');
  if (!referer) return { kind: 'missing' };
  try {
    return { kind: 'value', value: new URL(referer).origin };
  } catch {
    return { kind: 'missing' };
  }
}

export function rejectIfInvalidOrigin(request: Request): NextResponse | null {
  const parsed = headerOrigin(request);
  if (parsed.kind === 'missing') {
    return NextResponse.json({ error: 'Origin metadata required' }, { status: 403 });
  }
  if (!ALLOWED_ORIGINS.has(parsed.value)) {
    return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 });
  }
  return null;
}
