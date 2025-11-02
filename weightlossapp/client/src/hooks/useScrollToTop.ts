import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Hook to scroll to top of page when route changes
 * Uses multiple strategies to ensure scroll works across all scenarios
 */
export function useScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Strategy 1: Immediate scroll
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Execute immediately
    scrollToTop();

    // Strategy 2: After next paint (for React 18+ concurrent features)
    requestAnimationFrame(() => {
      scrollToTop();
    });

    // Strategy 3: After a small delay to catch any async rendering
    const timeoutId = setTimeout(() => {
      scrollToTop();
    }, 50);

    // Strategy 4: After a longer delay as final fallback
    const fallbackTimeoutId = setTimeout(() => {
      scrollToTop();
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(fallbackTimeoutId);
    };
  }, [location]);
}

