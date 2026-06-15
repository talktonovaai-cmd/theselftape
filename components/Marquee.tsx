/** Infinite ticker strip between sections. Pure CSS animation. */
export default function Marquee({ items }: { items: string[] }) {
  const row = (hidden = false) => (
    <div
      aria-hidden={hidden}
      className="flex shrink-0 items-center gap-8 pr-8 font-display text-2xl font-extrabold uppercase tracking-tight md:text-4xl"
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-8">
          <span className={i % 2 ? 'text-mist' : 'text-transparent [-webkit-text-stroke:1px_#8A8EA6]'}>
            {item}
          </span>
          <span className={`h-2 w-2 rounded-full ${['bg-cyan','bg-electric','bg-violet','bg-magenta'][i % 4]}`} />
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden border-y border-mist/10 py-5">
      <div className="flex w-max motion-safe:animate-marquee">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
