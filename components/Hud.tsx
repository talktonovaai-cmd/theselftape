'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

function format(elapsed: number) {
  const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
  const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
  const s = String(elapsed % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

/**
 * The signature: the site records your visit like a take.
 * Top — scroll progress as a timeline scrubber.
 * Bottom-left — live REC timecode counting from page load.
 */
export default function Hud() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const [tc, setTc] = useState('00:00:00');

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      setTc(format(Math.floor((Date.now() - start) / 1000)));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Timeline scrubber */}
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-electric"
        style={{ scaleX: reduced ? 1 : scaleX, opacity: reduced ? 0 : 1 }}
      />
      {/* Running timecode */}
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-4 left-4 z-[70] hidden items-center gap-2 rounded-full border border-mist/10 bg-void/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-slate backdrop-blur md:flex"
      >
        <span className="h-2 w-2 rounded-full bg-record motion-safe:animate-rec" />
        Rec {tc}
      </div>
    </>
  );
}
