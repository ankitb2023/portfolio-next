"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.scss";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // When mounted on client, now we can show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={styles.placeholder} aria-hidden="true" />;
  }

  const toggleTheme = () => {
    if (theme === "dark") setTheme("light");
    else setTheme("dark");
  };

  const getIcon = () => {
    if (theme === "dark") return "fas fa-moon";
    return "fas fa-sun";
  };

  const currentThemeClass = theme === "dark" ? styles.dark : styles.light;

  return (
    <button
      onClick={toggleTheme}
      className={styles.themeToggle}
      aria-label="Toggle Dark/Light Mode"
      title={`Current: ${theme} - Click to switch`}
    >
      <div className={`${styles.iconContainer} ${currentThemeClass}`}>
        <i className={getIcon()}></i>
      </div>
    </button>
  );
};
