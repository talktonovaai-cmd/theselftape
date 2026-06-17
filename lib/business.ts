// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for business data.
//
// Every place the name / address / phone appears (footer, contact page,
// JSON-LD schema) pulls from here. For local SEO, this must match your
// Google Business Profile exactly — edit once, consistent everywhere.
// ─────────────────────────────────────────────────────────────────────────────

export const BUSINESS = {
  name: 'The Selftape',
  legalName: 'The Self Tape, LLC',
  tagline: 'The original self-tape studio in Los Angeles',
  url: 'https://www.theselftape.com',
  founded: '2008',
  founder: 'Jason Montgomery',

  // Earned credentials — verified against public bio + press. Used in copy,
  // the pinned scroll sequence, and schema.
  creds: {
    nytQuote: 'The Godfather of Selftape',
    nytSource: 'The New York Times',
    nytUrl: 'https://www.nytimes.com/2019/08/30/theater/audition-videos-for-actors.html',
    nytDate: '2019',
    tapesShot: 100000,
    isOriginal: true,
    readers: 'series-regular working actors',
    imdbUrl: 'https://www.imdb.com/name/nm2766232/',
    imdbCredits: ['X-Men: First Class', 'A Good Day to Die Hard', 'Date Night'],
  },

  // 99 Actors Day 2.0 — Nov 3, 2012, Ensemble Studio Theatre (Atwater Village).
  // Jason appeared in the casting-director/industry lineup. Notable names below
  // are taken directly from the event poster. Framed as "appeared alongside" —
  // factual co-billing, not an endorsement claim.
  panel: {
    event: '99 Actors Day 2.0',
    date: 'November 2012',
    host: 'Risa Bramon Garcia',
    venue: 'Ensemble Studio Theatre, Los Angeles',
    alongside: [
      'casting director Randi Hiller (The Avengers, Iron Man)',
      'casting director Marci Liroff (Mean Girls, E.T.)',
      'actor Clark Gregg',
      'actor Keith David',
    ],
    agencies: ['Gersh', 'Frontline', 'Concrete', 'Michael Greene & Associates'],
  },

  phoneDisplay: '(424) 333-2057',
  phoneHref: 'tel:+14243332057',
  email: 'jason@theselftape.com',

  address: {
    street: '14138 Collins St',
    city: 'Sherman Oaks',
    region: 'CA',
    zip: '91401',
    country: 'US',
  },

  // TODO: verify the exact map pin before launch (drop a pin in Google Maps
  // and copy the coordinates). These are approximate for 14138 Collins St.
  geo: { lat: 34.1693, lng: -118.4377 },

  // TODO: set real studio hours — also used in JSON-LD once filled in.
  // Format: https://schema.org/openingHours e.g. ['Mo-Fr 10:00-20:00', 'Sa 10:00-18:00']
  hours: [] as string[],

  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=The+Selftape+14138+Collins+St+Sherman+Oaks+CA+91401',

  socials: {
    instagram: 'https://www.instagram.com/theselftape/',
    facebook: 'https://www.facebook.com/Theselftape',
    twitter: 'https://www.twitter.com/theselftape',
  },

  // Sold to a former reader — friendly cross-promo only. Keep it OUT of
  // schema/NAP so Google doesn't conflate the two businesses.
  sisterStudio: {
    city: 'West Hollywood',
    url: '', // TODO: add the WeHo studio's site or booking link
  },

  // The funnel. TODO: confirm final production URL + UTM params.
  app: {
    name: 'selftape.ai',
    url: 'https://www.selftape.ai?utm_source=theselftape&utm_medium=site&utm_campaign=funnel',
    embedUrl: 'https://www.selftape.ai',
  },

  digishot: {
    name: 'Digishot',
    url: 'https://digishot.co', // also digishot.me
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// PRICING — carried over from the live Wix /price_list page.
// TODO: these look like 2012-era published rates. Confirm or update before
// launch; edit here and the pricing page + homepage teaser update together.
// ─────────────────────────────────────────────────────────────────────────────

export type PriceLine = { label: string; price: string; note?: string };

export const PRICING: Record<
  string,
  { title: string; blurb?: string; lines: PriceLine[] }
> = {
  selfTapes: {
    title: 'Self-tape sessions',
    blurb:
      'Every rate includes an optional professional reader and file transmission. Sessions start at your scheduled arrival time — build in a few minutes to review takes before you leave.',
    lines: [
      { label: '30-minute session', price: '$50', note: '1–2 short scenes' },
      { label: '60-minute session', price: '$75', note: 'Longer sides or multiple looks' },
      { label: '90-minute session', price: '$125', note: 'Heavy sides, multiple roles, or extra coaching' },
    ],
  },
  packs: {
    title: 'Session packs',
    blurb: 'For actors who tape every week. Packs apply to 30-minute sessions.',
    lines: [
      { label: '5-pack', price: '$225', note: 'Save $25' },
      { label: '10-pack', price: '$400', note: 'Save $100' },
      { label: 'Unlimited month', price: '$999', note: '1 30-minute tape/day' },
    ],
  },
  demoReels: {
    title: 'Demo reel editing',
    blurb: 'Sit-down managed edits — you direct, we cut.',
    lines: [{ label: 'Managed edit', price: '$75/hr' }],
  },
  digishot: {
    title: 'Digishot 3D / AR scans',
    blurb:
      'Full-body 3D capture with an AR-ready avatar for your casting profile. Pricing and packages at digishot.co.',
    lines: [{ label: 'Digishot scan session', price: 'See digishot.co' }],
  },
  production: {
    title: 'Production services',
    lines: [
      { label: 'Studio day rate', price: '$500', note: '8-hour day' },
      { label: 'Camera operator (with gear)', price: '$500', note: '8-hour day' },
      { label: 'Camera operator (no gear)', price: '$300', note: '8-hour day' },
      { label: 'Videographer', price: '$100/hr' },
      { label: 'Event photographer', price: '$100/hr' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS — TODO: replace with real quotes. Best sources: your Google
// reviews and Yelp. Real names + real shows booked = trust gold. Do not launch
// with these placeholders visible.
// ─────────────────────────────────────────────────────────────────────────────

export const TESTIMONIALS = [
  {
    quote:
      "I've been taping with Jason and his team for over a decade. Not only is he an amazing director, his understanding of sides is unmatched. He brings out the best in the most collaborative way.",
    name: 'Jordan Belfi',
    detail: 'Entourage · Snow Bride · Nefarious · NCIS: LA',
  },
  {
    quote:
      "Yo, Jay is my boy! I've booked so many times working with him -- truly a Top G.",
    name: 'Pooch Hall',
    detail: 'Ray Donovan · Chuck · The Game',
  },
  {
    quote:
      'Whenever I do a self-tape with Jason, I get a callback. He knows how to coach you to shine in any given role and the proof is in the results -- I have had CDs and directors in the callbacks compliment me on the tape.',
    name: 'Kee Chan',
    detail: 'Kung Fu · Mortal Engines',
  },
  {
    quote:
      'The best self-tape experience I have had. The first time I used the studio, I booked a feature film. Anyone who tapes here will not be disappointed.',
    name: 'Maya Stojan',
    detail: 'Agents of S.H.I.E.L.D.',
  },
  {
    quote:
      'Jason and his staff are not just about running a business -- they truly care about the people they work with and want to see their actors succeed. My son has booked network and lead roles out of this studio.',
    name: 'Actor parent',
    detail: 'Yelp · 5 stars',
  },
  {
    quote:
      'The most professional studio by far -- great lighting, great sound, great atmosphere. I fully recommend recording your self-tapes here.',
    name: 'Verified actor',
    detail: 'Yelp · 5 stars',
  },
];
