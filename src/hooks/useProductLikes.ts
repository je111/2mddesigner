import { useEffect, useState } from 'react';
import { onValue, ref, runTransaction } from 'firebase/database';
import { database } from '../lib/firebase';

function getVisitorId(): string {
  const storageKey = '2md-designer-visitor-id';
  try {
    let visitorId = window.localStorage.getItem(storageKey);
    if (!visitorId) {
      visitorId = window.crypto?.randomUUID?.() ?? `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem(storageKey, visitorId);
    }
    return visitorId;
  } catch {
    return `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

export function useProductLikes(productId?: string) {
  const [visitorId] = useState(getVisitorId);
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const likesRef = ref(database, `productLikes/${productId}`);
    const unsubscribe = onValue(
      likesRef,
      (snapshot) => {
        setCount(snapshot.size);
        setLiked(snapshot.hasChild(visitorId));
        setLoading(false);
      },
      (error) => {
        console.error('Impossible de charger les likes du produit :', error);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [productId, visitorId]);

  const toggleLike = async () => {
    if (!productId || saving) return;
    setSaving(true);
    try {
      const likeRef = ref(database, `productLikes/${productId}/${visitorId}`);
      await runTransaction(likeRef, (currentValue) => currentValue ? null : true);
    } catch (error) {
      console.error('Impossible de mettre ? jour le like :', error);
    } finally {
      setSaving(false);
    }
  };

  return { liked, count, loading, saving, toggleLike };
}
