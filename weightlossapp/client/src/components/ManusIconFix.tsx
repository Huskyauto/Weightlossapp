import { useEffect } from 'react';

/**
 * Component to hide the Manus assistant badge completely
 * to prevent it from blocking the bottom navigation on mobile devices
 */
export default function ManusIconFix() {
  useEffect(() => {
    const hideManusIcon = () => {
      // Find and hide Manus badge elements
      const selectors = [
        'iframe[src*="manus"]',
        'button[aria-label*="Manus"]',
        'a[aria-label*="Manus"]',
        '[aria-label*="Made with Manus"]',
      ];

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element: Element) => {
          const htmlElement = element as HTMLElement;
          htmlElement.style.display = 'none';
          htmlElement.style.visibility = 'hidden';
          htmlElement.style.opacity = '0';
          htmlElement.style.pointerEvents = 'none';
          htmlElement.remove(); // Actually remove it from DOM
        });
      });
      
      // Also hide any direct body children that aren't #root (on mobile)
      if (window.innerWidth < 1024) {
        const bodyChildren = Array.from(document.body.children);
        bodyChildren.forEach((child) => {
          if (child.id !== 'root' && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
            (child as HTMLElement).style.display = 'none';
          }
        });
      }
    };

    // Run immediately
    hideManusIcon();

    // Run after a short delay to catch dynamically loaded elements
    const timeouts = [100, 500, 1000, 2000];
    const timeoutIds = timeouts.map(delay =>
      setTimeout(hideManusIcon, delay)
    );

    // Set up a MutationObserver to watch for new elements
    const observer = new MutationObserver(hideManusIcon);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup
    return () => {
      timeoutIds.forEach(clearTimeout);
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
}

