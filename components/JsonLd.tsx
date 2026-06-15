import { BUSINESS } from '@/lib/business';

/**
 * LocalBusiness structured data — the schema Google reads for the local pack.
 * Rendered once in the root layout. Address/phone pull from lib/business.ts
 * so they can never drift from the visible NAP.
 */
export default function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BUSINESS.url}/#business`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    description:
      'The original self-tape studio in Los Angeles — founded in 2008 and called "The Godfather of Selftape" by The New York Times. Over 100,000 self-tapes shot, coached by a working casting director with series-regular readers. Audition tapes, demo reel editing, and 3D AR Digishot scans in Sherman Oaks.',
    url: BUSINESS.url,
    telephone: '+14243332057',
    email: BUSINESS.email,
    foundingDate: BUSINESS.founded,
    founder: {
      '@type': 'Person',
      name: BUSINESS.founder,
      sameAs: [BUSINESS.creds.imdbUrl],
    },
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.zip,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.lat,
      longitude: BUSINESS.geo.lng,
    },
    // openingHoursSpecification intentionally omitted until BUSINESS.hours is
    // filled in — wrong hours in schema are worse than none.
    ...(BUSINESS.hours.length > 0 ? { openingHours: BUSINESS.hours } : {}),
    sameAs: [
      BUSINESS.socials.instagram,
      BUSINESS.socials.facebook,
      BUSINESS.socials.twitter,
    ],
    areaServed: { '@type': 'City', name: 'Los Angeles' },
    makesOffer: [
      { '@type': 'Offer', name: 'Self-tape audition recording' },
      { '@type': 'Offer', name: 'Demo reel editing' },
      { '@type': 'Offer', name: 'Digishot 3D AR scans' },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
