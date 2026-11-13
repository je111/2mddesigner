import { useState, useEffect } from 'react';
import { useLoading } from '../hooks/useLoading';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../hooks/useCreateOrder';
import { useCart } from '../hooks/useCart';
import { STUDIO_INFO } from '../lib/constants';
import type { PaymentMode } from '../types/firebase';

const DELIVERY_MODES = [
  { value: 'pickup', label: 'Retrait au studio', price: 0 },
  { value: 'brazza', label: 'Livraison à Brazzaville', price: 1000 },
];

const formatPrice = (n: number) =>
  Math.round(n || 0).toLocaleString('fr-FR').replace(/\u202f/g, ' ') + ' FCFA';

// ⚠️ À PERSONNALISER : ton numéro MTN Money
const MTN_MONEY_NUMBER = STUDIO_INFO.phone;
// ⚠️ À PERSONNALISER : ton numéro WhatsApp
const WHATSAPP_NUMBER = STUDIO_INFO.whatsapp;

export default function Commander() {
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();
  const { selectedProduct, clearSelectedProduct } = useCart();

  const [form, setForm] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    delivery: 'pickup',
    deliveryDate: '',
    notes: '',
  });
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('deposit');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState('');

  // Redirection si pas de produit sélectionné
  useEffect(() => {
    if (!selectedProduct && !success) {
      navigate('/catalogue');
    }
  }, [selectedProduct, success, navigate]);

  if (!selectedProduct && !success) {
    return null;
  }

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  // Calcul des montants
  const baseTotal = selectedProduct?.total || 0;
  const discountAmount = paymentMode === 'full' ? Math.round(baseTotal * 0.05) : 0;
  const totalAfterDiscount = baseTotal - discountAmount;
  const paymentAmount =
    paymentMode === 'full' ? totalAfterDiscount : Math.round(baseTotal / 2);
  const remaining =
    paymentMode === 'full' ? 0 : baseTotal - Math.round(baseTotal / 2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.clientName.trim()) {
      setError('Merci d\'indiquer votre nom.');
      return;
    }
    if (!form.clientPhone.trim()) {
      setError('Merci d\'indiquer votre numéro de téléphone.');
      return;
    }

    setSending(true);
    showLoading();

    try {
      const newOrderId = await createOrder({
  clientName: form.clientName,
  clientPhone: form.clientPhone,
  clientEmail: form.clientEmail,
  clientAddress: form.clientAddress,
  product: selectedProduct!.product.name,
  category: selectedProduct!.product.category,
  quantity: selectedProduct!.quantity,
  format: selectedProduct!.format,
  style: selectedProduct!.style,
  customText: selectedProduct!.customText,
  delivery: form.delivery,
  deliveryDate: form.deliveryDate,
  notes: form.notes,
  files: selectedProduct!.files,
  total: baseTotal,
  paymentMode,
});

// 🔥 Envoie les emails (client + admin) — ne bloque pas si ça échoue
try {
  await fetch('/api/send-order-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      order: {
        id: newOrderId,
        clientName: form.clientName,
        clientPhone: form.clientPhone,
        clientEmail: form.clientEmail,
        clientAddress: form.clientAddress,
        product: selectedProduct!.product.name,
        quantity: selectedProduct!.quantity,
        format: selectedProduct!.format,
        style: selectedProduct!.style,
        customText: selectedProduct!.customText,
        total: baseTotal,
        paymentMode,
        paymentAmount,
        remaining,
        notes: form.notes,
      },
    }),
  });
} catch (emailErr) {
  console.warn('⚠️ Erreur envoi email (non bloquant):', emailErr);
}

setOrderId(newOrderId);
clearSelectedProduct();
setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Réessayez.');
    } finally {
      hideLoading();
      setSending(false);
    }
  };

  // ============================================
  // ÉCRAN DE SUCCÈS
  // ============================================
  if (success) {
    const shortId = orderId.slice(-8).toUpperCase();

    const whatsappMessage = encodeURIComponent(
      `Bonjour 2MD Designer 👋\n\n` +
      `Je viens de passer commande :\n\n` +
      `🆔 Commande : ORD-${shortId}\n` +
      `💰 Montant envoyé : ${formatPrice(paymentAmount)}\n` +
      `📱 Mode : ${paymentMode === 'deposit' ? 'Acompte 50%' : 'Paiement total (-5%)'}\n` +
      `📲 MTN Money\n\n` +
      `Voici la capture de mon paiement 👇`
    );

    return (
      <div className="pt-32 pb-24 min-h-[70vh] px-6">
        <div className="max-w-2xl mx-auto">
          {/* Icône succès */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-ink-900 mb-4">
              Commande <span className="text-gradient">envoyée</span> !
            </h1>
            <p className="text-lg text-gray-600">
              Merci pour votre confiance. Il ne reste plus qu'à payer pour lancer la fabrication.
            </p>
          </div>

          {/* Instructions paiement */}
          <div className="bg-white rounded-3xl border-2 border-brand-100 shadow-sm p-8 mb-6">
            <div className="text-center mb-6">
              <div className="inline-block px-4 py-1.5 bg-brand-50 text-brand-700 text-sm font-semibold rounded-full mb-3 border border-red-100">
                Prochaine étape
              </div>
              <h2 className="font-display text-2xl font-bold text-ink-900 mb-2">
                Effectuez votre paiement
              </h2>
              <p className="text-sm text-gray-500">
                Envoyez le montant par MTN Mobile Money
              </p>
            </div>

            {/* Montant à payer */}
            <div className="p-6 bg-brand-gradient rounded-2xl text-white shadow-lg mb-6">
              <div className="text-center">
                <div className="text-sm opacity-90 mb-1">
                  {paymentMode === 'deposit' ? 'Acompte à envoyer (50%)' : 'Montant total à envoyer'}
                </div>
                <div className="font-display text-4xl font-black mb-2">
                  {formatPrice(paymentAmount)}
                </div>
                {paymentMode === 'deposit' && (
                  <div className="text-sm opacity-90">
                    Reste à la livraison : {formatPrice(remaining)}
                  </div>
                )}
                {paymentMode === 'full' && discountAmount > 0 && (
                  <div className="text-sm bg-white/20 inline-block px-3 py-1 rounded-full mt-2">
                    🎉 Vous économisez {formatPrice(discountAmount)} (-5%)
                  </div>
                )}
              </div>
            </div>

            {/* Infos MTN */}
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-brand-50 rounded-xl">
                <div className="w-12 h-12 rounded-2xl bg-yellow-400 flex items-center justify-center shrink-0">
                  <span className="font-bold text-black text-xs">MTN</span>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Numéro MTN Money</div>
                  <div className="font-mono font-bold text-ink-900">{MTN_MONEY_NUMBER}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-brand-50 rounded-xl">
                <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Référence commande</div>
                  <div className="font-mono font-bold text-ink-900">ORD-{shortId}</div>
                </div>
              </div>
            </div>

            {/* Étapes */}
            <div className="mt-6 pt-6 border-t border-red-100">
              <div className="text-sm font-semibold text-ink-900 mb-3">Comment payer :</div>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">1</span>
                  <span>Ouvrez MTN Mobile Money sur votre téléphone</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">2</span>
                  <span>Envoyez <strong>{formatPrice(paymentAmount)}</strong> au <strong>{MTN_MONEY_NUMBER}</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">3</span>
                  <span>Notez la référence <strong>ORD-{shortId}</strong> dans le motif</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">4</span>
                  <span>Envoyez la capture d'écran sur WhatsApp 👇</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Bouton WhatsApp */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white font-semibold rounded-2xl shadow-lg hover:bg-green-600 transition mb-3"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
            Envoyer la preuve sur WhatsApp
          </a>

          <Link
            to="/"
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-brand-200 text-ink-900 font-semibold rounded-2xl hover:bg-red-50 transition"
          >
            Retour à l'accueil
          </Link>

          <p className="text-xs text-gray-500 text-center mt-6">
            Une fois votre paiement reçu, nous confirmons votre commande sous 24h et lançons la fabrication.
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // FORMULAIRE
  // ============================================
  return (
    <div className="pt-32 pb-24">
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-brand-50 text-brand-700 text-sm font-semibold rounded-full mb-4 border border-red-100">
            Finaliser la commande
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-black mb-6 text-ink-900">
            Vos <span className="text-gradient">coordonnées</span>
          </h1>
          <p className="text-lg text-gray-600">
            Dernière étape ! Nous vous contacterons sous 24h pour valider.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Récap produit */}
          <div className="bg-white rounded-3xl border-2 border-brand-100 shadow-sm p-6">
            <h2 className="font-display text-lg font-bold text-ink-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-gradient text-white text-sm font-bold flex items-center justify-center">
                ✓
              </span>
              Récapitulatif
            </h2>

            <div className="flex gap-4 mb-4">
              {selectedProduct!.product.image && (
                <img
                  src={selectedProduct!.product.image}
                  alt={selectedProduct!.product.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
              )}
              <div className="flex-1">
                <div className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
                  {selectedProduct!.product.category}
                </div>
                <div className="font-display font-bold text-lg text-ink-900">
                  {selectedProduct!.product.name}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm pt-4 border-t border-red-50">
              <div className="flex justify-between">
                <span className="text-gray-600">Quantité</span>
                <span className="font-semibold">{selectedProduct!.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Format</span>
                <span className="font-semibold capitalize">{selectedProduct!.format}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Style</span>
                <span className="font-semibold capitalize">{selectedProduct!.style}</span>
              </div>
              {selectedProduct!.customText && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Texte</span>
                  <span className="font-semibold text-right ml-4 truncate">
                    {selectedProduct!.customText}
                  </span>
                </div>
              )}
              {selectedProduct!.files.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Photos</span>
                  <span className="font-semibold text-green-600">
                    ✓ {selectedProduct!.files.length} photo{selectedProduct!.files.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-red-50 flex justify-between items-center">
              <span className="text-sm text-gray-600">Total</span>
              <span className="font-display text-2xl font-black text-brand-600">
                {formatPrice(baseTotal)}
              </span>
            </div>

            <Link
              to={`/produit/${selectedProduct!.product.slug || selectedProduct!.product.id}`}
              className="text-xs text-brand-600 hover:underline mt-3 inline-block"
            >
              ← Modifier ma sélection
            </Link>
          </div>

          {/* 🔥 NOUVEAU : Mode de paiement */}
          <div className="bg-white rounded-3xl border-2 border-brand-100 shadow-sm p-6 md:p-8">
            <h2 className="font-display text-lg font-bold text-ink-900 mb-1">
              Mode de paiement
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Choisissez comment vous souhaitez payer
            </p>

            <div className="space-y-3">
              {/* Acompte 50% */}
              <label
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMode === 'deposit'
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-red-100 hover:border-brand-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="deposit"
                  checked={paymentMode === 'deposit'}
                  onChange={() => setPaymentMode('deposit')}
                  className="w-5 h-5 text-brand-600 mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <div className="font-bold text-ink-900">Acompte 50%</div>
                    <div className="font-display font-black text-brand-600">
                      {formatPrice(Math.round(baseTotal / 2))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Vous payez la moitié maintenant.
                    Le reste ({formatPrice(baseTotal - Math.round(baseTotal / 2))}) à la livraison.
                  </p>
                </div>
              </label>

              {/* Paiement total */}
              <label
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition relative ${
                  paymentMode === 'full'
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-red-100 hover:border-brand-300'
                }`}
              >
                {/* Badge recommandé */}
                <div className="absolute -top-2.5 right-4 px-3 py-0.5 bg-brand-gradient text-white text-xs font-bold rounded-full shadow-lg">
                  ⭐ RECOMMANDÉ
                </div>
                <input
                  type="radio"
                  name="payment"
                  value="full"
                  checked={paymentMode === 'full'}
                  onChange={() => setPaymentMode('full')}
                  className="w-5 h-5 text-brand-600 mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <div className="font-bold text-ink-900">
                      Paiement total <span className="text-brand-600">-5%</span>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-black text-brand-600">
                        {formatPrice(totalAfterDiscount)}
                      </div>
                      <div className="text-xs text-gray-400 line-through">
                        {formatPrice(baseTotal)}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Vous payez tout maintenant et économisez <strong>{formatPrice(discountAmount)}</strong>.
                    Rien à la livraison.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Formulaire client */}
          <div className="bg-white rounded-3xl border border-red-100 shadow-sm p-6 md:p-8 space-y-5">
            <h2 className="font-display text-lg font-bold text-ink-900 mb-2">
              Vos coordonnées
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-ink-900">
                  Nom complet <span className="text-brand-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.clientName}
                  onChange={(e) => update('clientName', e.target.value)}
                  placeholder="Votre nom"
                  className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-ink-900">
                  Téléphone / WhatsApp <span className="text-brand-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={form.clientPhone}
                  onChange={(e) => update('clientPhone', e.target.value)}
                  placeholder={STUDIO_INFO.phone}
                  className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-ink-900">
                  Email <span className="text-gray-400 font-normal">(optionnel)</span>
                </label>
                <input
                  type="email"
                  value={form.clientEmail}
                  onChange={(e) => update('clientEmail', e.target.value)}
                  placeholder="vous@email.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-ink-900">
                  Adresse <span className="text-gray-400 font-normal">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={form.clientAddress}
                  onChange={(e) => update('clientAddress', e.target.value)}
                  placeholder="Quartier, rue, numéro"
                  className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Livraison */}
          <div className="bg-white rounded-3xl border border-red-100 shadow-sm p-6 md:p-8">
            <h2 className="font-display text-lg font-bold text-ink-900 mb-4">
              Livraison
            </h2>

            <div className="space-y-2 mb-5">
              {DELIVERY_MODES.map((mode) => (
                <label
                  key={mode.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${
                    form.delivery === mode.value
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-red-100 hover:border-brand-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={mode.value}
                    checked={form.delivery === mode.value}
                    onChange={(e) => update('delivery', e.target.value)}
                    className="w-5 h-5 text-brand-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-ink-900">{mode.label}</div>
                  </div>
                  <span className="font-bold text-sm text-brand-600">
                    {mode.price === 0 ? 'Gratuit' : `+ ${formatPrice(mode.price)}`}
                  </span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-ink-900">
                Date de livraison souhaitée <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <input
                type="date"
                value={form.deliveryDate}
                onChange={(e) => update('deliveryDate', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none transition"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-3xl border border-red-100 shadow-sm p-6 md:p-8">
            <label className="block font-display text-lg font-bold mb-3 text-ink-900">
              Notes supplémentaires <span className="text-gray-400 font-normal text-sm">(optionnel)</span>
            </label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Précisions, instructions particulières..."
              className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none transition resize-none"
            />
          </div>

          {/* Erreur */}
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={sending}
              className="w-full btn-shine px-6 py-4 bg-brand-gradient text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Envoi en cours…
                </>
              ) : (
                <>
                  Envoyer ma commande
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              Une fois la commande envoyée, vous recevrez les instructions de paiement MTN Money.
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}
