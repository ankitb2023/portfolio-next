'use client';

import React, { useState } from 'react';
import { AnimatedButton } from '../common/AnimatedButton';
import styles from './Experience.module.scss';

import { experienceData } from '@/data/experience';

export const Experience = ({ showAll = false }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayedExperienceData = showAll ? experienceData : experienceData.slice(0, 5);

  return (
    <section className={styles.experience} id="experience">
      <h2 className={styles.heading}>
        <i className="fas fa-briefcase" aria-hidden="true"></i> Professional <span>Journey</span>
      </h2>

      <div className={styles.timeline}>
        {displayedExperienceData.map((exp, index) => {
          const isLeft = index % 2 === 0;
          const isActive = activeIndex === index;

          return (
            <div
              key={index}
              className={`${styles.timelineNode} ${isLeft ? styles.leftNode : styles.rightNode} ${isActive ? styles.active : ''
                }`}
              onClick={() => setActiveIndex(index)}
            >
              <div className={styles.breakpointContainer}>
                <div className={styles.breakpoint}>
                  <i className={exp.icon} aria-hidden="true"></i>
                </div>
                {/* Visual Line connector from icon to card */}
                <div className={styles.connector}></div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{exp.company}</h3>
                </div>
                <div className={styles.cardBody}>
                  <h4>{exp.role}</h4>
                  <p className={styles.duration}>
                    <i className="far fa-calendar-alt" aria-hidden="true"></i> {exp.duration}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.moreBtn}>
        {showAll ? (
          <AnimatedButton href="/" iconClass="fas fa-arrow-left" ariaLabel="Back To Home">
            Back To Home
          </AnimatedButton>
        ) : (
          <AnimatedButton href="/experience" iconClass="fas fa-arrow-right" ariaLabel="View All Experience">
            View All
          </AnimatedButton>
        )}
      </div>
    </section>
  );
};
