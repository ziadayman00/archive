"use client";

import { motion } from "motion/react";
import ArchiveNav from "../components/ArchiveNav";

const YEAR = new Date().getFullYear();

const timeline = [
  { year: "2021", note: "Began frontend journey — HTML, CSS, vanilla JavaScript." },
  { year: "2022", note: "Discovered React. Built first full-stack apps with Node.js." },
  { year: "2023", note: "Deep dive into Next.js App Router, TypeScript, and Tailwind." },
  { year: "2024", note: "Launched SnippetVault. Mastered Prisma, PostgreSQL, and auth flows." },
  { year: "2025", note: "Refining craft — design systems, animations, editorial aesthetics." },
];

const stats = [
  { label: "Years", value: "4+" },
  { label: "Projects", value: "10+" },
  { label: "Stack", value: "12+" },
  { label: "Status", value: "Open to Work" },
];

function FadeIn({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <>
      <ArchiveNav />
      <main style={{ paddingTop: "8rem", paddingBottom: "6rem", padding: "8rem clamp(1.5rem, 6vw, 6rem) 6rem" }}>

        {/* Page header */}
        <FadeIn>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "4rem",
                fontWeight: 300,
                color: "var(--accent)",
                opacity: 0.4,
                lineHeight: 1,
              }}
            >
              001
            </span>
            <div>
              <p className="text-label" style={{ marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="accent-rule" />
                Personnel File
              </p>
              <h1 className="text-section">About — The Engineer</h1>
            </div>
          </div>
          <div className="archive-line" style={{ marginBottom: "3.5rem" }} />
        </FadeIn>

        {/* ─── Stats row ─── */}
        <FadeIn delay={0.05}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "1px",
              marginBottom: "4rem",
              background: "var(--border)",
              border: "1px solid var(--border)",
            }}
          >
            {stats.map((s) => (
              <div
                key={s.label}
                style={{
                  padding: "1.5rem",
                  background: "var(--surface)",
                  position: "relative",
                }}
              >
                <p className="text-label" style={{ marginBottom: "0.5rem" }}>{s.label}</p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 400, color: "var(--text)", lineHeight: 1 }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* ─── Main content: 2-column on desktop ─── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "3rem",
            marginBottom: "4rem",
          }}
        >
          {/* Identity card */}
          <FadeIn delay={0.1}>
            <div>
              <p className="text-label" style={{ marginBottom: "1rem" }}>Identification</p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  lineHeight: 1.1,
                  marginBottom: "2rem",
                  color: "var(--text)",
                }}
              >
                Ziad Ayman,<br />Frontend Engineer
              </h2>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { label: "Location",      value: "Cairo, Egypt" },
                  { label: "Specialisation", value: "Frontend Engineering" },
                  { label: "Status",         value: "Open to opportunities" },
                  { label: "Archive Vol.",   value: `I — ${YEAR}` },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "1rem",
                      padding: "0.75rem 0",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <span className="text-label">{item.label}</span>
                    <span style={{ fontSize: "0.82rem", color: "var(--text)", textAlign: "right" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Field notes */}
          <FadeIn delay={0.15}>
            <div>
              <p className="text-label" style={{ marginBottom: "1rem" }}>Field Notes</p>
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderLeft: "3px solid var(--accent)",
                  padding: "2rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Corner stamp */}
                <div
                  className="archive-stamp"
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    opacity: 0.15,
                    width: "3.5rem",
                    height: "3.5rem",
                    fontSize: "0.45rem",
                  }}
                >
                  <span>ON</span>
                  <span>FILE</span>
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1rem, 2vw, 1.2rem)",
                    fontWeight: 300,
                    fontStyle: "italic",
                    lineHeight: 1.85,
                    color: "var(--text-muted)",
                  }}
                >
                  I build things for the web — from polished interfaces to full-stack
                  applications. My focus is on creating experiences that are technically
                  excellent and aesthetically considered. I believe the best code is code
                  that people never notice, because it just works beautifully.
                </p>
                <p
                  style={{
                    marginTop: "1.5rem",
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1rem, 2vw, 1.2rem)",
                    fontWeight: 300,
                    fontStyle: "italic",
                    lineHeight: 1.85,
                    color: "var(--text-muted)",
                  }}
                >
                  When I&apos;m not building production apps, I&apos;m in the lab —
                  experimenting with animations, design systems, and the creative edges
                  of the web platform.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* ─── Timeline ─── */}
        <FadeIn delay={0.2}>
          <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: "3.5rem",
            }}
          >
            <p className="text-label" style={{ marginBottom: "2.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span className="accent-rule" />
              Engineering Timeline
            </p>

            <div style={{ position: "relative" }}>
              {/* Vertical track */}
              <div
                style={{
                  position: "absolute",
                  left: "4.5rem",
                  top: 0,
                  bottom: 0,
                  width: "1px",
                  background: "var(--border)",
                }}
              />

              <div style={{ display: "flex", flexDirection: "column" }}>
                {timeline.map((item, i) => {
                  const isLast = i === timeline.length - 1;
                  return (
                    <div
                      key={item.year}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "4.5rem 2rem 1fr",
                        alignItems: "start",
                        gap: "0 1rem",
                        padding: "1.35rem 0",
                        borderBottom: i < timeline.length - 1 ? "1px solid var(--border)" : "none",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1rem",
                          fontWeight: 500,
                          color: isLast ? "var(--accent)" : "var(--text-muted)",
                          textAlign: "right",
                          paddingTop: "0.15rem",
                        }}
                      >
                        {item.year}
                      </span>
                      <div style={{ display: "flex", justifyContent: "center", paddingTop: "0.45rem" }}>
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: isLast ? "var(--accent)" : "var(--border)",
                            border: `2px solid var(--surface)`,
                            zIndex: 1,
                            boxShadow: isLast ? `0 0 0 3px ${isLast ? "rgba(196,106,45,0.2)" : "transparent"}` : "none",
                          }}
                        />
                      </div>
                      <div>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.75 }}>
                          {item.note}
                        </p>
                        {isLast && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", marginTop: "0.4rem", padding: "0.2rem 0.6rem", border: "1px solid rgba(196,106,45,0.3)", color: "var(--accent)", fontSize: "0.55rem", fontFamily: "var(--font-body)", letterSpacing: "0.15em" }}>
                            ● CURRENT
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </FadeIn>
      </main>
    </>
  );
}
