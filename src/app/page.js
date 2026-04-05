import { Home } from "@/components/Home";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Education } from "@/components/Education";
import { Projects } from "@/components/Projects";

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
    </main>
  );
}
