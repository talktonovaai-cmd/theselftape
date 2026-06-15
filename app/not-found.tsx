import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container py-24 text-center">
      <p className="eyebrow">Scene missing</p>
      <h1 className="mt-4 font-display text-4xl font-extrabold md:text-5xl">
        That page didn&rsquo;t make the cut.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-slate">
        The page you&rsquo;re looking for moved or never existed. Head home or
        book a session below.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/"
          className="rounded-md border border-mist/25 px-6 py-3 font-display font-bold hover:border-electric hover:text-electric"
        >
          Go home
        </Link>
        <Link
          href="/book"
          className="rounded-md bg-electric px-6 py-3 font-display font-bold text-void hover:bg-mist"
        >
          Book a session
        </Link>
      </div>
    </section>
  );
}
