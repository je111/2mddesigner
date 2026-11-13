import { useState, type ReactNode } from 'react';
import { CartContext } from './CartContextValue';

export function CartProvider({ children }: { children: ReactNode }) {
  const [selectedProduct, setSelectedProduct] = useState<import('./CartContextValue').SelectedProduct | null>(null);
  const clearSelectedProduct = () => setSelectedProduct(null);

  return (
    <CartContext.Provider value={{ selectedProduct, setSelectedProduct, clearSelectedProduct }}>
      {children}
    </CartContext.Provider>
  );
}
