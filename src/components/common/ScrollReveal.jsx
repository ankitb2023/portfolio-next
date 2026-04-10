'use client';
import { useScrollReveal } from '@/customhook/useScrollReveal';

/**
 * Thin client wrapper that adds scroll-reveal animation to any section.
 * Drop-in: wrap any server/client component with <ScrollReveal>.
 */
export function ScrollReveal({ children, className = '', threshold = 0.1, rootMargin = '-50px 0px -50px 0px', as: Tag = 'div', ...props }) {
  const { ref, isRevealed } = useScrollReveal({ threshold, rootMargin });
  const classes = `scroll-reveal ${isRevealed ? 'revealed' : ''} ${className}`.trim();

  return (
    <Tag ref={ref} className={classes} {...props}>
      {children}
    </Tag>
  );
}
