const fs = require('fs');

const BASE_URL = process.env.SITE_URL; // The site URL is configured in the github actions env

const urls = [
  '/',
  '/products',
  '/cart',
  '/checkout'
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `
  <url>
    <loc>${BASE_URL}${url}</loc>
  </url>
`).join('')}
</urlset>
`;

fs.writeFileSync('client/public/sitemap.xml', sitemap);

console.log('✅ sitemap generated');