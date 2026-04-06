"use client";
import { useState, useEffect } from 'react';
import { smoothScrollTo } from '@/utils/scroll';
import { AnimatedButton } from '../common/AnimatedButton';
import styles from './HeroContent.module.scss';
import { useTypewriter } from '../../customhook/useTypewriter';
import { ROTATING_SECTIONS, SCROLLING_SKILLS } from '@/data/home';
import { socialLinks } from '@/data/layout/common';

export const HeroContent = () => {
  const typedText = useTypewriter(SCROLLING_SKILLS);
  const [sectionIndex, setSectionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSectionIndex((prev) => (prev + 1) % ROTATING_SECTIONS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const currentSection = ROTATING_SECTIONS[sectionIndex];

  const handleScroll = (e, id) => {
    e.preventDefault();
    smoothScrollTo(id);
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
          {socialLinks.map((link) => (
            <li key={link.id}>
              <a className={styles.socialIcon} href={link.href} target="_blank" rel="noopener noreferrer">
                <span className={styles.iconWrapper}><i className={link.icon} aria-hidden="true"></i></span>
                <span className={styles.socialName}>{link.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
};
