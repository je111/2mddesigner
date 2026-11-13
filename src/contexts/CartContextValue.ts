import { createContext } from 'react';
import type { Product, OrderFile } from '../types/firebase';

export interface SelectedProduct {
  product: Product;
  quantity: number;
  format: string;
  style: string;
  customText: string;
  files: OrderFile[];
  total: number;
}

export interface CartContextType {
  selectedProduct: SelectedProduct | null;
  setSelectedProduct: (data: SelectedProduct | null) => void;
  clearSelectedProduct: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
