import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { requireOriginAndAuth } from '@/lib/selftape-launch-gate/guard';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const gate = await requireOriginAndAuth(request);
  if (!gate.ok) return gate.response;

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: 'Vercel Blob: Invalid event type' }, { status: 400 });
  }

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['video/webm', 'video/mp4', 'video/quicktime', 'video/x-m4v'],
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => undefined,
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Vercel Blob: Invalid event type';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
