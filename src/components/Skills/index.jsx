import React from 'react';
import styles from './Skills.module.scss';
import { skillCategories } from '@/data/skills';

export const Skills = () => {
  return (
    <section className={styles.skills} id="skills">
      <h2 className={styles.heading}>
        <i className="fas fa-microchip" aria-hidden="true"></i> Technical <span>Arsenal</span>
      </h2>
      
      <div className={styles.skillsContainer}>
        {skillCategories.map((category, idx) => (
          <div key={idx} className={`${styles.categoryCard} ${idx === 4 ? styles.spanTwo : ''}`}>
            <h3 className={styles.categoryTitle}>{category.title}</h3>
            <div className={styles.skillGrid}>
              {category.skills.map((skill, sIdx) => (
                <div 
                  key={sIdx} 
                  className={styles.skillItem}
                  style={{ '--skill-color': skill.color }}
                >
                  {skill.imgSrc ? (
                    <img src={skill.imgSrc} alt={skill.name} className={styles.skillImage} />
                  ) : (
                    <i className={skill.icon} aria-hidden="true"></i>
                  )}
                  <span>{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
