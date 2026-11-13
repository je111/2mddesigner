import { useContext } from 'react';
import { CartContext } from '../contexts/CartContextValue';

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart doit ?tre utilis? dans CartProvider');
  return context;
}
