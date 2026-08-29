import type { Metadata } from 'next';
import ScriptUploadDropzone from '@/components/ScriptUploadDropzone';

export const metadata: Metadata = {
  title: 'Upload sides',
  description: 'Upload a PDF or paste sides for selftape.ai.',
  robots: { index: false, follow: false },
};

export default function UploadPage() {
  return (
    <section className="container py-16 md:py-24">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-electric">selftape.ai</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold">Upload your sides</h1>
      <p className="mt-4 max-w-xl text-slate">
        The picker should show the filename as soon as you choose a file. If a PDF cannot be read,
        the status spinner clears and you can paste the text instead.
      </p>
      <div className="mt-10">
        <ScriptUploadDropzone />
      </div>
    </section>
  );
}
