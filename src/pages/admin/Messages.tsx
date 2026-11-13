import { useOutletContext } from 'react-router-dom';
import { useMessages } from '../../hooks/useMessages';
import { updateMessageStatus } from '../../lib/firebase';

interface OutletContext {
  toggleSidebar: () => void;
}

const formatDate = (timestamp: number) => {
  if (!timestamp) return '—';
  const date = new Date(timestamp);
  const diff = Date.now() - timestamp;
  if (diff < 60000) return 'À l\'instant';
  if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
  if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)} h`;
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
};

export default function Messages() {
  const { toggleSidebar } = useOutletContext<OutletContext>();
  const { messages, loading } = useMessages();

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateMessageStatus(id, 'read');
    } catch (err) {
      console.error(err);
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
              <h1 className="font-display text-2xl font-black text-ink-900">Messages</h1>
              <p className="text-sm text-gray-500">
                {loading ? 'Chargement…' : `${messages.length} message${messages.length > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 rounded-full border-4 border-red-100 border-t-brand-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Chargement des messages…</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="font-display text-xl font-bold text-ink-900 mb-2">Aucun message</h3>
              <p className="text-gray-500">
                Les messages de contact apparaîtront ici automatiquement.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-red-50">
              {messages.map((m) => (
                <div key={m.id} className="p-5 hover:bg-brand-50 transition">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold shrink-0">
                      {m.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <div className="font-semibold text-sm text-ink-900">{m.name}</div>
                        <div className="text-xs text-gray-500 shrink-0">{formatDate(m.createdAt)}</div>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {m.email && `✉️ ${m.email}`}
                        {m.phone && ` • 📞 ${m.phone}`}
                        {m.projectType && ` • 📦 ${m.projectType}`}
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{m.message}</p>

                      {m.status !== 'read' && (
                        <button
                          onClick={() => handleMarkAsRead(m.id!)}
                          className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                        >
                          Marquer comme lu
                        </button>
                      )}
                      {m.status === 'read' && (
                        <span className="text-xs text-gray-400">✓ Lu</span>
                      )}

                      <div className="flex gap-3 mt-2">
                        {m.email && (
                          <a href={`mailto:${m.email}`} className="text-xs font-semibold text-brand-600 hover:underline">
                            Répondre par email
                          </a>
                        )}
                        {m.phone && (
                          <a
                            href={`https://wa.me/${m.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-green-600 hover:underline"
                          >
                            WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}