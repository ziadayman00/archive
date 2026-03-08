import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "../../data/projects";
import CaseFilePage from "./CaseFilePage";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `Case File #${project.id?.slice(0, 3)} — ${project.title} | ZIAD'S ARCHIVE`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  return <CaseFilePage project={project} />;
}
