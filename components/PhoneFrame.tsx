'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * A phone mockup for the selftape.ai section.
 *
 * Shows an on-brand "app preview" card by default (always looks intentional).
 * It ALSO attempts to load the live selftape.ai inside the screen as a
 * progressive enhancement. The live app is only ever revealed if it genuinely
 * frames successfully; if selftape.ai refuses to be embedded (X-Frame-Options
 * / missing frame-ancestors), the browser's "refused to connect" error is kept
 * hidden underneath the preview card and the user only ever sees the clean card.
 *
 * To make the REAL app appear here, selftape.ai must send a header allowing:
 *   Content-Security-Policy: frame-ancestors 'self'
 *     https://shermanoaksselftape.com https://www.shermanoaksselftape.com
 *   (and remove X-Frame-Options: DENY/SAMEORIGIN)
 */
export default function PhoneFrame({
  src,
  appUrl,
}: {
  src: string;
  appUrl: string;
}) {
  const reduced = useReducedMotion();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [liveReady, setLiveReady] = useState(false);
  const [tryLive, setTryLive] = useState(false);

  // Only attempt the live embed after the user has actually scrolled -- never
  // on initial paint, so a cross-origin frame can't pull the page to itself.
  useEffect(() => {
    const onFirstScroll = () => {
      setTryLive(true);
      window.removeEventListener('scroll', onFirstScroll);
    };
    window.addEventListener('scroll', onFirstScroll, { passive: true });
    return () => window.removeEventListener('scroll', onFirstScroll);
  }, []);

  // A blocked cross-origin frame still fires `load` (on the browser's error
  // page), so `load` alone can't be trusted. We probe: on a SUCCESSFULLY framed
  // cross-origin app, reading contentWindow.location.href throws a SecurityError
  // -- that's our signal the real app is there. A same-origin browser error
  // page does NOT throw, so it stays hidden. We also require the frame to still
  // be present a beat later, to avoid flashing an error page.
  function handleLoad() {
    let crossOrigin = false;
    try {
      // Throws (SecurityError) => real cross-origin app loaded. Good.
      void iframeRef.current?.contentWindow?.location.href;
      // No throw => same-origin (our error page). Keep it hidden.
      crossOrigin = false;
    } catch {
      crossOrigin = true;
    }
    if (crossOrigin) {
      // Small settle delay so we never flash a half-loaded frame.
      setTimeout(() => setLiveReady(true), 400);
    }
  }

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[300px]"
    >
      {/* glow behind phone */}
      <div aria-hidden className="pointer-events-none absolute -inset-8 z-0 rounded-[3rem] bg-spectrum opacity-20 blur-3xl" />

      {/* phone body */}
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.6rem] border-[3px] border-mist/15 bg-void shadow-glow-cyan">
        {/* notch */}
        <div className="absolute left-1/2 top-0 z-30 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-void" />

        {/* live app -- stays BELOW the preview (z-0, transparent) until it is
            CONFIRMED to have framed successfully, then rises above (z-20). If
            selftape.ai refuses to be embedded, the browser error page renders
            here but stays hidden under the preview card forever. */}
        {tryLive && (
          <iframe
            ref={iframeRef}
            src={src}
            title="selftape.ai live app"
            onLoad={handleLoad}
            tabIndex={-1}
            scrolling="no"
            className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-700 ${
              liveReady
                ? 'z-20 opacity-100'
                : 'z-0 pointer-events-none opacity-0'
            }`}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        )}

        {/* on-brand preview -- ALWAYS visible above the not-ready iframe (z-10),
            so its button is always tappable and no error page ever shows. The
            live iframe (z-20) covers it only once the real app is confirmed. */}
        <div className="absolute inset-0 z-10 flex flex-col bg-gradient-to-b from-panel2 to-void">
          <div className="flex items-center gap-2 px-5 pt-10">
            <span className="h-2 w-2 rounded-full bg-cyan motion-safe:animate-pulseGlow" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate">
              selftape.ai
            </span>
          </div>
          <div className="flex flex-1 flex-col justify-center px-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">
              Not in LA? Can&rsquo;t make the studio?
            </p>
            <h3 className="mt-3 font-display text-3xl font-extrabold leading-tight text-mist">
              selftape.ai
            </h3>
            <p className="mt-3 text-sm text-slate">
              Your on-demand reader and scene partner, with Scene Intelligence
              that breaks down your sides and a best-take selector. From sides
              to sent.
            </p>
            <div className="mt-5 space-y-2">
              {['Upload', 'Rehearse', 'Record', 'Ship'].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-mist/20 font-mono text-[10px] text-cyan">
                    {i + 1}
                  </span>
                  <span className="text-sm text-mist">{step}</span>
                </div>
              ))}
            </div>
          </div>
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 m-4 rounded-xl bg-spectrum py-3 text-center font-display font-bold text-void"
          >
            Open selftape.ai
          </a>
        </div>
      </div>
    </motion.div>
  );
}
