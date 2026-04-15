import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./scroll-reveal.css";
import { ToastProvider } from "@/context/ToastContext";
import { VisitorProvider } from "@/context/VisitorContext";
import { Header } from "@/components/Header";
import { BackToTop } from "@/components/common/BackToTop";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CommandPalette } from "@/components/CommandPalette";
import { PWA } from "@/components/PWA";
import { Chatbot } from "@/components/Chatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const viewport = {
  themeColor: "#8b5cf6",
  colorScheme: "dark"
}
export const metadata = {
  metadataBase: new URL("https://abhujeja.vercel.app"),
  title: "Ankit Bhujeja | Senior Software Engineer Portfolio",
  description: "Portfolio of Ankit Bhujeja, a Senior Software Engineer@Naukri.com specializing in React, Next.js, Java, and Spring Boot. Building scalable full-stack applications.",
  applicationName: "Ankit Bhujeja Portfolio",
  authors: [{ name: "Ankit Bhujeja", url: "https://github.com/ankitb2023" }],
  generator: "Next.js",
  keywords: ["Ankit Bhujeja", "Senior Software Engineer", "React Developer", "Next.js", "Java Developer", "Spring Boot", "Portfolio", "Full Stack Engineer"],
  manifest: "/manifest.json",
  icons: {
    icon: "/abIcon.png",
    apple: "/abIcon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ankit Portfolio",
  },
  openGraph: {
    title: "Ankit Bhujeja | Senior Software Engineer",
    description: "Explore the portfolio, projects, and professional experience of Ankit Bhujeja.",
    url: "https://ankitbhujeja.com",
    siteName: "Ankit Bhujeja Portfolio",
    images: [
      {
        url: "/images/profileupdated.png",
        width: 800,
        height: 600,
        alt: "Ankit Bhujeja",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ankit Bhujeja | Senior Software Engineer",
    description: "Explore the portfolio, projects, and professional experience of Ankit Bhujeja.",
    images: ["/images/profileupdated.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Ankit Bhujeja",
              "jobTitle": "Senior Software Engineer",
              "url": "https://ankitbhujeja.com",
              "sameAs": [
                "https://github.com/ankitb2023",
                "https://www.linkedin.com/in/ankit-bhujeja/"
              ],
              "knowsAbout": ["React", "Next.js", "Java", "Spring Boot", "Software Engineering", "Full Stack Development"],
              "worksFor": {
                "@type": "Organization",
                "name": "Naukri (InfoEdge)"
              },
              "alumniOf": {
                "@type": "Organization",
                "name": "DCRUST Murthal"
              }
            })
          }}
        />
        <ThemeProvider>
          <VisitorProvider>
            <ToastProvider>
              <PWA />
              <Header />
              <CommandPalette />
              {children}
              <Chatbot />
              <BackToTop />
            </ToastProvider>
          </VisitorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
