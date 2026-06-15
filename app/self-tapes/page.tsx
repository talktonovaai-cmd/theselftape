import type { Metadata } from 'next';
import BookCta from '@/components/BookCta';
import AiFunnelBanner from '@/components/AiFunnelBanner';
import { PRICING } from '@/lib/business';

export const metadata: Metadata = {
  title: 'Self-Tape Sessions',
  description:
    'Book a self-tape session in Sherman Oaks. Professional reader, lighting, and sound included — 30 minutes for $50, 60 for $75. Casting director–owned since 2008.',
  alternates: { canonical: '/self-tapes' },
};

const STEPS = [
  {
    title: 'Book your slot',
    body: 'Pick a 30 or 60-minute session online. Tell us roughly how many scenes and whether you want our reader (included, no extra charge).',
  },
  {
    title: 'Walk in, hit your mark',
    body: 'Lighting and framing are set to current casting specs before you arrive. Slate, run the scene, go again as many times as the clock allows.',
  },
  {
    title: 'Review before you leave',
    body: 'Watch your takes in the room and pick selects. No guessing later about whether you got it.',
  },
  {
    title: 'Files delivered, ready to submit',
    body: 'Transmission is included in every rate — you get casting-ready files formatted for Actors Access, Casting Networks, and direct email.',
  },
];

export default function SelfTapesPage() {
  return (
    <>
      <section className="container py-16 md:py-24">
        <p className="eyebrow">Self-tapes &middot; Sherman Oaks</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] md:text-5xl">
          A tape that looks like you booked the room.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-slate">
          Phone-on-a-bookshelf tapes get skipped. Ours are lit, framed, and read
          by people who&rsquo;ve sat on the casting side of the table since 2008.
        </p>
      </section>

      <section className="border-t border-mist/10">
        <div className="container py-16">
          <p className="eyebrow">How a session works</p>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {STEPS.map((step, i) => (
              <div key={step.title} className="flex gap-4">
                {/* Numbered because this genuinely is a sequence */}
                <span className="font-mono text-sm text-electric">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h2 className="font-display text-xl font-bold">{step.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-mist/10 bg-panel">
        <div className="container py-16">
          <p className="eyebrow">Rates</p>
          <h2 className="mt-3 font-display text-3xl font-bold">
            {PRICING.selfTapes.title}
          </h2>
          <p className="mt-3 max-w-xl text-sm text-slate">{PRICING.selfTapes.blurb}</p>
          <dl className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...PRICING.selfTapes.lines, ...PRICING.packs.lines].map((line) => (
              <div key={line.label} className="rounded-lg border border-mist/10 p-6">
                <dt className="text-sm text-slate">{line.label}</dt>
                <dd className="mt-2 font-display text-3xl font-extrabold text-electric">
                  {line.price}
                </dd>
                {line.note ? (
                  <dd className="mt-1 text-xs text-slate">{line.note}</dd>
                ) : null}
              </div>
            ))}
          </dl>
        </div>
      </section>

      <AiFunnelBanner />
      <BookCta heading="Sides due tomorrow?" />
    </>
  );
}
