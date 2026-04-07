"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { useEffect } from "react";

export function ThemeProvider({ children }) {
  useEffect(() => {
    // Prevent transitions on initial load, enable them for toggles
    document.body.classList.add('transitions-ready');
  }, []);

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem={true}
      value={{ light: 'light-theme', dark: 'dark-theme' }}
    >
      {children}
    </NextThemesProvider>
  );
}
