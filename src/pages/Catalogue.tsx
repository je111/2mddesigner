import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import type { Product } from '../types/firebase';
import { useProductLikes } from '../hooks/useProductLikes';

const categories = ['Tous', 'Portrait', 'Objet', 'Textile', 'Décoration', 'Autre'];
const MOBILE_PRODUCTS_PER_PAGE = 4;
const DESKTOP_PRODUCTS_PER_PAGE = 9;

const formatPrice = (n: number) =>
  Math.round(n || 0).toLocaleString('fr-FR').replace(/\u202f/g, ' ') + ' FCFA';

const calculateDiscount = (price: number, oldPrice?: number) => {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
};

export default function Catalogue() {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('Tous');
  const search = searchParams.get('q') ?? '';
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(() =>
    window.matchMedia('(min-width: 1024px)').matches
      ? DESKTOP_PRODUCTS_PER_PAGE
      : MOBILE_PRODUCTS_PER_PAGE,
  );

  useEffect(() => {
    const desktopMedia = window.matchMedia('(min-width: 1024px)');
    const updatePageSize = () => {
      setProductsPerPage(
        desktopMedia.matches ? DESKTOP_PRODUCTS_PER_PAGE : MOBILE_PRODUCTS_PER_PAGE,
      );
      setCurrentPage(1);
    };

    desktopMedia.addEventListener('change', updatePageSize);
    return () => desktopMedia.removeEventListener('change', updatePageSize);
  }, []);

  const filtered = products.filter((p) => {
    const matchCategory = activeCategory === 'Tous' || p.category === activeCategory;
    const normalizedSearch = search.trim().toLocaleLowerCase('fr');
    const searchableText = `${p.name} ${p.description ?? ''}`.toLocaleLowerCase('fr');
    const matchSearch = !normalizedSearch || searchableText.includes(normalizedSearch) ||
      (['tee', 't-shirt', 'tshirt'].includes(normalizedSearch) && /\b(tee|t[ -]?shirt)\b/.test(searchableText));
    return matchCategory && matchSearch;
  });

  const pageCount = Math.ceil(filtered.length / productsPerPage);
  const visiblePage = Math.min(currentPage, Math.max(pageCount, 1));
  const pageStart = (visiblePage - 1) * productsPerPage;
  const pageProducts = filtered.slice(pageStart, pageStart + productsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    document.getElementById('catalogue-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-brand-50 text-brand-700 text-sm font-semibold rounded-full mb-4 border border-red-100">
            Notre catalogue
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-black mb-6 text-ink-900">
            Toutes nos <span className="text-gradient">créations</span>
          </h1>
          <p className="text-lg text-gray-600">
            Parcourez notre catalogue de créations personnalisables.
            Chaque produit peut être adapté à vos envies.
          </p>
        </div>
      </section>

      {/* Filtres */}
      <section className="max-w-7xl mx-auto px-6 mb-8">
        <div className="bg-white rounded-2xl border border-red-100 p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearchParams((params) => {
                  if (value) params.set('q', value);
                  else params.delete('q');
                  return params;
                }, { replace: true });
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  activeCategory === cat
                    ? 'bg-brand-gradient text-white shadow-lg shadow-red-500/30'
                    : 'bg-white border-2 border-red-100 text-gray-700 hover:border-brand-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grille produits */}
      <section id="catalogue-products" className="max-w-7xl mx-auto px-6 scroll-mt-28">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-red-100 border-t-brand-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Chargement des créations…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="font-display text-2xl font-bold text-ink-900 mb-2">
              {products.length === 0 ? 'Catalogue en préparation' : 'Aucun résultat'}
            </h3>
            <p className="text-gray-500 mb-6">
              {products.length === 0
                ? 'Nos créations arrivent très bientôt. Revenez nous voir !'
                : 'Essayez une autre recherche ou catégorie.'}
            </p>
            {products.length === 0 && (
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gradient text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition"
              >
                Demander une création sur mesure
              </Link>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              {filtered.length} création{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}
            </p>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pageProducts.map((p) => {
                const discount = calculateDiscount(p.price, p.oldPrice);
                return (
                  <ProductCard key={p.id} product={p} discount={discount} />
                );
              })}
            </div>
            {pageCount > 1 && (
              <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination du catalogue">
                <button
                  type="button"
                  onClick={() => goToPage(visiblePage - 1)}
                  disabled={visiblePage === 1}
                  className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-ink-900 transition hover:border-brand-500 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Précédent
                </button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    aria-current={visiblePage === page ? 'page' : undefined}
                    aria-label={`Page ${page}`}
                    className={`h-10 min-w-10 rounded-xl px-3 text-sm font-bold transition ${visiblePage === page ? 'bg-brand-gradient text-white shadow-md' : 'border border-red-200 bg-white text-ink-900 hover:border-brand-500 hover:text-brand-600'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => goToPage(visiblePage + 1)}
                  disabled={visiblePage === pageCount}
                  className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-ink-900 transition hover:border-brand-500 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Suivant
                </button>
              </nav>
            )}
          </>
        )}
      </section>

      {/* CTA bas de page */}
      {filtered.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-16">
          <div className="relative rounded-3xl bg-brand-gradient p-10 md:p-12 text-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 african-dots opacity-20" />
            <div className="relative">
              <h2 className="font-display text-2xl md:text-3xl font-black text-white mb-3">
                Vous ne trouvez pas ce que vous cherchez ?
              </h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Nous créons sur mesure selon vos envies.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 font-semibold rounded-full shadow-xl hover:shadow-2xl transition hover:bg-red-50"
              >
                Demander une création
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ============================================
// CARTE PRODUIT
// ============================================
function ProductCard({ product, discount }: { product: Product; discount: number }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { liked, count: likeCount, loading: likesLoading, saving: likeSaving, toggleLike } = useProductLikes(product.id);

  return (
    <>
    <div className="card-hover bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden group">
      {/* Image cliquable â†’ fiche produit */}
      <div className="aspect-square bg-gradient-to-br from-brand-500 to-brand-800 relative overflow-hidden lg:aspect-[4/3]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 african-dots opacity-20" />
            <svg className="w-20 h-20 text-white/50 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {product.image && (
            <button
              type="button"
              aria-label={`Voir l’image de ${product.name} en grand`}
              onClick={() => setPreviewOpen(true)}
              className="w-10 h-10 rounded-full bg-white/95 text-ink-900 shadow-lg flex items-center justify-center hover:scale-110 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h6v6m-7 1l7-7M9 21H3v-6m7-1l-7 7" />
              </svg>
            </button>
          )}
          <button
            type="button"
            aria-label={liked ? `Ne plus aimer ${product.name}` : `Aimer ${product.name}`}
            aria-pressed={liked}
            onClick={toggleLike}
            disabled={likesLoading || likeSaving}
            title={`${likeCount} j’aime`}
            className="w-10 h-10 rounded-full bg-white/95 shadow-lg flex items-center justify-center hover:scale-110 transition"
          >
            <svg className={`w-5 h-5 ${liked ? 'text-red-600' : 'text-gray-600'}`} fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
          <span className="min-w-10 rounded-full bg-white/95 px-2 py-1 text-center text-xs font-semibold text-gray-700 shadow-lg" aria-live="polite">
            {likesLoading ? '?' : likeCount}
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-2.5 py-1 bg-white text-brand-600 text-xs font-bold rounded-full shadow-lg">
              NOUVEAU
            </span>
          )}
          {product.featured && (
            <span className="px-2.5 py-1 bg-brand-gradient text-white text-xs font-bold rounded-full shadow-lg">
              ⭐ VEDETTE
            </span>
          )}
          {discount > 0 && (
            <span className="px-2.5 py-1 bg-brand-600 text-white text-xs font-bold rounded-full shadow-lg">
              -{discount}%
            </span>
          )}
        </div>

        {/* Statut stock */}
        {product.stock && product.stock !== 'Disponible' && (
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1 text-xs font-bold rounded-full shadow-lg ${
              product.stock === 'Épuisé'
                ? 'bg-red-100 text-red-700'
                : 'bg-amber-100 text-amber-700'
            }`}>
              {product.stock}
            </span>
          </div>
        )}

        {/* Overlay au survol — span (parent déjà un Link) */}
        <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="px-5 py-2.5 bg-white text-brand-600 text-sm font-bold rounded-full shadow-xl">
            Commander
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <div className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">
          {product.category}
        </div>

        <Link
          to={`/produit/${product.slug || product.id}`}
          className="font-display font-bold text-base mb-2 text-ink-900 line-clamp-2 min-h-[2.5rem] block hover:text-brand-600 transition"
        >
          {product.name}
        </Link>

        {product.description && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {(product.format || product.delay) && (
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            {product.format && <span>📐 {product.format}</span>}
            {product.delay && <span>⏱️ {product.delay}</span>}
          </div>
        )}

        {/* Prix + Action */}
        <div className="flex items-end justify-between pt-3 border-t border-red-50">
          <div>
            <div className="font-display text-xl font-black text-brand-600">
              {formatPrice(product.price)}
            </div>
            {Number(product.oldPrice) > 0 && Number(product.oldPrice) > Number(product.price) && (
              <div className="text-xs text-gray-400 line-through">
                {formatPrice(Number(product.oldPrice))}
              </div>
            )}
          </div>
          <Link
            to={`/produit/${product.slug || product.id}`}
            className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center shadow-lg hover:scale-110 transition"
            title="Commander"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
    {previewOpen && product.image && (
      <div
        className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label={`Aperçu de ${product.name}`}
        onClick={() => setPreviewOpen(false)}
      >
        <button
          type="button"
          aria-label="Fermer l’aperçu"
          onClick={() => setPreviewOpen(false)}
          className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white text-gray-900 flex items-center justify-center text-2xl shadow-lg"
        >×</button>
        <img
          src={product.image}
          alt={product.name}
          onClick={(event) => event.stopPropagation()}
          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
        />
      </div>
    )}
    </>
  );
}


