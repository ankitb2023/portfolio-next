import { Projects } from "@/components/Projects";

export const metadata = {
  title: 'Portfolio | Projects Built',
  description: 'View all my projects and works',
};

export default function ProjectsPage() {
  return (
    <main style={{ paddingTop: '80px' }}>
      <Projects showAll={true} />
    </main>
  );
}
