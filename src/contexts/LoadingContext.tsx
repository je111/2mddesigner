import { useState, useCallback, useEffect, type ReactNode } from 'react';
import { LoadingContext } from './loading';
import LoadingScreen from '../components/ui/LoadingScreen';

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startupTimer = window.setTimeout(() => {
      setIsLoading(false);
    }, 900);

    return () => window.clearTimeout(startupTimer);
  }, []);

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
