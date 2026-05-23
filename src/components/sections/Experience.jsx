import React, { useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import content from '../../content.json';
import TerminalBlock from '../ui/TerminalBlock';

const VISIBLE_BULLETS = 2;

const genHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i);
  return Math.abs(hash).toString(16).slice(0, 7);
};

const Experience = () => {
  const { experience } = content;
  const items = experience.items;

  const [expandedCards, setExpandedCards] = useState(() => {
    const init = {};
    items.forEach((_, i) => { init[i] = false; });
    return init;
  });

  if (!experience.enable_section) return null;

  const toggleCard = (i) => setExpandedCards(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <TerminalBlock command="git log --oneline --career" id={experience.section_id}>
      {items.map((item, index) => {
        const isExpanded = expandedCards[index];
        const canExpand = item.description.length > VISIBLE_BULLETS;
        const visibleDesc = canExpand && !isExpanded
          ? item.description.slice(0, VISIBLE_BULLETS)
          : item.description;
        const hiddenCount = item.description.length - VISIBLE_BULLETS;
        const hash = genHash(item.company + item.title);

        return (
          <Fade key={index} triggerOnce direction="up" delay={index * 120} duration={600}>
            <div className="term-git-entry">
              <div>
                <span className="term-git-hash">{hash}</span>
                {item.is_current && <span className="term-git-head">(HEAD)</span>}
                <span className="term-git-date">{item.start_date} – {item.end_date || 'Present'}</span>
                <span className="term-git-company">{item.company}</span>
                {' — '}
                <span className="term-git-role">{item.title}</span>
              </div>

              {visibleDesc.map((desc, i) => (
                <div key={i} className="term-git-bullet">- {desc}</div>
              ))}

              {canExpand && (
                <button
                  className="journey__toggle"
                  onClick={() => toggleCard(index)}
                  style={{ marginLeft: '1rem', marginTop: '0.5rem' }}
                >
                  <span className="journey__toggle-text">
                    {isExpanded ? 'Show less' : `+${hiddenCount} more`}
                  </span>
                </button>
              )}

              {item.technologies.length > 0 && (
                <div className="term-git-tags">
                  [{item.technologies.join(', ')}]
                </div>
              )}
            </div>
          </Fade>
        );
      })}
    </TerminalBlock>
  );
};

export default Experience;
