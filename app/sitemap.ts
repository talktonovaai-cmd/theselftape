import type { MetadataRoute } from 'next';
import { BUSINESS } from '@/lib/business';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/self-tapes',
    '/selftape-ai',
    '/demo-reels',
    '/pricing',
    '/about',
    '/contact',
    '/book',
  ];

  return routes.map((route) => ({
    url: `${BUSINESS.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/book' ? 0.9 : 0.7,
  }));
}
