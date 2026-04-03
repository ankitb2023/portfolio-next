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
        <div className={styles.btnContainer}>
          <div className={styles.btnAnimatedBorder}></div>
          <Link href="#about" className={styles.btn} aria-label="About Me section">
            <span>About Me</span> <i className="fas fa-arrow-circle-down" aria-hidden="true"></i>
          </Link>
        </div>
      <nav className={styles.socials} aria-label="Social Links">
        <ul className={styles.socialIcons}>
          <li>
            <a className={styles.socialIcon} href="https://www.linkedin.com/in/ankit-bhujeja/" target="_blank" rel="noopener noreferrer">
              <span className={styles.iconWrapper}><i className="fab fa-linkedin" aria-hidden="true"></i></span>
              <span className={styles.socialName}>LinkedIn</span>
            </a>
          </li>
          <li>
            <a className={styles.socialIcon} href="https://github.com/AnkitBhujeja" target="_blank" rel="noopener noreferrer">
              <span className={styles.iconWrapper}><i className="fab fa-github" aria-hidden="true"></i></span>
              <span className={styles.socialName}>GitHub</span>
            </a>
          </li>
          <li>
            <a className={styles.socialIcon} href="mailto:ankitbhujeja2468@gmail.com" target="_blank" rel="noopener noreferrer">
              <span className={styles.iconWrapper}><i className="fas fa-envelope" aria-hidden="true"></i></span>
              <span className={styles.socialName}>Email</span>
            </a>
          </li>
          <li>
            <a className={styles.socialIcon} href="https://t.me/abhujeja" target="_blank" rel="noopener noreferrer">
              <span className={styles.iconWrapper}><i className="fab fa-telegram-plane" aria-hidden="true"></i></span>
              <span className={styles.socialName}>Telegram</span>
            </a>
          </li>
          <li>
            <a className={styles.socialIcon} href="https://www.instagram.com/ankit_bhujeja" target="_blank" rel="noopener noreferrer">
              <span className={styles.iconWrapper}><i className="fab fa-instagram" aria-hidden="true"></i></span>
              <span className={styles.socialName}>Instagram</span>
            </a>
          </li>
        </ul>
      </nav>
    </article>
  );
};
