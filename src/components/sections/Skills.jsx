import React from 'react';
import { Fade } from 'react-awesome-reveal';
import content from '../../content.json';
import TerminalBlock from '../ui/TerminalBlock';

const Skills = () => {
  const { skills } = content;
  if (!skills.enable_section) return null;

  return (
    <TerminalBlock command="cat skills.yaml" id={skills.section_id}>
      <Fade triggerOnce cascade damping={0.08}>
        {skills.categories.map((category, i) => (
          <div key={i} className="term-yaml-category">
            <span className="term-yaml-key">{category.name.toLowerCase().replace(/\s+/g, '_')}: </span>
            <span className="term-yaml-inline">
              [
              {category.items.map((skill, j) => (
                <span key={j}>
                  <span className="term-yaml-inline-item">{skill}</span>
                  {j < category.items.length - 1 && <span className="term-yaml-sep">, </span>}
                </span>
              ))}
              ]
            </span>
          </div>
        ))}
      </Fade>
    </TerminalBlock>
  );
};

export default Skills;
