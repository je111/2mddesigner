import { Outlet, useLocation, useNavigation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import LoadingScreen from './ui/LoadingScreen';
import RouteLoadingBridge from './ui/RouteLoadingBridge';

export default function Layout() {
  const { pathname } = useLocation();
  const navigation = useNavigation();

  // Remonte en haut à chaque changement de page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <RouteLoadingBridge />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {navigation.state !== 'idle' && <LoadingScreen />}
      <Footer />
    </div>
  );
}