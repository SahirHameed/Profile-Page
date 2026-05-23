import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import content from '../../content.json';

const Footer = () => {
  const { footer, general } = content;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__social">
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
            <a
              href={`mailto:${general.social_links.email}`}
              className="icon-link"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
          </div>

          <p className="footer__text">
            {footer.built_with} by{' '}
            <a href={general.social_links.github} target="_blank" rel="noopener noreferrer">
              {footer.copyright}
            </a>
          </p>

          <p className="footer__text">
            &copy; {currentYear} {footer.copyright}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
