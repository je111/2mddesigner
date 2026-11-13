import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ADMIN_IDLE_TIMEOUT_MS = 1 * 60 * 1000;
const ACTIVITY_THROTTLE_MS = 1000;

export default function AdminInactivityGuard({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let lastActivityAt = 0;
    let loggingOut = false;

    const logoutAfterInactivity = async () => {
      if (loggingOut) return;
      loggingOut = true;
      try {
        await logout();
      } catch (error) {
        console.error('Échec de la déconnexion après inactivité :', error);
      } finally {
        navigate('/admin/login', { replace: true });
      }
    };

    const resetTimeout = () => {
      timeoutId = setTimeout(() => {
        void logoutAfterInactivity();
      }, ADMIN_IDLE_TIMEOUT_MS);
    };

    const onActivity = () => {
      const now = Date.now();
      if (now - lastActivityAt < ACTIVITY_THROTTLE_MS) return;
      lastActivityAt = now;
      clearTimeout(timeoutId);
      resetTimeout();
    };

    resetTimeout();
    const activityEvents: (keyof WindowEventMap)[] = [
      'pointerdown',
      'pointermove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ];
    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, onActivity, { passive: true });
    });

    return () => {
      clearTimeout(timeoutId);
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, onActivity);
      });
    };
  }, [logout, navigate]);

  return <>{children}</>;
}

