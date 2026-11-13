import type { ComponentType } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import AdminAuthProvider from './components/admin/AdminAuthProvider';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Chaque page et ses dépendances sont chargées au premier accès à sa route.
const lazyPage = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
});

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: (
      <AdminAuthProvider>
        <Outlet />
      </AdminAuthProvider>
    ),
    children: [
      { path: 'login', lazy: lazyPage(() => import('./pages/admin/Login')) },
      {
        element: (
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, lazy: lazyPage(() => import('./pages/admin/Dashboard')) },
          { path: 'orders', lazy: lazyPage(() => import('./pages/admin/Orders')) },
          { path: 'messages', lazy: lazyPage(() => import('./pages/admin/Messages')) },
          { path: 'products', lazy: lazyPage(() => import('./pages/admin/Products')) },
          { path: 'settings', lazy: lazyPage(() => import('./pages/admin/Settings')) },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, lazy: lazyPage(() => import('./pages/Home')) },
      { path: 'services', lazy: lazyPage(() => import('./pages/Services')) },
      { path: 'catalogue', lazy: lazyPage(() => import('./pages/Catalogue')) },
      { path: 'produit/:slug', lazy: lazyPage(() => import('./pages/Product')) },
      { path: 'a-propos', lazy: lazyPage(() => import('./pages/About')) },
      { path: 'contact', lazy: lazyPage(() => import('./pages/Contact')) },
      { path: 'commander', lazy: lazyPage(() => import('./pages/Commander')) },
      { path: 'mentions-legales', lazy: lazyPage(() => import('./pages/legals/MentionLegales')) },
      { path: 'confidentialite', lazy: lazyPage(() => import('./pages/legals/Confidentialite')) },
      { path: 'cgv', lazy: lazyPage(() => import('./pages/legals/Confidentialite')) },
      { path: 'cookies', lazy: lazyPage(() => import('./pages/legals/Cookies')) },
      { path: '*', lazy: lazyPage(() => import('./pages/NotFound')) },
    ],
  },
]);
