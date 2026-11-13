import { Outlet, useLocation, useNavigation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import LoadingScreen from '../ui/LoadingScreen';
import RouteLoadingBridge from '../ui/RouteLoadingBridge';

export default function AdminLayout() {
  const { pathname } = useLocation();
  const navigation = useNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <RouteLoadingBridge />
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenu */}
      <div className="flex-1 lg:ml-64 min-w-0">
        <Outlet context={{ toggleSidebar: () => setSidebarOpen(true) }} />
      </div>
      {navigation.state !== 'idle' && <LoadingScreen />}
    </div>
  );
}