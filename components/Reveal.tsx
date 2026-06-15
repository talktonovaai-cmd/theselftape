'use client';

import { motion } from 'framer-motion';
import { EASE } from '@/lib/motion';

/**
 * Scroll-reveal wrapper. This is now a plain layout container — each Item
 * triggers its own whileInView animation independently, so nothing depends
 * on fragile parent->child variant propagation (which could leave content
 * stuck invisible if the parent's "show" state never resolved).
 */
export default function Reveal({
  children,
  className,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section';
}) {
  const Tag = as === 'section' ? 'section' : 'div';
  return <Tag className={className}>{children}</Tag>;
}

/**
 * Self-contained fade-up. Each Item animates itself when scrolled into view.
 * `once: true` so it doesn't replay; `amount: 0.15` triggers as soon as a
 * sliver is visible. No dependency on a parent variant state.
 */
export function Item({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
