'use client';

import React from 'react';
import styles from './Footer.module.scss';

export const Footer = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Portfolio Info */}
        <div className={styles.box}>
          <h3>Ankit&apos;s Portfolio</h3>
          <p>
            Thank you for visiting my personal portfolio website. Connect with
            me over socials.
          </p>
        </div>

        {/* Quick Links */}
        <div className={styles.box}>
          <h3>Quick Links</h3>
          <div className={styles.links}>
            <button onClick={() => scrollToSection('home')}>
              <i className="fas fa-chevron-circle-right" aria-hidden="true"></i> Home
            </button>
            <button onClick={() => scrollToSection('about')}>
              <i className="fas fa-chevron-circle-right" aria-hidden="true"></i> About
            </button>
            <button onClick={() => scrollToSection('skills')}>
              <i className="fas fa-chevron-circle-right" aria-hidden="true"></i> Skills
            </button>
            <button onClick={() => scrollToSection('education')}>
              <i className="fas fa-chevron-circle-right" aria-hidden="true"></i> Education
            </button>
            <button onClick={() => scrollToSection('work')}>
              <i className="fas fa-chevron-circle-right" aria-hidden="true"></i> Projects
            </button>
            <button onClick={() => scrollToSection('experience')}>
              <i className="fas fa-chevron-circle-right" aria-hidden="true"></i> Experience
            </button>
            <button onClick={() => scrollToSection('contact')}>
              <i className="fas fa-chevron-circle-right" aria-hidden="true"></i> Contact
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className={styles.box}>
          <h3>Contact Info</h3>
          <div className={styles.contactInfo}>
            <p>
              <i className="fas fa-phone" aria-hidden="true"></i>{' '}
              <a href="tel:+919518614811">+91 9518614811</a>
            </p>
            <p>
              <i className="fas fa-envelope" aria-hidden="true"></i>{' '}
              <a href="mailto:ankitbhujeja2468@gmail.com">ankitbhujeja2468@gmail.com</a>
            </p>
            <p>
              <i className="fas fa-map-marked-alt" aria-hidden="true"></i>{' '}
              <a href="https://www.google.com/maps/place/Hansi,+Haryana,+India" target="_blank" rel="noopener noreferrer">Haryana, India - 125033</a>
            </p>
          </div>
          
          <div className={styles.socials}>
            <a href="https://www.linkedin.com/in/ankit-bhujeja/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={styles.linkedin}>
              <i className="fab fa-linkedin" aria-hidden="true"></i>
            </a>
            <a href="https://github.com/AnkitBhujeja" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={styles.github}>
              <i className="fab fa-github" aria-hidden="true"></i>
            </a>
            <a href="mailto:ankitbhujeja2468@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email" className={styles.email}>
              <i className="fas fa-envelope" aria-hidden="true"></i>
            </a>
            <a href="whatsapp://send?text=Hey! I'd like to chat with you.&phone=+919518614811" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={styles.whatsapp}>
              <i className="fab fa-whatsapp" aria-hidden="true"></i>
            </a>
            <a href="https://t.me/abhujeja/" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className={styles.telegram}>
              <i className="fab fa-telegram-plane" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
      
      <div className={styles.credit}>
        <p>
          Designed with <i className="fa fa-heart" aria-hidden="true" style={{ color: '#ff3366' }}></i> by{' '}
          <a href="https://www.linkedin.com/in/ankit-bhujeja/" target="_blank" rel="noopener noreferrer">
            Ankit Bhujeja
          </a>
        </p>
      </div>
    </footer>
  );
};
