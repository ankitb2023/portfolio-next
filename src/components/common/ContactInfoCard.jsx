import React from 'react';
import styles from '../Contact/Contact.module.scss';

export const ContactInfoCard = ({ href, iconClass, label, value }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.infoItem}
      aria-label={label}
    >
      <div className={styles.itemIcon}>
        <i className={iconClass} aria-hidden="true"></i>
      </div>
      <div className={styles.itemText}>
        <span>{label}</span>
        <p>{value}</p>
      </div>
    </a>
  );
};
