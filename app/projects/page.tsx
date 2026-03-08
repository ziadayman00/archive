import ProjectsClient from "./ProjectsClient";
import { getFeaturedProjects, getWebProjects, getDesignProjects } from "../data/projects";

export default async function ProjectsPage() {
  const featuredProjects = await getFeaturedProjects();
  const webProjects = await getWebProjects();
  const designProjects = await getDesignProjects();

  return (
    <ProjectsClient
      featuredProjects={featuredProjects}
      webProjects={webProjects}
      designProjects={designProjects}
    />
  );
}
