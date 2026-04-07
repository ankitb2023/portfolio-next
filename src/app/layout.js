import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import { Header } from "@/components/Header";
import { BackToTop } from "@/components/common/BackToTop";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CommandPalette } from "@/components/CommandPalette";
import { PWA } from "@/components/PWA";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Portfolio | Ankit Bhujeja",
  description: "Senior Frontend Engineer Portfolio",
  manifest: "/manifest.json",
  themeColor: "#8b5cf6",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ThemeProvider>
          <ToastProvider>
            <PWA />
            <Header />
            <CommandPalette />
            {children}
            <BackToTop />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
