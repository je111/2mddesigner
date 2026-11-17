import { useState, useCallback, type ReactNode } from 'react';
import { LoadingContext } from './loading';
import LoadingScreen from '../components/ui/LoadingScreen';

export function LoadingProvider({ children }: { children: ReactNode }) {
  // Pas d'écran de chargement au démarrage : la page s'affiche dès qu'elle est prête
  // (meilleur score PageSpeed). Il reste utilisé pour les changements de page.
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = useCallback(() => setIsLoading(true), []);
  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
      {isLoading && <LoadingScreen />}
    </LoadingContext.Provider>
  );
}
