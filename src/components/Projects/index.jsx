import Image from 'next/image';
import { AnimatedButton } from '../common/AnimatedButton';
import styles from './Projects.module.scss';

import { projectsData } from '@/data/projects';

export const Projects = ({ showAll = false }) => {
  const displayedProjects = showAll ? projectsData : projectsData.slice(0, 6);

  return (
    <section className={styles.projects} id="work">
      <h2 className={styles.heading}>
        <i className="fas fa-laptop-code" aria-hidden="true"></i> What I've <span>Built</span>
      </h2>
      
      <div className={styles.grid}>
        {displayedProjects.map((project, index) => (
          <div className={styles.card} key={index}>
            <div className={styles.imageContainer}>
              <Image 
                src={project.imgSrc} 
                alt={project.title} 
                fill
                style={{ objectFit: 'cover', objectPosition: 'top' }}
                draggable="false"
                unoptimized
              />
            </div>
            
            <div className={styles.persistentTitle}>
              <h3>{project.title}</h3>
            </div>

            <div className={styles.overlay}>
              <div className={styles.content}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className={styles.btns}>
                  <a
                    href={project.viewLink}
                    className={styles.btn}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fas fa-eye" aria-hidden="true"></i> View
                  </a>
                  <a
                    href={project.codeLink}
                    className={styles.btn}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Code <i className="fas fa-code" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.viewAllContainer}>
        {showAll ? (
          <AnimatedButton href="/" iconClass="fas fa-arrow-left" ariaLabel="Back To Home">
            Back To Home
          </AnimatedButton>
        ) : (
          <AnimatedButton href="/projects" iconClass="fas fa-arrow-right" ariaLabel="View All Projects">
            View All
          </AnimatedButton>
        )}
      </div>
    </section>
  );
};
