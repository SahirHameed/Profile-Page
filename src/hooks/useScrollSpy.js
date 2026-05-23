import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to track which section is currently in view
 * Uses Intersection Observer API for performance
 */
const useScrollSpy = (sectionIds, options = {}) => {
  const [activeSection, setActiveSection] = useState('');
  const { offset = 100, updateHash = true } = options;

  const handleIntersection = useCallback((entries) => {
    // Find the section that is most visible
    const visibleSections = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => {
        // Prefer sections closer to the top of the viewport
        return a.boundingClientRect.top - b.boundingClientRect.top;
      });

    if (visibleSections.length > 0) {
      const topSection = visibleSections[0];
      const sectionId = topSection.target.id;

      if (sectionId !== activeSection) {
        setActiveSection(sectionId);

        // Update URL hash without triggering scroll
        if (updateHash && sectionId) {
          const newHash = `#${sectionId}`;
          if (window.location.hash !== newHash) {
            window.history.replaceState(null, '', newHash);
          }
        }
      }
    }
  }, [activeSection, updateHash]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: `-${offset}px 0px -50% 0px`,
      threshold: [0, 0.1, 0.5]
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Observe all sections
    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds, offset, handleIntersection]);

  return activeSection;
};

export default useScrollSpy;
