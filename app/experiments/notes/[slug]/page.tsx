import { db } from "@/app/lib/db";
import { notes } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import NoteDetailClient from "./NoteDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [note] = await db.select().from(notes).where(eq(notes.slug, slug)).limit(1);
  if (!note) return { title: "Note not found" };
  return {
    title: `${note.title} — Field Notes | Ziad's Archive`,
    description: note.body.slice(0, 160),
  };
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [note] = await db.select().from(notes).where(eq(notes.slug, slug)).limit(1);
  if (!note) notFound();
  return <NoteDetailClient note={note} />;
}
