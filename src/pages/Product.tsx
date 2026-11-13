import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import ImageUpload from '../components/ui/ImageUpload';
import type { OrderFile } from '../types/firebase';

const FORMAT_OPTIONS: Record<string, number> = {
  standard: 0,
  large: 3000,
  xl: 6000,
};

const STYLE_OPTIONS: Record<string, number> = {
  classique: 0,
  moderne: 0,
  couleur: 2000,
  premium: 5000,
};

const formatPrice = (n: number) =>
  Math.round(n || 0).toLocaleString('fr-FR').replace(/\u202f/g, ' ') + ' FCFA';

export default function Product() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { setSelectedProduct } = useCart();

  const product = useMemo(
    () => products.find((p) => p.slug === slug || p.id === slug),
    [products, slug]
  );

  const [format, setFormat] = useState('standard');
  const [style, setStyle] = useState('classique');
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState('');
  const [files, setFiles] = useState<OrderFile[]>([]);
  const [error, setError] = useState('');

  // Calcul du prix en direct
  const total = useMemo(() => {
    if (!product) return 0;
    const base = product.price;
    const formatExtra = FORMAT_OPTIONS[format] || 0;
    const styleExtra = STYLE_OPTIONS[style] || 0;
    return (base + formatExtra + styleExtra) * quantity;
  }, [product, format, style, quantity]);

  const handleAddFile = (url: string, publicId: string) => {
    setFiles((prev) => [
      ...prev,
      { url, publicId, name: `photo-${prev.length + 1}` },
    ]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    setError('');

    if (!product) {
      setError('Produit introuvable.');
      return;
    }

    // Le customText est obligatoire si aucun fichier
    if (files.length === 0 && !customText.trim()) {
      setError('Merci d\'ajouter une photo OU un texte personnalisé.');
      return;
    }

    // Stocker dans le contexte
    setSelectedProduct({
      product,
      quantity,
      format,
      style,
      customText,
      files,
      total,
    });

    // Naviguer vers /commander
    navigate('/commander');
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-red-100 border-t-brand-600 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-24 min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="font-display text-3xl font-black text-ink-900 mb-4">
            Produit introuvable
          </h1>
          <p className="text-gray-500 mb-6">
            Ce produit n'existe pas ou a été retiré.
          </p>
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gradient text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition"
          >
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0;

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-brand-600">Accueil</Link>
          <span className="mx-2">/</span>
          <Link to="/catalogue" className="hover:text-brand-600">Catalogue</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-600 font-semibold">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <div>
            <div className="aspect-square bg-gradient-to-br from-brand-500 to-brand-800 rounded-3xl overflow-hidden relative shadow-xl">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 african-dots opacity-20" />
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-24 h-24 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="px-3 py-1.5 bg-white text-brand-600 text-xs font-bold rounded-full shadow-lg">
                    NOUVEAU
                  </span>
                )}
                {product.featured && (
                  <span className="px-3 py-1.5 bg-brand-gradient text-white text-xs font-bold rounded-full shadow-lg">
                    ⭐ VEDETTE
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-3 py-1.5 bg-brand-600 text-white text-xs font-bold rounded-full shadow-lg">
                    -{discount}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Infos + Options */}
          <div>
            <div className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-2">
              {product.category}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-ink-900 mb-4">
              {product.name}
            </h1>

            {product.description && (
              <p className="text-gray-600 mb-6">{product.description}</p>
            )}

            {/* Prix */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-red-100">
              <span className="font-display text-4xl font-black text-brand-600">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            {/* Format / Délai / Stock */}
            <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
              {product.format && (
                <div className="p-3 bg-brand-50 rounded-xl">
                  <div className="text-xs text-gray-500 mb-1">Format</div>
                  <div className="font-semibold text-ink-900">{product.format}</div>
                </div>
              )}
              {product.delay && (
                <div className="p-3 bg-brand-50 rounded-xl">
                  <div className="text-xs text-gray-500 mb-1">Délai</div>
                  <div className="font-semibold text-ink-900">{product.delay}</div>
                </div>
              )}
              {product.stock && (
                <div className="p-3 bg-brand-50 rounded-xl">
                  <div className="text-xs text-gray-500 mb-1">Stock</div>
                  <div className={`font-semibold ${
                    product.stock === 'Disponible'
                      ? 'text-green-600'
                      : product.stock === 'Épuisé'
                      ? 'text-red-600'
                      : 'text-amber-600'
                  }`}>
                    {product.stock}
                  </div>
                </div>
              )}
            </div>

            {/* Options personnalisation */}
            <div className="space-y-5 mb-6">
              {/* Format */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-ink-900">
                  Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'standard', label: 'Standard' },
                    { id: 'large', label: 'Grand', extra: '+3 000' },
                    { id: 'xl', label: 'XL', extra: '+6 000' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFormat(opt.id)}
                      className={`p-3 rounded-xl border-2 text-center text-sm font-medium transition ${
                        format === opt.id
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-red-100 hover:border-brand-300'
                      }`}
                    >
                      <div>{opt.label}</div>
                      {opt.extra && (
                        <div className="text-xs text-gray-500 mt-0.5">{opt.extra}</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-ink-900">
                  Style
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'classique', label: 'Classique' },
                    { id: 'moderne', label: 'Moderne' },
                    { id: 'couleur', label: 'Couleur', extra: '+2 000' },
                    { id: 'premium', label: 'Premium', extra: '+5 000' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setStyle(opt.id)}
                      className={`p-3 rounded-xl border-2 text-center text-xs font-medium transition ${
                        style === opt.id
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-red-100 hover:border-brand-300'
                      }`}
                    >
                      <div>{opt.label}</div>
                      {opt.extra && (
                        <div className="text-xs text-gray-500 mt-0.5">{opt.extra}</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantité */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-ink-900">
                  Quantité
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 rounded-xl border-2 border-red-100 hover:border-brand-500 hover:bg-red-50 transition flex items-center justify-center font-bold text-lg"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))
                    }
                    className="w-20 text-center px-4 py-3 rounded-xl border-2 border-red-100 font-bold text-lg outline-none"
                    min="1"
                    max="100"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(100, quantity + 1))}
                    className="w-11 h-11 rounded-xl border-2 border-red-100 hover:border-brand-500 hover:bg-red-50 transition flex items-center justify-center font-bold text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Upload photo */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-ink-900">
                  Votre photo <span className="text-gray-400 font-normal">(optionnel, jusqu'à 5)</span>
                </label>

                {files.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    {files.map((file, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-xl overflow-hidden border-2 border-red-100"
                      >
                        <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-red-50"
                        >
                          <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {files.length < 5 && (
                  <ImageUpload
                    onChange={handleAddFile}
                    folder="2md-designer/orders"
                    label=""
                  />
                )}
              </div>

              {/* Texte personnalisé */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-ink-900">
                  Texte personnalisé <span className="text-gray-400 font-normal">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Ex : Joyeux anniversaire Marie !"
                  maxLength={80}
                  className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none transition"
                />
                <p className="text-xs text-gray-400 mt-1">{customText.length}/80 caractères</p>
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl text-sm text-red-700 mb-4">
                {error}
              </div>
            )}

            {/* Total + CTA */}
            <div className="p-5 bg-brand-50 rounded-2xl border border-red-100 mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Total estimé</span>
                <span className="font-display text-3xl font-black text-brand-600">
                  {formatPrice(total)}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Le devis final sera confirmé par notre équipe
              </p>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="w-full btn-shine px-6 py-4 bg-brand-gradient text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              Continuer vers la commande
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}