import { useState, useEffect } from 'react';

/**
 * Stagger animation for lists
 * DataDog-style: items appear with slight delay
 */
export function useStaggerAnimation(items: any[], delay = 50) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount < items.length) {
      const timer = setTimeout(() => {
        setVisibleCount(visibleCount + 1);
      }, delay);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [visibleCount, items.length, delay]);

  return (index: number) => ({
    opacity: index < visibleCount ? 1 : 0,
    transform: index < visibleCount ? 'translateY(0)' : 'translateY(4px)',
    transition: 'opacity 200ms, transform 200ms',
  });
}

/**
 * Smooth scroll to element
 */
export function smoothScrollTo(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}

/**
 * Number counter animation
 * For stat panels
 */
export function useCountUp(end: number, duration = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) {
        startTime = currentTime;
      }
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
}

/**
 * Check if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}
