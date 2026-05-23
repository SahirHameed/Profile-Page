import React, { useState, useEffect, useCallback } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi';
import content from '../../content.json';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const { general } = content;
  const NAVBAR_HEIGHT = 80;

  const navLinks = [
    { name: 'My Story', href: '#about' },
    { name: 'Journey', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: "Let's Talk", href: '#contact' },
  ];

  // Handle scroll state and active section detection
  useEffect(() => {
    const sectionIds = ['about', 'experience', 'projects', 'skills', 'contact'];

    const handleScroll = () => {
      // Update scrolled state
      setIsScrolled(window.scrollY > 50);

      // If near the top of page, clear hash — we're at the hero
      if (window.scrollY < 200) {
        if (activeSection !== '') {
          setActiveSection('');
          if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }
        return;
      }

      // Find active section
      const scrollPosition = window.scrollY + NAVBAR_HEIGHT + 100;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollPosition) {
          if (activeSection !== sectionIds[i]) {
            setActiveSection(sectionIds[i]);
            // Update URL hash without triggering scroll
            const newHash = `#${sectionIds[i]}`;
            if (window.location.hash !== newHash) {
              window.history.replaceState(null, '', newHash);
            }
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  // Scroll to section function — gentle smooth scroll
  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - NAVBAR_HEIGHT;
      // Use native smooth scrolling with gentle easing
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      // Update URL
      window.history.pushState(null, '', `#${sectionId}`);
    }
  }, []);

  // Handle nav link click
  const handleNavClick = (e, href) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileMenuOpen(false);
    const sectionId = href.replace('#', '');
    scrollToSection(sectionId);
  };

  // Handle logo click - scroll to top
  const handleLogoClick = (e) => {
    e.preventDefault();
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__container">
          {/* Left - Logo */}
          <div className="navbar__left">
            <button
              className="navbar__logo"
              onClick={handleLogoClick}
              type="button"
            >
              {general.first_name}
              <span className="text-accent">.</span>
            </button>
          </div>

          {/* Center - Nav Links + Resume */}
          <div className={`navbar__center ${isMobileMenuOpen ? 'navbar__center--open' : ''}`}>
            <div className="navbar__nav">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`navbar__link ${activeSection === link.href.replace('#', '') ? 'navbar__link--active' : ''}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.name}
                </a>
              ))}
            </div>
            <Button href={general.resume_url} variant="primary" size="sm" download>
              Resume
            </Button>
          </div>

          {/* Right - Theme Toggle + Social Icons + Cmd K */}
          <div className="navbar__actions">
            <ThemeToggle />
            <button
              className="navbar__cmd-hint"
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
              aria-label="Open command palette"
            >
              <kbd>⌘</kbd><kbd>K</kbd>
            </button>
            <a
              href={general.social_links.github}
              className="icon-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href={general.social_links.linkedin}
              className="icon-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="navbar__mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <HiX size={24} /> : <HiOutlineMenuAlt3 size={24} />}
          </button>
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="navbar__overlay navbar__overlay--visible"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </nav>
  );
};

export default Navbar;
