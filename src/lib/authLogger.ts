import { ref as dbRef, push, set } from 'firebase/database';
import { database } from './firebase';

export async function logAdminAccess(userId: string, email: string) {
  try {
    const logsRef = dbRef(database, 'admin_logs');
    const newRef = push(logsRef);
    await set(newRef, {
      userId,
      email,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    });
  } catch (err) {
    console.error('Erreur log:', err);
    throw err;
  }
}