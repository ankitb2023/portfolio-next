import { Home } from "@/components/Home";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Education } from "@/components/Education";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/common/ScrollReveal";

export const metadata = {
  title: 'Portfolio | Home',
  description: 'Welcome to my portfolio created with Next.js. Senior Frontend Engineer specializing in React, Next.js, and modern UI/UX.',
  openGraph: {
    title: 'Ankit Bhujeja | Portfolio',
    description: 'Senior Frontend Engineer crafting beautiful and performant web applications.',
    url: 'https://ankitbhujeja.com',
    siteName: 'Ankit Portfolio',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ankit Bhujeja',
  jobTitle: 'Senior Software Engineer',
  url: 'https://ankitbhujeja.com',
  sameAs: [
    'https://linkedin.com/in/ankitbhujeja',
    'https://github.com/AnkitBhujeja'
  ]
};

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Home />
      <ScrollReveal><About /></ScrollReveal>
      <ScrollReveal><Skills /></ScrollReveal>
      <ScrollReveal><Education /></ScrollReveal>
      <ScrollReveal><Projects /></ScrollReveal>
      <ScrollReveal><Experience /></ScrollReveal>
      <ScrollReveal><Contact /></ScrollReveal>
      <Footer />
    </main>
  );
}
