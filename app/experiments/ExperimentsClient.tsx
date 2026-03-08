"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import ArchiveNav from "../components/ArchiveNav";

interface Experiment {
  id: string;
  title: string;
  description: string;
  tech: string[];
  previewUrl: string | null;
  codeUrl: string | null;
  category: string;
  image: string | null;
  slug: string;
  createdAt: string;
}

interface Note {
  id: string;
  title: string;
  body: string;
  tags: string[];
  slug: string;
  createdAt: string;
}

const LAB_CATEGORIES = ["All", "Animation", "CSS", "Interaction", "Typography", "Layout"];

const ACCENT = "var(--accent)";
const MONO = "var(--font-mono, monospace)";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function excerpt(text: string, max = 160) {
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

/* ─── Lab Card ──────────────────────────────────────── */
function ExperimentCard({ exp, index }: { exp: Experiment; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? "rgba(196,106,45,0.4)" : "var(--border)"}`,
        background: hovered ? "rgba(196,106,45,0.04)" : "var(--surface)",
        transition: "border-color 0.25s, background 0.25s",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Preview area */}
      <div
        style={{
          height: "200px",
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {exp.image ? (
          <img
            src={exp.image}
            alt={exp.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
          />
        ) : exp.previewUrl ? (
          <iframe
            src={exp.previewUrl}
            style={{ width: "100%", height: "100%", border: "none", pointerEvents: hovered ? "auto" : "none" }}
            title={exp.title}
          />
        ) : (
          <div style={{ textAlign: "center", opacity: 0.25 }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚗</div>
            <span style={{ fontFamily: MONO, fontSize: "0.55rem", letterSpacing: "0.2em", color: "var(--text-muted)" }}>
              NO PREVIEW
            </span>
          </div>
        )}
        {/* Category badge */}
        <div style={{
          position: "absolute", top: "0.75rem", left: "0.75rem",
          padding: "0.2rem 0.6rem",
          border: "1px solid rgba(196,106,45,0.3)",
          background: "rgba(12,12,12,0.85)",
          color: ACCENT,
          fontFamily: MONO,
          fontSize: "0.52rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}>
          {exp.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.25rem",
          fontWeight: 400,
          color: "var(--text)",
          lineHeight: 1.2,
        }}>
          {exp.title}
        </h3>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.7, flex: 1 }}>
          {excerpt(exp.description)}
        </p>

        {/* Tags */}
        {exp.tech.length > 0 && (
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
            {exp.tech.map((t) => (
              <span key={t} style={{
                padding: "0.15rem 0.55rem",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                fontFamily: MONO,
                fontSize: "0.5rem",
                letterSpacing: "0.1em",
              }}>
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid var(--border)" }}>
          {exp.codeUrl && (
            <a
              href={exp.codeUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: MONO,
                fontSize: "0.58rem",
                letterSpacing: "0.15em",
                color: ACCENT,
                textTransform: "uppercase",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              View Code →
            </a>
          )}
          {exp.previewUrl && (
            <a
              href={exp.previewUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: MONO,
                fontSize: "0.58rem",
                letterSpacing: "0.15em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Open ↗
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Note Row ──────────────────────────────────────── */
function NoteRow({ note, index }: { note: Note; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/experiments/notes/${note.slug}`} style={{ display: "block" }}>
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "1.75rem 0",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "2rem",
            alignItems: "start",
            transition: "padding-left 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.paddingLeft = "1rem";
            (e.currentTarget as HTMLElement).style.borderTopColor = "rgba(196,106,45,0.4)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.paddingLeft = "0";
            (e.currentTarget as HTMLElement).style.borderTopColor = "var(--border)";
          }}
        >
          <div>
            {/* Tags row */}
            {note.tags.length > 0 && (
              <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
                {note.tags.map((t) => (
                  <span key={t} style={{
                    padding: "0.12rem 0.5rem",
                    border: "1px solid rgba(196,106,45,0.3)",
                    color: ACCENT,
                    fontFamily: MONO,
                    fontSize: "0.5rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
              fontWeight: 400,
              color: "var(--text)",
              marginBottom: "0.5rem",
              lineHeight: 1.2,
            }}>
              {note.title}
            </h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.75, maxWidth: "60ch" }}>
              {excerpt(note.body)}
            </p>
          </div>
          <div style={{ flexShrink: 0, textAlign: "right" }}>
            <span style={{
              display: "block",
              fontFamily: MONO,
              fontSize: "0.55rem",
              letterSpacing: "0.15em",
              color: "var(--text-muted)",
              whiteSpace: "nowrap",
            }}>
              {formatDate(note.createdAt)}
            </span>
            <span style={{
              display: "block",
              marginTop: "0.5rem",
              fontFamily: MONO,
              fontSize: "0.7rem",
              color: ACCENT,
            }}>
              →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Main Component ────────────────────────────────── */
export default function ExperimentsClient({
  experiments,
  notes,
}: {
  experiments: Experiment[];
  notes: Note[];
}) {
  const [tab, setTab] = useState<"lab" | "notes">("lab");
  const [filter, setFilter] = useState("All");

  const filteredExps = filter === "All"
    ? experiments
    : experiments.filter((e) => e.category.toLowerCase() === filter.toLowerCase());

  return (
    <>
      <ArchiveNav />
      <main style={{ paddingTop: "8rem", paddingBottom: "6rem", padding: "8rem clamp(1.5rem, 6vw, 6rem) 6rem" }}>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: "4rem",
              fontWeight: 300,
              color: ACCENT,
              opacity: 0.4,
              lineHeight: 1,
            }}>
              004
            </span>
            <div>
              <p className="text-label" style={{ marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="accent-rule" />
                Lab Notes
              </p>
              <h1 className="text-section">Experiments — The Lab</h1>
            </div>
          </div>
          <div className="archive-line" style={{ marginBottom: "0" }} />
        </motion.div>

        {/* Tab switcher */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid var(--border)",
          marginBottom: "3rem",
        }}>
          {(["lab", "notes"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "1.25rem 2rem",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${tab === t ? ACCENT : "transparent"}`,
                color: tab === t ? "var(--text)" : "var(--text-muted)",
                fontFamily: MONO,
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "color 0.2s, border-color 0.2s",
                marginBottom: "-1px",
              }}
            >
              {t === "lab" ? `⚗ Lab — ${experiments.length}` : `✍ Notes — ${notes.length}`}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {tab === "lab" && (
            <motion.div
              key="lab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Category filter */}
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "2rem" }}>
                {LAB_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setFilter(c)}
                    style={{
                      padding: "0.3rem 0.85rem",
                      border: `1px solid ${filter === c ? "rgba(196,106,45,0.5)" : "var(--border)"}`,
                      background: filter === c ? "rgba(196,106,45,0.1)" : "transparent",
                      color: filter === c ? ACCENT : "var(--text-muted)",
                      fontFamily: MONO,
                      fontSize: "0.55rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {filteredExps.length === 0 ? (
                <div style={{ padding: "6rem 0", textAlign: "center", color: "var(--text-muted)" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.2 }}>⚗</div>
                  <p style={{ fontFamily: MONO, fontSize: "0.65rem", letterSpacing: "0.2em" }}>
                    NO EXPERIMENTS YET — CHECK BACK SOON
                  </p>
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "1.5rem",
                }}>
                  {filteredExps.map((exp, i) => (
                    <ExperimentCard key={exp.id} exp={exp} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === "notes" && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {notes.length === 0 ? (
                <div style={{ padding: "6rem 0", textAlign: "center", color: "var(--text-muted)" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.2 }}>✍</div>
                  <p style={{ fontFamily: MONO, fontSize: "0.65rem", letterSpacing: "0.2em" }}>
                    NO FIELD NOTES YET — CHECK BACK SOON
                  </p>
                </div>
              ) : (
                <div>
                  {notes.map((note, i) => (
                    <NoteRow key={note.id} note={note} index={i} />
                  ))}
                  <div style={{ borderTop: "1px solid var(--border)" }} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
