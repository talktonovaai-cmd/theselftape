import Link from 'next/link';
import Reveal, { Item } from '@/components/Reveal';
import Magnetic from '@/components/Magnetic';
import { BUSINESS } from '@/lib/business';

/**
 * The funnel: routes visitors to the selftape.ai page on this domain.
 * Light panel intentionally inverts the dark theme so it reads as a
 * distinct moment on every page it appears.
 */
export default function AiFunnelBanner() {
  return (
    <section className="bg-mist text-void">
      <Reveal className="container flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between">
        <Item className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-record">
            Not in LA?
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">
            Tape from home with an AI scene partner.
          </h2>
          <p className="mt-3 text-void/70">
            {BUSINESS.app.name} reads opposite you &mdash; any scene, any hour,
            unlimited takes. Built by the same team behind this studio.
          </p>
        </Item>
        <Item>
          <Magnetic>
            <Link
              href="/selftape-ai"
              className="block shrink-0 rounded-md bg-void px-6 py-3 font-display font-bold text-mist transition-colors hover:bg-record"
            >
              Meet {BUSINESS.app.name} &rarr;
            </Link>
          </Magnetic>
        </Item>
      </Reveal>
    </section>
  );
}
