import { useEffect } from 'react';

/**
 * Component to hide the Manus assistant badge completely
 * to prevent it from blocking the bottom navigation on mobile devices.
 * 
 * IMPORTANT: Must NOT hide Radix UI portal elements (used by Select, Dialog, etc.)
 */
export default function ManusIconFix() {
  useEffect(() => {
    const hideManusIcon = () => {
      // Find and hide Manus badge elements by specific selectors
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
        });
      });
      
      // On mobile, hide direct body children that are NOT:
      // - #root (our app)
      // - Radix UI portals (used by Select, Dialog, Popover, etc.)
      // - Script/Style tags
      if (window.innerWidth < 1024) {
        const bodyChildren = Array.from(document.body.children);
        bodyChildren.forEach((child) => {
          const el = child as HTMLElement;
          // Skip our app root
          if (child.id === 'root') return;
          // Skip script and style tags
          if (child.tagName === 'SCRIPT' || child.tagName === 'STYLE') return;
          // Skip Radix UI portal elements (Select dropdowns, Dialogs, Popovers, etc.)
          if (el.hasAttribute('data-radix-portal')) return;
          if (el.hasAttribute('data-radix-popper-content-wrapper')) return;
          if (el.getAttribute('role') === 'listbox') return;
          if (el.getAttribute('role') === 'dialog') return;
          if (el.querySelector('[data-radix-popper-content-wrapper]')) return;
          // Skip any element with radix-related attributes
          if (el.className && typeof el.className === 'string' && el.className.includes('radix')) return;
          
          // Hide everything else (Manus badges, etc.)
          el.style.display = 'none';
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
    // But debounce it to avoid interfering with rapid DOM changes (like dropdown opening)
    let debounceTimer: ReturnType<typeof setTimeout>;
    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(hideManusIcon, 300);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: false, // Only watch direct children, not deep subtree
    });

    // Cleanup
    return () => {
      timeoutIds.forEach(clearTimeout);
      clearTimeout(debounceTimer);
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
}
