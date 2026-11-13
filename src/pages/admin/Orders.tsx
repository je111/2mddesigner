import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { updateOrderStatus, markOrderAsPaid, markOrderAsUnpaid } from '../../lib/firebase';

interface OutletContext {
  toggleSidebar: () => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: '⏳ En attente', className: 'status-pending' },
  confirmed: { label: '✓ Confirmée', className: 'status-confirmed' },
  progress: { label: '🎨 En fabrication', className: 'status-progress' },
  delivered: { label: '📦 Livrée', className: 'status-delivered' },
  cancelled: { label: '✕ Annulée', className: 'status-cancelled' },
};

const formatPrice = (n: number) =>
  Math.round(n || 0).toLocaleString('fr-FR').replace(/\u202f/g, ' ') + ' FCFA';

export default function Orders() {
  const { toggleSidebar } = useOutletContext<OutletContext>();
  const { orders, loading } = useOrders();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  // Modal paiement
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [saving, setSaving] = useState(false);

  const filtered = orders.filter((o) => {
    const matchSearch = `${o.clientName || ''} ${o.clientPhone || ''} ${o.product || ''} ${
      o.id || ''
    }`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || o.status === statusFilter;
    const matchPayment = !paymentFilter || o.paymentStatus === paymentFilter;
    return matchSearch && matchStatus && matchPayment;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const openPaymentModal = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    setSelectedOrderId(orderId);
    setPaymentRef(order?.paymentReference || '');
    setPaymentNote(order?.paymentNote || '');
    setPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setPaymentModalOpen(false);
    setSelectedOrderId(null);
    setPaymentRef('');
    setPaymentNote('');
  };

  const confirmPayment = async () => {
    if (!selectedOrderId) return;
    setSaving(true);
    try {
      await markOrderAsPaid(selectedOrderId, paymentRef, paymentNote);
      closePaymentModal();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la confirmation');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkUnpaid = async (orderId: string) => {
    if (!confirm('Marquer cette commande comme non payée ?')) return;
    try {
      await markOrderAsUnpaid(orderId);
    } catch (err) {
      console.error(err);
      alert('Erreur');
    }
  };

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

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
              <h1 className="font-display text-2xl font-black text-ink-900">Commandes</h1>
              <p className="text-sm text-gray-500">
                {loading ? 'Chargement…' : `${filtered.length} commande${filtered.length > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none text-sm bg-white cursor-pointer"
          >
            <option value="">Tous statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="progress">En fabrication</option>
            <option value="delivered">Livrée</option>
            <option value="cancelled">Annulée</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none text-sm bg-white cursor-pointer"
          >
            <option value="">Tous paiements</option>
            <option value="pending">🟡 À payer</option>
            <option value="paid">🟢 Payé</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 rounded-full border-4 border-red-100 border-t-brand-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Chargement…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="font-display text-xl font-bold text-ink-900 mb-2">
                {orders.length === 0 ? 'Aucune commande' : 'Aucun résultat'}
              </h3>
              <p className="text-gray-500">
                {orders.length === 0
                  ? 'Les commandes apparaîtront ici automatiquement.'
                  : 'Essaie de modifier tes filtres.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-brand-50 border-b border-red-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-bold text-brand-700 uppercase">Client</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-brand-700 uppercase">Produit</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-brand-700 uppercase">Total</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-brand-700 uppercase">Paiement</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-brand-700 uppercase">Statut</th>
                    <th className="text-right px-6 py-4 text-xs font-bold text-brand-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-50">
                  {filtered.map((o) => (
                    <tr key={o.id} className="hover:bg-brand-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-600 text-sm">
                            {o.clientName?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-ink-900">{o.clientName}</div>
                            <div className="text-xs text-gray-500">{o.clientPhone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-sm text-ink-900">{o.product}</div>
                        <div className="text-xs text-gray-500">Qté : {o.quantity}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm text-ink-900">{formatPrice(o.total)}</div>
                      </td>
                      <td className="px-6 py-4">
                        {o.paymentStatus === 'paid' ? (
                          <div>
                            <div className="flex items-center gap-1.5 text-green-600 font-bold text-sm">
                              🟢 {formatPrice(o.paymentAmount || 0)}
                            </div>
                            {o.paymentReference && (
                              <div className="text-xs text-gray-500 font-mono">{o.paymentReference}</div>
                            )}
                            {o.remaining > 0 && (
                              <div className="text-xs text-amber-600">Reste : {formatPrice(o.remaining)}</div>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => openPaymentModal(o.id!)}
                            className="text-sm font-bold text-amber-600 hover:text-amber-700 transition"
                          >
                            🟡 Marquer payé
                            <div className="text-xs text-gray-500 font-normal mt-0.5">
                              {formatPrice(o.paymentAmount || 0)}
                            </div>
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id!, e.target.value)}
                          className={`px-3 py-1 text-xs font-bold rounded-full border cursor-pointer ${
                            statusConfig[o.status]?.className || ''
                          }`}
                        >
                          <option value="pending">⏳ En attente</option>
                          <option value="confirmed">✓ Confirmée</option>
                          <option value="progress">🎨 En fabrication</option>
                          <option value="delivered">📦 Livrée</option>
                          <option value="cancelled">✕ Annulée</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {o.paymentStatus === 'paid' && (
                            <button
                              onClick={() => handleMarkUnpaid(o.id!)}
                              className="p-1.5 rounded-lg hover:bg-red-50 transition"
                              title="Marquer comme non payé"
                            >
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                          )}
                          {o.clientPhone && (
                            <a
                              href={`https://wa.me/${o.clientPhone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-full hover:bg-green-600 transition"
                            >
                              WhatsApp
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal confirmation paiement */}
      {paymentModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => !saving && closePaymentModal()} />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-black text-ink-900 mb-2">
                Confirmer le paiement
              </h3>
              <p className="text-sm text-gray-500">
                Commande de <strong>{selectedOrder.clientName}</strong>
              </p>
            </div>

            <div className="p-4 bg-brand-50 rounded-xl mb-5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Montant à recevoir</span>
                <span className="font-display text-lg font-black text-brand-600">
                  {formatPrice(selectedOrder.paymentAmount || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Mode</span>
                <span className="font-semibold">
                  {selectedOrder.paymentMode === 'full' ? 'Paiement total (-5%)' : 'Acompte 50%'}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-ink-900">
                Référence transaction <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <input
                type="text"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                placeholder="Ex : TX-7823492"
                className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none transition font-mono text-sm"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-ink-900">
                Note <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <input
                type="text"
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                placeholder="Ex : Reçu à 14h32"
                className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none transition text-sm"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={closePaymentModal}
                disabled={saving}
                className="flex-1 px-5 py-3 bg-white border-2 border-red-100 text-ink-900 font-semibold rounded-xl hover:bg-red-50 transition disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmPayment}
                disabled={saving}
                className="flex-1 px-5 py-3 bg-green-500 text-white font-semibold rounded-xl shadow-lg hover:bg-green-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Enregistrement…
                  </>
                ) : (
                  <>✅ Confirmer</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}