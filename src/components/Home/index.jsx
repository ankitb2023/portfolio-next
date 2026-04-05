import { HeroContent } from './HeroContent';
import { TerminalCard } from './TerminalCard';
import { TechNodes } from './TechNodes';
import styles from './Home.module.scss';

export const Home = () => (
  <section className={styles.home} id="home">
    <div className={styles.bgLines} aria-hidden="true" />
    <HeroContent />
    <div className={styles.image}>
      <div className={styles.graphicContainer}>
        <div className={styles.cardGlowEffect} aria-hidden="true" />
        <TerminalCard />
        <TechNodes />
      </div>
    </div>
  </section>
);
