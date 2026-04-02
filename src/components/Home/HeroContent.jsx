"use client";
import React from 'react';
import Link from 'next/link';
import styles from './HeroContent.module.scss';
import { useTypewriter } from '../../customhook/useTypewriter';

const SCROLLING_SKILLS = [
  "Problem Solving (DSA)",
  "Frontend Engineering (React)",
  "SSR & Performance (Next.js)",
  "Backend APIs (Spring Boot)",
  "Scalable System Design"
];

export const HeroContent = () => {
  const typedText = useTypewriter(SCROLLING_SKILLS);

  return (
    <article className={styles.content}>
      <h3>
        Hi There,
        <br /> I'm Ankit<span> Bhujeja</span>
      </h3>
      <p>
        I am into{' '}
        <span className={styles.typingText}>
          {typedText}
          <span className={styles.cursor}>|</span>
        </span>
      </p>
      <Link href="#about" className={styles.btn} aria-label="About Me section">
        <span>About Me</span> <i className="fas fa-arrow-circle-down" aria-hidden="true"></i>
      </Link>
      <nav className={styles.socials} aria-label="Social Links">
        <ul className={styles.socialIcons}>
          <li>
            <a className={styles.socialIcon} href="https://www.linkedin.com/in/ankit-bhujeja/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <i className="fab fa-linkedin" aria-hidden="true"></i>
            </a>
          </li>
          <li>
            <a className={styles.socialIcon} href="https://github.com/AnkitBhujeja" target="_blank" rel="noopener noreferrer" title="GitHub">
              <i className="fab fa-github" aria-hidden="true"></i>
            </a>
          </li>
          <li>
            <a className={styles.socialIcon} href="mailto:ankitbhujeja2468@gmail.com" target="_blank" rel="noopener noreferrer" title="Email">
              <i className="fas fa-envelope" aria-hidden="true"></i>
            </a>
          </li>
          <li>
            <a className={styles.socialIcon} href="https://t.me/abhujeja" target="_blank" rel="noopener noreferrer" title="Telegram">
              <i className="fab fa-telegram-plane" aria-hidden="true"></i>
            </a>
          </li>
          <li>
            <a className={styles.socialIcon} href="https://www.instagram.com/ankit_bhujeja" target="_blank" rel="noopener noreferrer" title="Instagram">
              <i className="fab fa-instagram" aria-hidden="true"></i>
            </a>
          </li>
        </ul>
      </nav>
    </article>
  );
};
