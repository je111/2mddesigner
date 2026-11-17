/**
 * Sitemap dynamique : servi sur /sitemap.xml (voir rewrite dans vercel.json).
 * Liste les pages fixes + toutes les fiches produits lues dans Firebase.
 *
 * Mis en cache 1 h sur le CDN Vercel pour limiter les exécutions :
 * un nouveau produit apparaît dans le sitemap au plus 1 h après sa création.
 */

const SITE_URL = 'https://www.2md-designer.com';

const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/catalogue', priority: '0.9', changefreq: 'weekly' },
  { path: '/services', priority: '0.8', changefreq: 'monthly' },
  { path: '/a-propos', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/commander', priority: '0.5', changefreq: 'monthly' },
  { path: '/mentions-legales', priority: '0.2', changefreq: 'yearly' },
  { path: '/confidentialite', priority: '0.2', changefreq: 'yearly' },
  { path: '/cgv', priority: '0.2', changefreq: 'yearly' },
  { path: '/cookies', priority: '0.2', changefreq: 'yearly' },
];

const escapeXml = (s) =>
  String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);

const toDate = (ts) => (ts ? new Date(ts).toISOString().slice(0, 10) : undefined);

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

async function fetchProducts() {
  const dbUrl = process.env.FIREBASE_DATABASE_URL || process.env.VITE_FIREBASE_DATABASE_URL;
  if (!dbUrl) return [];
  const res = await fetch(`${dbUrl.replace(/\/$/, '')}/products.json`);
  if (!res.ok) throw new Error(`Firebase ${res.status}`);
  const data = (await res.json()) || {};
  return Object.entries(data).map(([id, p]) => ({ id, ...p }));
}

export default async function handler(req, res) {
  let products = [];
  let ok = true;
  try {
    products = await fetchProducts();
  } catch (err) {
    console.error('Sitemap : lecture des produits impossible', err);
    ok = false;
  }

  const latest = products.reduce((max, p) => Math.max(max, p.updatedAt || p.createdAt || 0), 0);

  const entries = [
    ...STATIC_PAGES.map((page) =>
      urlEntry({
        loc: `${SITE_URL}${page.path}`,
        lastmod: page.path === '/' || page.path === '/catalogue' ? toDate(latest) : undefined,
        changefreq: page.changefreq,
        priority: page.priority,
      })
    ),
    ...products.map((p) =>
      urlEntry({
        loc: `${SITE_URL}/produit/${encodeURIComponent(p.slug || p.id)}`,
        lastmod: toDate(p.updatedAt || p.createdAt),
        changefreq: 'monthly',
        priority: '0.7',
      })
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

  // En cas d'erreur Firebase, cache court pour réessayer vite.
  const cache = ok
    ? 'public, s-maxage=3600, stale-while-revalidate=86400'
    : 'public, s-maxage=60';

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', cache);
  res.setHeader('Vercel-CDN-Cache-Control', cache);
  res.status(200).send(xml);
}
