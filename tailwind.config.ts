import type { Config } from 'tailwindcss';

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens — tuned to match selftape.ai
//
//   void     #0A0A0F  the app's exact theme-color — near-black, cool cast
//   panel    raised surface, cool charcoal
//   panel2   second-level surface
//   mist     cool near-white body/text
//   slate    muted cool gray (secondary text)
//   electric #4D7CFF  primary accent — electric indigo (CTAs, highlights)
//   violet   #8B5CF6  gradient companion for the neon glow
//   record   REC red — kept for the camera record dot only
// ─────────────────────────────────────────────────────────────────────────────
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', md: '2rem' },
      screens: { '2xl': '72rem' },
    },
    extend: {
      colors: {
        void: '#0A0A0F',
        panel: '#13131F',
        panel2: '#1B1B2B',
        mist: '#EAECF5',
        slate: '#8A8EA6',
        electric: '#4D7CFF',
        violet: '#8B5CF6',
        cyan: '#22D3EE',
        magenta: '#E84DD8',
        record: '#FF3B5C',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'glow-line':
          'linear-gradient(90deg, transparent, #22D3EE, #4D7CFF, #8B5CF6, #E84DD8, transparent)',
        'electric-violet': 'linear-gradient(135deg, #22D3EE 0%, #4D7CFF 40%, #8B5CF6 70%, #E84DD8 100%)',
        'spectrum': 'linear-gradient(120deg, #22D3EE, #4D7CFF, #8B5CF6, #E84DD8)',
      },
      boxShadow: {
        glow: '0 0 60px -12px rgba(77,124,255,0.5)',
        'glow-violet': '0 0 80px -16px rgba(139,92,246,0.45)',
        'glow-cyan': '0 0 70px -14px rgba(34,211,238,0.45)',
      },
      keyframes: {
        rec: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.2' } },
        marquee: { to: { transform: 'translateX(-50%)' } },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(6%, -4%) scale(1.08)' },
          '66%': { transform: 'translate(-5%, 5%) scale(0.96)' },
        },
        pulseGlow: { '0%, 100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
      },
      animation: {
        rec: 'rec 1.6s ease-in-out infinite',
        marquee: 'marquee 24s linear infinite',
        drift: 'drift 22s ease-in-out infinite',
        'drift-slow': 'drift 34s ease-in-out infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
