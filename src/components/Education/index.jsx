'use client';

import React from 'react';
import Image from 'next/image';
import styles from './Education.module.scss';

const educationData = [
  {
    id: 1,
    title: "Bachelor of Technology",
    major: "Electronics and Communication",
    school: "Deenbandhu Chhotu Ram University of Science and Technology | DCRUST",
    date: "2019 - 2023",
    score: "CGPA: 8.80",
    image: "/images/educat/college.png"
  },
  {
    id: 2,
    title: "Senior Secondary Education",
    major: "Science",
    school: "Govt. Sr. Sec. School, Hansi | HBSE",
    date: "2016-2018",
    score: "88.2%",
    image: "/images/educat/school.png"
  }
];

export const Education = () => {
  return (
    <section className={styles.education} id="education">
      <h2 className={styles.heading}>
        <i className="fas fa-graduation-cap" aria-hidden="true"></i> My <span>Education</span>
      </h2>
      <p className={styles.quote}>
        "Education is not the learning of facts, but the training of the mind to think."
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
