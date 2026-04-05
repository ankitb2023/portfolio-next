'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatedButton } from '../common/AnimatedButton';
import styles from './Projects.module.scss';

const projectsData = [
  {
    title: 'Portfolio Website',
    description:
      "Personal portfolio website. Don't need much info about it, just scroll down. You're here only!",
    imgSrc: '/images/projects/featured/portfolio.png',
    viewLink: 'https://abhujeja.netlify.app/',
    codeLink: 'https://github.com/ankitb2023/abhujeja',
  },
  {
    title: 'Technova',
    description:
      'Website for Annual Technical Fest of DCRUST, Murthal. Over 3000 Registrations through it.',
    imgSrc: '/images/projects/featured/technova.png',
    viewLink: 'https://technova22-f21f2.web.app/',
    codeLink: 'https://github.com/Technova22/Technova2k22',
  },
  {
    title: 'Chat Application',
    description:
      'A react application built for chatting. Login with Google or Facebook & enjoy chatting with many features.',
    imgSrc: '/images/projects/featured/chat.png',
    viewLink: 'https://chat-app-dabb6.web.app/signin',
    codeLink: 'https://github.com/ankitb2023/Chat-app',
  },
  {
    title: 'Weather App',
    description:
      'Check the weather status of a city by entering its name or pincode.',
    imgSrc: '/images/projects/featured/weather.png',
    viewLink: 'https://bhujejaweatherapp.netlify.app/',
    codeLink: 'https://github.com/ankitb2023/Weather-App',
  },
  {
    title: 'Box-office',
    description:
      'Shows details about movies and web series, including predictions for upcoming seasons.',
    imgSrc: '/images/projects/featured/boxoffice.png',
    viewLink: 'https://ankitbhujeja.github.io/box-office-lighttheme/',
    codeLink: 'https://github.com/ankitb2023/box-office-lighttheme',
  },
  {
    title: 'Tic Tac Toe Game',
    description:
      'A Classic game created with React.js featuring history of moves and an animated winner display.',
    imgSrc: '/images/projects/featured/tictactoe.png',
    viewLink: 'https://zerokatakhel.netlify.app/',
    codeLink: 'https://github.com/ankitb2023/tictacgame',
  }
]; // Initially mapping just the top 6 for the homepage dashboard

export const Projects = () => {
  return (
    <section className={styles.projects} id="work">
      <h2 className={styles.heading}>
        <i className="fas fa-laptop-code" aria-hidden="true"></i> What I've <span>Built</span>
      </h2>
      
      <div className={styles.grid}>
        {projectsData.map((project, index) => (
          <div className={styles.card} key={index}>
            <div className={styles.imageContainer}>
              <Image 
                src={project.imgSrc} 
                alt={project.title} 
                fill
                style={{ objectFit: 'cover', objectPosition: 'top' }}
                draggable="false"
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
        <AnimatedButton href="#work" iconClass="fas fa-arrow-right" ariaLabel="View All Projects">
          View All
        </AnimatedButton>
      </div>
    </section>
  );
};
