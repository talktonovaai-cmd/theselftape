import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { POST as ocrPost } from '../../app/api/ocr-script/route';
import { classifyOcrText, hasUsableScriptDialogue, isModelRefusal } from './ocr';
import { countPdfPages, formatPdfReadError, isAllowedScriptFile, isPdfFile } from './script-file';

const ORIGIN = 'https://www.selftape.ai';

async function read(response: Response) {
  return { status: response.status, body: await response.json() };
}

describe('OCR refusal classification', () => {
  it('treats the live vision refusal as a failure, not usable script', () => {
    const refusal = "I'm sorry, but I can't assist with that.";
    assert.equal(isModelRefusal(refusal), true);
    assert.equal(hasUsableScriptDialogue(refusal), false);
    assert.deepEqual(classifyOcrText(refusal), {
      success: false,
      error: 'We could not read usable script dialogue from this PDF. Please try a clearer PDF or text file',
    });
  });

  it('accepts a short scene with a character cue', () => {
    const sides = 'INT. KITCHEN - NIGHT\n\nJORDAN\nDid you lock the door?\n\nSAM\nI thought you did.';
    assert.equal(classifyOcrText(sides).success, true);
  });
});

describe('Upload file + error copy', () => {
  it('treats iPhone octet-stream PDFs as PDFs', () => {
    const file = { name: 'sides.pdf', type: 'application/octet-stream' };
    assert.equal(isPdfFile(file), true);
    assert.equal(isAllowedScriptFile(file), true);
  });

  it('reads page count from a one-page PDF catalog', () => {
    const pdf = `%PDF-1.1
1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj
2 0 obj<< /Type /Pages /Count 1 /Kids [3 0 R] >>endobj
3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>endobj
trailer<< /Root 1 0 R >>
%%EOF`;
    assert.equal(countPdfPages(new TextEncoder().encode(pdf)), 1);
  });

  it('does not leave a double period on the PDF error string', () => {
    const formatted = formatPdfReadError(
      new Error('We could not read usable script dialogue from this PDF. Please try a clearer PDF or text file.'),
    );
    assert.equal(formatted.includes('..'), false);
    assert.match(formatted, /Try copying and pasting the text instead\.$/);
  });
});

describe('POST /api/ocr-script', () => {
  it('requires auth after Origin, before classifying text', async () => {
    const result = await read(
      await ocrPost(
        new Request('https://www.selftape.ai/api/ocr-script', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Origin: ORIGIN },
          body: JSON.stringify({ text: "I'm sorry, but I can't assist with that." }),
        }),
      ),
    );
    assert.equal(result.status, 401);
    assert.deepEqual(result.body, { error: 'Authentication required' });
  });
});
