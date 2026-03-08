"use client";

import Link from "next/link";
import { motion } from "motion/react";

interface ArchiveRecordProps {
  number: string;
  category: string;
  title: string;
  description?: string;
  href: string;
  index?: number;
}

export default function ArchiveRecord({
  number,
  category,
  title,
  description,
  href,
  index = 0,
}: ArchiveRecordProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={href}
        style={{ display: "block" }}
      >
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "1.5rem 0",
            display: "grid",
            gridTemplateColumns: "4rem 1fr auto",
            alignItems: "center",
            gap: "2rem",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.paddingLeft = "1rem";
            el.style.borderTopColor = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.paddingLeft = "0";
            el.style.borderTopColor = "var(--border)";
          }}
        >
          {/* Record number */}
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 300,
              color: "var(--accent)",
              opacity: 0.8,
              lineHeight: 1,
            }}
          >
            {number}
          </span>

          {/* Content */}
          <div>
            <p className="text-label" style={{ marginBottom: "0.3rem" }}>
              {category}
            </p>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
                fontWeight: 400,
                color: "var(--text)",
                lineHeight: 1.1,
              }}
            >
              {title}
            </h3>
            {description && (
              <p
                style={{
                  marginTop: "0.4rem",
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.5,
                  maxWidth: "40rem",
                }}
              >
                {description}
              </p>
            )}
          </div>

          {/* Arrow */}
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              color: "var(--border)",
              transition: "color 0.2s, transform 0.2s",
            }}
          >
            →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
