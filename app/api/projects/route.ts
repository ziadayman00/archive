import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "../../lib/db";
import { projects, categories } from "../../lib/db/schema";
import { eq } from "drizzle-orm";

// Helper to verify the admin is authenticated
async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  return !!token?.value?.startsWith("authenticated_admin_");
}

// GET all projects from DB (for the dashboard list)
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const allCategories = await db.select().from(categories).orderBy(categories.order);
    const allProjects = await db.select().from(projects).orderBy(projects.createdAt);
    return NextResponse.json({ projects: allProjects, categories: allCategories });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST - Create a new project
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, subtitle, year, sector, responsibility, impact, tech, description, features, images, live, github, comingSoon, inProgress, categoryId } = body;

    if (!title || !subtitle || !year || !sector || !description) {
      return NextResponse.json({ error: "Missing required fields (title, subtitle, year, sector, description)" }, { status: 400 });
    }

    const techArray = Array.isArray(tech) ? tech : (typeof tech === 'string' ? tech.split(',').map((s: string) => s.trim()).filter(Boolean) : []);
    const featuresArray = Array.isArray(features) ? features : (typeof features === 'string' ? features.split('\n').map((s: string) => s.trim()).filter(Boolean) : []);
    const imagesArray = Array.isArray(images) ? images : (typeof images === 'string' ? images.split('\n').map((s: string) => s.trim()).filter(Boolean) : []);

    const [newProject] = await db.insert(projects).values({
      title,
      subtitle,
      year,
      sector,
      responsibility: responsibility || null,
      impact: impact || null,
      tech: techArray,
      description,
      features: featuresArray.length > 0 ? featuresArray : null,
      images: imagesArray,
      live: live || "#",
      github: github || "#",
      comingSoon: comingSoon ?? false,
      inProgress: inProgress ?? false,
      categoryId: categoryId || null,
    }).returning();

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

// PUT - Update an existing project
export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, subtitle, year, sector, responsibility, impact, tech, description, features, images, live, github, comingSoon, inProgress, categoryId } = body;

    if (!id) {
      return NextResponse.json({ error: "Project ID is required for update" }, { status: 400 });
    }

    const techArray = Array.isArray(tech) ? tech : (typeof tech === 'string' ? tech.split(',').map((s: string) => s.trim()).filter(Boolean) : []);
    const featuresArray = Array.isArray(features) ? features : (typeof features === 'string' ? features.split('\n').map((s: string) => s.trim()).filter(Boolean) : []);
    const imagesArray = Array.isArray(images) ? images : (typeof images === 'string' ? images.split('\n').map((s: string) => s.trim()).filter(Boolean) : []);

    const [updated] = await db.update(projects)
      .set({
        title,
        subtitle,
        year,
        sector,
        responsibility: responsibility || null,
        impact: impact || null,
        tech: techArray,
        description,
        features: featuresArray.length > 0 ? featuresArray : null,
        images: imagesArray,
        live: live || "#",
        github: github || "#",
        comingSoon: comingSoon ?? false,
        inProgress: inProgress ?? false,
        categoryId: categoryId || null,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// DELETE a project
export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const [deleted] = await db.delete(projects).where(eq(projects.id, id)).returning();

    if (!deleted) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
