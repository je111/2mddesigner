import { slugify, generateUniqueSlug } from '../../utils/slugify';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { addProduct, updateProduct, deleteProduct } from '../../lib/firebase';
import ImageUpload from '../../components/ui/ImageUpload';
import type { Product } from '../../types/firebase';


interface OutletContext {
  toggleSidebar: () => void;
}

const formatPrice = (n: number) =>
  Math.round(n || 0).toLocaleString('fr-FR').replace(/\u202f/g, ' ');

interface ProductForm {
  name: string; category: string; price: number; oldPrice: number; description: string;
  format: string; delay: string; stock: Product['stock']; featured: boolean; isNew: boolean;
  image: string; publicId: string;
}

const EMPTY_FORM: ProductForm = {
  name: '',
  category: 'Portrait',
  price: 0,
  oldPrice: 0,
  description: '',
  format: '',
  delay: '',
  stock: 'Disponible' as const,
  featured: false,
  isNew: true,
  image: '',
  publicId: '',
};

export default function Products() {
  const { toggleSidebar } = useOutletContext<OutletContext>();
  const { products, loading } = useProducts();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id!);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      oldPrice: p.oldPrice || 0,
      description: p.description || '',
      format: p.format || '',
      delay: p.delay || '',
      stock: p.stock,
      featured: p.featured || false,
      isNew: p.isNew || false,
      image: p.image || '',
      publicId: p.publicId || '',
    });
    setModalOpen(true);
  };

  // ✅ FONCTION SAVE AVEC GÉNÉRATION DE SLUG
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // 1. Génère le slug de base depuis le nom
      const baseSlug = slugify(form.name);

      // 2. Liste des slugs déjà utilisés (sauf celui qu'on édite)
      const existingSlugs = products
        .filter((p) => p.id !== editingId)
        .map((p) => p.slug || '')
        .filter(Boolean);

      // 3. Génère un slug unique (ajoute -2, -3 si collision)
      const finalSlug = generateUniqueSlug(baseSlug, existingSlugs);

      // 4. Prépare les données du produit
      const productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
        name: form.name,
        slug: finalSlug,
        category: form.category,
        price: Number(form.price),
        description: form.description || '',
        format: form.format || '',
        delay: form.delay || '',
        stock: form.stock,
        featured: form.featured,
        isNew: form.isNew,
        image: form.image || '',
        publicId: form.publicId || '',
      };

      // 5. Ajoute oldPrice seulement s'il est valide (> prix actuel)
      const oldPriceNum = Number(form.oldPrice);
      if (oldPriceNum > 0 && oldPriceNum > Number(form.price)) {
        productData.oldPrice = oldPriceNum;
      }

      // 6. Enregistre dans Firebase
      if (editingId) {
        await updateProduct(editingId, productData);
      } else {
        await addProduct(productData);
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await deleteProduct(id);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-red-100">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-red-50">
              <svg className="w-6 h-6 text-ink-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="font-display text-2xl font-black text-ink-900">Catalogue</h1>
              <p className="text-sm text-gray-500">
                {loading ? 'Chargement…' : `${products.length} produit${products.length > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          <button
            onClick={openNew}
            className="px-5 py-2.5 bg-brand-gradient text-white font-semibold text-sm rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ajouter
          </button>
        </div>
      </header>

      <div className="p-6 space-y-4">
        {/* Filtres */}
        <div className="bg-white rounded-2xl border border-red-100 p-4 flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none text-sm"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none text-sm bg-white cursor-pointer"
          >
            <option value="">Toutes catégories</option>
            <option>Portrait</option>
            <option>Objet</option>
            <option>Textile</option>
            <option>Décoration</option>
            <option>Autre</option>
          </select>
        </div>

        {/* Grille */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-red-100 p-12 text-center">
            <div className="w-10 h-10 rounded-full border-4 border-red-100 border-t-brand-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Chargement…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-red-200 p-12 text-center">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="font-display text-xl font-bold text-ink-900 mb-2">
              {products.length === 0 ? 'Aucun produit' : 'Aucun résultat'}
            </h3>
            <p className="text-gray-500 mb-4">
              {products.length === 0
                ? 'Ajoute ton premier produit avec sa photo.'
                : 'Essaie de modifier ta recherche.'}
            </p>
            {products.length === 0 && (
              <button
                onClick={openNew}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-gradient text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl transition"
              >
                + Ajouter un produit
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden group">
                <div className="aspect-square bg-gradient-to-br from-brand-500 to-brand-800 relative flex items-center justify-center">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="absolute inset-0 african-dots opacity-20" />
                      <svg className="w-16 h-16 text-white/60 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </>
                  )}
                  <button
                    type="button"
                    aria-label={likedProducts.has(p.id!) ? `Retirer ${p.name} des favoris` : `Aimer ${p.name}`}
                    aria-pressed={likedProducts.has(p.id!)}
                    onClick={() => setLikedProducts((current) => {
                      const next = new Set(current);
                      if (next.has(p.id!)) next.delete(p.id!);
                      else next.add(p.id!);
                      return next;
                    })}
                    className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/95 flex items-center justify-center shadow-lg hover:scale-110 transition"
                  >
                    <svg className={`w-5 h-5 ${likedProducts.has(p.id!) ? 'text-red-600' : 'text-gray-500'}`} fill={likedProducts.has(p.id!) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </button>
                  <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/50 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    {p.image && (
                      <button
                        type="button"
                        aria-label={`Agrandir l?image de ${p.name}`}
                        onClick={() => setPreviewImage({ url: p.image!, name: p.name })}
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-110 transition"
                      >
                        <svg className="w-5 h-5 text-ink-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h6v6m-7 1l7-7M9 21H3v-6m7-1l-7 7" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => openEdit(p)}
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-110 transition"
                    >
                      <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => remove(p.id!)}
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-110 transition"
                    >
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">
                    {p.category}
                  </div>
                  <h3 className="font-display font-bold text-base mb-1 text-ink-900">{p.name}</h3>
                  {p.slug && (
                    <div className="text-xs text-gray-400 font-mono mb-3 truncate">
                      /produit/{p.slug}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-red-50">
                    <div>
                      <div className="font-display text-lg font-black text-brand-600">
                        {formatPrice(p.price)} F
                      </div>
                      {p.oldPrice && p.oldPrice > p.price && (
                        <div className="text-xs text-gray-400 line-through">
                          {formatPrice(p.oldPrice)} F
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => openEdit(p)}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                    >
                      Modifier →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Aper?u de ${previewImage.name}`}
          onClick={() => setPreviewImage(null)}
        >
          <button
            type="button"
            aria-label="Fermer l?aper?u"
            onClick={() => setPreviewImage(null)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white text-gray-900 flex items-center justify-center text-2xl shadow-lg"
          >
            ?
          </button>
          <img
            src={previewImage.url}
            alt={previewImage.name}
            onClick={(event) => event.stopPropagation()}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => !saving && setModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <h3 className="font-display text-xl font-black text-ink-900 mb-6">
              {editingId ? 'Modifier le produit' : 'Nouveau produit'}
            </h3>
            <form onSubmit={save} className="space-y-4">
              {/* Upload image */}
              <ImageUpload
                value={form.image}
                onChange={(url, publicId) => setForm({ ...form, image: url, publicId })}
                onRemove={() => setForm({ ...form, image: '', publicId: '' })}
                folder="2md-designer/catalogue"
                label="Photo du produit"
              />

              <div>
                <label className="block text-sm font-semibold mb-2">Nom du produit *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex : Portrait crayon A4"
                  className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none"
                />
                {form.name && (
                  <p className="text-xs text-gray-400 mt-1 font-mono">
                    URL : /produit/{slugify(form.name)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Catégorie *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none bg-white"
                >
                  <option>Portrait</option>
                  <option>Objet</option>
                  <option>Textile</option>
                  <option>Décoration</option>
                  <option>Autre</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Prix (FCFA) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.price || ''}
                    onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                    placeholder="25000"
                    className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Ancien prix (optionnel)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.oldPrice || ''}
                    onChange={(e) => setForm({ ...form, oldPrice: parseInt(e.target.value) || 0 })}
                    placeholder="35000"
                    className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description (optionnel)</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Courte description..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Format (optionnel)</label>
                  <input
                    type="text"
                    value={form.format}
                    onChange={(e) => setForm({ ...form, format: e.target.value })}
                    placeholder="A4, 40x40cm..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Délai (optionnel)</label>
                  <input
                    type="text"
                    value={form.delay}
                    onChange={(e) => setForm({ ...form, delay: e.target.value })}
                    placeholder="3-5 jours"
                    className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-600"
                  />
                  <span className="text-sm">Produit mis en avant ⭐</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isNew}
                    onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-600"
                  />
                  <span className="text-sm">Nouveau produit 🆕</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                  className="flex-1 px-5 py-3 bg-white border-2 border-red-100 text-ink-900 font-semibold rounded-xl hover:bg-red-50 transition disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-5 py-3 bg-brand-gradient text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition disabled:opacity-60"
                >
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}