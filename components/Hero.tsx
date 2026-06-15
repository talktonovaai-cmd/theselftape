'use client';

import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import Magnetic from '@/components/Magnetic';
import { EASE } from '@/lib/motion';
import { BUSINESS } from '@/lib/business';

const HEADLINE = ['Audition panic', 'ends here.'];

export default function Hero() {
  const reduced = useReducedMotion();

  // Electric key light follows the cursor across the hero.
  const mx = useMotionValue(50);
  const my = useMotionValue(35);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const light = useMotionTemplate`radial-gradient(640px circle at ${sx}% ${sy}%, rgba(77,124,255,0.16), transparent 65%)`;

  function onMove(e: React.MouseEvent<HTMLElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 100);
    my.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  const bracket = (cls: string, delay: number) => (
    <motion.span
      aria-hidden
      className={`absolute h-9 w-9 border-electric/70 ${cls}`}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    />
  );

  // Direct fade-up: each element animates itself with an explicit delay.
  // No variant propagation, so nothing can get stuck in a hidden state.
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE, delay },
  });

  return (
    <section className="container py-6 md:py-10" onMouseMove={onMove}>
      <motion.div
        className="relative px-5 py-16 md:px-12 md:py-28"
        style={{ background: light }}
      >
        {bracket('left-0 top-0 border-l-2 border-t-2', 0.1)}
        {bracket('right-0 top-0 border-r-2 border-t-2', 0.2)}
        {bracket('bottom-0 right-0 border-b-2 border-r-2', 0.3)}
        {bracket('bottom-0 left-0 border-b-2 border-l-2', 0.4)}

        {/* Slate bar */}
        <motion.div
          className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-slate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <span>Scene 01 &middot; Take &infin;</span>
          <span className="hidden sm:inline">
            Sherman Oaks &middot; Est. {BUSINESS.founded}
          </span>
        </motion.div>

        <div className="mt-12 max-w-3xl md:mt-16">
          <motion.p className="eyebrow" {...fade(0.55)}>
            The original self-tape studio &middot; Sherman Oaks, LA
          </motion.p>

          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            {HEADLINE.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span
                  className={i === 1 ? 'block text-gradient' : 'block'}
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.65 + i * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p className="mt-5 max-w-xl text-lg text-slate" {...fade(0.95)}>
            Sides due in the morning? Walk in, hit your mark, walk out with the
            tape you wanted to send. The studio that started it all &mdash; over
            100,000 self-tapes shot since {BUSINESS.founded}, coached by a working
            casting director and read by series-regular actors.
          </motion.p>

          <motion.div className="mt-8 flex flex-wrap gap-4" {...fade(1.1)}>
            <Magnetic>
              <Link
                href="/book"
                className="block rounded-md bg-electric px-6 py-3 font-display font-bold text-void transition-colors hover:bg-mist"
              >
                Book a session
              </Link>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Link
                href="/pricing"
                className="block rounded-md border border-mist/25 px-6 py-3 font-display font-bold text-mist transition-colors hover:border-electric hover:text-electric"
              >
                See pricing
              </Link>
            </Magnetic>
          </motion.div>

          <motion.p
            className="mt-6 font-mono text-xs uppercase tracking-[0.15em] text-slate"
            {...fade(1.25)}
          >
            30 min &middot; $50&ensp;/&ensp;60 min &middot; $75&ensp;/&ensp;reader included
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
