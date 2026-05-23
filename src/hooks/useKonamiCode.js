import { useState, useEffect, useCallback, useRef } from 'react';

const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

const useKonamiCode = () => {
  const [activated, setActivated] = useState(false);
  const inputRef = useRef([]);
  const timeoutRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    inputRef.current.push(e.key);

    // Keep only the last N keys
    if (inputRef.current.length > KONAMI_SEQUENCE.length) {
      inputRef.current = inputRef.current.slice(-KONAMI_SEQUENCE.length);
    }

    // Check for match
    const match = inputRef.current.length === KONAMI_SEQUENCE.length &&
      inputRef.current.every((key, i) => key === KONAMI_SEQUENCE[i]);

    if (match) {
      setActivated(true);
      inputRef.current = [];

      // Auto-dismiss after 8 seconds
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setActivated(false), 8000);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [handleKeyDown]);

  const dismiss = useCallback(() => setActivated(false), []);

  return { activated, dismiss };
};

export default useKonamiCode;
