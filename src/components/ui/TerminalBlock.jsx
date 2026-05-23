import React, { useState, useEffect, useRef } from 'react';

const TerminalBlock = ({ command, children, id, className = '' }) => {
  const [typed, setTyped] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          // Type the command character by character
          let i = 0;
          const interval = setInterval(() => {
            if (i <= command.length) {
              setTyped(command.slice(0, i));
              i++;
            } else {
              clearInterval(interval);
              // Show output after typing finishes
              setTimeout(() => setShowOutput(true), 150);
            }
          }, 20);
          observer.disconnect();
          return () => clearInterval(interval);
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [command, hasAnimated]);

  return (
    <section className={`term-block ${className}`} id={id} ref={ref}>
      <div className="term-block__prompt">
        <span className="term-block__user">sahir</span>
        <span className="term-block__at">@</span>
        <span className="term-block__host">portfolio</span>
        <span className="term-block__sep">:</span>
        <span className="term-block__path">~</span>
        <span className="term-block__dollar">$</span>
        <span className="term-block__command">{typed}</span>
        <span className="term-block__cursor" />
      </div>
      <div className={`term-block__output ${showOutput ? 'term-block__output--visible' : ''}`}>
        {children}
      </div>
    </section>
  );
};

export default TerminalBlock;
