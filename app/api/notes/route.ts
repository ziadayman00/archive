import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/app/lib/db";
import { notes } from "@/app/lib/db/schema";
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
      .from(notes)
      .where(eq(notes.published, true))
      .orderBy(desc(notes.createdAt));
    return NextResponse.json({ notes: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ notes: [] });
  }
}

export async function POST(req: Request) {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const tagsArr = Array.isArray(body.tags)
    ? body.tags
    : String(body.tags || "").split(",").map((s: string) => s.trim()).filter(Boolean);

  const [row] = await db.insert(notes).values({
    title: body.title,
    body: body.body,
    tags: tagsArr,
    slug: body.slug || slugify(body.title),
    published: body.published ?? true,
  }).returning();

  return NextResponse.json({ note: row });
}

export async function PUT(req: Request) {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const tagsArr = Array.isArray(body.tags)
    ? body.tags
    : String(body.tags || "").split(",").map((s: string) => s.trim()).filter(Boolean);

  const [row] = await db.update(notes).set({
    title: body.title,
    body: body.body,
    tags: tagsArr,
    slug: body.slug || slugify(body.title),
    published: body.published ?? true,
    updatedAt: new Date(),
  }).where(eq(notes.id, body.id)).returning();

  return NextResponse.json({ note: row });
}

export async function DELETE(req: Request) {
  if (!(await isAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await db.delete(notes).where(eq(notes.id, id));
  return NextResponse.json({ success: true });
}
