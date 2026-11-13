import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import type { Product } from '../types/firebase';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(
      productsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.entries(data).map(([id, value]) => ({
            id,
            ...(value as Omit<Product, 'id'>),
          }));
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setProducts(list);
        } else {
          setProducts([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Erreur chargement produits:', error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return { products, loading };
}