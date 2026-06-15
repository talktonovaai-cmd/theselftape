/** @type {import('next').NextConfig} */

// ─────────────────────────────────────────────────────────────────────────────
// 301 redirect map: old Wix slugs → new architecture.
// Keep this list intact at launch so existing backlinks and indexed URLs
// pass their equity to the new pages. Test every one after DNS cutover
// (see README → "Verify redirects").
// ─────────────────────────────────────────────────────────────────────────────
const legacyRedirects = [
  // Pricing
  { source: '/price_list', destination: '/pricing', permanent: true },
  { source: '/plans-pricing', destination: '/pricing', permanent: true },

  // Booking
  { source: '/book-online', destination: '/book', permanent: true },
  { source: '/appointments', destination: '/book', permanent: true },

  // Services
  { source: '/video-services', destination: '/self-tapes', permanent: true },
  { source: '/grid', destination: '/demo-reels', permanent: true },        // old Demo Reels page
  { source: '/video_reel', destination: '/demo-reels', permanent: true },  // old Promotional Videos page
  { source: '/photography', destination: '/#digishot', permanent: true },
  { source: '/headshots', destination: '/#digishot', permanent: true },

  // About cluster
  { source: '/who-we-are', destination: '/about', permanent: true },
  { source: '/testimonials', destination: '/about', permanent: true },

  // Retired pages → home (no equivalent on the new site)
  { source: '/blank', destination: '/', permanent: true },                 // old Website Design page
  { source: '/selftape-tv', destination: '/', permanent: true },
  { source: '/community-forum', destination: '/', permanent: true },
  { source: '/casting', destination: '/', permanent: true },
];

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return legacyRedirects;
  },
};

export default nextConfig;
