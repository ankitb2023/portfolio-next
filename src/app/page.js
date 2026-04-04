import { Home } from "@/components/Home";
import { About } from "@/components/About";

export const metadata = {
  title: 'Portfolio | Home',
  description: 'Welcome to my portfolio created with Next.js',
};

export default function HomePage() {
  return (
    <main>
      <Home />
      <About />
    </main>
  );
}
