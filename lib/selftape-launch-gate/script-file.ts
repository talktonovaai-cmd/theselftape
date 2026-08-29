const ALLOWED_EXTENSIONS = ['.pdf', '.txt', '.md', '.markdown'];
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/x-pdf',
  'text/plain',
  'text/markdown',
  'text/x-markdown',
]);

export function fileExtension(name: string): string {
  const index = name.lastIndexOf('.');
  return index < 0 ? '' : name.slice(index).toLowerCase();
}

export function isPdfFile(file: { name: string; type?: string }): boolean {
  const type = (file.type || '').toLowerCase();
  if (fileExtension(file.name) === '.pdf') return true;
  return type === 'application/pdf' || type === 'application/x-pdf';
}

export function isAllowedScriptFile(file: { name: string; type?: string }): boolean {
  const extension = fileExtension(file.name);
  const type = (file.type || '').toLowerCase();
  const typeMissingOrGeneric = !type || type === 'application/octet-stream';

  if (ALLOWED_EXTENSIONS.includes(extension)) {
    return typeMissingOrGeneric || ALLOWED_TYPES.has(type);
  }
  return ALLOWED_TYPES.has(type);
}

export function formatPdfReadError(error: unknown): string {
  const raw = error instanceof Error ? error.message : 'We could not read this PDF';
  const message = raw.replace(/\.+$/, '').trim() || 'We could not read this PDF';
  if (/try copying and pasting/i.test(message)) {
    return `${message}.`;
  }
  return `Could not read PDF: ${message}. Try copying and pasting the text instead.`;
}

export function countPdfPages(bytes: Uint8Array): number | null {
  const source = new TextDecoder('latin1').decode(bytes);
  const catalogCounts: number[] = [];
  const catalogPattern = /\/Type\s*\/Pages\b[\s\S]{0,200}?\/Count\s+(\d+)/g;
  let catalogMatch: RegExpExecArray | null;
  while ((catalogMatch = catalogPattern.exec(source))) {
    catalogCounts.push(Number(catalogMatch[1]));
  }
  if (catalogCounts.length > 0) {
    return Math.max.apply(null, catalogCounts);
  }
  const pageObjects = source.match(/\/Type\s*\/Page(?!s)\b/g);
  return pageObjects && pageObjects.length > 0 ? pageObjects.length : null;
}
