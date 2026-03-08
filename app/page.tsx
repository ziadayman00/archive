"use client";

import { motion } from "motion/react";
import Link from "next/link";
import ArchiveNav from "./components/ArchiveNav";
import ArchiveRecord from "./components/ArchiveRecord";

const YEAR = new Date().getFullYear();

const skills = [
  "Next.js", "React", "TypeScript", "Tailwind CSS",
  "Prisma", "PostgreSQL", "Node.js", "Framer Motion",
  "CSS Animations", "Figma", "Supabase", "Drizzle ORM",
];

const records = [
  {
    number: "001",
    category: "Personnel File",
    title: "About — The Engineer",
    description: "Background, timeline, and field notes on Ziad Ayman.",
    href: "/about",
  },
  {
    number: "002",
    category: "Technical Dossier",
    title: "Skills — Capabilities Index",
    description: "A catalogued list of technical skills, tools, and proficiencies.",
    href: "/skills",
  },
  {
    number: "003",
    category: "Project Case Files",
    title: "Projects — Archived Works",
    description: "Documented case studies of completed and ongoing projects.",
    href: "/projects",
  },
  {
    number: "004",
    category: "Lab Notes",
    title: "Experiments — The Lab",
    description: "UI studies, animation experiments, and technical explorations.",
    href: "/experiments",
  },
  {
    number: "005",
    category: "Transmission",
    title: "Contact — Open Channel",
    description: "Reach out to initiate a new record or collaboration.",
    href: "/contact",
  },
];

export default function HomePage() {
  return (
    <>
      <ArchiveNav />

      <main style={{ paddingTop: "5rem" }}>
        {/* ── HERO ─────────────────────────────────────── */}
        <section
          style={{
            minHeight: "100svh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 clamp(1.5rem, 6vw, 6rem)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle grid background */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.025,
              backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              pointerEvents: "none",
            }}
          />

          {/* Background accent glow */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "20%",
              right: "-10%",
              width: "40vw",
              height: "40vw",
              borderRadius: "50%",
              background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 7%, transparent) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Archive stamp — hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
            animate={{ opacity: 0.6, rotate: -12, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", top: "12%", right: "8%", zIndex: 1 }}
            className="hero-stamp"
          >
            <div className="archive-stamp">
              <span>DIGITAL</span>
              <span style={{ fontSize: "0.9em", letterSpacing: "0.08em" }}>ARCHIVE</span>
              <span>{YEAR}</span>
            </div>
          </motion.div>

          {/* Top label */}
          <motion.p
            className="text-label"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <span className="accent-rule" />
            Est. {YEAR} — Volume I
          </motion.p>

          {/* Hero heading */}
          <div style={{ overflow: "hidden" }}>
            <motion.h1
              className="text-hero"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: "relative" }}
            >
              ZIAD&apos;S
            </motion.h1>
          </div>
          <div style={{ overflow: "hidden" }}>
            <motion.h1
              className="text-hero"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ color: "var(--accent)", fontStyle: "italic" }}
            >
              ARCHIVE
            </motion.h1>
          </div>

          {/* Subtitle row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="hero-subtitle-row"
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1rem, 2.5vw, 1.6rem)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: "var(--text-muted)",
                  marginBottom: "0.4rem",
                }}
              >
                Digital Records of Ziad Ayman
              </p>
              <p className="text-label">Frontend Engineer — Cairo, Egypt</p>
            </div>
            <div
              style={{
                maxWidth: "28rem",
                borderLeft: "2px solid var(--accent)",
                paddingLeft: "1.5rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.85,
                }}
              >
                A curated collection of technical work, creative experiments, and
                professional records — organised as a digital archive. Browse
                the records below to explore the collection.
              </p>
            </div>
          </motion.div>


          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            style={{
              position: "absolute",
              bottom: "3rem",
              left: "clamp(1.5rem, 6vw, 6rem)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <span className="text-label">Scroll to browse records</span>
            <span
              style={{
                display: "inline-block",
                width: "3rem",
                height: "1px",
                background: "var(--accent)",
              }}
            />
          </motion.div>
        </section>

        {/* ── ARCHIVE RECORDS INDEX ─────────────────── */}
        <section
          style={{
            padding: "6rem clamp(1.5rem, 6vw, 6rem)",
            backgroundColor: "var(--surface)",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ marginBottom: "3rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <p className="text-label" style={{ marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span className="accent-rule" />
                Archive Contents — Records 001–005
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.8rem, 4vw, 3rem)",
                  fontWeight: 300,
                  color: "var(--text)",
                }}
              >
                Browse the Collection
              </h2>
            </div>
            <Link
              href="/projects"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.65rem 1.5rem",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                (e.currentTarget as HTMLElement).style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
              }}
            >
              All Projects →
            </Link>
          </div>

          <div>
            {records.map((r, i) => (
              <ArchiveRecord key={r.number} {...r} index={i} />
            ))}
            <div style={{ borderTop: "1px solid var(--border)" }} />
          </div>
        </section>

        {/* ── MARQUEE TICKER ───────────────────────── */}
        <section
          style={{
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            padding: "1.1rem 0",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", overflow: "hidden" }}>
            <div className="marquee-track">
              {[...skills, ...skills].map((s, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: "3rem",
                  }}
                >
                  {s}
                  <span style={{ color: "var(--accent)", fontSize: "0.45rem" }}>✦</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────── */}
        <footer
          style={{
            padding: "2.5rem clamp(1.5rem, 6vw, 6rem)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <p className="text-meta">
            © {YEAR} Ziad Ayman — All records classified
          </p>
          <div style={{ display: "flex", gap: "2rem" }}>
            {[
              { label: "GitHub", href: "https://github.com/ziadayman00" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/ziad-ayman-6249122a4/" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-meta"
                style={{ transition: "color 0.2s" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--accent)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-muted)")}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/contact"
              className="text-meta"
              style={{ transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--accent)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-muted)")}
            >
              Contact
            </Link>
          </div>
        </footer>
      </main>
    </>
  );
}
