'use client';

import { LINKEDIN_URL } from '@/constants/constants';
import styles from './Footer.module.scss';
import { sectionQuickLinks, footerContactInfo, socialLinks } from '@/data/layout/common';

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
            Thanks for stopping by! <br/>Let’s connect and build something amazing together.
          </p>
        </div>

        {/* Quick Links */}
        <div className={styles.box}>
          <h3>Quick Links</h3>
          <div className={styles.links}>
            {sectionQuickLinks.map((link) => (
              <button key={link.id} onClick={() => scrollToSection(link.id)}>
                <i className={link.iconClass} aria-hidden="true"></i> {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className={styles.box}>
          <h3>Contact Info</h3>
          <div className={styles.contactInfo}>
            {footerContactInfo.map((info) => (
              <p key={info.label}>
                <i className={info.iconClass} aria-hidden="true"></i>{' '}
                <a href={info.href}>{info.value}</a>
              </p>
            ))}
          </div>
          <div className={styles.socials}>
            {socialLinks.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.className}
                className={styles[social.className]}
              >
                <i className={social.icon} aria-hidden="true"></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.credit}>
        <p>
          Designed with <i className="fa fa-heart" aria-hidden="true" style={{ color: '#ff3366' }}></i> by{' '}
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            Ankit Bhujeja
          </a>
        </p>
      </div>
    </footer>
  );
};
