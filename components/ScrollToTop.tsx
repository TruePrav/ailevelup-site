'use client';

import { useEffect } from 'react';

/**
 * Runs on mount — scrolls to top instantly AND strips any URL hash
 * so the browser never auto-scrolls to an anchor on page load.
 */
export default function ScrollToTop() {
  useEffect(() => {
    // Strip hash from URL without triggering a navigation/scroll
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    // Force scroll to top — overrides any residual browser scroll restoration
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);
  return null;
}
