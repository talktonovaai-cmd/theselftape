import type { MetadataRoute } from 'next';
import { BUSINESS } from '@/lib/business';

// The opposite of the old Wix site: explicitly allow everything.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${BUSINESS.url}/sitemap.xml`,
  };
}
