"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.scss";
import { smoothScrollTo } from '@/utils/scroll';
import { sectionQuickLinks } from '@/data/layout/common';
import { ThemeToggle } from '../common/ThemeToggle';
import { useVisitorContext } from '@/context/VisitorContext';

export const Header = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { updateMemory, isReturningUser, memory, isReady } = useVisitorContext();
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const trackedSectionRef = useRef(null);

  useEffect(() => {
    if (isReady && isReturningUser && memory.lastSessionSection && memory.lastSessionSection !== 'home') {
      const shown = sessionStorage.getItem('portfolio_resume_banner_shown');
      if (!shown && window.scrollY < 100) {
        setShowResumeBanner(true);
        sessionStorage.setItem('portfolio_resume_banner_shown', 'true');
        const timer = setTimeout(() => setShowResumeBanner(false), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [isReady, isReturningUser, memory.lastSessionSection]);

  useEffect(() => {
    const handleScrollHide = () => {
      if (window.scrollY > 100 && showResumeBanner) {
        setShowResumeBanner(false);
      }
    };
    if (showResumeBanner) {
      window.addEventListener("scroll", handleScrollHide);
    }
    return () => window.removeEventListener("scroll", handleScrollHide);
  }, [showResumeBanner]);

  useEffect(() => {
    if (showResumeBanner && memory.currentSection && memory.currentSection !== 'home') {
      setShowResumeBanner(false);
    }
  }, [memory.currentSection, showResumeBanner]);

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = document.querySelectorAll("section[id]");
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      // Filter only intersecting entries and find the one with the highest intersection ratio
      const mostVisible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (mostVisible) {
        const newSection = mostVisible.target.id;
        if (trackedSectionRef.current !== newSection) {
          trackedSectionRef.current = newSection;
          setActiveSection(newSection);
          updateMemory({ currentSection: newSection });
        }
      }
    }, {
      threshold: [0.4],
      rootMargin: '-5% 0px -5% 0px'
    });

    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname, updateMemory]);

  useEffect(() => {
    const handleScroll = () => {
      // Navbar shrink effect
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    // Visibility change logic
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "Come back | Ankit Portfolio";
      } else {
        const titleMap = {
          home: 'Home',
          about: 'About',
          skills: 'Skills',
          education: 'Education',
          work: 'Projects',
          experience: 'Experience',
          contact: 'Contact'
        };
        const sectionName = titleMap[activeSection] || 'Home';
        document.title = `${sectionName} | Ankit Portfolio`;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname, activeSection]);

  // Sync title on section change when visible
  useEffect(() => {
    if (!document.hidden) {
      const titleMap = {
        home: 'Home',
        about: 'About',
        skills: 'Skills',
        education: 'Education',
        work: 'Projects',
        experience: 'Experience',
        contact: 'Contact'
      };
      const sectionName = titleMap[activeSection] || 'Home';
      document.title = `${sectionName} | Ankit Portfolio`;
    }
  }, [activeSection]);

  const handleNavClick = (e, id, href) => {
    // If on homepage, let default navigation route back to /#id but perfectly offset it
    if (pathname === "/") {
      e.preventDefault();
      setMenuOpen(false);
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        smoothScrollTo(id);
      }
    } else {
      setMenuOpen(false);
    }
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <img src="/abtransparentIcon.png" alt="AB Logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} /> <span>Ankit</span>
        </Link>


        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
          <ul className={styles.navList}>
            {sectionQuickLinks.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${activeSection === link.id && pathname === "/" ? styles.active : ""
                    }`}
                  onClick={(e) => handleNavClick(e, link.id, link.href)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <div
            className={styles.commandHint}
            title="Open Command Palette (Ctrl+K)"
            onClick={() => {
              window.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'k',
                ctrlKey: true,
                metaKey: true,
                bubbles: true
              }));
            }}
          >
            Press <span>Ctrl + K</span>
          </div>
          <ThemeToggle />
          <div
            className={`${styles.menuBtn} ${menuOpen ? styles.open : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className={styles.burgerPanel}></div>
          </div>
        </div>
      </div>

      {showResumeBanner && (
        <div className={styles.resumeBanner}>
          <span className={styles.resumeMessage}>Welcome back 👋 Continue where you left off?</span>
          <div className={styles.resumeActions}>
            <button
              onClick={() => {
                setShowResumeBanner(false);
                smoothScrollTo(memory.lastSessionSection);
                updateMemory({ currentSection: memory.lastSessionSection });
              }}
              className={styles.resumeBtn}
            >
              Continue
            </button>
            <button
              onClick={() => setShowResumeBanner(false)}
              className={styles.closeBtn}
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
