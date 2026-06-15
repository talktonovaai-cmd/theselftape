'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';

// Number of "focus pulses" across the page -- roughly one per major section.
const SECTIONS = 8;
const BLADE_COUNT = 9;

/**
 * A single curved aperture blade -- the petal shape of a real iris. Pivots
 * around the lens center; when assembled the blades swing in and overlap to
 * form the spiral aperture with a small central opening, when apart they swing
 * out and the iris opens wide.
 *
 * The petal path is drawn once (a curved sliver) and rotated/translated by the
 * blade's pivot. `assembly` 1 = closed iris (swung in), 0 = open (swung out).
 */
function Blade({
  assembly,
  angle,
  color,
}: {
  assembly: MotionValue<number>;
  angle: number;
  color: string;
}) {
  // Swing angle: blades rotate around their pivot to open/close the iris.
  // Kept modest so the iris opens within the barrel instead of poking past it.
  const swing = useTransform(assembly, [0, 1], [-28, 0]);
  const opacity = useTransform(assembly, [0, 1], [0.22, 0.7]);
  // Slight radial retract when wide open.
  const ty = useTransform(assembly, [0, 1], [12, 0]);

  return (
    <g transform={`rotate(${angle})`}>
      <motion.g style={{ rotate: swing, y: ty, originX: 0, originY: 0 }}>
        <motion.path
          d="M-20 -158
             C 26 -160, 60 -150, 74 -120
             C 60 -96, 30 -64, -14 -44
             C -30 -72, -34 -120, -20 -158 Z"
          fill={color}
          fillOpacity={0.06}
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
          style={{ opacity }}
        />
      </motion.g>
    </g>
  );
}

/** A barrel ring that nests when assembled and separates + fades when apart. */
function Ring({
  assembly,
  baseR,
  spread,
  color,
}: {
  assembly: MotionValue<number>;
  baseR: number;
  spread: number;
  color: string;
}) {
  const r = useTransform(assembly, [0, 1], [baseR + spread, baseR]);
  const opacity = useTransform(assembly, [0, 1], [0.08, 0.4]);
  return (
    <motion.circle
      cx={0}
      cy={0}
      r={r}
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      style={{ opacity }}
    />
  );
}

export default function CameraRig() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 26, mass: 0.4 });

  // Cosine wave: assembled (=1) at section centers, apart (=0) between them.
  // Starts assembled at the top so the hero feels "in focus" on load.
  const assembly = useTransform(p, (v) => (Math.cos(v * SECTIONS * 2 * Math.PI) + 1) / 2);

  // Whole rig spins slowly; spins faster while disassembled.
  const spin = useTransform(p, [0, 1], [0, 90]);
  const focusReticle = useTransform(assembly, [0.6, 1], [0, 1]);
  const reticleScale = useTransform(assembly, [0, 1], [1.4, 1]);

  if (reduced) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[2] flex items-center justify-center overflow-hidden"
    >
      <motion.svg
        viewBox="-220 -220 440 440"
        className="h-[120vmin] w-[120vmin] opacity-70"
        style={{ rotate: spin, filter: 'drop-shadow(0 0 24px rgba(77,124,255,0.22))' }}
      >
        <defs>
          {/* Keeps the iris blades contained inside the lens barrel */}
          <clipPath id="barrel-clip">
            <circle cx={0} cy={0} r={164} />
          </clipPath>
        </defs>

        {/* Outer machined barrel -- rotates slowly */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 140, repeat: Infinity, ease: 'linear' }}
        >
          <Ring assembly={assembly} baseR={200} spread={56} color="#8B5CF6" />
          <Ring assembly={assembly} baseR={182} spread={30} color="#4D7CFF" />
          <Ring assembly={assembly} baseR={170} spread={14} color="#8A8EA6" />

          {/* Knurling: short radial ticks around the grip ring */}
          {Array.from({ length: 72 }).map((_, i) => (
            <line
              key={i}
              x1={0}
              y1={-198}
              x2={0}
              y2={-188}
              stroke="#4D7CFF"
              strokeWidth={1}
              opacity={0.18}
              transform={`rotate(${i * 5})`}
            />
          ))}

          {/* Engraved markings, like a real lens barrel */}
          <g fontFamily="monospace" fill="#8A8EA6" opacity={0.4} fontSize={9} letterSpacing={1}>
            <text x={0} y={-156} textAnchor="middle">ZOOM</text>
            <text x={148} y={4} textAnchor="middle" transform="rotate(90 148 0)">105 mm</text>
            <text x={0} y={162} textAnchor="middle" transform="rotate(180 0 158)">24-105 mm 1:4</text>
            <text x={-148} y={4} textAnchor="middle" transform="rotate(-90 -148 0)">LENS</text>
          </g>
        </motion.g>

        {/* Inner focus ring -- counter-rotates */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
        >
          <circle cx={0} cy={0} r={158} fill="none" stroke="#4D7CFF" strokeWidth={2} opacity={0.3} />
          {Array.from({ length: 48 }).map((_, i) => (
            <line
              key={i}
              x1={0}
              y1={-158}
              x2={0}
              y2={i % 4 === 0 ? -150 : -154}
              stroke="#8B5CF6"
              strokeWidth={1}
              opacity={0.22}
              transform={`rotate(${i * 7.5})`}
            />
          ))}
        </motion.g>

        {/* The iris -- curved blades overlapping into the aperture spiral.
            Clipped to the barrel so blades never extend past the lens. */}
        <g clipPath="url(#barrel-clip)">
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 200, repeat: Infinity, ease: 'linear' }}
          >
            {Array.from({ length: BLADE_COUNT }).map((_, i) => {
              const palette = ['#22D3EE', '#4D7CFF', '#8B5CF6', '#E84DD8'];
              return (
                <Blade
                  key={i}
                  assembly={assembly}
                  angle={(360 / BLADE_COUNT) * i}
                  color={palette[i % palette.length]}
                />
              );
            })}
          </motion.g>
        </g>

        {/* Aperture opening + focus glints when locked */}
        <motion.g style={{ opacity: focusReticle, scale: reticleScale }}>
          <circle cx={0} cy={0} r={26} fill="#0A0A0F" stroke="#4D7CFF" strokeWidth={1.5} opacity={0.7} />
          <circle cx={-8} cy={-8} r={5} fill="#4D7CFF" opacity={0.5} />
          <circle cx={10} cy={6} r={3} fill="#8B5CF6" opacity={0.4} />
        </motion.g>
      </motion.svg>
    </div>
  );
}
