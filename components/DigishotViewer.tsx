'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * Real interactive 3D viewer for a Digishot scan, powered by Google's
 * <model-viewer>. Drag to rotate on desktop; tap "View in AR" on a phone to
 * drop the full-body avatar into the room (iOS Quick Look via USDZ, Android
 * Scene Viewer via GLB).
 *
 * The model-viewer library and the model lazy-load only when the viewer
 * scrolls into view, so the homepage's initial load isn't hit.
 */
export default function DigishotViewer({
  glbSrc,
  usdzSrc,
  poster,
  name = 'Michael Galante',
}: {
  glbSrc: string;
  usdzSrc?: string;
  poster?: string;
  name?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Don't arm the observer until after first paint settles, and use a small
    // margin, so the model never mounts on initial load (which could pull the
    // page down to it). It loads once the user scrolls it near view.
    let io: IntersectionObserver | null = null;
    const arm = () => {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io?.disconnect();
          }
        },
        { rootMargin: '120px' }
      );
      io.observe(el);
    };
    const t = setTimeout(arm, 300);
    return () => {
      clearTimeout(t);
      io?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!visible || scriptLoaded) return;
    if (customElements.get('model-viewer')) {
      setScriptLoaded(true);
      return;
    }
    const existing = document.querySelector('script[data-model-viewer="true"]');
    if (existing) {
      existing.addEventListener('load', () => setScriptLoaded(true));
      return;
    }
    const s = document.createElement('script');
    s.type = 'module';
    s.src =
      'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js';
    s.setAttribute('data-model-viewer', 'true');
    s.onload = () => setScriptLoaded(true);
    document.head.appendChild(s);
  }, [visible, scriptLoaded]);

  useEffect(() => {
    if (!scriptLoaded) return;
    const el = ref.current?.querySelector('model-viewer');
    if (!el) return;

    // model-viewer can pull the page toward itself when its canvas initializes
    // or fires `load`. If the user hasn't actively scrolled here yet, hold the
    // current scroll position steady through the load window.
    el.setAttribute('tabindex', '-1');
    const startY = window.scrollY;
    let guarding = startY < window.innerHeight; // only guard if still near top
    const hold = () => {
      if (guarding) window.scrollTo(0, startY);
    };
    // Stop guarding the moment the user intentionally scrolls.
    const release = () => {
      guarding = false;
      window.removeEventListener('wheel', release);
      window.removeEventListener('touchmove', release);
      window.removeEventListener('keydown', release);
    };
    window.addEventListener('wheel', release, { passive: true });
    window.addEventListener('touchmove', release, { passive: true });
    window.addEventListener('keydown', release);

    const onLoad = () => {
      setModelReady(true);
      hold();
      // keep holding briefly while the canvas settles
      requestAnimationFrame(hold);
      setTimeout(hold, 100);
      setTimeout(release, 400);
    };
    el.addEventListener('load', onLoad);

    return () => {
      el.removeEventListener('load', onLoad);
      release();
    };
  }, [scriptLoaded]);

  return (
    <div
      ref={ref}
      className="relative aspect-[3/4.4] overflow-hidden rounded-xl border border-mist/10 bg-gradient-to-b from-panel2 to-panel shadow-glow"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(rgba(77,124,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.12) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-slate">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan motion-safe:animate-pulseGlow" />
          Digishot &middot; live 3D
        </span>
        <span className="hidden sm:inline">{modelReady ? 'Drag to rotate' : 'Loading'}</span>
      </div>

      <AnimatePresence>
        {!modelReady && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4"
          >
            {!reduced && (
              <motion.div
                aria-hidden
                className="absolute inset-x-0 h-px bg-glow-line"
                initial={{ top: '12%' }}
                animate={{ top: ['12%', '88%', '12%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            <p className="z-10 font-mono text-xs uppercase tracking-[0.3em] text-slate">
              {visible ? 'Materializing scan...' : 'Scroll to load'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {scriptLoaded && (
        <model-viewer
          src={glbSrc}
          ios-src={usdzSrc}
          poster={poster}
          alt={`Interactive 3D Digishot scan of ${name}`}
          camera-controls
          touch-action="pan-y"
          auto-rotate={!reduced}
          auto-rotate-delay={600}
          rotation-per-second="24deg"
          interaction-prompt="none"
          shadow-intensity="1"
          shadow-softness="1"
          exposure="1.05"
          camera-orbit="0deg 90deg 105%"
          min-camera-orbit="auto auto 60%"
          max-camera-orbit="auto auto 200%"
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="fixed"
          ar-placement="floor"
          loading="lazy"
          reveal="auto"
          style={{
            width: '100%',
            height: '100%',
            background: 'transparent',
            // @ts-expect-error model-viewer CSS custom property
            '--progress-bar-color': '#22D3EE',
            '--progress-bar-height': '2px',
          }}
        />
      )}

      <span aria-hidden className="absolute left-3 top-3 z-10 h-6 w-6 border-l border-t border-cyan/50" />
      <span aria-hidden className="absolute right-3 top-3 z-10 h-6 w-6 border-r border-t border-cyan/50" />
      <span aria-hidden className="absolute bottom-3 left-3 z-10 h-6 w-6 border-b border-l border-violet/50" />
      <span aria-hidden className="absolute bottom-3 right-3 z-10 h-6 w-6 border-b border-r border-violet/50" />

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 bg-gradient-to-t from-void via-void/70 to-transparent px-4 py-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em]">
          <p className="text-mist">{name}</p>
          <p className="mt-0.5 text-slate">Full-body 3D scan</p>
        </div>
        {usdzSrc && (
          <a
            href={usdzSrc}
            rel="ar"
            className="rounded-md border border-cyan/60 bg-void/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan backdrop-blur transition-colors hover:bg-cyan hover:text-void"
          >
            View in AR &#8599;
          </a>
        )}
      </div>
    </div>
  );
}
