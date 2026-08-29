'use client';

import { useCallback, useRef, useState } from 'react';
import {
  countPdfPages,
  formatPdfReadError,
  isAllowedScriptFile,
  isPdfFile,
} from '@/lib/selftape-launch-gate/script-file';

type PickedFile = {
  name: string;
  pageCount: number | null;
};

export default function ScriptUploadDropzone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setStatus('');
    setPicked({ name: file.name, pageCount: null });

    if (!isAllowedScriptFile(file)) {
      setError('Please upload a PDF, TXT, or Markdown file');
      return;
    }
    if (file.size > 8_388_608) {
      setError('Script file is too large. Please upload a file under 8 MB.');
      return;
    }

    try {
      if (isPdfFile(file)) {
        setStatus('Reading PDF…');
        const bytes = new Uint8Array(await file.arrayBuffer());
        const pageCount = countPdfPages(bytes);
        setPicked({ name: file.name, pageCount });
        setStatus(
          pageCount
            ? `Rendering page 1/${pageCount} for OCR…`
            : 'Some PDF pages need OCR…',
        );

        const response = await fetch('/api/ocr-script', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: file.name.replace(/\.[^/.]+$/, ''),
            text: '',
            pageNumbers: pageCount ? Array.from({ length: pageCount }, (_, index) => index + 1) : [1],
          }),
        });
        const payload = (await response.json().catch(() => ({}))) as {
          success?: boolean;
          error?: string;
        };
        if (!response.ok || payload.success === false) {
          throw new Error(
            payload.error ||
              'We could not read usable script dialogue from this PDF. Please try a clearer PDF or text file',
          );
        }
        return;
      }

      const text = await file.text();
      if (!text || text.trim().length < 50) {
        setError('Script seems too short or empty.');
      }
    } catch (caught) {
      setError(formatPdfReadError(caught));
    } finally {
      setStatus('');
    }
  }, []);

  return (
    <div className="w-full max-w-2xl">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          const file = event.dataTransfer.files[0];
          if (file) void handleFile(file);
        }}
        className={`relative rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
          dragOver ? 'border-electric bg-electric/10' : 'border-mist/20 hover:border-mist/40'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,application/pdf,text/plain"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
            event.target.value = '';
          }}
        />
        <p className="font-display text-lg font-semibold">Upload your sides</p>
        <p className="mt-1 text-sm text-slate">PDF, TXT, or Markdown</p>
      </div>

      {picked && (
        <div
          data-testid="picked-file-chip"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-sm text-mist"
        >
          <span className="font-medium">{picked.name}</span>
          {picked.pageCount !== null && (
            <span className="text-slate">
              {picked.pageCount} {picked.pageCount === 1 ? 'page' : 'pages'}
            </span>
          )}
        </div>
      )}

      {status && (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-electric/30 bg-electric/10 p-4 text-sm text-mist">
          <span
            aria-hidden
            className="h-5 w-5 animate-spin rounded-full border-2 border-electric border-t-transparent"
          />
          <p>{status}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-record/40 bg-record/10 p-4 text-sm text-mist">
          {error}
        </div>
      )}
    </div>
  );
}
