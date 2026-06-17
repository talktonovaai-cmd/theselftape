import type { Metadata } from 'next';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Scene3D from '@/components/Scene3D';
import PinnedCreds from '@/components/PinnedCreds';
import SpotlightCard from '@/components/SpotlightCard';
import CountUp from '@/components/CountUp';
import PhoneFrame from '@/components/PhoneFrame';
import DigishotViewer from '@/components/DigishotViewer';
import Magnetic from '@/components/Magnetic';
import { BUSINESS, PRICING, TESTIMONIALS } from '@/lib/business';

export const metadata: Metadata = {
  title: 'Self Tape Studio Los Angeles | The Selftape -- Sherman Oaks',
  description:
    'Audition panic ends here. The original self-tape studio in LA -- 100,000+ tapes shot, series-regular readers, working casting director. Book in Sherman Oaks.',
  alternates: { canonical: '/' },
};

const SERVICES = [
  {
    href: '/self-tapes',
    title: 'Self-Tapes',
    body: 'Pro lighting, clean sound, and a reader who acts with you. Reader and file transmission included in every rate.',
  },
  {
    href: '/demo-reels',
    title: 'Demo Reels',
    body: 'Managed sit-down edits at $75/hr. You direct; we cut a reel formatted for Actors Access and casting links.',
  },
  {
    href: '/#digishot',
    title: 'Digishot',
    body: 'Next-gen 3D and AR full-body scans. Your spatial casting identity -- rotate it, drop it into a room in AR.',
  },
];

const WHY = [
  {
    title: 'Coached by a working CD',
    body: 'Founder Jason Montgomery is a working casting director with 30+ credits -- X-Men: First Class, Die Hard, Date Night. Your tape is framed the way the people watching it expect.',
  },
  {
    title: 'Series-regular readers',
    body: 'A flat reader kills a tape. Ours are working actors who book series-regular roles -- you get someone to genuinely act against, every session.',
  },
  {
    title: 'No pressure, no rush',
    body: 'Review your takes before you leave. Re-slate if you need to. The session ends when the tape is right.',
  },
];

const YEARS = new Date().getFullYear() - Number(BUSINESS.founded);

export default function HomePage() {
  return (
    <>
      {/* Hero -- own load animation, not wrapped in Scene3D */}
      <Hero />

      <Marquee
        items={[
          'Self-Tapes',
          'Demo Reels',
          'Digishot',
          'Est. 2008',
          'Reader Included',
          'Teleprompter',
          'Sherman Oaks',
          'The Original',
        ]}
      />

      {/* selftape.ai */}
      <Scene3D className="border-t border-mist/10">
        <div className="container grid items-center gap-12 py-24 md:grid-cols-2 md:py-36">
          <div>
            <div className="relative inline-block">
              <div
                aria-hidden
                className="absolute -inset-x-3 -inset-y-1 rounded-full bg-spectrum opacity-20 blur-xl"
              />
              <p className="relative font-mono text-xs uppercase tracking-[0.2em] text-mist">
                We defined self-taping in 2008. We&rsquo;re redefining it in 2026.
              </p>
            </div>
            <div aria-hidden className="mt-3 h-px w-48 bg-glow-line" />
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] md:text-6xl">
              Not in LA? <span className="text-gradient">No problem.</span>
            </h2>
            <p className="mt-5 max-w-md text-lg text-slate">
              Can&rsquo;t make it into one of the studios? No reader? selftape.ai
              is your on-demand reader and scene partner -- with Scene
              Intelligence that breaks down your sides and a best-take selector.
              From sides to sent.
            </p>
            <ul className="mt-6 grid gap-2 text-sm text-slate sm:grid-cols-2">
              {[
                { label: 'Scene partner', dot: 'bg-cyan' },
                { label: 'Scene Intelligence prep', dot: 'bg-electric' },
                { label: 'Actor Brain archive', dot: 'bg-violet' },
                { label: 'Best-take selector', dot: 'bg-magenta' },
              ].map((f) => (
                <li key={f.label} className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${f.dot}`} />
                  {f.label}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <Magnetic>
                <a
                  href={BUSINESS.app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-md bg-spectrum px-7 py-3.5 font-display text-lg font-bold text-void transition-opacity hover:opacity-90"
                >
                  Start a scene
                </a>
              </Magnetic>
              <Magnetic strength={0.25}>
                <Link
                  href="/selftape-ai"
                  className="block rounded-md border border-mist/25 px-7 py-3.5 font-display text-lg font-bold transition-colors hover:border-cyan hover:text-cyan"
                >
                  How it works
                </Link>
              </Magnetic>
            </div>
          </div>
          <PhoneFrame src={BUSINESS.app.embedUrl} appUrl={BUSINESS.app.url} />
        </div>
      </Scene3D>

      {/* Digishot */}
      <Scene3D className="border-t border-mist/10">
        <div id="digishot" className="container grid items-center gap-12 py-24 md:grid-cols-2 md:py-36 scroll-mt-24">
          <DigishotViewer
            glbSrc="/digishot-1062.glb"
            usdzSrc="/digishot-1062.usdz"
            poster="/photos/digishot-poster.jpg"
            name="Michael Galante"
          />
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
              Next-gen casting -- AR / 3D full-body scans
            </p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] md:text-6xl">
              Step into <span className="text-gradient">three dimensions</span>.
            </h2>
            <p className="mt-5 max-w-md text-lg text-slate">
              That&rsquo;s a real actor on the left -- a full-body Digishot scan.
              Drag to spin him around. On your phone, tap{' '}
              <span className="text-cyan">View in AR</span> and watch him walk
              into your room at life size. This is the future of the casting
              profile.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate">
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
                Full-body 3D capture and texture in a single session
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
                Native AR on iPhone and Android -- life-size, in the room
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
                Compatible with selftape.ai for spatial submissions
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <Magnetic>
                <a
                  href={BUSINESS.digishot.url}
                  className="block rounded-md bg-spectrum px-7 py-3.5 font-display text-lg font-bold text-void transition-opacity hover:opacity-90"
                >
                  Try Digishot
                </a>
              </Magnetic>
              <Magnetic strength={0.25}>
                <a
                  href={BUSINESS.digishot.url}
                  className="block rounded-md border border-mist/25 px-7 py-3.5 font-display text-lg font-bold transition-colors hover:border-cyan hover:text-cyan"
                >
                  See how it works
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </Scene3D>

      {/* Pinned cinematic credentials -- NOT wrapped (uses sticky) */}
      <PinnedCreds />

      {/* NYT press */}
      <Scene3D className="border-t border-mist/10">
        <div className="container grid items-center gap-12 py-24 md:grid-cols-[1.2fr_1fr] md:py-32">
          <div>
            <p className="eyebrow">As seen in</p>
            <p className="mt-6 font-display text-4xl font-extrabold leading-[1.1] md:text-6xl">
              <span className="text-gradient">"The Godfather of Selftape."</span>
            </p>
            <a
              href={BUSINESS.creds.nytUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block font-mono text-xs uppercase tracking-[0.25em] text-slate transition-colors hover:text-electric"
            >
              -- The New York Times, {BUSINESS.creds.nytDate}
            </a>
            <p className="mt-5 max-w-md text-slate">
              When the Times set out to chronicle how actors audition now, the
              trail led to one studio -- and one name.
            </p>
          </div>
          <div className="relative mx-auto max-w-sm">
            {/* spectrum glow halo behind the frame */}
            <div
              aria-hidden
              className="absolute -inset-10 rounded-[2rem] bg-spectrum opacity-40 blur-[60px]"
            />
            <figure className="relative overflow-hidden rounded-lg border border-mist/15 shadow-glow-violet">
              <img
                src="/photos/nyt-feature.jpg"
                alt="The full New York Times feature on self-tape auditions, framed on the studio wall"
                className="block h-auto w-full"
                loading="lazy"
              />
              <figcaption className="bg-void/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate">
                The New York Times, 2019
              </figcaption>
            </figure>
          </div>
        </div>
      </Scene3D>

      {/* Services */}
      <Scene3D className="border-t border-mist/10">
        <div className="container py-16 md:py-24">
          <p className="eyebrow">What we do</p>
          <h2 className="mt-3 max-w-lg font-display text-3xl font-bold md:text-4xl">
            Everything your audition needs, one roof.
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <SpotlightCard key={s.title}>
                <Link href={s.href} className="block p-6">
                  <h3 className="font-display text-xl font-bold">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate">{s.body}</p>
                  <p className="mt-4 font-mono text-xs uppercase tracking-widest text-electric">
                    Learn more &#8594;
                  </p>
                </Link>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </Scene3D>

      {/* Stats + Why */}
      <Scene3D className="border-t border-mist/10">
        <div className="container py-16 md:py-24">
          <div className="grid gap-12 md:grid-cols-[auto_1fr] md:gap-20">
            <div className="flex flex-col gap-8">
              <div>
                <p className="font-display text-7xl font-extrabold leading-none text-electric md:text-8xl">
                  <CountUp to={100} />k+
                </p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-slate">
                  Self-tapes shot
                </p>
              </div>
              <div>
                <p className="font-display text-7xl font-extrabold leading-none text-violet md:text-8xl">
                  <CountUp to={YEARS} />
                </p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-slate">
                  Years of tapes
                </p>
              </div>
            </div>
            <div className="grid gap-10 sm:grid-cols-3">
              {WHY.map((item) => (
                <div key={item.title}>
                  <h3 className="font-display text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Scene3D>

      {/* Pricing teaser */}
      <Scene3D className="border-t border-mist/10 bg-panel">
        <div className="container py-16 md:py-24">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Rates</p>
              <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                Simple pricing. Reader included.
              </h2>
            </div>
            <Link
              href="/pricing"
              className="font-mono text-xs uppercase tracking-widest text-electric hover:text-mist"
            >
              Full price list &#8594;
            </Link>
          </div>
          <dl className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...PRICING.selfTapes.lines, ...PRICING.packs.lines].map((line) => (
              <SpotlightCard key={line.label} className="bg-void">
                <div className="p-6">
                  <dt className="text-sm text-slate">{line.label}</dt>
                  <dd className="mt-2 font-display text-3xl font-extrabold text-electric">
                    {line.price}
                  </dd>
                  {line.note ? (
                    <dd className="mt-1 text-xs text-slate">{line.note}</dd>
                  ) : null}
                </div>
              </SpotlightCard>
            ))}
          </dl>
        </div>
      </Scene3D>

      {/* Testimonials */}
      <Scene3D className="border-t border-mist/10">
        <div className="container py-16 md:py-24">
          <p className="eyebrow">From the room</p>
          <h2 className="mt-3 max-w-lg font-display text-3xl font-bold md:text-4xl">
            Working actors keep coming back.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {TESTIMONIALS.slice(0, 4).map((t, i) => (
              <SpotlightCard key={i}>
                <figure className="flex h-full flex-col p-7">
                  <span aria-hidden className="font-display text-5xl leading-none text-electric/40">
                    &ldquo;
                  </span>
                  <blockquote className="mt-2 flex-1 text-lg leading-relaxed text-mist">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-5">
                    <p className="font-display text-base font-bold text-mist">{t.name}</p>
                    <p className="mt-0.5 font-mono text-[11px] uppercase tracking-widest text-slate">
                      {t.detail}
                    </p>
                  </figcaption>
                </figure>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </Scene3D>

      {/* Visit */}
      <Scene3D className="border-t border-mist/10">
        <div className="container grid gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="eyebrow">Visit the studio</p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              {BUSINESS.address.street}, {BUSINESS.address.city}
            </h2>
            <p className="mt-4 max-w-md text-slate">
              Easy Valley access off the 101 and 405. Book ahead -- sessions
              start at your scheduled arrival time.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href={BUSINESS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-mist/25 px-5 py-2.5 text-sm font-bold transition-colors hover:border-electric hover:text-electric"
              >
                Open in Maps
              </a>
              <a
                href={BUSINESS.phoneHref}
                className="rounded-md border border-mist/25 px-5 py-2.5 text-sm font-bold transition-colors hover:border-electric hover:text-electric"
              >
                {BUSINESS.phoneDisplay}
              </a>
            </div>
          </div>
          <div className="rounded-lg border border-mist/10 bg-panel p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-slate">Hours</p>
            <p className="mt-3 text-slate">
              By appointment --{' '}
              <Link href="/book" className="text-mist underline decoration-electric underline-offset-4">
                check live availability
              </Link>
              .
            </p>
            {BUSINESS.sisterStudio.url ? (
              <p className="mt-6 text-sm text-slate">
                Closer to the Westside? Our sister studio in{' '}
                <a
                  href={BUSINESS.sisterStudio.url}
                  className="text-mist underline decoration-electric underline-offset-4"
                >
                  {BUSINESS.sisterStudio.city}
                </a>{' '}
                has you covered.
              </p>
            ) : null}
          </div>
        </div>
      </Scene3D>
    </>
  );
}
