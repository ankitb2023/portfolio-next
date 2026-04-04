import React from 'react';
import { HeroContent } from './HeroContent';
import { TerminalCard } from './TerminalCard';
import { TechNodes } from './TechNodes';
import styles from './Home.module.scss';

export const Home = () => {
  return (
    <section className={styles.home} id="home">
      {/* Subtle animated vertical lines background */}
      <div className={styles.bgLines} aria-hidden="true"></div>
      
      <HeroContent />
      
      <div className={styles.image}>
        <div className={styles.graphicContainer}>
          {/* Purple radial glow behind image/card */}
          <div className={styles.cardGlowEffect} aria-hidden="true"></div>

          <TerminalCard />
          <TechNodes />
        </div>
      </div>
    </section>
  );
};
