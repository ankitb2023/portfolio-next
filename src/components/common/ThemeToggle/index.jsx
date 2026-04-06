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
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={styles.themeToggle}
      aria-label="Toggle Dark/Light Mode"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <div className={`${styles.iconContainer} ${theme === "dark" ? styles.dark : styles.light}`}>
        <i className={theme === "dark" ? "fas fa-moon" : "fas fa-sun"}></i>
      </div>
    </button>
  );
};
