import { eq, desc } from "drizzle-orm";
import { db } from "../lib/db";
import { projects, categories } from "../lib/db/schema";
import localProjects from "../../projects.json";

export async function getFeaturedProjects() {
  let dbData: any[] = [];
  try {
    dbData = await db
      .select()
      .from(projects)
      .leftJoin(categories, eq(projects.categoryId, categories.id))
      .where(eq(categories.slug, "featured"))
      .orderBy(desc(projects.createdAt));
  } catch (error) {
    console.warn("Could not fetch DB featured projects:", error);
  }

  const mappedDb = dbData.map(({ projects }) => ({
    ...projects,
    color: "#C46A2D", 
    slug: (projects.title || "").toLowerCase().replace(/\s+/g, '-'),
  }));

  const localMocks = localProjects.featuredProjects
    .filter((p: any) => !mappedDb.some((dbP) => dbP.title === p.title))
    .map((p: any, i: number) => ({
    ...p,
    id: `local-f-${i}`,
    categoryId: null,
    order: 0,
    createdAt: new Date(`${p.year}-01-01`),
    updatedAt: new Date(),
    color: "#C46A2D",
    slug: (p.title || "").toLowerCase().replace(/\s+/g, '-'),
  }));

  return [...mappedDb, ...localMocks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getWebProjects() {
  let dbData: any[] = [];
  try {
    dbData = await db
      .select()
      .from(projects)
      .leftJoin(categories, eq(projects.categoryId, categories.id))
      .where(eq(categories.slug, "web"))
      .orderBy(desc(projects.createdAt));
  } catch (error) {
    console.warn("Could not fetch DB web projects:", error);
  }

  const mappedDb = dbData.map(({ projects }) => ({
    ...projects,
    color: "#4A6A8B",
    slug: (projects.title || "").toLowerCase().replace(/\s+/g, '-'),
  }));

  const localMocks = localProjects.webProjects
    .filter((p: any) => !mappedDb.some((dbP) => dbP.title === p.title))
    .map((p: any, i: number) => ({
    ...p,
    id: `local-w-${i}`,
    categoryId: null,
    responsibility: null,
    impact: null,
    features: null,
    order: 0,
    createdAt: new Date(`${p.year}-01-01`),
    updatedAt: new Date(),
    color: "#4A6A8B",
    slug: (p.title || "").toLowerCase().replace(/\s+/g, '-'),
  }));

  return [...mappedDb, ...localMocks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getDesignProjects() {
  let dbData: any[] = [];
  try {
    dbData = await db
      .select()
      .from(projects)
      .leftJoin(categories, eq(projects.categoryId, categories.id))
      .where(eq(categories.slug, "design"))
      .orderBy(desc(projects.createdAt));
  } catch (error) {
    console.warn("Could not fetch DB design projects:", error);
  }

  const mappedDb = dbData.map(({ projects }) => ({
    ...projects,
    color: "#D1C0A8", // Vintage tan/beige
    slug: (projects.title || "").toLowerCase().replace(/\s+/g, '-'),
  }));

  // Fallback if localProjects doesn't have designProjects array
  const localDesign = (localProjects as any).designProjects || [];
  const localMocks = localDesign
    .filter((p: any) => !mappedDb.some((dbP) => dbP.title === p.title))
    .map((p: any, i: number) => ({
    ...p,
    id: `local-d-${i}`,
    categoryId: null,
    responsibility: null,
    impact: null,
    features: null,
    order: 0,
    createdAt: new Date(`${p.year || new Date().getFullYear()}-01-01`),
    updatedAt: new Date(),
    color: "#D1C0A8",
    slug: (p.title || "").toLowerCase().replace(/\s+/g, '-'),
  }));

  return [...mappedDb, ...localMocks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getAllProjects() {
  const featured = await getFeaturedProjects();
  const web = await getWebProjects();
  const design = await getDesignProjects();
  return [...featured, ...web, ...design];
}

export async function getProjectBySlug(slug: string) {
  const all = await getAllProjects();
  return all.find((p) => p.slug === slug) || null;
}

export type AnyProject = Awaited<ReturnType<typeof getAllProjects>>[0];
