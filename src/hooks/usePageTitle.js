import { useEffect } from 'react';

const SECTION_TITLES = {
  '': 'Sahir Hameed',
  'about': 'Sahir Hameed | My Story',
  'experience': 'Sahir Hameed | Journey',
  'projects': 'Sahir Hameed | Projects',
  'skills': 'Sahir Hameed | Skills',
  'vibes': 'Sahir Hameed | Currently Into',
  'contact': "Sahir Hameed | Let's Talk",
};

const usePageTitle = () => {
  useEffect(() => {
    const sectionIds = ['about', 'experience', 'projects', 'skills', 'vibes', 'contact'];
    const NAVBAR_HEIGHT = 80;

    const handleScroll = () => {
      if (window.scrollY < 200) {
        document.title = SECTION_TITLES[''];
        return;
      }

      const scrollPosition = window.scrollY + NAVBAR_HEIGHT + 100;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollPosition) {
          document.title = SECTION_TITLES[sectionIds[i]] || SECTION_TITLES[''];
          return;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};

export default usePageTitle;
