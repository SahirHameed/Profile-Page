import React, { useEffect, useRef } from 'react';

const MatrixRain = ({ active, onDismiss }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'SAHIRHAMEED01アイウエオカキクケコサシスセソ<>{}[]|/\\=+*&^%$#@!';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, x) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const isHighlight = Math.random() > 0.96;

        ctx.fillStyle = isHighlight
          ? '#00D4FF'
          : `rgba(249, 115, 22, ${0.3 + Math.random() * 0.5})`;

        ctx.fillText(char, x * fontSize, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[x] = 0;
        }
        drops[x]++;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="matrix-rain" onClick={onDismiss}>
      <canvas ref={canvasRef} className="matrix-rain__canvas" />
      <div className="matrix-rain__message">
        <span className="matrix-rain__glitch" data-text="WELCOME TO THE MATRIX">
          WELCOME TO THE MATRIX
        </span>
        <p className="matrix-rain__sub">You found the easter egg! Click anywhere to exit.</p>
        <p className="matrix-rain__hint">↑↑↓↓←→←→BA</p>
      </div>
    </div>
  );
};

export default MatrixRain;
