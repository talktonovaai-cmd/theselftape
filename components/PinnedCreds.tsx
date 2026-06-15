'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';

/**
 * The signature scroll moment: a tall section that PINS its inner panel while
 * you scroll, scrubbing through the studio's credentials one beat at a time.
 * Each beat fades/slides in and back out, locked to scroll position.
 *
 * Reduced motion → renders as a plain stacked list, fully readable.
 */

type Beat = {
  kicker: string;
  line: string;
  sub: string;
};

const BEATS: Beat[] = [
  {
    kicker: 'The first of its kind',
    line: 'The original self-tape studio.',
    sub: 'Not a franchise, not a copy. The studio that started it all — everyone else followed.',
  },
  {
    kicker: 'The New York Times',
    line: '\u201CThe Godfather of Selftape.\u201D',
    sub: 'A title earned by defining the craft before the rest of the industry had a name for it.',
  },
  {
    kicker: 'Volume nobody can touch',
    line: 'Over 100,000 self-tapes shot.',
    sub: 'Six figures of auditions through these rooms. No one else is anywhere close to that experience.',
  },
  {
    kicker: 'Who you work with',
    line: 'One casting director. Series-regular readers.',
    sub: 'Coached by a working CD, read by actors who book series regular roles — every single session.',
  },
];

function BeatBlock({
  beat,
  index,
  total,
  progress,
}: {
  beat: Beat;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Carve the scroll range into one window per beat; fade in/hold/out.
  const span = 1 / total;
  const start = index * span;
  const inAt = start + span * 0.12;
  const holdEnd = start + span * 0.78;
  const end = start + span;

  const opacity = useTransform(
    progress,
    [start, inAt, holdEnd, end],
    [0, 1, 1, 0]
  );
  const y = useTransform(progress, [start, inAt, holdEnd, end], [70, 0, 0, -70]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
    >
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-electric">
        {beat.kicker}
      </p>
      <h3 className="mt-5 max-w-4xl font-display text-4xl font-extrabold leading-[1.05] md:text-7xl">
        {beat.line}
      </h3>
      <p className="mt-6 max-w-xl text-base text-slate md:text-lg">{beat.sub}</p>
    </motion.div>
  );
}

export default function PinnedCreds() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Scrubber width across the pinned panel.
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (reduced) {
    return (
      <section className="border-y border-mist/10 bg-panel">
        <div className="container space-y-12 py-20">
          {BEATS.map((b) => (
            <div key={b.line}>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-electric">
                {b.kicker}
              </p>
              <h3 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">
                {b.line}
              </h3>
              <p className="mt-3 max-w-xl text-slate">{b.sub}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    // Tall scroll track (400vh) — the inner panel pins for its duration.
    <section ref={ref} className="relative h-[400vh] border-y border-mist/10 bg-panel">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Scene counter */}
        <div className="absolute left-1/2 top-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-slate">
          Scene 02 &middot; The Record
        </div>

        {BEATS.map((beat, i) => (
          <BeatBlock
            key={beat.line}
            beat={beat}
            index={i}
            total={BEATS.length}
            progress={scrollYProgress}
          />
        ))}

        {/* Bottom scrubber */}
        <div className="absolute bottom-12 left-1/2 h-[2px] w-48 -translate-x-1/2 overflow-hidden rounded-full bg-mist/15">
          <motion.div
            style={{ scaleX: barScale }}
            className="h-full w-full origin-left bg-glow-line"
          />
        </div>
      </div>
    </section>
  );
}
