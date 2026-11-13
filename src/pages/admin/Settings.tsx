import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  { to: '/admin', label: 'Vue d\'ensemble', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', end: true },
  { to: '/admin/orders', label: 'Commandes', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { to: '/admin/messages', label: 'Messages', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { to: '/admin/products', label: 'Catalogue', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { to: '/admin/settings', label: 'Paramètres', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
];

export default function AdminSidebar({ isOpen = true, onClose = () => {} }: Props) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (!confirm('Voulez-vous vous déconnecter ?')) return;
    await logout();
  };

  // Récupère les initiales de l'email ou les 2 premiers caractères de l'UID
  const userInitial = user?.email?.[0]?.toUpperCase() || 'A';

  // Affiche l'UID raccourci (8 premiers caractères + …)
  const shortUid = user?.uid ? `${user.uid.slice(0, 8)}…` : 'Admin';

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-red-100 z-40 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-red-100">
        <Link to="/admin" onClick={onClose} className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-lg shadow-red-500/30">
            <span className="font-display font-black text-white text-base">2MD</span>
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-base text-ink-900">2MD Studio</div>
            <div className="text-xs text-brand-600 font-medium">Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                isActive
                  ? 'bg-brand-gradient text-white shadow-lg shadow-red-500/30'
                  : 'text-gray-700 hover:bg-brand-50 hover:text-brand-600'
              }`
            }
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="flex-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bas de sidebar — Infos utilisateur */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-red-100 bg-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-ink-900 truncate">
              {user?.email || 'Admin'}
            </div>
            <div className="text-xs text-green-600 font-medium flex items-center gap-1">
              🟢 {shortUid}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-brand-600 font-medium text-sm rounded-xl hover:bg-red-100 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}