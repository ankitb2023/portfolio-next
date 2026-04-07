"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.scss";
import { smoothScrollTo } from '@/utils/scroll';
import { sectionQuickLinks } from '@/data/layout/common';
import { ThemeToggle } from '../common/ThemeToggle';

export const Header = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      // Navbar shrink effect
      setIsScrolled(window.scrollY > 50);

      // Scroll spy logic active only on homepage
      if (pathname === "/") {
        const sections = document.querySelectorAll("section[id]");
        let current = "home";
        let minDistance = Infinity;

        // Determine which section center is closest to screen center
        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const elementCenter = rect.top + rect.height / 2;
          const screenCenter = window.innerHeight / 2;
          const distance = Math.abs(screenCenter - elementCenter);
          if (distance < minDistance) {
            minDistance = distance;
            current = section.getAttribute("id");
          }
        });
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Visibility change logic
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "Come back 👀 | Ankit Portfolio";
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
          <i className="fab fa-angular" aria-hidden="true"></i> Ankit
        </Link>
        
        
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
          <ul className={styles.navList}>
            {sectionQuickLinks.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${
                    activeSection === link.id && pathname === "/" ? styles.active : ""
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
    </header>
  );
};
