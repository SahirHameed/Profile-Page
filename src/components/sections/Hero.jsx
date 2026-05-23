import React from 'react';
import { Fade } from 'react-awesome-reveal';
import content from '../../content.json';
import TerminalBlock from '../ui/TerminalBlock';

const floatingSnippets = [
  { code: 'client = Anthropic()', top: '10%', left: '4%', delay: 0 },
  { code: 'SELECT * FROM users;', top: '20%', right: '3%', delay: 2 },
  { code: 'git push origin main', top: '38%', left: '2%', delay: 4 },
  { code: 'model="claude-opus-4"', top: '72%', right: '2%', delay: 6 },
  { code: 'docker build -t app .', top: '80%', left: '5%', delay: 8 },
  { code: 'await fetch("/api/v1")', top: '55%', right: '4%', delay: 3 },
];

const thinkingPhrases = [
  { text: 'Thinking...', top: '14%', right: '14%', delay: 1 },
  { text: 'Analyzing', top: '62%', left: '3%', delay: 7 },
];

const Hero = () => {
  const { hero } = content;
  if (!hero.enable_section) return null;

  return (
    <div className="hero-wrapper" id="top">
      <div className="hero__code-bg" aria-hidden="true">
        {floatingSnippets.map((s, i) => (
          <div key={i} className="hero__code-line" style={{ top: s.top, left: s.left, right: s.right, animationDelay: `${s.delay}s` }}>
            {s.code}
          </div>
        ))}
        {thinkingPhrases.map((p, i) => (
          <div key={`t-${i}`} className="hero__thinking" style={{ top: p.top, left: p.left, right: p.right, animationDelay: `${p.delay}s` }}>
            <span className="hero__thinking-dot" />
            <span className="hero__thinking-dot" />
            <span className="hero__thinking-dot" />
            <span className="hero__thinking-text">{p.text}</span>
          </div>
        ))}
      </div>

      <TerminalBlock command="whoami">
        <Fade triggerOnce cascade damping={0.15}>
          <div className="term-whoami">
            <div className="term-whoami__name">{hero.name}</div>
            <div className="term-whoami__line">
              <span className="term-json__key">motto</span>
              <span className="term-json__colon">: </span>
              <span className="term-json__string">{hero.narrative}</span>
            </div>
            <div className="term-whoami__line">
              <span className="term-json__key">focus</span>
              <span className="term-json__colon">: </span>
              <span className="term-json__string">{hero.sub_narrative}</span>
            </div>
          </div>
        </Fade>
      </TerminalBlock>
    </div>
  );
};

export default Hero;
