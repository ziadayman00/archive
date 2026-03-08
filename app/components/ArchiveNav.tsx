"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";

const records = [
  { num: "001", label: "About",       href: "/about" },
  { num: "002", label: "Skills",      href: "/skills" },
  { num: "003", label: "Projects",    href: "/projects" },
  { num: "004", label: "Experiments", href: "/experiments" },
  { num: "005", label: "Contact",     href: "/contact" },
];

const YEAR = new Date().getFullYear();

export default function ArchiveNav() {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "1.25rem clamp(1.25rem, 4vw, 2.5rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
          backgroundColor: "color-mix(in srgb, var(--bg) 88%, transparent)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
              fontWeight: 500,
              letterSpacing: "0.05em",
              color: "var(--text)",
            }}
          >
            ZIAD&apos;S ARCHIVE
          </span>
          <span className="text-meta" style={{ fontSize: "0.55rem" }}>
            EST. {YEAR} — DIGITAL RECORDS
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="desktop-nav">
          <ul
            style={{
              display: "flex",
              gap: "2rem",
              listStyle: "none",
              alignItems: "center",
            }}
          >
            {records.map((r) => {
              const active = path === r.href;
              return (
                <li key={r.num}>
                  <Link
                    href={r.href}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "1px",
                      transition: "color 0.2s",
                      color: active ? "var(--accent)" : "var(--text-muted)",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) (e.currentTarget as HTMLElement).style.color = "var(--text)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                    }}
                  >
                    <span style={{ fontSize: "0.5rem", letterSpacing: "0.15em", fontFamily: "var(--font-body)" }}>
                      REC {r.num}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 400,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {r.label}
                    </span>
                  </Link>
                </li>
              );
            })}
            
            {/* Desktop Theme Toggle */}
            <li style={{ marginLeft: "1rem", display: "flex", alignItems: "center" }}>
              <ThemeToggle />
            </li>
          </ul>
        </nav>

        {/* Mobile controls */}
        <div className="mobile-menu-btn" style={{ gap: "1rem", alignItems: "center" }}>
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              background: "none",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "0.5rem 0.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <span style={{ display: "block", width: "18px", height: "1px", background: menuOpen ? "var(--accent)" : "var(--text-muted)", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translateY(5px)" : "none" }} />
            <span style={{ display: "block", width: "18px", height: "1px", background: menuOpen ? "transparent" : "var(--text-muted)", transition: "all 0.3s" }} />
            <span style={{ display: "block", width: "18px", height: "1px", background: menuOpen ? "var(--accent)" : "var(--text-muted)", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translateY(-5px)" : "none" }} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              top: "61px",
              left: 0,
              right: 0,
              zIndex: 99,
              background: "color-mix(in srgb, var(--bg) 97%, transparent)",
              borderBottom: "1px solid var(--border)",
              backdropFilter: "blur(14px)",
              padding: "1.5rem clamp(1.25rem, 4vw, 2.5rem) 2rem",
            }}
          >
            <nav>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0" }}>
                {records.map((r) => {
                  const active = path === r.href;
                  return (
                    <li key={r.num} style={{ borderBottom: "1px solid var(--border)" }}>
                      <Link
                        href={r.href}
                        onClick={() => setMenuOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "1rem 0",
                          color: active ? "var(--accent)" : "var(--text)",
                          transition: "color 0.2s",
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.5rem", letterSpacing: "0.2em", color: active ? "var(--accent)" : "var(--text-muted)" }}>
                            REC {r.num}
                          </span>
                          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 300 }}>
                            {r.label}
                          </span>
                        </div>
                        <span style={{ color: "var(--text-muted)", fontSize: "1.2rem" }}>→</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .desktop-nav { display: flex; }
        .mobile-menu-btn { display: none; }

        @media (max-width: 768px) {
          .desktop-nav { display: none; }
          .mobile-menu-btn { display: flex; }
        }
      `}</style>
    </>
  );
}
