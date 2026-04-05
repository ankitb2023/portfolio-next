import Image from 'next/image';
import styles from './Education.module.scss';
import { educationData } from '@/data/education';

export const Education = () => {
  return (
    <section className={styles.education} id="education">
      <h2 className={styles.heading}>
        <i className="fas fa-graduation-cap" aria-hidden="true"></i> Academic <span>Journey</span>
      </h2>
      <p className={styles.quote}>
        "Education is not the learning of facts, but the training of the mind to think."
        <br/>
        — A principle that drives my continuous learning.
      </p>

      <div className={styles.boxContainer}>
        {educationData.map((edu) => (
          <div key={edu.id} className={styles.box}>
            <div className={styles.image}>
              <Image
                src={edu.image}
                alt={edu.school}
                fill
                style={{ objectFit: 'cover' }}
                draggable="false"
              />
            </div>
            <div className={styles.content}>
              <h3>{edu.title} <span>| {edu.major}</span></h3>
              <p>{edu.school}</p>
              <h4>
                {edu.date} <span>| {edu.score}</span>
              </h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
