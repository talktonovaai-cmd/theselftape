import type { Metadata } from 'next';
import BookCta from '@/components/BookCta';
import { PRICING } from '@/lib/business';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Self-tape sessions from $50 with reader and file transmission included. Session packs, demo reel editing, Digishot 3D scans, and production rates in Sherman Oaks, LA.',
  alternates: { canonical: '/pricing' },
};

export default function PricingPage() {
  const groups = Object.values(PRICING);

  return (
    <>
      <section className="container py-16 md:py-24">
        <p className="eyebrow">Pricing</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold md:text-5xl">
          No surprises. Reader included.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-slate">
          Every self-tape rate includes an optional professional reader and file
          transmission. Book online, or call if your situation is unusual.
        </p>
      </section>

      {groups.map((group) => (
        <section key={group.title} className="border-t border-mist/10">
          <div className="container py-12 md:py-16">
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              {group.title}
            </h2>
            {group.blurb ? (
              <p className="mt-2 max-w-xl text-sm text-slate">{group.blurb}</p>
            ) : null}
            <dl className="mt-8 divide-y divide-mist/10 border-y border-mist/10">
              {group.lines.map((line) => (
                <div
                  key={line.label}
                  className="flex flex-wrap items-baseline justify-between gap-2 py-4"
                >
                  <dt className="text-mist">
                    {line.label}
                    {line.note ? (
                      <span className="ml-3 text-xs text-slate">{line.note}</span>
                    ) : null}
                  </dt>
                  <dd className="font-display text-xl font-extrabold text-electric">
                    {line.price}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ))}

      <BookCta />
    </>
  );
}
