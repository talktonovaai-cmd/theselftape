// Voice IDs shipped by the live selftape.ai studio client (2026-08-28).
// Coach playback also uses Rachel.
export const READER_VOICE_IDS = [
  '9BWtsMINqrJLrRacOk9x', // Aria
  'EXAVITQu4vr4xnSDxMaL', // Sarah
  'FGY2WhTYpPnrIDTdsKH5', // Laura
  'Xb7hH8MSUJpSbSDYk0k2', // Alice
  'XrExE9yKIg1WjnnlVkGX', // Matilda
  'cgSgspJ2msm6clMCkdW9', // Jessica
  'pFZP5JQG7iQjIQuC4Bku', // Lily
  'CwhRBWXzGAHq8TQ4Fs17', // Roger
  'JBFqnCBsd6RMkjVDRZzb', // George
  'iP95p4xoKVk53GoZ742B', // Chris
  'bIHbv24MWmeRgasZH58o', // Will
  'onwK4e9ZLuTAKqWW03F9', // Daniel
  'TX3LPaxmHKxFdv7VOQHJ', // Liam
  'pqHfZKP75CvOlQylNhV4', // Bill
  '21m00Tcm4TlvDq8ikWAM', // Rachel (coach)
] as const;

const ALLOWED = new Set<string>(READER_VOICE_IDS);

export function isAllowedReaderVoice(voiceId: unknown): voiceId is string {
  return typeof voiceId === 'string' && ALLOWED.has(voiceId.trim());
}
