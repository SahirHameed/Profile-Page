import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch } from 'react-icons/hi';
import { FaRocket, FaUser, FaBriefcase, FaCode, FaTools, FaEnvelope, FaFileAlt, FaStar, FaTerminal } from 'react-icons/fa';
import content from '../../content.json';

const buildSearchItems = () => {
  const items = [];

  // Navigation sections
  const sections = [
    { name: 'Home', icon: <FaRocket />, action: 'scroll', target: 'home', category: 'Navigate' },
    { name: 'My Story', icon: <FaUser />, action: 'scroll', target: 'about', category: 'Navigate' },
{ name: 'Experience', icon: <FaBriefcase />, action: 'scroll', target: 'experience', category: 'Navigate' },
    { name: 'Projects', icon: <FaCode />, action: 'scroll', target: 'projects', category: 'Navigate' },
    { name: 'Skills', icon: <FaTools />, action: 'scroll', target: 'skills', category: 'Navigate' },
    { name: 'Contact', icon: <FaEnvelope />, action: 'scroll', target: 'contact', category: 'Navigate' },
    { name: 'Download Resume', icon: <FaFileAlt />, action: 'download', target: content.general.resume_url, category: 'Navigate' },
    { name: 'Open Terminal', icon: <FaTerminal />, action: 'terminal', target: null, category: 'Navigate' },
  ];
  items.push(...sections);

  // Skills
  content.skills.categories.forEach(cat => {
    cat.items.forEach(skill => {
      items.push({
        name: skill,
        icon: <FaTools />,
        action: 'scroll',
        target: 'skills',
        category: `Skill — ${cat.name}`,
        subtitle: cat.name
      });
    });
  });

  // Projects
  content.projects.items.forEach(proj => {
    items.push({
      name: proj.name,
      icon: <FaStar />,
      action: proj.links.github ? 'link' : 'scroll',
      target: proj.links.github || 'projects',
      category: 'Project',
      subtitle: proj.technologies.slice(0, 3).join(', ')
    });
  });

  // Experience
  content.experience.items.forEach(exp => {
    items.push({
      name: `${exp.title} at ${exp.company}`,
      icon: <FaBriefcase />,
      action: 'scroll',
      target: 'experience',
      category: 'Experience',
      subtitle: `${exp.start_date} – ${exp.end_date || 'Present'}`
    });
  });

  return items;
};

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();
  const allItems = useRef(buildSearchItems()).current;

  const filtered = query.trim()
    ? allItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()))
      )
    : allItems.filter(item => item.category === 'Navigate');

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const selected = list.children[selectedIndex];
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const executeItem = useCallback((item) => {
    setIsOpen(false);
    if (item.action === 'scroll') {
      const el = document.getElementById(item.target);
      if (el) {
        const offset = el.offsetTop - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    } else if (item.action === 'download') {
      const a = document.createElement('a');
      a.href = item.target;
      a.download = '';
      a.click();
    } else if (item.action === 'navigate') {
      navigate(item.target);
    } else if (item.action === 'link') {
      window.open(item.target, '_blank', 'noopener,noreferrer');
    } else if (item.action === 'terminal') {
      setTimeout(() => window.dispatchEvent(new Event('openTerminal')), 100);
    }
  }, [navigate]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      executeItem(filtered[selectedIndex]);
    }
  };

  // Group by category
  const grouped = {};
  filtered.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  let flatIndex = -1;

  if (!isOpen) return null;

  return (
    <div className="cmd-palette__overlay" onClick={() => setIsOpen(false)}>
      <div className="cmd-palette" onClick={e => e.stopPropagation()}>
        <div className="cmd-palette__search">
          <HiSearch size={20} className="cmd-palette__search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="cmd-palette__input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search skills, projects, sections..."
          />
          <kbd className="cmd-palette__kbd">esc</kbd>
        </div>

        <div className="cmd-palette__results" ref={listRef}>
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className="cmd-palette__category">{category}</div>
              {items.map((item) => {
                flatIndex++;
                const idx = flatIndex;
                return (
                  <button
                    key={`${item.name}-${idx}`}
                    className={`cmd-palette__item ${idx === selectedIndex ? 'cmd-palette__item--active' : ''}`}
                    onClick={() => executeItem(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <span className="cmd-palette__item-icon">{item.icon}</span>
                    <span className="cmd-palette__item-text">
                      <span className="cmd-palette__item-name">{item.name}</span>
                      {item.subtitle && <span className="cmd-palette__item-sub">{item.subtitle}</span>}
                    </span>
                    <span className="cmd-palette__item-action">↵</span>
                  </button>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="cmd-palette__empty">
              No results for "{query}"
            </div>
          )}
        </div>

        <div className="cmd-palette__footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
