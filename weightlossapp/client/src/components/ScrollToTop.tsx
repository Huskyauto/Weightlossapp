import { useLocation } from 'wouter';
import { useEffect } from 'react';

/**
 * ScrollToTop component that resets scroll position on route change
 * Must be placed inside Router component to work properly
 * Enhanced for mobile browser compatibility
 */
const ScrollToTop = () => {
  const [location] = useLocation();

  useEffect(() => {
    // Mobile browsers need multiple scroll strategies
    const scrollToTop = () => {
      // Strategy 1: Immediate scroll
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Strategy 2: After animation frame (for DOM updates)
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
      
      // Strategy 3: Delayed for mobile browsers (address bar animations)
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 0);
      
      // Strategy 4: Additional delay for stubborn mobile browsers
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 100);
    };
    
    scrollToTop();
  }, [location]);

  return null;
};

export default ScrollToTop;

