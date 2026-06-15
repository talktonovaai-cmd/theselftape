import type { Metadata } from 'next';
import Link from 'next/link';
import { BUSINESS } from '@/lib/business';

export const metadata: Metadata = {
  title: 'Contact',
  description: `${BUSINESS.name} — ${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.region} ${BUSINESS.address.zip}. Call ${BUSINESS.phoneDisplay} or book a self-tape session online.`,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <section className="container py-16 md:py-24">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-4 font-display text-4xl font-extrabold md:text-5xl">
        Find us in Sherman Oaks.
      </h1>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="space-y-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-slate">
              Studio
            </p>
            <address className="mt-2 text-lg not-italic leading-relaxed">
              {BUSINESS.name}
              <br />
              {BUSINESS.address.street}
              <br />
              {BUSINESS.address.city}, {BUSINESS.address.region}{' '}
              {BUSINESS.address.zip}
            </address>
            <a
              href={BUSINESS.mapsUrl}
              className="mt-3 inline-block font-mono text-xs uppercase tracking-widest text-electric hover:text-mist"
            >
              Open in Maps &rarr;
            </a>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-slate">
              Reach us
            </p>
            <p className="mt-2 text-lg">
              <a href={BUSINESS.phoneHref} className="hover:text-electric">
                {BUSINESS.phoneDisplay}
              </a>
              <br />
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-electric">
                {BUSINESS.email}
              </a>
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-slate">
              Hours
            </p>
            {/* TODO: real hours — update here AND lib/business.ts (schema) */}
            <p className="mt-2 text-slate">
              Sessions by appointment.{' '}
              <Link
                href="/book"
                className="text-mist underline decoration-electric underline-offset-4"
              >
                See live availability
              </Link>
              .
            </p>
          </div>

          {BUSINESS.sisterStudio.url ? (
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-slate">
                Westside?
              </p>
              <p className="mt-2 text-slate">
                Our sister studio in{' '}
                <a
                  href={BUSINESS.sisterStudio.url}
                  className="text-mist underline decoration-electric underline-offset-4"
                >
                  {BUSINESS.sisterStudio.city}
                </a>{' '}
                is independently owned by one of our longtime readers.
              </p>
            </div>
          ) : null}
        </div>

        <div className="rounded-lg border border-mist/10 bg-panel p-2">
          {/* Free, key-less embedded map */}
          <iframe
            title="Map to The Selftape, Sherman Oaks"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              `${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.region} ${BUSINESS.address.zip}`
            )}&output=embed`}
            className="h-80 w-full rounded-md border-0 md:h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
