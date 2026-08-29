import { NextResponse } from 'next/server';

export function readBearerToken(request: Request): string | null {
  const header = request.headers.get('authorization');
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  return token.length > 0 ? token : null;
}

export async function verifySupabaseUser(token: string): Promise<boolean> {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
  if (!url || !anon) return false;

  try {
    const response = await fetch(`${url}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: anon,
      },
      cache: 'no-store',
    });
    if (!response.ok) return false;
    const body = (await response.json()) as { id?: unknown };
    return typeof body.id === 'string' && body.id.length > 0;
  } catch {
    return false;
  }
}

export async function rejectIfUnauthenticated(request: Request): Promise<NextResponse | null> {
  const token = readBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  const ok = await verifySupabaseUser(token);
  if (!ok) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  return null;
}
