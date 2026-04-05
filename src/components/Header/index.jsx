"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.scss";

const navLinks = [
  { id: "home", label: "Home", href: "/#home" },
  { id: "about", label: "About", href: "/#about" },
  { id: "skills", label: "Skills", href: "/#skills" },
  { id: "education", label: "Education", href: "/#education" },
  { id: "work", label: "Projects", href: "/#work" },
  { id: "experience", label: "Experience", href: "/#experience" },
  { id: "contact", label: "Contact", href: "/#contact" },
];

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
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleNavClick = (e, id, href) => {
    // If on homepage, let default navigation route back to /#id but perfectly offset it
    if (pathname === "/") {
      e.preventDefault();
      setMenuOpen(false);
      const element = document.getElementById(id);
      if (element) {
         const yOffset = -80; // height of navbar
         const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
         window.scrollTo({ top: y, behavior: 'smooth' });
      } else if (id === 'home') {
         window.scrollTo({ top: 0, behavior: 'smooth' });
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
        
        <div 
          className={`${styles.menuBtn} ${menuOpen ? styles.open : ""}`} 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className={styles.burgerPanel}></div>
        </div>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
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
      </div>
    </header>
  );
};
