'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BUSINESS } from '@/lib/business';

const NAV = [
  { href: '/self-tapes', label: 'Self-Tapes' },
  { href: '/demo-reels', label: 'Demo Reels' },
  { href: '/#digishot', label: 'Digishot' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/selftape-ai', label: 'selftape.ai', accent: true },
] as { href: string; label: string; accent?: boolean }[];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-mist/10 bg-void/95 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="group flex flex-col leading-none" onClick={() => setOpen(false)}>
          <span className="font-display text-xl font-extrabold tracking-tight">
            THE SELFTAPE
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric">
            Sherman Oaks &middot; Est. {BUSINESS.founded}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.accent
                  ? 'font-mono text-sm text-electric transition-colors hover:text-mist'
                  : 'text-sm text-slate transition-colors hover:text-mist'
              }
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="rounded-md bg-electric px-4 py-2 font-display text-sm font-bold text-void transition-colors hover:bg-mist"
          >
            Book a session
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="font-mono text-xs uppercase tracking-widest text-mist md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-mist/10 md:hidden"
        >
          <div className="container flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded px-2 py-3 text-mist hover:bg-panel"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/book"
              className="mt-2 rounded-md bg-electric px-4 py-3 text-center font-display font-bold text-void"
              onClick={() => setOpen(false)}
            >
              Book a session
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
