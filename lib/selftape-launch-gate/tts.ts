import { isAllowedReaderVoice } from './voices';

export class VoiceUnavailableError extends Error {
  constructor() {
    super('Voice is not available');
    this.name = 'VoiceUnavailableError';
  }
}

export class TtsGenerationError extends Error {
  constructor() {
    super('TTS generation failed');
    this.name = 'TtsGenerationError';
  }
}

type TtsInput = {
  text: unknown;
  voiceId: unknown;
  maxTextLength?: number;
  stability?: unknown;
  similarityBoost?: unknown;
  style?: unknown;
};

function asUnit(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  return Math.max(0, Math.min(1, value));
}

export async function synthesizeReaderSpeech(input: TtsInput): Promise<Uint8Array> {
  if (!isAllowedReaderVoice(input.voiceId)) {
    throw new VoiceUnavailableError();
  }
  const text = typeof input.text === 'string' ? input.text.trim() : '';
  const maxLen = input.maxTextLength ?? 5000;
  if (!text) throw new TtsGenerationError();
  const clipped = text.slice(0, maxLen);

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new TtsGenerationError();

  const voiceSettings: Record<string, number> = {};
  const stability = asUnit(input.stability);
  const similarity = asUnit(input.similarityBoost);
  const style = asUnit(input.style);
  if (stability !== undefined) voiceSettings.stability = stability;
  if (similarity !== undefined) voiceSettings.similarity_boost = similarity;
  if (style !== undefined) voiceSettings.style = style;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${input.voiceId.trim()}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text: clipped,
        model_id: 'eleven_multilingual_v2',
        ...(Object.keys(voiceSettings).length > 0 ? { voice_settings: voiceSettings } : {}),
      }),
    },
  );

  if (!response.ok) {
    if (response.status === 404 || response.status === 403) {
      throw new VoiceUnavailableError();
    }
    throw new TtsGenerationError();
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength === 0) throw new TtsGenerationError();
  return bytes;
}

export function ttsErrorResponse(error: unknown): { error: string; status: number } {
  if (error instanceof VoiceUnavailableError) {
    return { error: 'Voice is not available', status: 403 };
  }
  return { error: 'TTS generation failed', status: 400 };
}
