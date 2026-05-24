import React, { useState, useRef, useEffect, useCallback } from 'react';
import { HiX } from 'react-icons/hi';
import content from '../../content.json';

const NEOFETCH_ART = `
  ╔═══════════════════════════╗
  ║   ███████╗██╗  ██╗        ║
  ║   ██╔════╝██║  ██║        ║
  ║   ███████╗███████║        ║
  ║   ╚════██║██╔══██║        ║
  ║   ███████║██║  ██║        ║
  ║   ╚══════╝╚═╝  ╚═╝        ║
  ╚═══════════════════════════╝`;

const buildCommands = () => {
  const { general, hero, experience, projects, skills, education } = content;

  const skillsList = skills.categories
    .map(c => `  ${c.name}: ${c.items.join(', ')}`)
    .join('\n');

  const projectsList = projects.items
    .map(p => `  ${p.name} — ${p.description.slice(0, 70)}...`)
    .join('\n');

  const projectDetails = {};
  projects.items.forEach(p => {
    projectDetails[p.name.toLowerCase().replace(/\s+/g, '-')] = [
      `Project: ${p.name}`,
      `Date: ${p.date}`,
      `Description: ${p.description}`,
      `Technologies: ${p.technologies.join(', ')}`,
      p.links.github ? `GitHub: ${p.links.github}` : null,
      p.links.live ? `Live: ${p.links.live}` : null,
    ].filter(Boolean).join('\n');
  });

  const expList = experience.items
    .map(e => `  ${e.title} @ ${e.company} (${e.start_date} – ${e.end_date || 'Present'})`)
    .join('\n');

  const edu = education.items[0];

  return {
    help: `Available commands:
  help          Show this help message
  whoami        Who is Sahir?
  ls projects   List all projects
  cd <project>  View project details
  skills        Show technical skills
  experience    Show work history
  education     Show education
  contact       Get in touch
  cat resume    View resume info
  neofetch      System info
  date          Current date
  echo <text>   Echo text back
  clear         Clear terminal
  history       Show command history

Tip: Use ↑/↓ arrows to cycle through command history`,

    whoami: `${hero.name}
  Role: ${experience.items[0].title} @ ${experience.items[0].company}
  Focus: ${hero.sub_narrative}
  Motto: ${hero.narrative}
  Location: ${general.location}`,

    'ls projects': `total ${projects.items.length}
${projectsList}

Type 'cd <project-name>' for details (use dashes for spaces)`,

    skills: `Technical Skills:
${skillsList}`,

    experience: `Work Experience:
${expList}`,

    education: `Education:
  ${edu.school}
  ${edu.degree}
  Graduated: ${edu.graduation_date}
  Coursework: ${edu.coursework.join(', ')}`,

    contact: `Contact:
  Email: ${general.email}
  GitHub: ${general.social_links.github}
  LinkedIn: ${general.social_links.linkedin}`,

    'cat resume': `Resume: ${general.resume_url}
Download at: ${window.location.origin}${general.resume_url}

For full details, type 'experience', 'skills', or 'education'`,

    neofetch: `${NEOFETCH_ART}
  sahir@portfolio
  ────────────────
  OS: Web Portfolio v2.0
  Shell: React ${React.version}
  Theme: Terminal Dark
  Stack: React, CSS, JSON
  Role: Data & AI Engineer
  Location: ${general.location}
  Uptime: Since Dec 2024`,

    date: new Date().toString(),

    projectDetails,
  };
};

const LiveTerminal = ({ isOpen, onClose }) => {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const commands = useRef(buildCommands()).current;

  useEffect(() => {
    if (isOpen) {
      setLines([
        { type: 'output', text: "Welcome to Sahir's terminal. Type 'help' to get started." },
      ]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines]);

  // Lock body scroll on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const executeCommand = useCallback((cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const newLines = [
      ...lines,
      { type: 'prompt', text: trimmed },
    ];

    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    if (trimmed === 'clear') {
      setLines([]);
      return;
    }

    if (trimmed === 'history') {
      const historyText = commandHistory.length > 0
        ? commandHistory.map((c, i) => `  ${i + 1}  ${c}`).join('\n')
        : '  No commands in history';
      setLines([...newLines, { type: 'output', text: historyText }]);
      return;
    }

    if (trimmed.startsWith('echo ')) {
      setLines([...newLines, { type: 'output', text: trimmed.slice(5) }]);
      return;
    }

    if (trimmed.startsWith('cd ')) {
      const projectName = trimmed.slice(3).trim().toLowerCase().replace(/\s+/g, '-');
      if (projectName === '~' || projectName === '..') {
        setLines([...newLines, { type: 'output', text: '~' }]);
        return;
      }
      const detail = commands.projectDetails[projectName];
      if (detail) {
        setLines([...newLines, { type: 'output', text: detail }]);
      } else {
        const available = Object.keys(commands.projectDetails).join(', ');
        setLines([...newLines, { type: 'output', text: `cd: no such project: ${projectName}\nAvailable: ${available}` }]);
      }
      return;
    }

    if (trimmed === 'date') {
      setLines([...newLines, { type: 'output', text: new Date().toString() }]);
      return;
    }

    const output = commands[trimmed];
    if (output) {
      setLines([...newLines, { type: 'output', text: output }]);
    } else {
      setLines([...newLines, { type: 'output', text: `command not found: ${trimmed}\nType 'help' for available commands` }]);
    }
  }, [lines, commandHistory, commands]);

  const handleSubmit = (e) => {
    e.preventDefault();
    executeCommand(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIndex = historyIndex === -1
        ? commandHistory.length - 1
        : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="live-terminal__overlay" onClick={onClose}>
      <div className="live-terminal" onClick={(e) => e.stopPropagation()}>
        <div className="live-terminal__header">
          <div className="live-terminal__dots">
            <span className="terminal-shell__dot terminal-shell__dot--red" />
            <span className="terminal-shell__dot terminal-shell__dot--yellow" />
            <span className="terminal-shell__dot terminal-shell__dot--green" />
          </div>
          <span className="live-terminal__title">sahir@portfolio: ~</span>
          <button className="live-terminal__close" onClick={onClose}>
            <HiX size={16} />
          </button>
        </div>

        <div className="live-terminal__body" ref={scrollRef} onClick={() => inputRef.current?.focus()}>
          {lines.map((line, i) => (
            <div key={i} className={`live-terminal__line live-terminal__line--${line.type}`}>
              {line.type === 'prompt' && (
                <span className="live-terminal__prompt-prefix">
                  <span className="term-block__user">sahir</span>
                  <span className="term-block__at">@</span>
                  <span className="term-block__host">portfolio</span>
                  <span className="term-block__sep">:</span>
                  <span className="term-block__path">~</span>
                  <span className="term-block__dollar"> $ </span>
                </span>
              )}
              <span className="live-terminal__text">{line.text}</span>
            </div>
          ))}

          <form className="live-terminal__input-line" onSubmit={handleSubmit}>
            <span className="live-terminal__prompt-prefix">
              <span className="term-block__user">sahir</span>
              <span className="term-block__at">@</span>
              <span className="term-block__host">portfolio</span>
              <span className="term-block__sep">:</span>
              <span className="term-block__path">~</span>
              <span className="term-block__dollar"> $ </span>
            </span>
            <input
              ref={inputRef}
              type="text"
              className="live-terminal__input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default LiveTerminal;
