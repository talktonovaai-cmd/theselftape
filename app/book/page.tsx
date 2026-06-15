import type { Metadata } from 'next';
import Link from 'next/link';
import BookingEmbed from '@/components/BookingEmbed';
import { BUSINESS, PRICING } from '@/lib/business';

export const metadata: Metadata = {
  title: 'Book a Session',
  description:
    'Book a self-tape session or demo reel edit at The Selftape in Sherman Oaks. 30 min $50, 60 min $75 — reader and file transmission included. Online booking.',
  alternates: { canonical: '/book' },
};

export default function BookPage() {
  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <section className="container py-16 md:py-20">
        <p className="eyebrow">Book a session</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold md:text-5xl">
          Grab a slot.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate">
          Pick your session type and choose a time below. Reader and file
          transmission are included in every self-tape rate. Same-day requests?
          Call us directly at{' '}
          <a
            href={BUSINESS.phoneHref}
            className="text-mist underline decoration-electric underline-offset-4 hover:text-electric"
          >
            {BUSINESS.phoneDisplay}
          </a>
          .
        </p>

        {/* ── Booking embed ─────────────────────────────────────────────── */}
        <BookingEmbed />
      </section>

      {/* ── Session packs ─────────────────────────────────────────────── */}
      <section className="border-t border-mist/10 bg-panel">
        <div className="container py-14">
          <p className="eyebrow">Tape every week?</p>
          <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">
            Session packs save you money.
          </h2>
          <p className="mt-2 max-w-lg text-sm text-slate">
            Buy in bulk and book individual slots as you need them. Packs apply
            to 30-minute sessions and never expire.
          </p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            {PRICING.packs.lines.map((line) => (
              <div
                key={line.label}
                className="rounded-lg border border-mist/10 bg-void p-5"
              >
                <dt className="text-sm text-slate">{line.label}</dt>
                <dd className="mt-2 font-display text-2xl font-extrabold text-electric">
                  {line.price}
                </dd>
                {line.note ? (
                  <dd className="mt-1 font-mono text-xs text-slate">{line.note}</dd>
                ) : null}
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-slate">
            To purchase a pack, email{' '}
            <a
              href={`mailto:${BUSINESS.email}?subject=Session pack enquiry`}
              className="text-mist underline decoration-electric underline-offset-4 hover:text-electric"
            >
              {BUSINESS.email}
            </a>{' '}
            or call after booking your first session.
          </p>
        </div>
      </section>

      {/* ── Studio details ─────────────────────────────────────────────── */}
      <section className="border-t border-mist/10">
        <div className="container grid gap-8 py-14 md:grid-cols-3">
          <div>
            <p className="eyebrow">Where</p>
            <address className="mt-3 text-sm not-italic leading-relaxed text-mist">
              {BUSINESS.address.street}
              <br />
              {BUSINESS.address.city}, {BUSINESS.address.region}{' '}
              {BUSINESS.address.zip}
            </address>
            <a
              href={BUSINESS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block font-mono text-xs uppercase tracking-widest text-electric hover:text-mist"
            >
              Open in Maps &#8599;
            </a>
          </div>
          <div>
            <p className="eyebrow">What to bring</p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate">
              <li>Your sides (we have a printer if needed)</li>
              <li>Any wardrobe for the role</li>
              <li>5 min early — sessions start on time</li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">Good to know</p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate">
              <li>Reader included — or bring your own</li>
              <li>Review takes before you leave</li>
              <li>Files delivered same day</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── selftape.ai reverse funnel ─────────────────────────────────── */}
      <section className="border-t border-mist/10 bg-panel">
        <div className="container flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-electric">
              Can&rsquo;t make it in?
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold">
              Tape from home with {BUSINESS.app.name}.
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate">
              AI scene partner, any scene, any hour. Same team, different room.
            </p>
          </div>
          <a
            href={BUSINESS.app.url}
            className="shrink-0 rounded-md border border-electric px-5 py-2.5 font-display font-bold text-electric transition-colors hover:bg-electric hover:text-void"
          >
            Try {BUSINESS.app.name} &#8599;
          </a>
        </div>
      </section>
    </>
  );
}
