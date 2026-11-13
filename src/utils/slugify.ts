/**
 * Transforme un texte en slug URL-friendly
 *
 * Exemples :
 *   "Portrait crayon A4"          → "portrait-crayon-a4"
 *   "Tasse à café personnalisée"  → "tasse-a-cafe-personnalisee"
 *   "Logo 2MD Designer™"          → "logo-2md-designertm"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')                       // décompose les accents
    .replace(/[\u0300-\u036f]/g, '')        // enlève les accents
    .replace(/[^a-z0-9\s-]/g, '')           // enlève caractères spéciaux
    .trim()
    .replace(/\s+/g, '-')                   // espaces → tirets
    .replace(/-+/g, '-')                    // tirets multiples → 1 seul
    .replace(/^-+|-+$/g, '');               // tirets début/fin
}

/**
 * Génère un slug unique en évitant les collisions
 *
 * Exemples :
 *   generateUniqueSlug("portrait", ["portrait"])          → "portrait-2"
 *   generateUniqueSlug("portrait", ["portrait", "portrait-2"]) → "portrait-3"
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(baseSlug)) return baseSlug;

  let counter = 2;
  while (existingSlugs.includes(`${baseSlug}-${counter}`)) {
    counter++;
  }
  return `${baseSlug}-${counter}`;
}