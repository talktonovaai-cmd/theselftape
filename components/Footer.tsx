import Link from 'next/link';
import { BUSINESS } from '@/lib/business';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-mist/10 bg-panel">
      <div className="container grid gap-10 py-14 md:grid-cols-4">
        {/* Brand */}
        <div className="md:col-span-1">
          <p className="font-display text-lg font-extrabold">THE SELFTAPE</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-electric">
            Sherman Oaks &middot; Est. {BUSINESS.founded}
          </p>
          <p className="mt-4 text-sm text-slate">
            Casting director&ndash;owned self-tape studio. Pro readers, lighting,
            and sound &mdash; so the only thing casting notices is you.
          </p>
        </div>

        {/* Visit — the NAP. Must match Google Business Profile exactly. */}
        <div>
          <p className="eyebrow">Visit</p>
          <address className="mt-3 text-sm not-italic leading-relaxed text-slate">
            {BUSINESS.name}
            <br />
            {BUSINESS.address.street}
            <br />
            {BUSINESS.address.city}, {BUSINESS.address.region} {BUSINESS.address.zip}
          </address>
          <p className="mt-3 text-sm">
            <a href={BUSINESS.phoneHref} className="text-mist hover:text-electric">
              {BUSINESS.phoneDisplay}
            </a>
            <br />
            <a href={`mailto:${BUSINESS.email}`} className="text-mist hover:text-electric">
              {BUSINESS.email}
            </a>
          </p>
          {BUSINESS.sisterStudio.url ? (
            <p className="mt-3 text-sm text-slate">
              On the Westside? Visit our sister studio in{' '}
              <a
                href={BUSINESS.sisterStudio.url}
                className="text-mist underline decoration-electric underline-offset-4"
              >
                {BUSINESS.sisterStudio.city}
              </a>
              .
            </p>
          ) : null}
        </div>

        {/* Explore */}
        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              { href: '/self-tapes', label: 'Self-Tapes' },
              { href: '/demo-reels', label: 'Demo Reels' },
              { href: '/#digishot', label: 'Digishot' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/about', label: 'About' },
              { href: '/book', label: 'Book a session' },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-slate hover:text-mist">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Elsewhere */}
        <div>
          <p className="eyebrow">Elsewhere</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={BUSINESS.app.url} className="text-slate hover:text-mist">
                {BUSINESS.app.name} &mdash; tape from home
              </a>
            </li>
            <li>
              <a href={BUSINESS.digishot.url} className="text-slate hover:text-mist">
                {BUSINESS.digishot.name} &mdash; casting digitals
              </a>
            </li>
            <li>
              <a href={BUSINESS.socials.instagram} className="text-slate hover:text-mist">
                Instagram
              </a>
            </li>
            <li>
              <a href={BUSINESS.socials.facebook} className="text-slate hover:text-mist">
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-mist/10">
        <div className="container flex flex-col gap-2 py-6 font-mono text-xs text-slate md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {year} {BUSINESS.legalName}. All rights reserved.
          </p>
          <p className="uppercase tracking-widest">
            Shot &middot; Lit &middot; Read &middot; Delivered
          </p>
        </div>
      </div>
    </footer>
  );
}
