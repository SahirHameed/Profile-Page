import { useEffect, useCallback } from 'react';

/**
 * Custom hook to handle hash-based navigation
 * Scrolls to section on hash change and page load
 */
const useHashNavigation = (navbarHeight = 80) => {

  const scrollToHash = useCallback((hash) => {
    if (!hash) return;

    const elementId = hash.replace('#', '');
    const element = document.getElementById(elementId);

    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, [navbarHeight]);

  // Handle hash change events (browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      scrollToHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [scrollToHash]);

  // Handle initial page load with hash
  useEffect(() => {
    if (window.location.hash) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        scrollToHash(window.location.hash);
      }, 100);
    }
  }, [scrollToHash]);

  // Navigate to a section programmatically
  const navigateToSection = useCallback((sectionId) => {
    const hash = sectionId.startsWith('#') ? sectionId : `#${sectionId}`;

    // Update URL
    window.history.pushState(null, '', hash);

    // Scroll to section
    scrollToHash(hash);
  }, [scrollToHash]);

  return { navigateToSection, scrollToHash };
};

export default useHashNavigation;
