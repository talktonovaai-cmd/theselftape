'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

/**
 * Scene3D wraps a homepage section and drives it through z-space as it passes
 * the viewport:
 *
 *   entering (bottom) -> rises forward out of depth, tilted back, dim
 *   centered          -> flat, full size, fully opaque  (the resting frame)
 *   leaving  (top)    -> recedes back into depth, tilts away, dims
 *
 * The effect reads as panes of glass moving through a tunnel -- the section
 * "scrolls into itself." Opacity is full across the whole center band so
 * content can never get stuck dimmed. A spring smooths the scrub.
 *
 * IMPORTANT: never wrap a section that contains `position: sticky` (e.g.
 * PinnedCreds) -- a transformed ancestor breaks sticky positioning.
 */
export default function Scene3D({
  children,
  className = '',
  intensity = 1,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const p = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    mass: 0.35,
  });

  const rotateX = useTransform(p, [0, 0.5, 1], [9 * intensity, 0, -7 * intensity]);
  const scale = useTransform(p, [0, 0.5, 1], [0.88, 1, 0.93]);
  const z = useTransform(p, [0, 0.5, 1], [-200 * intensity, 0, -140 * intensity]);
  // Opaque across the whole middle band; only dims at the very edges.
  const opacity = useTransform(p, [0, 0.16, 0.84, 1], [0.2, 1, 1, 0.45]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{
        transformPerspective: 1400,
        rotateX,
        scale,
        z,
        opacity,
        transformOrigin: 'center center',
        willChange: 'transform, opacity',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
