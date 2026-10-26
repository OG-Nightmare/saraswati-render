import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 * Automatically resets scroll position to the top of the window on every route change.
 * Uses 'instant' behavior to ensure the user lands directly at the top with 0 delay.
 * Respects in-page anchor hashes (e.g., #featured-showcase).
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Instantly scroll to the top of the page on route transition
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname, hash]);

  return null;
}
