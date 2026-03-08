"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch {
      setError("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Animated background grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: "linear-gradient(rgba(200,180,140,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,180,140,1) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Accent glow */}
      <div style={{
        position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)",
        width: "600px", height: "400px",
        background: "radial-gradient(ellipse at center, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Left — Branding panel */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "4rem",
        borderRight: `1px solid var(--border)`,
      }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          <div style={{ marginBottom: "3rem" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.3em", color: "color-mix(in srgb, var(--accent) 70%, transparent)", textTransform: "uppercase" }}>
              ARCHIVE_SYS / ADMIN
            </span>
            <div style={{ width: "32px", height: "1px", background: "color-mix(in srgb, var(--accent) 50%, transparent)", marginTop: "1rem" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 6vw, 6rem)", fontWeight: 300, color: "var(--text)", lineHeight: 1, marginBottom: "2rem" }}>
            Control
            <br />
            <span style={{ color: "color-mix(in srgb, var(--accent) 80%, transparent)" }}>Centre</span>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "color-mix(in srgb, var(--text) 50%, transparent)", lineHeight: 1.8, maxWidth: "320px" }}>
            Manage your portfolio projects — add new case files, edit existing ones, or remove archived works.
          </p>

          <div style={{ marginTop: "4rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {["Full CRUD Project Management", "Supabase Database Integration", "Real-time Updates"].map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "color-mix(in srgb, var(--accent) 60%, transparent)" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.1em", color: "color-mix(in srgb, var(--text) 30%, transparent)" }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right — Login form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ width: "100%", maxWidth: "420px" }}
        >
          {/* Card */}
          <div style={{
            background: "color-mix(in srgb, var(--text) 3%, transparent)",
            border: `1px solid var(--border)`,
            padding: "2.5rem",
            backdropFilter: "blur(10px)",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Top accent */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, color-mix(in srgb, var(--accent) 80%, transparent), color-mix(in srgb, var(--accent) 20%, transparent))" }} />

            <div style={{ marginBottom: "2.5rem" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.25em", color: "color-mix(in srgb, var(--accent) 60%, transparent)", marginBottom: "0.75rem", textTransform: "uppercase" }}>
                Authentication Required
              </p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 300, color: "var(--text)" }}>
                Sign In
              </h2>
            </div>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  style={{ padding: "0.8rem 1rem", background: "rgba(200,50,50,0.08)", border: "1px solid rgba(200,50,50,0.2)", color: "#e57373", fontSize: "0.8rem", fontFamily: "var(--font-body)" }}>
                  {error}
                </motion.div>
              )}

              <div>
                <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.2em", color: "color-mix(in srgb, var(--text) 30%, transparent)", marginBottom: "0.6rem", textTransform: "uppercase" }}>
                  Email Address
                </label>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  style={{
                    width: "100%", padding: "0.9rem 1rem",
                    background: "color-mix(in srgb, var(--text) 4%, transparent)",
                    border: `1px solid color-mix(in srgb, var(--text) 10%, transparent)`,
                    color: "var(--text)",
                    fontFamily: "var(--font-body)", fontSize: "0.85rem",
                    outline: "none", transition: "border-color 0.2s, background 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={e => { e.target.style.borderColor = "color-mix(in srgb, var(--accent) 60%, transparent)"; e.target.style.background = "color-mix(in srgb, var(--accent) 4%, transparent)"; }}
                  onBlur={e => { e.target.style.borderColor = "color-mix(in srgb, var(--text) 10%, transparent)"; e.target.style.background = "color-mix(in srgb, var(--text) 4%, transparent)"; }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.2em", color: "color-mix(in srgb, var(--text) 30%, transparent)", marginBottom: "0.6rem", textTransform: "uppercase" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    required
                    style={{
                      width: "100%", padding: "0.9rem 3rem 0.9rem 1rem",
                      background: "color-mix(in srgb, var(--text) 4%, transparent)",
                      border: `1px solid color-mix(in srgb, var(--text) 10%, transparent)`,
                      color: "var(--text)",
                      fontFamily: "var(--font-body)", fontSize: "0.85rem",
                      outline: "none", transition: "border-color 0.2s, background 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={e => { e.target.style.borderColor = "color-mix(in srgb, var(--accent) 60%, transparent)"; e.target.style.background = "color-mix(in srgb, var(--accent) 4%, transparent)"; }}
                    onBlur={e => { e.target.style.borderColor = "color-mix(in srgb, var(--text) 10%, transparent)"; e.target.style.background = "color-mix(in srgb, var(--text) 4%, transparent)"; }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "color-mix(in srgb, var(--text) 30%, transparent)", cursor: "pointer", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
                    {showPass ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                style={{
                  marginTop: "0.75rem", width: "100%", padding: "1rem",
                  background: loading ? "color-mix(in srgb, var(--accent) 40%, transparent)" : "color-mix(in srgb, var(--accent) 90%, transparent)",
                  color: "var(--bg)", border: "none",
                  fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase",
                  cursor: loading ? "wait" : "pointer",
                  transition: "background 0.2s, transform 0.15s",
                  position: "relative", overflow: "hidden",
                }}
                onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = "var(--accent)"; }}
                onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb, var(--accent) 90%, transparent)"; }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <span style={{ width: "14px", height: "14px", border: "1.5px solid #0a0a0a", borderTop: "1.5px solid transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                    Authenticating...
                  </span>
                ) : "Authenticate"}
              </button>
            </form>

            <p style={{ marginTop: "2rem", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.15em", color: "color-mix(in srgb, var(--text) 15%, transparent)" }}>
              SESSION ENCRYPTED · HTTP-ONLY COOKIE
            </p>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
