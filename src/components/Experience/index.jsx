'use client';

import React, { useState } from 'react';
import { AnimatedButton } from '../common/AnimatedButton';
import styles from './Experience.module.scss';

const experienceData = [
  {
    company: 'InfoEdge (Naukri.com) India Ltd.',
    role: 'Senior Software Engineer',
    duration: 'November 2025 - Present',
    icon: 'fas fa-laptop-code',
  },
  {
    company: 'Veersa Technologies Pvt. Ltd.',
    role: 'Senior Software Engineer',
    duration: 'July 2023 - November 2025',
    icon: 'fas fa-briefcase',
  },
  {
    company: 'Veersa Technologies Pvt. Ltd.',
    role: 'Software Engineer Intern',
    duration: 'February 2023 - July 2023',
    icon: 'fas fa-code',
  },
  {
    company: 'Oyesters Training Pvt. Ltd.',
    role: 'Full Stack Web Development Intern',
    duration: 'August 2022 - September 2022',
    icon: 'fas fa-server',
  },
  {
    company: 'The Sparks Foundation',
    role: 'Web Development Intern',
    duration: 'January 2021 - February 2021',
    icon: 'fas fa-code',
  },
  {
    company: 'Microsoft Virtual Intern',
    role: 'FutureReady Talent Intern',
    duration: 'December 2021 - February 2022',
    icon: 'fab fa-microsoft',
  },
  {
    company: 'React.js Training',
    role: 'React Trainee',
    duration: 'June 2021 - July 2021',
    icon: 'fab fa-react',
  },
  {
    company: 'Google Cloud Ready Facilitator',
    role: 'Facilitator',
    duration: 'March 2021 - June 2021',
    icon: 'fab fa-google',
  },
  {
    company: 'Coding Club India',
    role: 'Campus Ambassador and Content Writer',
    duration: 'April 2020 - January 2021',
    icon: 'fas fa-pen-nib',
  },
];

export const Experience = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const miniExperienceData = experienceData.slice(0, 5);

  return (
    <section className={styles.experience} id="experience">
      <h2 className={styles.heading}>
        <i className="fas fa-briefcase" aria-hidden="true"></i> Professional <span>Journey</span>
      </h2>

      <div className={styles.timeline}>
        {miniExperienceData.map((exp, index) => {
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
        <AnimatedButton href="#experience" iconClass="fas fa-arrow-right" ariaLabel="View All Experience">
          View All
        </AnimatedButton>
      </div>
    </section>
  );
};
