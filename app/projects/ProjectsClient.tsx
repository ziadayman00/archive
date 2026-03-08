"use client";

import { motion } from "motion/react";
import Link from "next/link";
import ArchiveNav from "../components/ArchiveNav";
import type { AnyProject } from "../data/projects";

interface ProjectsClientProps {
  featuredProjects: AnyProject[];
  webProjects: AnyProject[];
  designProjects: AnyProject[];
}

const MONO = "var(--font-mono, monospace)";
const ACCENT = "var(--accent)";

function ProjectCard({ project, index }: { project: AnyProject; index: number }) {
  // Determine status (Live vs In Progress vs Coming Soon)
  let statusText = "Live";
  let statusColor = "#6aad6a"; // green
  if ("inProgress" in project && project.inProgress) {
    statusText = "In Progress";
    statusColor = ACCENT;
  } else if (project.comingSoon) {
    statusText = "Coming Soon";
    statusColor = "var(--text-muted)";
  }

  // Parse tech array safely
  const techArr = Array.isArray(project.tech)
    ? project.tech
    : typeof project.tech === "string" && project.tech
    ? (project.tech as string).split(",").map((t) => t.trim())
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/projects/${project.slug}`} style={{ display: "block", height: "100%" }}>
        <div
          className="stat-card"
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "2rem",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "rgba(196,106,45,0.4)";
            el.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "var(--border)";
            el.style.transform = "translateY(0)";
          }}
        >
          {/* Top Row: Year + Status */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
            <span style={{ fontFamily: MONO, fontSize: "0.8rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
              {project.year}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: MONO, fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: statusColor }}>
              <span style={{ fontSize: "0.8em" }}>●</span> {statusText}
            </span>
          </div>

          {/* Body: Title + Subtitle */}
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              fontWeight: 400,
              color: "var(--text)",
              lineHeight: 1.1,
              marginBottom: "0.75rem",
            }}>
              {project.title}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "2rem" }}>
              {project.subtitle}
            </p>
          </div>

          {/* Footer: Tech Tags + ID */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", flex: 1 }}>
              {techArr.filter(Boolean).slice(0, 4).map((t: string) => (
                <span key={t} style={{
                  fontFamily: MONO,
                  fontSize: "0.5rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.2rem 0.6rem",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--text-muted)",
                  background: "rgba(255,255,255,0.02)",
                }}>
                  {t}
                </span>
              ))}
              {techArr.length > 4 && (
                <span style={{ fontFamily: MONO, fontSize: "0.5rem", color: "var(--text-muted)", padding: "0.2rem", letterSpacing: "0.1em" }}>
                  +{techArr.length - 4} MORE
                </span>
              )}
            </div>

            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 300,
              color: ACCENT,
              opacity: 0.4,
              lineHeight: 1,
            }}>
              #{String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ProjectSection({ title, subtitle, projects, startIndex }: { title: string, subtitle: string, projects: AnyProject[], startIndex: number }) {
  if (projects.length === 0) return null;

  return (
    <section style={{ marginBottom: "6rem" }}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: "3rem", display: "flex", gap: "1.5rem", alignItems: "flex-end" }}
      >
        <div style={{ flex: 1 }}>
          <p className="text-label" style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span className="accent-rule" />
            {subtitle}
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 300,
            color: "var(--text)",
          }}>
            {title}
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.1em" }}>
          <span>{projects.length} RECORDS</span>
        </div>
      </motion.div>

      {/* Grid Layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "1.5rem",
      }}>
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={startIndex + i} />
        ))}
      </div>
    </section>
  );
}


export default function ProjectsClient({ featuredProjects, webProjects, designProjects }: ProjectsClientProps) {
  return (
    <>
      <ArchiveNav />
      <main style={{ paddingTop: "8rem", paddingBottom: "6rem", background: "var(--bg)" }}>

        {/* Page Header */}
        <div style={{ padding: "0 clamp(1.5rem, 6vw, 6rem)" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3rem" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "4rem", fontWeight: 300, color: ACCENT, opacity: 0.4, lineHeight: 1 }}>
                003
              </span>
              <div>
                <p className="text-label" style={{ marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="accent-rule" />
                  Project Case Files
                </p>
                <h1 className="text-section">Projects — Archived Works</h1>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <div style={{ padding: "0 clamp(1.5rem, 6vw, 6rem)" }}>
          <ProjectSection
            title="Full-Stack Applications"
            subtitle="Section I"
            projects={featuredProjects}
            startIndex={0}
          />

          <ProjectSection
            title="Web & Landing Pages"
            subtitle="Section II"
            projects={webProjects}
            startIndex={featuredProjects.length}
          />

          <ProjectSection
            title="Design & Branding"
            subtitle="Section III"
            projects={designProjects}
            startIndex={featuredProjects.length + webProjects.length}
          />
        </div>
      </main>
    </>
  );
}
