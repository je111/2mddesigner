import { lazy, Suspense, type ReactNode } from 'react';
import LoadingScreen from '../ui/LoadingScreen';

const AuthProvider = lazy(() =>
  import('../../contexts/AuthContest').then(({ AuthProvider: Provider }) => ({ default: Provider })),
);

export default function AdminAuthProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AuthProvider>{children}</AuthProvider>
    </Suspense>
  );
}
