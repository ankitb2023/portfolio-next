import styles from './TechNodes.module.scss';
import { techNodesData } from '@/data/home';

export const TechNodes = () => (
  <div className={styles.techScatteredContainer}>
    {techNodesData.map((node) => (
      <div
        key={node.id}
        className={`${styles.techNode} ${styles[`pos${node.id.charAt(0).toUpperCase() + node.id.slice(1)}`]}`}
        style={{ color: node.color, borderColor: node.borderColor }}
        title={node.name}
      >
        <i className={node.icon} /> <span>{node.name}</span>
      </div>
    ))}
  </div>
);
