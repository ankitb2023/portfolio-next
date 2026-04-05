import { Home } from "@/components/Home";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Education } from "@/components/Education";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";

export const metadata = {
  title: 'Portfolio | Home',
  description: 'Welcome to my portfolio created with Next.js',
};

export default function HomePage() {
  return (
    <main>
      <Home />
      <About />
      <Skills />
      <Education />
      <Projects />
      <Experience />
      <Contact />
    </main>
  );
}
