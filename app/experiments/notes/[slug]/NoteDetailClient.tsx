"use client";

import { motion } from "motion/react";
import Link from "next/link";
import ArchiveNav from "@/app/components/ArchiveNav";

interface Note {
  id: string;
  title: string;
  body: string;
  tags: string[];
  slug: string;
  createdAt: string | Date;
}

const MONO = "var(--font-mono, monospace)";

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

/* Minimal markdown-to-HTML: handles headings, bold, code blocks, lists */
function renderMarkdown(md: string) {
  const lines = md.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderLeft: "3px solid var(--accent)",
          padding: "1.25rem 1.5rem",
          overflowX: "auto",
          margin: "1.5rem 0",
          fontFamily: MONO,
          fontSize: "0.8rem",
          lineHeight: 1.7,
          color: "var(--text)",
        }}>
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      i++;
      continue;
    }

    // H1
    if (line.startsWith("# ")) {
      elements.push(
        <h2 key={i} style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 3vw, 2.5rem)", fontWeight: 400, color: "var(--text)", margin: "2rem 0 0.75rem", lineHeight: 1.2 }}>
          {line.slice(2)}
        </h2>
      );
      i++; continue;
    }

    // H2
    if (line.startsWith("## ")) {
      elements.push(
        <h3 key={i} style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.2rem, 2vw, 1.75rem)", fontWeight: 400, color: "var(--text)", margin: "1.75rem 0 0.5rem" }}>
          {line.slice(3)}
        </h3>
      );
      i++; continue;
    }

    // H3
    if (line.startsWith("### ")) {
      elements.push(
        <h4 key={i} style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text)", margin: "1.5rem 0 0.4rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {line.slice(4)}
        </h4>
      );
      i++; continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} style={{
          borderLeft: "3px solid var(--accent)",
          paddingLeft: "1.25rem",
          margin: "1.5rem 0",
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "1.1rem",
          color: "var(--text-muted)",
          lineHeight: 1.75,
        }}>
          {line.slice(2)}
        </blockquote>
      );
      i++; continue;
    }

    // Empty line → spacer
    if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: "0.75rem" }} />);
      i++; continue;
    }

    // Regular paragraph (inline bold + code)
    const rendered = line
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`(.+?)`/g, `<code style="background:var(--surface);border:1px solid var(--border);padding:0.1em 0.4em;font-family:${MONO};font-size:0.82em;color:var(--accent)">$1</code>`);

    elements.push(
      <p key={i}
        dangerouslySetInnerHTML={{ __html: rendered }}
        style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.85, margin: "0.25rem 0" }}
      />
    );
    i++;
  }

  return elements;
}

export default function NoteDetailClient({ note }: { note: Note }) {
  return (
    <>
      <ArchiveNav />
      <main style={{ paddingTop: "8rem", paddingBottom: "6rem", padding: "8rem clamp(1.5rem, 6vw, 6rem) 6rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          {/* Back link */}
          <Link
            href="/experiments"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.18em",
              color: "var(--text-muted)", textTransform: "uppercase",
              marginBottom: "2.5rem", transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            ← Back to Experiments
          </Link>

          {/* Header */}
          <div style={{ marginBottom: "3rem", paddingBottom: "2rem", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              {note.tags.map((t) => (
                <span key={t} style={{
                  padding: "0.2rem 0.65rem",
                  border: "1px solid rgba(196,106,45,0.35)",
                  color: "var(--accent)",
                  fontFamily: MONO, fontSize: "0.52rem", letterSpacing: "0.15em", textTransform: "uppercase",
                }}>
                  {t}
                </span>
              ))}
            </div>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 400,
              color: "var(--text)",
              lineHeight: 1.1,
              marginBottom: "1rem",
            }}>
              {note.title}
            </h1>
            <span style={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.18em", color: "var(--text-muted)" }}>
              {formatDate(note.createdAt)}
            </span>
          </div>

          {/* Body */}
          <div style={{ maxWidth: "72ch" }}>
            {renderMarkdown(note.body)}
          </div>
        </motion.div>
      </main>
    </>
  );
}
