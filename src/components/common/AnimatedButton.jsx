import React from 'react';
import Link from 'next/link';
import styles from './AnimatedButton.module.scss';

export const AnimatedButton = ({ href, children, iconClass, download, ariaLabel, containerClassName, onClick }) => {
  const content = (
    <>
      <span>{children}</span>
      {iconClass && <i className={iconClass} aria-hidden="true"></i>}
    </>
  );

  const containerClasses = `${styles.btnContainer} ${containerClassName || ''}`;

  return (
    <div className={containerClasses.trim()}>
      <div className={styles.btnAnimatedBorder}></div>
      {download ? (
        <a href={href} download className={styles.btn} aria-label={ariaLabel} onClick={onClick}>
          {content}
        </a>
      ) : (
        <Link href={href} className={styles.btn} aria-label={ariaLabel} onClick={onClick}>
          {content}
        </Link>
      )}
    </div>
  );
};
