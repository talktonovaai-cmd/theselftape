import { NextResponse } from 'next/server';
import { requireOriginAndAuth } from '@/lib/selftape-launch-gate/guard';
import { classifyOcrText } from '@/lib/selftape-launch-gate/ocr';

export const runtime = 'nodejs';

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function asNumberArray(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((item): item is number => typeof item === 'number' && Number.isFinite(item))
    : [];
}

export async function POST(request: Request) {
  const gate = await requireOriginAndAuth(request);
  if (!gate.ok) return gate.response;

  let body: {
    text?: unknown;
    pages?: unknown;
    pageTexts?: unknown;
    pageNumbers?: unknown;
    title?: unknown;
  } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    body = {};
  }

  const pageTexts = asStringArray(body.pageTexts);
  const combined = [typeof body.text === 'string' ? body.text : '', ...pageTexts]
    .filter((part) => part.trim().length > 0)
    .join('\n\n')
    .trim();

  const classified = classifyOcrText(combined);
  if (!classified.success) {
    return NextResponse.json(
      {
        success: false,
        error: classified.error,
        method: 'vision-ocr',
      },
      { status: 422 },
    );
  }

  const pageNumbers = asNumberArray(body.pageNumbers);
  const texts = pageTexts.length > 0 ? pageTexts : [classified.text];
  const numbers = pageNumbers.length === texts.length ? pageNumbers : texts.map((_, index) => index + 1);

  return NextResponse.json({
    success: true,
    method: 'vision-ocr',
    text: classified.text,
    pageNumbers: numbers,
    pageTexts: texts,
  });
}
