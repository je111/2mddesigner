import { useMemo, type ReactNode } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useMessages } from '../../hooks/useMessages';
import { useOrders } from '../../hooks/useOrders';
import type { Order } from '../../types/firebase';

interface OutletContext {
  toggleSidebar: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; className: string }> = {
  pending: { label: 'En attente', color: '#f59e0b', className: 'status-pending' },
  confirmed: { label: 'Confirmee', color: '#3b82f6', className: 'status-confirmed' },
  progress: { label: 'En fabrication', color: '#6366f1', className: 'status-progress' },
  delivered: { label: 'Livree', color: '#10b981', className: 'status-delivered' },
  cancelled: { label: 'Annulee', color: '#ef4444', className: 'status-cancelled' },
};

const formatPrice = (value: number) =>
  `${Math.round(value || 0).toLocaleString('fr-FR').replace(/\u202f/g, ' ')} FCFA`;

const compactPrice = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)} k`;
  return `${value}`;
};

function monthStart(date: Date, offset = 0) {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(date);
}

function Comparison({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) {
    return <span className="text-xs font-semibold text-gray-500">{current > 0 ? 'Nouveau ce mois' : 'Pas de variation'}</span>;
  }

  const change = ((current - previous) / previous) * 100;
  const positive = change >= 0;
  return (
    <span className={`text-xs font-semibold ${positive ? 'text-green-700' : 'text-red-600'}`}>
      {positive ? '+' : ''}{change.toFixed(0)}% vs mois precedent
    </span>
  );
}

function StatCard({ label, value, note, tone }: { label: string; value: string; note: ReactNode; tone: string }) {
  return (
    <article className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className={`h-2.5 w-2.5 rounded-full ${tone}`} />
      </div>
      <div className="mb-2 break-words font-display text-2xl font-black text-ink-900">{value}</div>
      <div className="min-h-5">{note}</div>
    </article>
  );
}

export default function Dashboard() {
  const { toggleSidebar } = useOutletContext<OutletContext>();
  const { orders, loading: loadingOrders } = useOrders();
  const { messages, loading: loadingMessages } = useMessages();
  const now = useMemo(() => new Date(), []);
  const thisMonthKey = monthKey(now);
  const previousMonthKey = monthKey(monthStart(now, -1));

  const analytics = useMemo(() => {
    const validOrders = orders.filter((order) => Number.isFinite(order.createdAt));
    const activeOrders = validOrders.filter((order) => order.status !== 'cancelled');
    const buckets = new Map<string, { revenue: number; orders: number }>();

    for (let offset = -5; offset <= 0; offset++) {
      buckets.set(monthKey(monthStart(now, offset)), { revenue: 0, orders: 0 });
    }

    for (const order of activeOrders) {
      const key = monthKey(new Date(order.createdAt));
      const bucket = buckets.get(key);
      if (bucket) {
        bucket.orders += 1;
        bucket.revenue += Number(order.total) || 0;
      }
    }

    const monthly = Array.from(buckets.entries()).map(([key, value]) => {
      const [year, month] = key.split('-').map(Number);
      return { key, month: monthLabel(new Date(year, month - 1, 1)), ...value };
    });
    const current = buckets.get(thisMonthKey) ?? { revenue: 0, orders: 0 };
    const previous = buckets.get(previousMonthKey) ?? { revenue: 0, orders: 0 };
    const statusCounts = validOrders.reduce<Record<string, number>>((counts, order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
      return counts;
    }, {});
    const statuses = Object.entries(STATUS_CONFIG)
      .map(([key, status]) => ({ name: status.label, value: statusCounts[key] || 0, color: status.color }))
      .filter((status) => status.value > 0);
    const productCounts = activeOrders.reduce<Record<string, number>>((counts, order) => {
      const product = order.product || 'Autre';
      counts[product] = (counts[product] || 0) + (Number(order.quantity) || 1);
      return counts;
    }, {});
    const topProducts = Object.entries(productCounts)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return { validOrders, activeOrders, monthly, current, previous, statuses, topProducts };
  }, [orders, now, thisMonthKey, previousMonthKey]);

  const pendingOrders = orders.filter((order) => order.status === 'pending').length;
  const recentOrders = analytics.validOrders.slice(0, 6);
  const currentAverage = analytics.current.orders
    ? analytics.current.revenue / analytics.current.orders
    : 0;
  const previousAverage = analytics.previous.orders
    ? analytics.previous.revenue / analytics.previous.orders
    : 0;
  const busy = loadingOrders || loadingMessages;
  const monthTitle = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(now);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-red-100 bg-white/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="rounded-lg p-2 hover:bg-red-50 lg:hidden" aria-label="Ouvrir le menu admin">
              <svg className="h-6 w-6 text-ink-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="font-display text-2xl font-black text-ink-900">Tableau de bord</h1>
              <p className="text-sm capitalize text-gray-500">Vue d'ensemble ? {monthTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-2">
            <span className={`h-2 w-2 rounded-full ${busy ? 'animate-pulse bg-amber-500' : 'animate-pulse bg-green-500'}`} />
            <span className={`text-xs font-semibold ${busy ? 'text-amber-700' : 'text-green-700'}`}>
              {busy ? 'Synchronisation' : 'Donnees a jour'}
            </span>
          </div>
        </div>
      </header>

      <main className="space-y-6 p-4 md:p-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicateurs du mois">
          <StatCard label="Valeur des commandes" value={formatPrice(analytics.current.revenue)} note={<Comparison current={analytics.current.revenue} previous={analytics.previous.revenue} />} tone="bg-brand-500" />
          <StatCard label="Commandes recues" value={`${analytics.current.orders}`} note={<Comparison current={analytics.current.orders} previous={analytics.previous.orders} />} tone="bg-blue-500" />
          <StatCard label="Panier moyen" value={formatPrice(currentAverage)} note={<Comparison current={currentAverage} previous={previousAverage} />} tone="bg-violet-500" />
          <StatCard label="A traiter" value={`${pendingOrders}`} note={<span className="text-xs text-gray-500">Commandes en attente de confirmation</span>} tone="bg-amber-500" />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <article className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-bold text-ink-900">Evolution du chiffre d'affaires</h2>
                <p className="text-sm text-gray-500">Valeur des commandes sur les six derniers mois</p>
              </div>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold capitalize text-brand-700">{monthTitle}</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.monthly} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.24} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#f3f4f6" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={compactPrice} width={48} />
                  <Tooltip formatter={(value) => [formatPrice(Number(value)), 'Commandes']} contentStyle={{ borderRadius: 12, borderColor: '#fee2e2' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={3} fill="url(#revenueFill)" activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="font-display text-lg font-bold text-ink-900">Commandes par mois</h2>
              <p className="text-sm text-gray-500">Comparaison sur six mois</p>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.monthly} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="#f3f4f6" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <Tooltip formatter={(value) => [`${value}`, 'Commandes']} contentStyle={{ borderRadius: 12, borderColor: '#fee2e2' }} />
                  <Bar dataKey="orders" name="Commandes" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={38} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-bold text-ink-900">Statut des commandes</h2>
            <p className="mb-2 text-sm text-gray-500">Toutes les commandes</p>
            {analytics.statuses.length ? (
              <>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={analytics.statuses} dataKey="value" nameKey="name" innerRadius={55} outerRadius={82} paddingAngle={3}>
                        {analytics.statuses.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}`, 'Commandes']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {analytics.statuses.map((status) => (
                    <div key={status.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-600"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: status.color }} />{status.name}</span>
                      <strong className="text-ink-900">{status.value}</strong>
                    </div>
                  ))}
                </div>
              </>
            ) : <div className="flex h-64 items-center justify-center text-sm text-gray-400">Pas encore de commandes</div>}
          </article>

          <article className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-ink-900">Produits les plus commandes</h2>
                <p className="text-sm text-gray-500">Quantites vendues, hors commandes annulees</p>
              </div>
            </div>
            {analytics.topProducts.length ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.topProducts} layout="vertical" margin={{ top: 4, right: 20, left: 12, bottom: 4 }}>
                    <CartesianGrid stroke="#f3f4f6" strokeDasharray="4 4" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" width={110} axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 12 }} />
                    <Tooltip formatter={(value) => [`${value}`, 'Unites']} contentStyle={{ borderRadius: 12, borderColor: '#fee2e2' }} />
                    <Bar dataKey="quantity" name="Unites vendues" fill="#b91c1c" radius={[0, 6, 6, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : <div className="flex h-64 items-center justify-center text-sm text-gray-400">Les ventes apparaitront ici</div>}
          </article>
        </section>

        <section className="rounded-2xl border border-red-100 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-100 p-5">
            <div>
              <h2 className="font-display text-lg font-bold text-ink-900">Commandes recentes</h2>
              <p className="text-sm text-gray-500">Les six dernieres demandes clients</p>
            </div>
            <Link to="/admin/orders" className="text-sm font-semibold text-brand-600 hover:text-brand-700">Toutes les commandes ?</Link>
          </div>
          {recentOrders.length ? (
            <div className="divide-y divide-red-50">
              {recentOrders.map((order: Order) => {
                const status = STATUS_CONFIG[order.status];
                return (
                  <div key={order.id} className="flex flex-wrap items-center justify-between gap-4 p-4 hover:bg-brand-50/50">
                    <div className="flex min-w-[200px] flex-1 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-600">{order.clientName?.[0]?.toUpperCase() || '?'}</div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-ink-900">{order.clientName}</div>
                        <div className="truncate text-xs text-gray-500">{order.product} ? {order.quantity} unite(s)</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-ink-900">{formatPrice(Number(order.total) || 0)}</div>
                      <div className="text-xs text-gray-500">{Number.isFinite(order.createdAt) ? new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'Date inconnue'}</div>
                    </div>
                    {status && <span className={`rounded-full border px-3 py-1 text-xs font-bold ${status.className}`}>{status.label}</span>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-gray-500">{loadingOrders ? 'Chargement des commandes?' : 'Aucune commande enregistree pour le moment.'}</div>
          )}
        </section>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Commandes au total</p>
            <p className="mt-1 font-display text-2xl font-black text-ink-900">{orders.length}</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Valeur totale (hors annulations)</p>
            <p className="mt-1 font-display text-2xl font-black text-ink-900">{formatPrice(analytics.activeOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0))}</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Messages recus</p>
            <p className="mt-1 font-display text-2xl font-black text-ink-900">{loadingMessages ? '?' : messages.length}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

