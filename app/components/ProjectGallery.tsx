"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectGalleryProps {
  images: (string | null)[];
  title: string;
  accentColor: string;
}

export default function ProjectGallery({ images, title, accentColor }: ProjectGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const validImages = images.filter((img): img is string => img !== null);
  if (validImages.length === 0) return null;

  const primary = validImages[0];
  const rest = validImages.slice(1);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i! - 1 + validImages.length) % validImages.length);
  const next = () => setLightboxIndex((i) => (i! + 1) % validImages.length);

  return (
    <>
      <section style={{ marginTop: "4rem" }}>
        <p className="text-label" style={{ marginBottom: "1.5rem" }}>
          <span className="accent-rule" style={{ marginRight: "0.75rem" }} />
          Visual Documentation — {validImages.length} {validImages.length === 1 ? "Exhibit" : "Exhibits"}
        </p>

        {/* Hero / primary image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => openLightbox(0)}
          style={{
            position: "relative",
            cursor: "pointer",
            overflow: "hidden",
            border: `1px solid ${accentColor}33`,
            marginBottom: "1rem",
            background: "var(--surface)",
          }}
        >
          {/* Exhibit label */}
          <div
            style={{
              position: "absolute",
              top: "1rem",
              left: "1rem",
              zIndex: 2,
              background: "color-mix(in srgb, var(--bg) 80%, transparent)",
              backdropFilter: "blur(8px)",
              padding: "0.3rem 0.7rem",
              border: `1px solid ${accentColor}55`,
            }}
          >
            <span style={{ fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: accentColor, fontFamily: "var(--font-body)" }}>
              Exhibit 01 — Primary
            </span>
          </div>

          {/* Expand hint */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "color-mix(in srgb, var(--bg) 40%, transparent)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            <span
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--text)",
                opacity: 0,
                transition: "opacity 0.3s",
                fontFamily: "var(--font-body)",
                padding: "0.5rem 1rem",
                border: "1px solid var(--text)",
              }}
              className="gallery-hint"
            >
              View Full
            </span>
          </div>

          <div style={{ aspectRatio: "16/9", position: "relative", width: "100%" }}>
            <Image
              src={primary}
              alt={`${title} — primary screenshot`}
              fill
              style={{ objectFit: "cover", objectPosition: "top", transition: "transform 0.4s ease" }}
              sizes="(max-width: 768px) 100vw, 60vw"
              onMouseEnter={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1.02)")}
              onMouseLeave={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1)")}
            />
          </div>
        </motion.div>

        {/* Thumbnail strip */}
        {rest.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(rest.length, 4)}, 1fr)`,
              gap: "0.75rem",
            }}
          >
            {rest.map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                onClick={() => openLightbox(i + 1)}
                style={{
                  position: "relative",
                  cursor: "pointer",
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  transition: "border-color 0.25s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = accentColor)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
              >
                {/* Exhibit badge */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "0.4rem",
                    right: "0.4rem",
                    zIndex: 2,
                    background: "color-mix(in srgb, var(--bg) 85%, transparent)",
                    padding: "0.15rem 0.4rem",
                  }}
                >
                  <span style={{ fontSize: "0.5rem", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                    {String(i + 2).padStart(2, "0")}
                  </span>
                </div>

                <div style={{ aspectRatio: "16/9", position: "relative" }}>
                  <Image
                    src={src}
                    alt={`${title} — screenshot ${i + 2}`}
                    fill
                    style={{ objectFit: "cover", objectPosition: "top", transition: "transform 0.35s ease" }}
                    sizes="(max-width: 768px) 50vw, 20vw"
                    onMouseEnter={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1)")}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── Lightbox ─────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9998,
              background: "color-mix(in srgb, var(--bg) 95%, transparent)",
              backdropFilter: "blur(16px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
            }}
            onClick={closeLightbox}
          >
            {/* Counter */}
            <div style={{ position: "absolute", top: "1.5rem", left: "2rem" }}>
              <span className="text-label">
                Exhibit {String(lightboxIndex + 1).padStart(2, "0")} / {String(validImages.length).padStart(2, "0")}
              </span>
            </div>

            {/* Close */}
            <button
              onClick={closeLightbox}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "2rem",
                background: "none",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "0.4rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--accent)"; el.style.color = "var(--accent)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--border)"; el.style.color = "var(--text-muted)"; }}
            >
              <X size={18} />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "1100px",
                border: `1px solid ${accentColor}44`,
              }}
            >
              <div style={{ aspectRatio: "16/9", position: "relative" }}>
                <Image
                  src={validImages[lightboxIndex]}
                  alt={`${title} — exhibit ${lightboxIndex + 1}`}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="100vw"
                />
              </div>
            </motion.div>

            {/* Prev / Next */}
            {validImages.length > 1 && (
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={prev}
                  style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer", padding: "0.6rem 1.2rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "var(--font-body)", transition: "border-color 0.2s, color 0.2s" }}
                  onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--accent)"; el.style.color = "var(--accent)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--border)"; el.style.color = "var(--text-muted)"; }}
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <button
                  onClick={next}
                  style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer", padding: "0.6rem 1.2rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "var(--font-body)", transition: "border-color 0.2s, color 0.2s" }}
                  onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--accent)"; el.style.color = "var(--accent)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--border)"; el.style.color = "var(--text-muted)"; }}
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}

            {/* Thumbnail strip at bottom */}
            {validImages.length > 1 && (
              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", overflowX: "auto", maxWidth: "100%" }}
                onClick={(e) => e.stopPropagation()}
              >
                {validImages.map((src, i) => (
                  <div
                    key={src}
                    onClick={() => setLightboxIndex(i)}
                    style={{
                      width: "64px",
                      height: "40px",
                      position: "relative",
                      flexShrink: 0,
                      cursor: "pointer",
                      border: `2px solid ${i === lightboxIndex ? accentColor : "transparent"}`,
                      opacity: i === lightboxIndex ? 1 : 0.45,
                      transition: "opacity 0.2s, border-color 0.2s",
                    }}
                  >
                    <Image src={src} alt="" fill style={{ objectFit: "cover" }} sizes="64px" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
