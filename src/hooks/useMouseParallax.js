import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for smooth mouse-based parallax effects
 * Returns normalized offset values for different depth layers
 */
const useMouseParallax = (options = {}) => {
  const {
    sensitivity = 1,
    smoothing = 0.1,
    enabled = true
  } = options;

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });
  const animationFrame = useRef(null);

  // Smooth animation loop
  const animate = useCallback(() => {
    setMousePosition(prev => {
      const dx = (targetPosition.current.x - prev.x) * smoothing;
      const dy = (targetPosition.current.y - prev.y) * smoothing;

      // Only update if there's meaningful change
      if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
        return prev;
      }

      return {
        x: prev.x + dx,
        y: prev.y + dy
      };
    });

    animationFrame.current = requestAnimationFrame(animate);
  }, [smoothing]);

  // Handle mouse movement
  const handleMouseMove = useCallback((e) => {
    if (!enabled) return;

    // Calculate position relative to viewport center (-1 to 1)
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    targetPosition.current = {
      x: ((e.clientX - centerX) / centerX) * sensitivity,
      y: ((e.clientY - centerY) / centerY) * sensitivity
    };
  }, [enabled, sensitivity]);

  // Handle mouse leave - return to center
  const handleMouseLeave = useCallback(() => {
    targetPosition.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [enabled, handleMouseMove, handleMouseLeave, animate]);

  // Return offset values for different depth layers
  // Layer 0: Background (slowest) - 5% movement
  // Layer 1: Mid-back - 10% movement
  // Layer 2: Midground - 15% movement
  // Layer 3: Foreground (fastest) - 25% movement
  const getLayerOffset = useCallback((layer = 0, multiplier = 1) => {
    const depthMultipliers = [0.05, 0.10, 0.15, 0.25];
    const depth = depthMultipliers[Math.min(layer, 3)] * multiplier;

    return {
      x: mousePosition.x * depth * 100, // Convert to pixels
      y: mousePosition.y * depth * 100,
      transform: `translate(${mousePosition.x * depth * 100}px, ${mousePosition.y * depth * 100}px)`
    };
  }, [mousePosition]);

  // Get rotation based on mouse position (for tilt effects)
  const getTiltRotation = useCallback((intensity = 1) => {
    const rotateX = mousePosition.y * -10 * intensity; // Tilt on X axis based on Y position
    const rotateY = mousePosition.x * 10 * intensity;  // Tilt on Y axis based on X position

    return {
      rotateX,
      rotateY,
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    };
  }, [mousePosition]);

  return {
    mousePosition,
    getLayerOffset,
    getTiltRotation,
    isMoving: Math.abs(mousePosition.x) > 0.01 || Math.abs(mousePosition.y) > 0.01
  };
};

export default useMouseParallax;
