'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * A phone mockup for the selftape.ai section.
 *
 * It shows an on-brand "app preview" card by default (always looks intentional),
 * and ATTEMPTS to load the live selftape.ai inside the screen as a progressive
 * enhancement. If the live app is frameable (selftape.ai must allow
 * theselftape.com as a frame-ancestor -- see README), the real app fades in
 * over the preview. If it's blocked, the preview simply stays -- never a blank
 * box.
 *
 * The iframe is given no scroll influence over the parent page.
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

  // Only attempt the live embed after the user has actually scrolled into the
  // section -- never on initial paint, so a cross-origin frame can't pull the
  // page down to itself on load.
  useEffect(() => {
    const onFirstScroll = () => {
      setTryLive(true);
      window.removeEventListener('scroll', onFirstScroll);
    };
    window.addEventListener('scroll', onFirstScroll, { passive: true });
    return () => window.removeEventListener('scroll', onFirstScroll);
  }, []);

  // Consider the live app "ready" only if the iframe actually renders content.
  // Cross-origin frames that are blocked will never reach a usable state, so we
  // confirm via a load event AND a short settle delay before revealing it.
  function handleLoad() {
    // Give the framed app a beat to paint; if it was an error/blocked page the
    // browser may still fire load, so we keep the preview unless we can confirm.
    try {
      // Accessing contentWindow.location.href throws on a successfully framed
      // cross-origin page (good) but the mere load of our own-origin error page
      // would not. We treat a thrown SecurityError as "real app is there."
      const href = iframeRef.current?.contentWindow?.location.href;
      if (href === undefined) setLiveReady(true);
    } catch {
      // SecurityError -> cross-origin app really loaded inside the frame.
      setLiveReady(true);
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

        {/* live app -- sits BELOW the preview until it genuinely frames, then
            rises above it. Rendered first so it's underneath in stacking. */}
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

        {/* on-brand preview -- sits above the not-ready iframe (z-10) so its
            button is always tappable. The live iframe (z-20) covers it only
            once the real app is confirmed loaded. */}
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
