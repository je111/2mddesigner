import { useContext } from 'react';
import { LoadingContext } from '../contexts/loading';

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) throw new Error('useLoading doit être utilisé dans LoadingProvider');
  return context;
}