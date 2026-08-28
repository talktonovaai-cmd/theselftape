import { NextResponse } from 'next/server';
import { requireOriginAndAuth } from '@/lib/selftape-launch-gate/guard';
import { synthesizeReaderSpeech, ttsErrorResponse } from '@/lib/selftape-launch-gate/tts';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const gate = await requireOriginAndAuth(request);
  if (!gate.ok) return gate.response;

  try {
    const body = (await request.json()) as { text?: unknown; voiceId?: unknown };
    const audio = await synthesizeReaderSpeech({
      text: body.text,
      voiceId: body.voiceId,
      maxTextLength: 500,
    });
    return new NextResponse(Buffer.from(audio), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    const { error: message, status } = ttsErrorResponse(error);
    return NextResponse.json({ error: message }, { status });
  }
}
