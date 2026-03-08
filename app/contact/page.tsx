"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import ArchiveNav from "../components/ArchiveNav";

const socials = [
  { label: "GitHub", handle: "@ziadayman00", href: "https://github.com/ziadayman00", icon: Github },
  { label: "LinkedIn", handle: "Ziad Ayman", href: "https://www.linkedin.com/in/ziad-ayman-6249122a4/", icon: Linkedin },
  { label: "Email", handle: "ziad.ayman.dev@gmail.com", href: "mailto:ziad.ayman.dev@gmail.com", icon: Mail },
];

function FieldInput({
  label,
  id,
  type = "text",
  textarea = false,
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  textarea?: boolean;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const sharedStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 0",
    background: "transparent",
    border: "none",
    borderBottom: `1px solid ${focused ? "var(--accent)" : "var(--border)"}`,
    color: "var(--text)",
    fontSize: "0.9rem",
    fontFamily: "var(--font-body)",
    outline: "none",
    resize: "none" as const,
    transition: "border-color 0.2s",
    lineHeight: 1.6,
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: focused ? "var(--accent)" : "var(--text-muted)",
          marginBottom: "0.4rem",
          fontFamily: "var(--font-body)",
          transition: "color 0.2s",
        }}
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={5}
          placeholder={placeholder}
          style={sharedStyle}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          style={sharedStyle}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      )}
    </div>
  );
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

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
              005
            </span>
            <div>
              <p className="text-label" style={{ marginBottom: "0.25rem" }}>Transmission</p>
              <h1 className="text-section">Contact — Open Channel</h1>
            </div>
          </div>
          <div className="archive-line" style={{ marginBottom: "4rem" }} />
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "5rem",
            alignItems: "start",
          }}
        >
          {/* Left — Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-label" style={{ marginBottom: "0.5rem" }}>
              <span className="accent-rule" style={{ marginRight: "0.75rem" }} />
              Transmit a Record
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.1rem",
                fontStyle: "italic",
                fontWeight: 300,
                color: "var(--text-muted)",
                marginBottom: "3rem",
                lineHeight: 1.7,
              }}
            >
              Have a project in mind, a collaboration to propose, or just want to say hello?
              Leave a message — it will be filed and responded to.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  padding: "2.5rem",
                  border: "1px solid var(--accent)",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: "1.5rem", color: "var(--accent)" }}>✦</span>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    fontStyle: "italic",
                    color: "var(--text)",
                    marginTop: "1rem",
                  }}
                >
                  Record Transmitted
                </p>
                <p className="text-label" style={{ marginTop: "0.5rem" }}>
                  Message received — a response will follow
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <FieldInput label="Name" id="contact-name" placeholder="Your full name" />
                <FieldInput label="Email Address" id="contact-email" type="email" placeholder="your@email.com" />
                <FieldInput label="Subject" id="contact-subject" placeholder="Regarding..." />
                <FieldInput label="Message" id="contact-message" textarea placeholder="Compose your message here..." />

                <button
                  type="submit"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    padding: "0.85rem 2rem",
                    background: "var(--accent)",
                    color: "var(--bg)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--accent-h)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--accent)")}
                >
                  <Send size={12} />
                  Transmit Record
                </button>
              </form>
            )}
          </motion.div>

          {/* Right — Social links + info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-label" style={{ marginBottom: "2rem" }}>
              <span className="accent-rule" style={{ marginRight: "0.75rem" }} />
              Direct Channels
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2.5rem 1fr",
                    alignItems: "center",
                    gap: "1.25rem",
                    padding: "1.25rem 0",
                    borderBottom: "1px solid var(--border)",
                    transition: "padding-left 0.25s, border-color 0.25s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.paddingLeft = "0.75rem";
                    el.style.borderBottomColor = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.paddingLeft = "0";
                    el.style.borderBottomColor = "var(--border)";
                  }}
                >
                  <s.icon size={16} color="var(--accent)" strokeWidth={1.5} />
                  <div>
                    <p className="text-label" style={{ marginBottom: "0.2rem" }}>{s.label}</p>
                    <p style={{ fontSize: "0.875rem", color: "var(--text)" }}>{s.handle}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Response note */}
            <div
              style={{
                marginTop: "3rem",
                padding: "1.5rem",
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <p className="text-label" style={{ marginBottom: "0.5rem" }}>Response Time</p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "1rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                }}
              >
                Records are reviewed and responded to within 24–48 hours.
                Collaboration enquiries are always welcome.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
