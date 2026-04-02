import React from 'react';
import styles from './TechNodes.module.scss';

const techNodesData = [
  { id: 'js', name: 'JavaScript', icon: 'fab fa-js', color: '#f7df1e', borderColor: 'rgba(247, 223, 30, 0.4)' },
  { id: 'react', name: 'React', icon: 'fab fa-react', color: '#61dafb', borderColor: 'rgba(97, 218, 251, 0.4)' },
  { id: 'ts', name: 'TypeScript', icon: 'fas fa-file-code', color: '#3178c6', borderColor: 'rgba(49, 120, 198, 0.4)' },
  { id: 'next', name: 'Next.js', icon: 'fab fa-node-js', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.3)' },
  { id: 'java', name: 'Java', icon: 'fab fa-java', color: '#f89820', borderColor: 'rgba(248, 152, 32, 0.4)' },
  { id: 'spring', name: 'Spring', icon: 'fas fa-leaf', color: '#6db33f', borderColor: 'rgba(109, 179, 63, 0.4)' },
  { id: 'docker', name: 'Docker', icon: 'fab fa-docker', color: '#2496ed', borderColor: 'rgba(36, 150, 237, 0.4)' },
  { id: 'git', name: 'Git', icon: 'fab fa-git-alt', color: '#f05032', borderColor: 'rgba(240, 80, 50, 0.4)' },
];

export const TechNodes = () => {
  return (
    <div className={styles.techScatteredContainer}>
      {techNodesData.map((node) => (
        <div 
          key={node.id}
          className={`${styles.techNode} ${styles[`pos${node.id.charAt(0).toUpperCase() + node.id.slice(1)}`]}`} 
          style={{ color: node.color, borderColor: node.borderColor }} 
          title={node.name}
        >
          <i className={node.icon}></i> <span>{node.name}</span>
        </div>
      ))}
    </div>
  );
};
