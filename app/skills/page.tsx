"use client";

import { motion } from "motion/react";
import ArchiveNav from "../components/ArchiveNav";

const skillCategories = [
  {
    id: "01",
    label: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "JavaScript (ES2024)", "HTML5", "CSS3"],
  },
  {
    id: "02",
    label: "Styling",
    skills: ["Tailwind CSS", "CSS Animations", "Motion", "GSAP", "Figma", "Responsive Design"],
  },
  {
    id: "03",
    label: "Backend",
    skills: ["Node.js", "Prisma ORM", "PostgreSQL", "REST APIs", "Authentication", "Paymob"],
  },
  {
    id: "04",
    label: "Tools",
    skills: ["Git / GitHub", "VS Code", "Vercel", "Postman", "npm / pnpm", "Linux CLI"],
  },
];

export default function SkillsPage() {
  return (
    <>
      <ArchiveNav />
      <main style={{ paddingTop: "8rem", paddingBottom: "6rem", padding: "8rem clamp(1.5rem, 6vw, 6rem) 6rem" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "4rem" }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "4rem",
                fontWeight: 300,
                color: "var(--accent)",
                opacity: 0.5,
                lineHeight: 1,
              }}
            >
              002
            </span>
            <div>
              <p className="text-label" style={{ marginBottom: "0.25rem" }}>Technical Dossier</p>
              <h1 className="text-section">Skills — Capabilities Index</h1>
            </div>
          </div>
          <div className="archive-line" style={{ marginBottom: "5rem" }} />
        </motion.div>

        {/* Skills grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "0",
          }}
        >
          {skillCategories.map((cat, ci) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: ci * 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                borderLeft: ci === 0 ? "1px solid var(--border)" : "none",
                borderRight: "1px solid var(--border)",
                borderTop: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
                padding: "2.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "2rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "3.5rem",
                    fontWeight: 300,
                    color: "var(--accent)",
                    opacity: 0.3,
                    lineHeight: 1,
                  }}
                >
                  {cat.id}
                </span>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    fontWeight: 400,
                    color: "var(--text)",
                  }}
                >
                  {cat.label}
                </h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {cat.skills.map((skill, si) => (
                  <div
                    key={skill}
                    style={{
                      padding: "0.65rem 0",
                      borderBottom: si < cat.skills.length - 1 ? "1px solid var(--border)" : "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      transition: "color 0.2s, padding-left 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.paddingLeft = "0.5rem";
                      const span = (e.currentTarget as HTMLElement).querySelector("span:last-child");
                      if (span) (span as HTMLElement).style.color = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.paddingLeft = "0";
                      const span = (e.currentTarget as HTMLElement).querySelector("span:last-child");
                      if (span) (span as HTMLElement).style.color = "var(--text-muted)";
                    }}
                  >
                    <span
                      style={{
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        background: "var(--accent)",
                        flexShrink: 0,
                        opacity: 0.6,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                        transition: "color 0.2s",
                      }}
                    >
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Proficiency note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            marginTop: "4rem",
            padding: "2rem",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            display: "flex",
            gap: "2rem",
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              color: "var(--accent)",
              opacity: 0.5,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ✦
          </span>
          <div>
            <p className="text-label" style={{ marginBottom: "0.5rem" }}>Field Note</p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.1rem",
                fontStyle: "italic",
                fontWeight: 300,
                color: "var(--text-muted)",
                lineHeight: 1.7,
              }}
            >
              Skills are most meaningful in context. See the Project Case Files (Record 003)
              for demonstrations of these capabilities applied to real problems.
            </p>
          </div>
        </motion.div>
      </main>
    </>
  );
}
