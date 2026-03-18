const fs = require('fs');
require('dotenv').config();

const BASE_URL = String(process.env.SITE_URL || 'http://localhost:3000').replace(/\/+$/, ''); // The SITE_URL is configured in the github actions yaml file
const PUBLIC_URLS = [
  '/',
  '/products',
  '/testimonials',
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PUBLIC_URLS.map((url) => `
  <url>
    <loc>${BASE_URL}${url}</loc>
  </url>
`).join('')}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /cart
Disallow: /checkout
Disallow: /order-success
Disallow: /api/
Disallow: /admin/

Sitemap: ${BASE_URL}/sitemap.xml
`;

fs.writeFileSync('client/public/sitemap.xml', sitemap);
fs.writeFileSync('client/public/robots.txt', robots);

console.log(`✅ sitemap.xml generated with base URL: ${BASE_URL}`);
console.log(`✅ robots.txt generated with sitemap: ${BASE_URL}/sitemap.xml`);
