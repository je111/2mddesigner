import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app: FirebaseApp = initializeApp(firebaseConfig);
export const database: Database = getDatabase(app);
export const auth: Auth = getAuth(app);

// ============================================
// FONCTIONS UTILITAIRES FIREBASE
// ============================================
import {
  ref as dbRef,
  push,
  set,
  update as dbUpdate,
  remove,
} from 'firebase/database';

/**
 * Ajoute un produit dans Firebase
 */
export async function addProduct(productData: Record<string, unknown>): Promise<string> {
  const productsRef = dbRef(database, 'products');
  const newRef = push(productsRef);
  await set(newRef, {
    ...productData,
    createdAt: Date.now(),
  });
  return newRef.key!;
}

/**
 * Met à jour un produit
 */
export async function updateProduct(productId: string, updates: Record<string, unknown>): Promise<void> {
  const productRef = dbRef(database, `products/${productId}`);
  await dbUpdate(productRef, {
    ...updates,
    updatedAt: Date.now(),
  });
}

/**
 * Supprime un produit
 */
export async function deleteProduct(productId: string): Promise<void> {
  const productRef = dbRef(database, `products/${productId}`);
  await remove(productRef);
}

/**
 * Change le statut d'une commande
 */
export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<void> {
  const orderRef = dbRef(database, `orders/${orderId}`);
  await dbUpdate(orderRef, {
    status,
    updatedAt: Date.now(),
  });
}

/**
 * Change le statut d'un message
 */
export async function updateMessageStatus(
  messageId: string,
  status: string
): Promise<void> {
  const messageRef = dbRef(database, `contacts/${messageId}`);
  await dbUpdate(messageRef, { status });
}

/**
 * Marque une commande comme payée
 */
export async function markOrderAsPaid(
  orderId: string,
  reference: string = '',
  note: string = ''
): Promise<void> {
  const orderRef = dbRef(database, `orders/${orderId}`);
  await dbUpdate(orderRef, {
    paymentStatus: 'paid',
    paymentReference: reference.trim(),
    paymentNote: note.trim(),
    paymentConfirmedAt: Date.now(),
    updatedAt: Date.now(),
  });
}

/**
 * Marque une commande comme non payée (retour arrière)
 */
export async function markOrderAsUnpaid(orderId: string): Promise<void> {
  const orderRef = dbRef(database, `orders/${orderId}`);
  await dbUpdate(orderRef, {
    paymentStatus: 'pending',
    paymentReference: '',
    paymentNote: '',
    paymentConfirmedAt: null,
    updatedAt: Date.now(),
  });
}

export default app;