import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/app/lib/db";
import { experiments } from "@/app/lib/db/schema";
import { eq, desc } from "drizzle-orm";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  return !!token?.value?.startsWith("authenticated_admin_");
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(experiments)
      .where(eq(experiments.published, true))
      .orderBy(desc(experiments.createdAt));
    return NextResponse.json({ experiments: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ experiments: [] });
  }
}

export async function POST(req: Request) {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, tech, previewUrl, codeUrl, category, slug, published, order, image } = body;
  
  if (!title || !description || !slug) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const [newExp] = await db.insert(experiments).values({
      title,
      description,
      tech: tech || [],
      previewUrl: previewUrl || null,
      codeUrl: codeUrl || null,
      category: category || "animation",
      slug,
      published: published ?? true,
      order: order || 0,
      image: image || null,
    }).returning();

    return NextResponse.json({ experiment: newExp });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create experiment" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, title, description, tech, previewUrl, codeUrl, category, slug, published, order, image } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing experiment ID" }, { status: 400 });
  }

  try {
    const [updatedExp] = await db.update(experiments)
      .set({
        title,
        description,
        tech,
        previewUrl,
        codeUrl,
        category,
        slug,
        published,
        order,
        image,
        updatedAt: new Date(),
      })
      .where(eq(experiments.id, id))
      .returning();

    return NextResponse.json({ experiment: updatedExp });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update experiment" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await db.delete(experiments).where(eq(experiments.id, id));
  return NextResponse.json({ success: true });
}
