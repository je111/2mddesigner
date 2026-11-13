import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';

const formatPrice = (n: number) =>
  Math.round(n || 0).toLocaleString('fr-FR').replace(/\u202f/g, ' ') + ' FCFA';

export default function FeaturedProducts() {
  const { products, loading } = useProducts();

  // Prend les 4 premiers : d'abord les "featured", puis complète avec les autres
  const featured = products.filter((p) => p.featured);
  const others = products.filter((p) => !p.featured);
  const displayProducts = [...featured, ...others].slice(0, 4);

  // Cache la section s'il n'y a pas de produits
  if (loading || displayProducts.length === 0) {
    return null;
  }

  return (
    <section id="catalogue" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Titre */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-block px-4 py-1.5 bg-brand-50 text-brand-700 text-sm font-semibold rounded-full mb-4 border border-red-100">
              Nos créations
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-black text-ink-900 mb-2">
              Nos <span className="text-gradient">produits</span> phares
            </h2>
            <p className="text-lg text-gray-600 max-w-xl">
              Découvrez une sélection de nos créations personnalisables.
            </p>
          </div>
          <Link
            to="/catalogue"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold transition group"
          >
            Voir tout le catalogue
            <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((p) => {
            const discount =
              p.oldPrice && p.oldPrice > p.price
                ? Math.round((1 - p.price / p.oldPrice) * 100)
                : 0;
            const productUrl = `/produit/${p.slug || p.id}`;

            return (
              <Link
                key={p.id}
                to={productUrl}
                className="card-hover bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden group"
              >
                <div className="aspect-square bg-gradient-to-br from-brand-500 to-brand-800 relative overflow-hidden">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="absolute inset-0 african-dots opacity-20" />
                      <svg className="w-16 h-16 text-white/50 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {p.isNew && (
                      <span className="px-2.5 py-1 bg-white text-brand-600 text-xs font-bold rounded-full shadow-lg">
                        NOUVEAU
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="px-2.5 py-1 bg-brand-600 text-white text-xs font-bold rounded-full shadow-lg">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  {/* Overlay au survol */}
                  <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="px-5 py-2.5 bg-white text-brand-600 text-sm font-bold rounded-full shadow-xl">
                      Voir le produit
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">
                    {p.category}
                  </div>
                  <h3 className="font-display font-bold text-sm text-ink-900 mb-3 line-clamp-2 min-h-[2.5rem]">
                    {p.name}
                  </h3>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="font-display text-lg font-black text-brand-600">
                        {formatPrice(p.price)}
                      </div>
                      {p.oldPrice && p.oldPrice > p.price && (
                        <div className="text-xs text-gray-400 line-through">
                          {formatPrice(p.oldPrice)}
                        </div>
                      )}
                    </div>
                    <div className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}