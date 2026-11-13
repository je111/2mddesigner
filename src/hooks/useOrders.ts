import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import type { Order } from '../types/firebase';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ordersRef = ref(database, 'orders');
    const unsubscribe = onValue(
      ordersRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.entries(data).map(([id, value]) => ({
            id,
            ...(value as Omit<Order, 'id'>),
          }));
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setOrders(list);
        } else {
          setOrders([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Erreur chargement commandes:', error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return { orders, loading };
}