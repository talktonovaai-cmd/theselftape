import type { Metadata } from 'next';
import BookCta from '@/components/BookCta';
import { BUSINESS, TESTIMONIALS } from '@/lib/business';

export const metadata: Metadata = {
  title: 'About',
  description:
    'The Selftape is the original self-tape studio in LA, founded in 2008 by Jason Montgomery — called "The Godfather of Selftape" by The New York Times. 100,000+ tapes shot.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <section className="container py-16 md:py-24">
        <p className="eyebrow">About</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] md:text-5xl">
          We didn&rsquo;t join the self-tape business.{' '}
          <span className="text-gradient">We started it.</span>
        </h1>
        <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-slate">
          <p>
            The Selftape was founded in {BUSINESS.founded} by{' '}
            <span className="text-mist">{BUSINESS.founder}</span> &mdash; the
            original self-tape studio, built to give actors a professional room
            to put themselves on tape back when most auditions still happened in
            person. Everyone else in this business followed. The New York Times
            called Jason{' '}
            <span className="text-mist">&ldquo;The Godfather of Selftape.&rdquo;</span>
          </p>
          <p>
            Since then we&rsquo;ve shot over{' '}
            <span className="text-mist">100,000 self-tapes</span> &mdash; a depth
            of experience no one else in the city comes close to. Jason is a
            working casting director with{' '}
            <a
              href={BUSINESS.creds.imdbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-mist underline decoration-electric underline-offset-4 hover:text-electric"
            >
              30+ studio credits
            </a>{' '}
            &mdash; {BUSINESS.creds.imdbCredits[0]}, {BUSINESS.creds.imdbCredits[1]},
            and {BUSINESS.creds.imdbCredits[2]} among them &mdash; and every
            reader in the
            room is a series-regular working actor. You&rsquo;re coached from the
            casting side of the table and you act against someone who actually
            books.
          </p>
          <p>
            That casting DNA is the whole point. Framing, lighting, the pace of
            the read &mdash; all of it comes from knowing exactly how tapes get
            watched on the other side: fast, in batches, with a finger on the
            skip key. We build tapes that survive that.
          </p>
          <p>
            For years we ran two rooms. Our original West Hollywood studio is now
            independently owned and operated by one of our longtime readers
            &mdash; a sister studio we&rsquo;re proud of &mdash; and Sherman Oaks
            is home.
          </p>
        </div>
      </section>

      {/* NYT framed clipping */}
      <section className="border-t border-mist/10 bg-panel">
        <div className="container flex flex-col items-center gap-8 py-16 md:flex-row md:items-center md:gap-16">
          <figure className="max-w-xs overflow-hidden rounded-lg border border-mist/10 shadow-glow-violet">
            <img
              src="/photos/nyt-feature.jpg"
              alt="The full New York Times feature on self-tape auditions, framed and hanging on the studio wall"
              className="block h-auto w-full"
              loading="lazy"
            />
            <figcaption className="bg-void/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate">
              The New York Times, 2019
            </figcaption>
          </figure>
          <div className="max-w-xl">
            <p className="eyebrow">As seen in</p>
            <p className="mt-4 font-display text-3xl font-extrabold md:text-4xl">
              <span className="text-gradient">"The Godfather of Selftape."</span>
            </p>
            <a
              href={BUSINESS.creds.nytUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.2em] text-slate hover:text-electric"
            >
              -- The New York Times, {BUSINESS.creds.nytDate} &#8599;
            </a>
            <p className="mt-4 text-slate">
              When the Times set out to chronicle how actors audition now, the
              trail led here. That framed page has been on the studio wall ever since.
            </p>
          </div>
        </div>
      </section>

      {/* TODO: Photo row -- restore once portrait photos are converted */}
      {/* panel-1.jpg = 99 Actors Day stage shot */}
      {/* panel-2.jpg = Skybar industry event shot */}

      {/* Testimonials */}
      <section className="border-t border-mist/10 bg-panel">
        <div className="container py-16">
          <p className="eyebrow">What actors say</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {TESTIMONIALS.map((t, i) => (
              <figure key={i} className="rounded-lg border border-mist/10 bg-void p-6">
                <blockquote className="text-lg leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 font-mono text-xs uppercase tracking-widest text-slate">
                  {t.name} &middot; {t.detail}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <BookCta heading="Come tape with us." />
    </>
  );
}
