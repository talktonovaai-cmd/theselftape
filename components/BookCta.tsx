import Link from 'next/link';
import Reveal, { Item } from '@/components/Reveal';
import Magnetic from '@/components/Magnetic';
import { BUSINESS } from '@/lib/business';

/** End-of-page booking band, reused across service pages. */
export default function BookCta({
  heading = 'Ready to tape?',
}: {
  heading?: string;
}) {
  return (
    <section className="border-t border-mist/10">
      <Reveal className="container flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between">
        <Item>
          <h2 className="font-display text-3xl font-bold md:text-4xl">{heading}</h2>
          <p className="mt-2 text-slate">
            Book online in under a minute, or call us at{' '}
            <a href={BUSINESS.phoneHref} className="text-mist underline decoration-electric underline-offset-4">
              {BUSINESS.phoneDisplay}
            </a>
            .
          </p>
        </Item>
        <Item>
          <Magnetic>
            <Link
              href="/book"
              className="block rounded-md bg-electric px-6 py-3 font-display font-bold text-void transition-colors hover:bg-mist"
            >
              Book a session
            </Link>
          </Magnetic>
        </Item>
      </Reveal>
    </section>
  );
}
