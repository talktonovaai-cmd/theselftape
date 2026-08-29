const REFUSAL_PATTERNS = [
  /i(?:['’]m| am) sorry, but i can(?:['’]t|not) assist/i,
  /i can(?:['’]t|not) assist with that/i,
  /i can(?:['’]t|not) help with that/i,
  /as an ai(?: language)? model/i,
  /i(?:['’]m| am) (?:not able|unable) to (?:help|assist|process)/i,
  /i(?:['’]m| am) sorry,? i can(?:['’]t|not)/i,
];

const USABLE_DIALOGUE_ERROR =
  'We could not read usable script dialogue from this PDF. Please try a clearer PDF or text file';

export function isModelRefusal(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return REFUSAL_PATTERNS.some((pattern) => pattern.test(trimmed));
}

export function hasUsableScriptDialogue(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 20) return false;
  if (isModelRefusal(trimmed)) return false;

  const lines = trimmed.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const hasSlug = lines.some((line) => /^(INT|EXT|INT\/EXT|I\/E)[.\s]/i.test(line));
  const hasCharacterCue = lines.some((line) =>
    /^[A-Z][A-Z0-9 .'&-]{1,40}(?:\s*\([^)]*\))?$/.test(line),
  );
  const hasDialoguePair = lines.some((line, index) => {
    const next = lines[index + 1];
    return (
      /^[A-Z][A-Z0-9 .'&-]{1,40}(?:\s*\([^)]*\))?$/.test(line) &&
      Boolean(next) &&
      !/^[A-Z][A-Z0-9 .'&-]{1,40}(?:\s*\([^)]*\))?$/.test(next)
    );
  });

  return hasSlug || hasDialoguePair || (hasCharacterCue && lines.length >= 3);
}

export function classifyOcrText(text: unknown): {
  success: false;
  error: string;
} | {
  success: true;
  text: string;
} {
  const value = typeof text === 'string' ? text.trim() : '';
  if (!value) {
    return { success: false, error: USABLE_DIALOGUE_ERROR };
  }
  if (isModelRefusal(value) || !hasUsableScriptDialogue(value)) {
    return { success: false, error: USABLE_DIALOGUE_ERROR };
  }
  return { success: true, text: value };
}
