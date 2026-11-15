/**
 * Protections communes aux fonctions d'envoi d'emails.
 * Le préfixe "_" empêche Vercel de publier ce fichier comme une route.
 *
 * Objectif : éviter qu'un robot appelle les fonctions en boucle et
 * consomme les quotas Vercel (exécutions) et Brevo (emails).
 */

const DEFAULT_ORIGINS = [
  'https://2md-designer.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
];

// Domaines autorisés en plus, séparés par des virgules (ex. domaine perso).
const EXTRA_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const ALLOWED_ORIGINS = new Set([...DEFAULT_ORIGINS, ...EXTRA_ORIGINS]);

// Déploiements de prévisualisation du projet.
const PREVIEW_ORIGIN = /^https:\/\/2md-designer-[a-z0-9-]+-attendaction-7557s-projects\.vercel\.app$/;

const isAllowedOrigin = (origin) =>
  !!origin && (ALLOWED_ORIGINS.has(origin) || PREVIEW_ORIGIN.test(origin));

// Limite par adresse IP. La mémoire est conservée tant que l'instance
// de la fonction reste chaude : c'est une protection "au mieux", qui
// suffit à couper les rafales d'un même robot.
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5; // par IP et par fenêtre
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Évite que la table grossisse indéfiniment.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_REQUESTS;
}

const MAX_BODY_BYTES = 20 * 1024; // 20 Ko : largement assez pour un formulaire

/**
 * Applique les protections. Renvoie true si la requête peut continuer ;
 * sinon la réponse est déjà envoyée et la fonction doit s'arrêter.
 */
export function guard(req, res) {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS') {
    res.status(isAllowedOrigin(origin) ? 204 : 403).end();
    return false;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return false;
  }
  if (!isAllowedOrigin(origin)) {
    res.status(403).json({ error: 'Origine non autorisée' });
    return false;
  }

  const size = Number(req.headers['content-length'] || 0);
  if (size > MAX_BODY_BYTES || JSON.stringify(req.body || {}).length > MAX_BODY_BYTES) {
    res.status(413).json({ error: 'Requête trop volumineuse' });
    return false;
  }

  const ip =
    String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'inconnu';
  if (isRateLimited(ip)) {
    res.setHeader('Retry-After', String(WINDOW_MS / 1000));
    res.status(429).json({ error: 'Trop de demandes, réessayez plus tard' });
    return false;
  }

  return true;
}

// Délai maximal d'un appel à Brevo : une API lente ne doit pas
// faire tourner la fonction (et le compteur) pendant longtemps.
export const BREVO_TIMEOUT_MS = 8000;
