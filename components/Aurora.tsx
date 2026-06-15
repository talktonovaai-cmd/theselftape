'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Ambient neon atmosphere — three large blurred gradient blobs that drift on
 * their own (CSS) and parallax with scroll (Framer). Fixed behind all content.
 * This is what makes the page feel like selftape.ai's glowing dark world.
 */
export default function Aurora() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Each blob drifts a different distance with scroll → depth.
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        style={{ y: reduced ? 0 : y1 }}
        className="absolute -left-[10%] -top-[10%] h-[55vh] w-[55vh] rounded-full bg-cyan/15 blur-[120px] motion-safe:animate-drift"
      />
      <motion.div
        style={{ y: reduced ? 0 : y2 }}
        className="absolute right-[-12%] top-[20%] h-[60vh] w-[60vh] rounded-full bg-violet/20 blur-[130px] motion-safe:animate-drift-slow"
      />
      <motion.div
        style={{ y: reduced ? 0 : y3 }}
        className="absolute bottom-[-15%] left-[25%] h-[50vh] w-[50vh] rounded-full bg-magenta/12 blur-[120px] motion-safe:animate-drift"
      />
      <motion.div
        style={{ y: reduced ? 0 : y1 }}
        className="absolute right-[15%] bottom-[5%] h-[40vh] w-[40vh] rounded-full bg-electric/15 blur-[110px] motion-safe:animate-drift-slow"
      />
    </div>
  );
}
