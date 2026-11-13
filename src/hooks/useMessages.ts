import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import type { ContactMessage } from '../types/firebase';

export function useMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const messagesRef = ref(database, 'contacts');
    const unsubscribe = onValue(
      messagesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.entries(data).map(([id, value]) => ({
            id,
            ...(value as Omit<ContactMessage, 'id'>),
          }));
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setMessages(list);
        } else {
          setMessages([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Erreur chargement messages:', error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return { messages, loading };
}