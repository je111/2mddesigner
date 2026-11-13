import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoading } from '../../hooks/useLoading';

export default function RouteLoadingBridge() {
  const location = useLocation();
  const { showLoading, hideLoading } = useLoading();
  const navigationStarted = useRef(false);
  const fallbackTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleInternalLinkClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest('a[href]');
      if (!(link instanceof HTMLAnchorElement) || link.target === '_blank' || link.hasAttribute('download')) return;

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === location.pathname && destination.search === location.search) return;

      navigationStarted.current = true;
      showLoading();
      window.clearTimeout(fallbackTimer.current);
      fallbackTimer.current = window.setTimeout(() => {
        navigationStarted.current = false;
        hideLoading();
      }, 8000);
    };

    document.addEventListener('click', handleInternalLinkClick, true);
    return () => {
      document.removeEventListener('click', handleInternalLinkClick, true);
      window.clearTimeout(fallbackTimer.current);
    };
  }, [hideLoading, location.pathname, location.search, showLoading]);

  useEffect(() => {
    if (!navigationStarted.current) return;

    const timer = window.setTimeout(() => {
      navigationStarted.current = false;
      window.clearTimeout(fallbackTimer.current);
      hideLoading();
    }, 180);

    return () => window.clearTimeout(timer);
  }, [hideLoading, location.key]);

  return null;
}
