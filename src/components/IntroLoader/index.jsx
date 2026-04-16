"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./IntroLoader.module.scss";

const FULL_NAME = "Ankit Bhujeja";
const CHAR_DELAY = 95;

export const IntroLoader = () => {
  // Start visible so SSR includes the loader — no content flash
  const [dismissed, setDismissed] = useState(false);
  const [skipLoader, setSkipLoader] = useState(false);
  const [logoReady, setLogoReady] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [exiting, setExiting] = useState(false);
  const cleanupRef = useRef(null);

  useEffect(() => {
    // On hydration, check if we should skip
    const alreadyVisited = sessionStorage.getItem("ab_intro_shown");
    if (alreadyVisited) {
      setSkipLoader(true);
      setDismissed(true);
      return;
    }

    sessionStorage.setItem("ab_intro_shown", "1");

    // Phase 1: Logo arrives
    const logoTimer = setTimeout(() => {
      setLogoReady(true);

      // Phase 2: Type the name
      let i = 0;
      const typeInterval = setInterval(() => {
        i++;
        setTypedText(FULL_NAME.slice(0, i));
        if (i >= FULL_NAME.length) {
          clearInterval(typeInterval);

          // Phase 3: Hold, then exit
          const exitTimer = setTimeout(() => {
            setExiting(true);
            const removeTimer = setTimeout(() => setDismissed(true), 800);
            cleanupRef.current = () => clearTimeout(removeTimer);
          }, 400);
          cleanupRef.current = () => clearTimeout(exitTimer);
        }
      }, CHAR_DELAY);

      cleanupRef.current = () => clearInterval(typeInterval);
    }, 500);

    return () => {
      clearTimeout(logoTimer);
      cleanupRef.current?.();
    };
  }, []);

  // Fully dismissed — render nothing
  if (dismissed) return null;

  return (
    <div
      className={`${styles.overlay} ${exiting ? styles.exiting : ""}`}
      data-intro-overlay
      aria-hidden="true"
      role="presentation"
    >
      {/* Ambient particles */}
      <div className={styles.particles}>
        {[...Array(6)].map((_, i) => (
          <span key={i} className={styles.particle} style={{ '--i': i }} />
        ))}
      </div>

      <div className={styles.content}>
        {/* AB Monogram */}
        <div className={`${styles.monogram} ${logoReady ? styles.monoIn : ""}`}>
          {/* Orbiting ring */}
          <div className={styles.ring} />
          <div className={styles.ring2} />

          <div className={styles.letterWrap}>
            <span className={styles.letterA}>A</span>
            <span className={styles.divider} />
            <span className={styles.letterB}>B</span>
          </div>
        </div>

        {/* Typewriter name */}
        <p className={`${styles.name} ${logoReady ? styles.nameIn : ""}`}>
          {typedText}
          <span className={styles.cursor}>|</span>
        </p>

        {/* Subtitle */}
        <span className={`${styles.subtitle} ${typedText.length > 5 ? styles.subIn : ""}`}>
          Senior Software Engineer
        </span>
      </div>
    </div>
  );
};
