'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE } from '@/lib/motion';

// ─────────────────────────────────────────────────────────────────────────────
// Cal.com booking — wired to username "theselftape" (personal profile).
// The embed renders your PUBLIC Cal.com booking pages (no API key needed).
// Slugs below are confirmed live:
//   cal.com/theselftape/30min        (30 min · $50)
//   cal.com/theselftape/60min        (60 min · $75)
//   cal.com/theselftape/90min        (90 min · $125)
//   cal.com/theselftape/demo-reel    (Demo Reel edit · $75/hr)
// To collect deposits: each event type → Payments → Stripe in the dashboard.
// ─────────────────────────────────────────────────────────────────────────────
const CAL_USERNAME = 'theselftape';

const EVENTS = [
  {
    id: 'tape-30',
    label: '30-min Self-Tape',
    price: '$50',
    note: '1–2 short scenes · reader included',
    calLink: `${CAL_USERNAME}/30min`,
    description:
      'Best for one scene or a pair of short sides. Reader and file transmission included.',
  },
  {
    id: 'tape-60',
    label: '60-min Self-Tape',
    price: '$75',
    note: 'Longer sides or multiple looks',
    calLink: `${CAL_USERNAME}/60min`,
    description:
      'Room for longer material, multiple scenes, or an audition with a full look change.',
  },
  {
    id: 'tape-90',
    label: '90-min Self-Tape',
    price: '$125',
    note: 'Heavy sides · multiple roles · extra coaching',
    calLink: `${CAL_USERNAME}/90min`,
    description:
      'The most room — heavy sides, several roles, or extra time to coach and dial in each take.',
  },
  {
    id: 'demo-reel',
    label: 'Demo Reel Edit',
    price: '$75/hr',
    note: 'Managed edit · you direct',
    calLink: `${CAL_USERNAME}/demo-reel`,
    description:
      'Sit-down managed edit — bring your footage, leave with a casting-ready reel.',
  },
] as const;

/**
 * Cal.com inline embed — dynamically imported to avoid SSR issues.
 * The `key` prop forces a full remount when the event type changes
 * so the calendar resets cleanly.
 *
 * Auto-scroll fix: Cal's embed script focuses itself on load, which
 * triggers a scroll. We block that by setting scroll-margin-top to
 * a large value on the wrapper, then restoring it after mount.
 */
/**
 * Cal.com booking embed via iframe of the public booking page.
 *
 * We use a plain iframe of cal.com/{calLink} (confirmed to resolve publicly)
 * rather than the @calcom/embed-react component, which was throwing
 * "404 Cal Link seems wrong" in this setup. The iframe loads the exact same
 * booking UI and always works as long as the public link is valid.
 */
function CalEmbed({ calLink }: { calLink: string }) {
  return (
    <iframe
      title="Cal.com booking"
      src={`https://cal.com/${calLink}?embed=true&theme=dark&layout=month_view`}
      className="h-[660px] w-full border-0"
      loading="lazy"
    />
  );
}

export default function BookingEmbed() {
  const [active, setActive] = useState(0);
  const event = EVENTS[active];

  return (
    <div className="mt-10">
      {/* Tab row */}
      <div className="relative flex gap-2 overflow-x-auto pb-2 md:gap-3">
        {EVENTS.map((e, i) => (
          <button
            key={e.id}
            type="button"
            onClick={() => setActive(i)}
            className={`relative shrink-0 rounded-lg border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric ${
              i === active
                ? 'border-electric bg-panel text-mist'
                : 'border-mist/10 bg-void text-slate hover:border-mist/30 hover:text-mist'
            }`}
          >
            <span className="block font-display text-sm font-bold">{e.label}</span>
            <span className="mt-0.5 block font-mono text-xs text-electric">{e.price}</span>
            {i === active && (
              <motion.span
                layoutId="tab-indicator"
                className="absolute inset-0 rounded-lg border border-electric/40 bg-electric/5"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Active event detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="mt-4"
        >
          <div className="mb-4 flex items-start justify-between gap-4 rounded-lg border border-mist/10 bg-panel p-4">
            <div>
              <p className="font-display font-bold text-mist">{event.label}</p>
              <p className="mt-1 text-sm text-slate">{event.description}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-display text-xl font-extrabold text-electric">{event.price}</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-slate">
                {event.note}
              </p>
            </div>
          </div>

          {/* The actual Cal embed */}
          <div className="overflow-hidden rounded-xl border border-mist/10 bg-panel">
            <CalEmbed calLink={event.calLink} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
