'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Lightweight scroll-reveal hook using IntersectionObserver.
 * Toggles a `.revealed` class when the element enters the viewport.
 * One-shot: unobserves after first reveal to avoid work on scroll.
 *
 * @param {{ threshold?: number, rootMargin?: string }} options
 * @returns {{ ref: React.RefObject, isRevealed: boolean }}
 */
export function useScrollReveal({ threshold = 0.1, rootMargin = '-50px 0px -50px 0px' } = {}) {
  const ref = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // Failsafe: If IntersectionObserver is unsupported, default to visible.
    if (typeof window !== 'undefined' && !window.IntersectionObserver) {
      setIsRevealed(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
        } else {
          setIsRevealed(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isRevealed };
}
