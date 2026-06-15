'use client';

import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';
import { EASE } from '@/lib/motion';

/** Card with an electric spotlight that tracks the cursor, plus hover lift. */
export default function SpotlightCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const spotlight = useMotionTemplate`radial-gradient(280px circle at ${x}px ${y}px, rgba(77,124,255,0.18), transparent 70%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={reduced ? undefined : { y: -6 }}
      transition={{ duration: 0.6, ease: EASE }}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(-200);
        y.set(-200);
      }}
      className={`group relative overflow-hidden rounded-lg border border-mist/10 bg-panel transition-colors hover:border-electric/60 ${className}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: spotlight }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
