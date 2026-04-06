"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }) {
  // We use standard next-themes with attribute="class" which works automatically.
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem={false}
      value={{ light: 'light-theme', dark: 'dark-theme' }}
    >
      {children}
    </NextThemesProvider>
  );
}
