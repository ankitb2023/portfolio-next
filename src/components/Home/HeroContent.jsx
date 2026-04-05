"use client";
import React, { useState, useEffect } from 'react';
import { AnimatedButton } from '../common/AnimatedButton';
import styles from './HeroContent.module.scss';
import { useTypewriter } from '../../customhook/useTypewriter';

const SCROLLING_SKILLS = [
  "Problem Solving (DSA)",
  "Frontend Engineering (React)",
  "SSR & Performance (Next.js)",
  "Backend APIs (Spring Boot)",
  "Scalable System Design"
];

const ROTATING_SECTIONS = [
  { id: 'about', label: 'About Me' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' }
];

export const HeroContent = () => {
  const typedText = useTypewriter(SCROLLING_SKILLS);
  const [sectionIndex, setSectionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSectionIndex((prev) => (prev + 1) % ROTATING_SECTIONS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const currentSection = ROTATING_SECTIONS[sectionIndex];

  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

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
      <AnimatedButton
        href={`#${currentSection.id}`}
        onClick={(e) => handleScroll(e, currentSection.id)}
        iconClass="fas fa-arrow-circle-down"
        ariaLabel={`${currentSection.label} section`}
        containerClassName={styles.heroBtnSpacing}
      >
        <span className={styles.rotatingTextContainer}>
          <span key={currentSection.id} className={styles.rotatingText}>
            {currentSection.label}
          </span>
        </span>
      </AnimatedButton>
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
