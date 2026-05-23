import React from 'react';
import { Fade } from 'react-awesome-reveal';
import content from '../../content.json';
import Button from '../ui/Button';
import TerminalBlock from '../ui/TerminalBlock';

const Contact = () => {
  const { contact, general } = content;

  if (!contact.enable_section) return null;

  return (
    <TerminalBlock command='echo "Let&apos;s connect"' id={contact.section_id}>
      <Fade triggerOnce cascade damping={0.1}>
        <div className="term-contact-line">
          <span className="term-contact-label">Email:</span>
          <span className="term-contact-value">
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </span>
        </div>
        <div className="term-contact-line">
          <span className="term-contact-label">GitHub:</span>
          <span className="term-contact-value">
            <a href={general.social_links.github} target="_blank" rel="noopener noreferrer">
              github.com/SahirHameed
            </a>
          </span>
        </div>
        <div className="term-contact-line">
          <span className="term-contact-label">LinkedIn:</span>
          <span className="term-contact-value">
            <a href={general.social_links.linkedin} target="_blank" rel="noopener noreferrer">
              linkedin.com/in/sahirhameed
            </a>
          </span>
        </div>

        <div className="term-contact-prompt">
          <span>&gt; Send a message?</span>
          <Button href={`mailto:${contact.email}`} variant="primary" size="sm">
            [Y] Let's talk
          </Button>
        </div>
      </Fade>
    </TerminalBlock>
  );
};

export default Contact;
