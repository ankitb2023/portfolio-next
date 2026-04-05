'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatedButton } from '../common/AnimatedButton';
import { InfoCard } from '../common/InfoCard';
import styles from './About.module.scss';

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
            transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        });
    };
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
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.content}>
                    <h3>I'm Ankit</h3>
                    <span className={styles.tag}>
                        Software Engineer | Full Stack Web Developer
                    </span>
                    <p>
                        I am a Software Engineer with over 1.5 years of experience in building scalable full-stack
                        applications. I specialize in Core Java, Spring Boot, and ReactJS, with a heavy focus on
                        modernizing legacy architectures and optimizing performance ecosystems.
                        <br />
                        <br />
                        Throughout my journey, I have successfully optimized complex API integrations and enhanced
                        observability using Elasticsearch and Kibana. I am passionate about driving innovation through
                        automated workflows and delivering high-performance, resilient solutions in fast-paced environments.
                        <br />
                        <br />
                        I excel at translating complex business requirements into elegant technical solutions, focusing
                        on clean code and best practices that scale with the needs of the users.
                    </p>

                    <div className={styles.infoContainer}>
                        <InfoCard
                            label="Email"
                            value="ankitbhujeja2468@gmail.com"
                            iconClass="fas fa-envelope"
                            href="mailto:ankitbhujeja2468@gmail.com?subject=Hi%20Ankit"
                        />
                        <InfoCard
                            label="Place"
                            value="Haryana, India - 125033"
                            iconClass="fas fa-map-marker-alt"
                            href="https://www.google.com/maps/place/Hansi,+Haryana+125033,+India"
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
