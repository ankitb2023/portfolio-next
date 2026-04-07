"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { smoothScrollTo } from '@/utils/scroll';
import { useTheme } from "next-themes";
import styles from "./CommandPalette.module.scss";

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const commands = [
    { id: "home", title: "Go to Home", icon: "fas fa-home", action: () => navigateToSection("home") },
    { id: "about", title: "Go to About", icon: "fas fa-user", action: () => navigateToSection("about") },
    { id: "skills", title: "Go to Skills", icon: "fas fa-code", action: () => navigateToSection("skills") },
    { id: "projects", title: "Go to Projects", icon: "fas fa-laptop-code", action: () => navigateToSection("work") },
    { id: "contact", title: "Go to Contact", icon: "fas fa-envelope", action: () => navigateToSection("contact") },
    { id: "top", title: "Scroll to Top", icon: "fas fa-arrow-up", action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { id: "theme", title: "Toggle Theme", icon: "fas fa-adjust", action: toggleTheme },
    { id: "resume", title: "Download Resume", icon: "fas fa-download", action: downloadResume },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Hotkey to open
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // If open, handle navigation globally to prevent background scroll
      if (isOpen) {
        if (e.key === "Escape") {
          setIsOpen(false);
          return;
        }

        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % filteredCommands.length);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setActiveIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === "Enter") {
          e.preventDefault();
          if (filteredCommands[activeIndex]) {
            filteredCommands[activeIndex].action();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, activeIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setQuery("");
      setActiveIndex(0);
      setupFocus();
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const setupFocus = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const navigateToSection = (id) => {
    setIsOpen(false);
    if (pathname !== "/") {
      router.push(`/#${id}`);
    } else {
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        smoothScrollTo(id);
      }
    }
  };

  function toggleTheme() {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
    setIsOpen(false);
  }

  function downloadResume() {
    window.open("/pdfs/ankit-bhujeja-resume.pdf", "_blank");
    setIsOpen(false);
  }

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.visible : ""}`} onClick={() => setIsOpen(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.inputWrapper}>
          <i className="fas fa-search"></i>
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={null}
            tabIndex={-1}
          />
          <span className={styles.shortcut}>ESC</span>
        </div>
        <div className={styles.list}>
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, index) => (
              <div
                key={cmd.id}
                className={`${styles.item} ${index === activeIndex ? styles.active : ""}`}
                onClick={cmd.action}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <i className={cmd.icon}></i>
                <span>{cmd.title}</span>
              </div>
            ))
          ) : (
            <div className={styles.item}>No commands found.</div>
          )}
        </div>
      </div>
    </div>
  );
};
