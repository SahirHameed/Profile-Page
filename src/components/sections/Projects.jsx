import React, { useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import content from '../../content.json';
import TerminalBlock from '../ui/TerminalBlock';

const Projects = () => {
  const { projects } = content;
  const [expanded, setExpanded] = useState({});

  if (!projects.enable_section) return null;

  const toggle = (i) => setExpanded(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <TerminalBlock command="ls -la ~/projects/" id={projects.section_id}>
      {projects.items.map((project, i) => (
        <Fade key={i} triggerOnce direction="up" delay={i * 100} duration={500}>
          <div className="term-ls-entry" onClick={() => toggle(i)}>
            <span className="term-ls-perms">drwxr-xr-x</span>
            <span className="term-ls-date">{project.date}</span>
            <span className="term-ls-name">{project.name}/</span>
            <span className="term-ls-links">
              {project.links.github && (
                <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="term-ls-link" onClick={e => e.stopPropagation()}>
                  <FaGithub />
                </a>
              )}
              {project.links.live && (
                <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="term-ls-link" onClick={e => e.stopPropagation()}>
                  <FaExternalLinkAlt />
                </a>
              )}
            </span>

            {expanded[i] && (
              <>
                <div className="term-ls-detail">
                  {project.description}
                </div>
                <div className="term-ls-tech">
                  {project.technologies.map((tech, j) => (
                    <span key={j} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </Fade>
      ))}
    </TerminalBlock>
  );
};

export default Projects;
