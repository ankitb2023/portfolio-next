import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: 'Portfolio | Professional Journey',
  description: 'View all my professional experiences',
};

export default function ExperiencePage() {
  return (
    <main style={{ paddingTop: '80px' }}>
      <Experience showAll={true} />
      <Footer />
    </main>
  );
}
