import React from 'react';
import styles from './InfoCard.module.scss';

export const InfoCard = ({ label, value, iconClass, href }) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={styles.infoCard}>
      <div className={styles.textContainer}>
        <span>{label}:</span> {value}
      </div>
      <div className={styles.iconWrapper}>
        <i className={iconClass} aria-hidden="true"></i>
      </div>
    </a>
  );
};
