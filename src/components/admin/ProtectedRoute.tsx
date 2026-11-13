import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingScreen from '../ui/LoadingScreen';
import AdminInactivityGuard from './AdminInactivityGuard';

interface Props {
  children: ReactNode;
}

// 🔒 Liste blanche des UID admins autorisés
// Pour ajouter un admin, ajoute son UID ici (visible dans Firebase Console)
const ADMIN_UIDS = [
  'xcKzNPzs3mhh711A5IcOE2d9HO53',
  // 'AUTRE_UID_ADMIN_SI_BESOIN',
];

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // 1. Pas connecté → redirection login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // 2. Connecté mais pas dans la liste blanche → redirection accueil
  if (!ADMIN_UIDS.includes(user.uid)) {
    console.warn('Accès admin refusé pour l\'UID:', user.uid);
    return <Navigate to="/" replace />;
  }

  // 3. Connecté + autorisé → accès OK
  return <AdminInactivityGuard>{children}</AdminInactivityGuard>;
}
