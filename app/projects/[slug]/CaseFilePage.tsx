"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import ArchiveNav from "../../components/ArchiveNav";
import ProjectGallery from "../../components/ProjectGallery";
import type { AnyProject } from "../../data/projects";

export default function CaseFilePage({ project }: { project: AnyProject }) {
  const isFeatured = "features" in project;

  return (
    <>
      <ArchiveNav />
      <main style={{ paddingTop: "8rem", paddingBottom: "6rem", background: "var(--bg)" }}>

        <div style={{ padding: "0 clamp(1.5rem, 6vw, 6rem)", maxWidth: "1600px", margin: "0 auto" }}>
          
          {/* Back Button */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: "4rem" }}>
            <Link
              href="/projects"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
            >
              <ArrowLeft size={14} />
              Return to Index
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: "5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <span className="accent-rule" />
              <p className="text-label">
                Case File {project.id} — {project.sector}
              </p>
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3.5rem, 8vw, 6.5rem)",
                fontWeight: 300,
                lineHeight: 0.95,
                color: project.color || "var(--accent)",
                marginBottom: "1.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              {project.title}
            </h1>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
                fontStyle: "italic",
                fontWeight: 300,
                color: "var(--text-muted)",
                maxWidth: "800px",
              }}
            >
              {project.subtitle}
            </p>
          </motion.div>

          {/* Two-column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "5rem", alignItems: "start" }}>

            {/* ── Left column: Content ─────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
              
              {/* Overview */}
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <p className="text-label" style={{ marginBottom: "1.5rem" }}>Overview</p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 300, lineHeight: 1.8, color: "var(--text-muted)" }}>
                  {project.description}
                </p>
              </motion.section>

              {/* Features — featured projects only */}
              {isFeatured && project.features && project.features.length > 0 && (
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                  <p className="text-label" style={{ marginBottom: "2rem" }}>Key Features</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {project.features.filter(Boolean).map((feat: string, i: number) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem" }}>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--accent)", opacity: 0.6, flexShrink: 0 }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{feat}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Gallery */}
              {project.images && project.images.length > 0 && (
                <ProjectGallery
                  images={project.images}
                  title={project.title}
                  accentColor={project.color}
                />
              )}
            </div>

            {/* ── Right column: Metadata ────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
              <div style={{ position: "sticky", top: "8rem", display: "flex", flexDirection: "column", gap: "3rem" }}>
                
                {/* Meta List */}
                <div>
                  <p className="text-label" style={{ marginBottom: "2rem" }}>Metadata</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {[
                      { label: "Year",   value: project.year },
                      { label: "Sector", value: project.sector },
                      ...("responsibility" in project ? [{ label: "Role",   value: (project as { responsibility: string }).responsibility }] : []),
                      ...("impact"         in project ? [{ label: "Impact", value: (project as { impact: string }).impact }]                 : []),
                      { label: "Status", value: project.comingSoon ? "Coming Soon" : ("inProgress" in project && project.inProgress) ? "In Progress" : "Live" },
                    ].map((m) => (
                      <div key={m.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "2rem" }}>
                        <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                          {m.label}
                        </span>
                        <span style={{ fontSize: "0.9rem", color: "var(--text)", textAlign: "right", fontWeight: 300 }}>
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                {project.tech && (
                  <div>
                    <span className="text-label" style={{ display: "block", marginBottom: "1.5rem" }}>
                      {project.sector === "Design" ? "Tools Used" : "Tech Stack"}
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {(Array.isArray(project.tech) ? project.tech : String(project.tech).split(",")).map((t: string) => t.trim()).filter(Boolean).map((tech: string) => (
                        <span
                          key={tech}
                          style={{
                            fontSize: "0.55rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            padding: "0.3rem 0.8rem",
                            background: "rgba(255,255,255,0.02)",
                            border: `1px solid rgba(255,255,255,0.08)`,
                            color: "var(--text-muted)",
                            fontFamily: "var(--font-mono, monospace)"
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTAs */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                  {!project.comingSoon && project.live && project.live !== "#" && (
                    <a
                      href={project.live || ""} target="_blank" rel="noreferrer"
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                        padding: "1rem", background: "var(--text)", color: "var(--bg)",
                        fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase",
                        fontFamily: "var(--font-mono, monospace)", transition: "opacity 0.2s"
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.8")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                    >
                      <ExternalLink size={14} /> Open Live Project
                    </a>
                  )}
                  {project.github && project.github !== "#" && (
                    <a
                      href={project.github || ""} target="_blank" rel="noreferrer"
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                        padding: "1rem", color: "var(--text-muted)",
                        fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase",
                        fontFamily: "var(--font-mono, monospace)", transition: "color 0.2s"
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
                    >
                      <Github size={14} /> View Repository
                    </a>
                  )}
                  {project.comingSoon && (
                    <div style={{
                      padding: "1rem", border: "1px dashed var(--border)",
                      textAlign: "center", fontSize: "0.7rem", letterSpacing: "0.15em",
                      textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)"
                    }}>
                      Deploying Soon
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

          </div>{/* end grid */}
        </div>
      </main>
    </>
  );
}

