import React from 'react';
import { Fade } from 'react-awesome-reveal';
import content from '../../content.json';
import TerminalBlock from '../ui/TerminalBlock';

const buildBar = (progress) => {
  const filled = Math.round(progress / 10);
  const empty = 10 - filled;
  return '[' + '█'.repeat(filled) + '░'.repeat(empty) + '] ' + progress + '%';
};

const CurrentlyInto = () => {
  const { currently_into } = content;
  if (!currently_into?.enable_section) return null;

  return (
    <TerminalBlock command="status --current" id={currently_into.section_id}>
      <Fade triggerOnce cascade damping={0.08}>
        {currently_into.items.map((item, i) => (
          <div key={i} className="term-status-line">
            <span className="term-status-category">{item.category}</span>
            <span className="term-status-title">{item.title}</span>
            <span className="term-status-bar">{buildBar(item.progress)}</span>
            {item.is_live && <span className="term-status-live">LIVE</span>}
          </div>
        ))}
      </Fade>
    </TerminalBlock>
  );
};

export default CurrentlyInto;
