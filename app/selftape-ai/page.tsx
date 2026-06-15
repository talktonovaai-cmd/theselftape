import type { Metadata } from 'next';
import Link from 'next/link';
import PhoneFrame from '@/components/PhoneFrame';
import Reveal, { Item } from '@/components/Reveal';
import SpotlightCard from '@/components/SpotlightCard';
import Magnetic from '@/components/Magnetic';
import { BUSINESS } from '@/lib/business';

export const metadata: Metadata = {
  title: 'selftape.ai — AI Scene Partner for Actors',
  description:
    'Record self-tapes at home with an AI reader that runs lines opposite you — any scene, any hour, unlimited takes. From the team behind The Selftape studio in LA.',
  alternates: { canonical: '/selftape-ai' },
};

// TODO: confirm these against the live app's actual feature set before launch.
const FEATURES = [
  {
    title: 'On-demand scene partner',
    body: 'Upload your sides, cast the scene, and rehearse whenever you are ready. Adjust pace, energy, and pickups so the read supports your choices -- no reader to schedule.',
  },
  {
    title: 'Scene Intelligence prep',
    body: 'Turn sides into objective, obstacles, emotional beats, and a rehearsal plan -- a private scene-prep packet before you roll camera.',
  },
  {
    title: 'Actor Brain + best-take review',
    body: 'Your past self-tapes become private actor intelligence -- casting lanes, recurring strengths, patterns. Record, compare takes, and ship the strongest one.',
  },
];

export default function SelftapeAiPage() {
  // SoftwareApplication schema — helps this page rank for "AI self tape app"
  // style queries and earns rich-result eligibility.
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: BUSINESS.app.name,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    url: BUSINESS.app.url,
    description:
      'AI scene partner for actors: record self-tape auditions at home with an AI reader, any scene, unlimited takes.',
    creator: {
      '@type': 'Organization',
      name: BUSINESS.legalName,
      url: BUSINESS.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="container grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <Reveal>
          <Item>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-record">
              We defined self-taping in 2008 &middot; redefining it in 2026
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] md:text-6xl">
              An AI scene partner that&rsquo;s always off-book.
            </h1>
            <p className="mt-5 max-w-md text-lg text-slate">
              Sides at midnight, tape due at nine? {BUSINESS.app.name} runs the
              scene opposite you &mdash; on your phone, in your kitchen, as many
              takes as it takes.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Magnetic>
                <a
                  href={BUSINESS.app.url}
                  className="block rounded-md bg-record px-6 py-3 font-display font-bold text-mist transition-colors hover:bg-electric hover:text-void"
                >
                  Try {BUSINESS.app.name} &#8599;
                </a>
              </Magnetic>
            </div>
          </Item>
        </Reveal>
        <Reveal>
          <Item>
            <PhoneFrame src={BUSINESS.app.embedUrl} appUrl={BUSINESS.app.url} />
          </Item>
        </Reveal>
      </section>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <section className="border-t border-mist/10">
        <Reveal className="container py-16 md:py-24">
          <div className="grid gap-5 md:grid-cols-3">
            {FEATURES.map((f) => (
              <SpotlightCard key={f.title}>
                <div className="p-6">
                  <h2 className="font-display text-xl font-bold">{f.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate">{f.body}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Reverse funnel: app visitors who ARE in LA ─────────────────── */}
      <section className="bg-mist text-void">
        <Reveal className="container flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between">
          <Item className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-record">
              In Los Angeles?
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">
              Nothing beats the room.
            </h2>
            <p className="mt-3 text-void/70">
              For the callback that matters, tape with us in Sherman Oaks &mdash;
              pro lighting, real direction, reader included.
            </p>
          </Item>
          <Item>
            <Magnetic>
              <Link
                href="/book"
                className="block shrink-0 rounded-md bg-void px-6 py-3 font-display font-bold text-mist transition-colors hover:bg-record"
              >
                Book the studio
              </Link>
            </Magnetic>
          </Item>
        </Reveal>
      </section>
    </>
  );
}
