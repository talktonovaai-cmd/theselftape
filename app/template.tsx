'use client';

import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from '@/lib/motion';

/** Every route change enters like a cut to a new take. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  // Ensure each page starts at the top. Browser scroll restoration plus async
  // content loading below the fold (3D model, iframe) can otherwise land the
  // user partway down the page on load. We reset on mount and again shortly
  // after, to catch jumps caused by late-loading content.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (window.location.hash) return; // respect intentional #anchor targets

    window.scrollTo(0, 0);
    const raf = requestAnimationFrame(() => window.scrollTo(0, 0));
    const t1 = setTimeout(() => window.scrollTo(0, 0), 200);
    const t2 = setTimeout(() => window.scrollTo(0, 0), 800);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
