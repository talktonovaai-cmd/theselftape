import type { Metadata } from 'next';
import BookCta from '@/components/BookCta';
import { PRICING } from '@/lib/business';

export const metadata: Metadata = {
  title: 'Demo Reel Editing',
  description:
    'Managed demo reel editing in Sherman Oaks at $75/hr. Sit with the editor, cut your best footage, and leave with a reel formatted for Actors Access and casting links.',
  alternates: { canonical: '/demo-reels' },
};

export default function DemoReelsPage() {
  return (
    <>
      <section className="container py-16 md:py-24">
        <p className="eyebrow">Demo reels</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] md:text-5xl">
          Your best moments, cut by someone who casts.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-slate">
          Casting decides in the first clip. We sit with you, pull your
          strongest moments, and cut a reel that leads with the work that books
          &mdash; not the credits chronology.
        </p>
      </section>

      <section className="border-t border-mist/10">
        <div className="container grid gap-10 py-16 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold">How it works</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate">
              Bring your footage &mdash; episodes, films, past tapes, anything
              with you in it. It&rsquo;s a managed edit: you&rsquo;re in the room
              making calls while we cut, so nothing gets buried that should lead.
              Most reels finish in one to two sessions.
            </p>
            <h2 className="mt-8 font-display text-2xl font-bold">What you leave with</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate">
              Export files sized for Actors Access, Casting Networks, your
              website, and direct-to-CD emails &mdash; plus the project file, so
              future updates are an hour, not a rebuild.
            </p>
          </div>
          <div className="rounded-lg border border-mist/10 bg-panel p-6">
            <p className="eyebrow">Rate</p>
            {PRICING.demoReels.lines.map((line) => (
              <div key={line.label} className="mt-4">
                <p className="text-sm text-slate">{line.label}</p>
                <p className="font-display text-4xl font-extrabold text-electric">
                  {line.price}
                </p>
              </div>
            ))}
            <p className="mt-4 text-xs text-slate">{PRICING.demoReels.blurb}</p>
          </div>
        </div>
      </section>

      <BookCta heading="Footage sitting on a drive?" />
    </>
  );
}
