'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatedButton } from '../common/AnimatedButton';
import { InfoCard } from '../common/InfoCard';
import styles from './About.module.scss';
import { EMAIL, LOCATION_URL, MAIL_TO_URL, PLACE } from '@/constants/constants';

export const About = () => {
    const [tiltStyle, setTiltStyle] = useState({});

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top; // y position within the element

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation (-15 to 15 degrees)
        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;

        setTiltStyle({
            transform: `scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`,
            transition: 'transform 0.1s ease-out'
        });
    };

    const handleMouseLeave = () => {
        setTiltStyle({
            transform: `scale(1) rotateX(0deg) rotateY(0deg) translateY(0px)`,
            transition: 'transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)'
        });
    };
    const experience = useMemo(() => {
        const start = new Date(2023, 1);
        const now = new Date();
        let years = now.getFullYear() - start.getFullYear();
        let months = now.getMonth() - start.getMonth();
        if (months < 0) {
            years--;
            months += 12;
        }
        const decimal = Math.floor((months / 12) * 10);
        return `${years}.${decimal} years`;
    }, []);

    return (
        <section className={styles.about} id="about">
            <h2 className={styles.heading}>
                <i className="fas fa-user-alt" aria-hidden="true"></i> Beyond the <span>Code</span>
            </h2>

            <div className={styles.row}>
                <div className={styles.imageContainer}>
                    <div className={styles.floatWrapper}>
                        <div
                            className={styles.tiltWrapper}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            style={tiltStyle}
                        >
                            <div className={styles.animatedBorder}></div>
                            <Image
                                src="/images/profileupdated.png"
                                alt="Ankit Bhujeja Profile"
                                width={320}
                                height={400}
                                className={styles.tiltImage}
                                draggable={false}
                                priority
                                style={{ objectFit: 'cover', objectPosition: 'top center' }}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.content}>
                    <h3>I'm Ankit</h3>
                    <span className={styles.tag}>
                        Senior Software Engineer | Full Stack Developer
                    </span>
                    <p>
                        I am a Senior Software Engineer with {experience} of experience building scalable, high-performance full-stack applications.
                        I specialize in Java, Spring Boot, React, and Next.js, with strong foundations in Data Structures, System Design, and modern web architecture.
                        <br /><br />

                        Currently working at Naukri, I have contributed to solving complex real-world problems.
                        My work involves designing efficient APIs, optimizing performance, and improving system reliability through better monitoring, tracking, and observability.
                        <br /><br />

                        {/* I have hands-on experience in integrating payment gateways, building modular and maintainable codebases, and developing robust end-to-end solutions across the stack, including Node.js services where needed.
                        <br /><br /> */}

                        Beyond work, I am deeply passionate about problem-solving, having solved 450+ problems on LeetCode, which strengthens my ability to write efficient and optimized code.
                        I focus on clean architecture, scalability, and delivering impactful solutions that align with business goals.
                    </p>

                    <div className={styles.infoContainer}>
                        <InfoCard
                            label="Email"
                            value={EMAIL}
                            iconClass="fas fa-envelope"
                            href={MAIL_TO_URL}
                        />
                        <InfoCard
                            label="Place"
                            value={PLACE}
                            iconClass="fas fa-map-marker-alt"
                            href={LOCATION_URL}
                        />
                    </div>

                    <div className={styles.resumeBtnWrapper}>
                        <AnimatedButton
                            href="/pdfs/resume.pdf"
                            iconClass="fas fa-chevron-right"
                            download
                            ariaLabel="Download Resume"
                        >
                            Resume
                        </AnimatedButton>
                    </div>
                </div>
            </div>
        </section>
    );
};
