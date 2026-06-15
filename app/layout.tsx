import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Instrument_Sans, IBM_Plex_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import Hud from '@/components/Hud';
import Aurora from '@/components/Aurora';
import CameraRig from '@/components/CameraRig';
import { BUSINESS } from '@/lib/business';
import './globals.css';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
});

const sans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.url),
  title: {
    default: 'Self Tape Studio Los Angeles | The Selftape – Sherman Oaks',
    template: '%s | The Selftape – Sherman Oaks',
  },
  description:
    'Professional self-tape studio in Sherman Oaks, run by casting directors since 2008. Expert readers, pro lighting & sound. Book online today.',
  openGraph: {
    type: 'website',
    siteName: BUSINESS.name,
    url: BUSINESS.url,
    // TODO: add /public/og.jpg (1200×630) — a real frame from the studio
    // works best. Until it exists this tag points at a missing file.
    images: ['/og.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0F',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-electric focus:px-4 focus:py-2 focus:text-void"
        >
          Skip to content
        </a>
        <JsonLd />
        <Hud />
        <Aurora />
        <CameraRig />
        <div aria-hidden className="grain" />
        <Header />
        <main id="main" className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
