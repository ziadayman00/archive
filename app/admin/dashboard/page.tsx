"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "../../components/ThemeToggle";

interface Category { id: string; name: string; slug: string; order: number; }
interface Project {
  id: string; title: string; subtitle: string; year: string; sector: string;
  responsibility: string | null; impact: string | null; tech: string[];
  description: string; features: string[] | null; images: string[];
  live: string; github: string; comingSoon: boolean; inProgress: boolean; categoryId: string | null;
}

const EMPTY_FORM: Omit<Project, "id"> = {
  title: "", subtitle: "", year: new Date().getFullYear().toString(),
  sector: "", responsibility: "", impact: "", tech: [], description: "",
  features: [], images: [], live: "#", github: "#", comingSoon: false, inProgress: false, categoryId: null,
};

/* ─── Style tokens ─────────────────────────────── */
const ACCENT = "var(--accent)";
const base = "var(--bg)";
const surface = "var(--surface)";
const border = "var(--border)";
const textPrimary = "var(--text)";
const textMuted = "var(--text-muted)";

const monoLabel: React.CSSProperties = {
  display: "block", fontFamily: "var(--font-mono)", fontSize: "0.58rem",
  letterSpacing: "0.2em", textTransform: "uppercase", color: textMuted, marginBottom: "0.55rem",
};

const fieldInput: React.CSSProperties = {
  width: "100%", padding: "0.75rem 1rem",
  background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`,
  color: textPrimary, fontFamily: "var(--font-body)", fontSize: "0.82rem",
  outline: "none", transition: "border-color 0.2s, background 0.2s", boxSizing: "border-box",
};

function focusIn(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = "var(--accent)"; e.target.style.background = "color-mix(in srgb, var(--accent) 8%, transparent)";
}
function focusOut(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = border; e.target.style.background = "color-mix(in srgb, var(--text) 4%, transparent)";
}

function Field({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) {
  return (
    <div style={{ marginBottom: "1rem", gridColumn: span2 ? "1 / -1" : undefined }}>
      <label style={monoLabel}>{label}</label>
      {children}
    </div>
  );
}

function StatusBadge({ p }: { p: Project }) {
  const label = p.comingSoon ? "SOON" : p.inProgress ? "WIP" : "LIVE";
  const color = p.comingSoon ? "var(--text-muted)" : p.inProgress ? ACCENT : "#6aad6a";
  return <span style={{ fontSize: "0.55rem", padding: "0.2rem 0.6rem", border: `1px solid color-mix(in srgb, ${color} 44%, transparent)`, color, fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>{label}</span>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(EMPTY_FORM);
  const [isAdding, setIsAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    const res = await fetch("/api/projects");
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setProjects(data.projects || []);
    setCategories(data.categories || []);
  }, [router]);

  useEffect(() => { load(); }, [load]);

  const selectProject = (p: Project) => {
    setSelected(p); setIsAdding(false);
    setForm({
      title: p.title, subtitle: p.subtitle, year: p.year, sector: p.sector,
      responsibility: p.responsibility || "", impact: p.impact || "",
      tech: p.tech || [], description: p.description, features: p.features || [],
      images: p.images || [], live: p.live || "#", github: p.github || "#",
      comingSoon: p.comingSoon, inProgress: p.inProgress, categoryId: p.categoryId,
    });
  };
  const startNew = () => { setSelected(null); setIsAdding(true); setForm(EMPTY_FORM); };
  const cancel = () => { setSelected(null); setIsAdding(false); setForm(EMPTY_FORM); };
  const set = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const techArr = Array.isArray(form.tech) ? form.tech : String(form.tech).split(",").map(s => s.trim()).filter(Boolean);
      const featArr = Array.isArray(form.features) ? form.features : String(form.features || "").split("\n").map(s => s.trim()).filter(Boolean);
      const imgArr = Array.isArray(form.images) ? form.images : String(form.images || "").split("\n").map(s => s.trim()).filter(Boolean);
      const payload = { ...form, tech: techArr, features: featArr, images: imgArr, ...(selected ? { id: selected.id } : {}) };
      const res = await fetch("/api/projects", {
        method: selected ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) { showToast(selected ? "Project updated!" : "Project created! 🎉"); cancel(); load(); }
      else showToast(data.error || "Failed to save.", "error");
    } catch { showToast("An error occurred.", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch("/api/projects", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) { showToast("Project deleted."); setConfirmDelete(null); cancel(); load(); }
    else showToast("Failed to delete.", "error");
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const imageList = Array.isArray(form.images) ? (form.images as string[]) : String(form.images || "").split("\n").map(s => s.trim()).filter(Boolean);
  const removeImage = (idx: number) => set("images", imageList.filter((_, i) => i !== idx));
  const addImageUrl = (url: string) => { if (url.trim()) set("images", [...imageList, url.trim()]); };

  /* Upload files to Supabase storage */
  const handleFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (arr.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      arr.forEach(f => formData.append("files", f));
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.urls?.length) {
        set("images", [...imageList, ...data.urls]);
        showToast(`${data.urls.length} image${data.urls.length > 1 ? "s" : ""} uploaded!`);
      } else {
        showToast(data.error || "Upload failed", "error");
      }
    } catch { showToast("Upload error", "error"); }
    finally { setUploading(false); }
  };

  /* Tech tag helpers */
  const techList = Array.isArray(form.tech) ? (form.tech as string[]) : String(form.tech || "").split(",").map(s => s.trim()).filter(Boolean);
  const removeTech = (idx: number) => set("tech", techList.filter((_, i) => i !== idx));

  const currentImages = imageList;

  /* Filtered projects */
  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.subtitle.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || p.categoryId === filterCat;
    return matchSearch && matchCat;
  });

  const isFormOpen = isAdding || !!selected;

  return (
    <div style={{ minHeight: "100vh", background: base, color: textPrimary, fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "color-mix(in srgb, var(--bg) 95%, transparent)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${border}`,
        padding: "0 2rem", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 300, color: textPrimary }}>
            Archive <span style={{ color: ACCENT }}>/ Admin</span>
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.2em", color: "#6aad6a", opacity: 0.7, border: "1px solid #6aad6a44", padding: "0.2rem 0.6rem" }}>
            ● CONNECTED
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <ThemeToggle />
          <a href="/admin/experiments"
            style={{ padding: "0.5rem 1.1rem", background: "transparent", border: `1px solid ${border}`, color: textMuted, fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.1em", cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center" }}>
            ⚗ EXPERIMENTS
          </a>
          <button onClick={startNew}
            style={{ padding: "0.5rem 1.25rem", background: ACCENT, color: base, border: "none", fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.2em", cursor: "pointer", transition: "opacity 0.2s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.85"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
          >
            + NEW PROJECT
          </button>
          <button onClick={handleLogout}
            style={{ padding: "0.5rem 1rem", background: "transparent", border: `1px solid ${border}`, color: textMuted, fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.1em", cursor: "pointer" }}>
            LOGOUT
          </button>
        </div>
      </header>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: "fixed", top: "4.5rem", right: "2rem", zIndex: 100, padding: "0.85rem 1.5rem", background: "color-mix(in srgb, var(--bg) 95%, transparent)", border: `1px solid ${toast.type === "success" ? "color-mix(in srgb, var(--accent) 66%, transparent)" : "#c8323266"}`, borderLeft: `3px solid ${toast.type === "success" ? ACCENT : "#c83232"}`, color: textPrimary, fontSize: "0.82rem", backdropFilter: "blur(12px)" }}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div style={{ display: "grid", gridTemplateColumns: isFormOpen ? "360px 1fr" : "1fr", minHeight: "calc(100vh - 60px)" }}>
        {/* Left: Project list */}
        <div style={{ borderRight: isFormOpen ? `1px solid ${border}` : "none", display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 60px)", overflow: "hidden" }}>
          {/* Search & filter bar */}
          <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${border}`, background: surface }}>
            <input
              placeholder="Search projects..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...fieldInput, marginBottom: "0.6rem", padding: "0.6rem 0.85rem", fontSize: "0.78rem" }}
              onFocus={focusIn} onBlur={focusOut}
            />
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {[{ id: "all", name: "All" }, ...categories].map(c => (
                <button key={c.id} onClick={() => setFilterCat(c.id)}
                  style={{ padding: "0.25rem 0.7rem", fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.12em", border: `1px solid ${filterCat === c.id ? ACCENT : border}`, background: filterCat === c.id ? "color-mix(in srgb, var(--accent) 15%, transparent)" : "transparent", color: filterCat === c.id ? ACCENT : textMuted, cursor: "pointer", transition: "all 0.2s" }}>
                  {c.name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div style={{ padding: "0.65rem 1.25rem", borderBottom: `1px solid ${border}`, display: "flex", gap: "1.5rem" }}>
            <span style={{ ...monoLabel, margin: 0 }}>{filtered.length} / {projects.length} projects</span>
          </div>

          {/* List */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.length === 0 && (
              <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: textMuted, fontSize: "0.82rem" }}>
                No projects found.
              </div>
            )}
            {filtered.map((p) => {
              const cat = categories.find(c => c.id === p.categoryId);
              const thumb = p.images?.[0];
              return (
                <div key={p.id} onClick={() => selectProject(p)}
                  style={{
                    padding: "0.9rem 1.25rem", borderBottom: `1px solid ${border}`,
                    cursor: "pointer", display: "flex", gap: "0.85rem", alignItems: "center",
                    background: selected?.id === p.id ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "transparent",
                    borderLeft: `3px solid ${selected?.id === p.id ? ACCENT : "transparent"}`,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { if (selected?.id !== p.id) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)"; }}
                  onMouseLeave={e => { if (selected?.id !== p.id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  {/* Thumbnail */}
                  <div style={{ width: "52px", height: "40px", flexShrink: 0, background: "rgba(255,255,255,0.05)", overflow: "hidden", position: "relative" }}>
                    {thumb ? (
                      <img src={thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: textMuted, fontSize: "0.55rem", fontFamily: "var(--font-mono)" }}>IMG</div>
                    )}
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", fontWeight: 400, marginBottom: "0.15rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</p>
                    <p style={{ fontSize: "0.68rem", color: textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.subtitle}</p>
                  </div>
                  {/* Meta */}
                  <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.3rem" }}>
                    <StatusBadge p={p} />
                    <span style={{ ...monoLabel, margin: 0, fontSize: "0.52rem" }}>{cat?.name || "—"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Form panel */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div key="form"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              style={{ overflowY: "auto", maxHeight: "calc(100vh - 60px)", background: "rgba(255,255,255,0.01)" }}
            >
              {/* Image strip at the top */}
              {currentImages.length > 0 && (
                <div style={{ display: "flex", gap: "0", borderBottom: `1px solid ${border}`, height: "200px", overflow: "hidden" }}>
                  {currentImages.map((img, i) => (
                    <div key={i} style={{ flex: 1, position: "relative", overflow: "hidden", minWidth: 0 }}>
                      <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }} />
                      {/* Hover overlay */}
                      <div
                        className="img-overlay"
                        onClick={() => removeImage(i)}
                        style={{
                          position: "absolute", inset: 0, background: "rgba(200,50,50,0.7)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          opacity: 0, cursor: "pointer", transition: "opacity 0.2s",
                          flexDirection: "column", gap: "0.25rem",
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "0"}
                      >
                        <span style={{ color: "white", fontSize: "1.5rem" }}>×</span>
                        <span style={{ color: "white", fontSize: "0.6rem", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>REMOVE</span>
                      </div>
                      {/* Index badge */}
                      <div style={{ position: "absolute", bottom: "0.4rem", left: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "rgba(255,255,255,0.5)", background: "rgba(0,0,0,0.5)", padding: "0.15rem 0.4rem" }}>
                        {i + 1}/{currentImages.length}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Form header */}
              <div style={{ padding: "1.5rem 2rem 1rem", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: base, zIndex: 10 }}>
                <div>
                  <p style={monoLabel}>{selected ? "Editing project" : "New project"}</p>
                  <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "1.4rem", color: textPrimary, marginTop: "0.15rem" }}>
                    {form.title || (selected ? "Untitled" : "Create Project")}
                  </h2>
                </div>
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  {selected && (
                    <button onClick={() => setConfirmDelete(selected.id)}
                      style={{ padding: "0.5rem 0.9rem", background: "rgba(200,50,50,0.08)", border: "1px solid rgba(200,50,50,0.3)", color: "#e57373", fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", cursor: "pointer" }}>
                      DELETE
                    </button>
                  )}
                  <button onClick={cancel}
                    style={{ padding: "0.5rem 0.9rem", background: "transparent", border: `1px solid ${border}`, color: textMuted, fontFamily: "var(--font-mono)", fontSize: "0.6rem", cursor: "pointer" }}>
                    CANCEL
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    style={{ padding: "0.5rem 1.25rem", background: saving ? "color-mix(in srgb, var(--accent) 55%, transparent)" : ACCENT, color: "var(--bg)", border: "none", fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.2em", cursor: saving ? "wait" : "pointer", transition: "background 0.2s" }}>
                    {saving ? "SAVING..." : selected ? "SAVE CHANGES" : "CREATE"}
                  </button>
                </div>
              </div>

              {/* Form body */}
              <div style={{ padding: "2rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1.5rem" }}>
                  <Field label="Title *">
                    <input style={fieldInput} value={form.title} onChange={e => set("title", e.target.value)} placeholder="Project title" onFocus={focusIn} onBlur={focusOut} />
                  </Field>
                  <Field label="Subtitle *">
                    <input style={fieldInput} value={form.subtitle} onChange={e => set("subtitle", e.target.value)} placeholder="Short subtitle" onFocus={focusIn} onBlur={focusOut} />
                  </Field>
                  <Field label="Year *">
                    <input style={fieldInput} value={form.year} onChange={e => set("year", e.target.value)} placeholder="2025" maxLength={4} onFocus={focusIn} onBlur={focusOut} />
                  </Field>
                  <Field label="Sector *">
                    <input style={fieldInput} value={form.sector} onChange={e => set("sector", e.target.value)} placeholder="Design, Technology..." onFocus={focusIn} onBlur={focusOut} />
                  </Field>
                  <Field label="Category">
                    <select style={{ ...fieldInput, appearance: "none" as any }} value={form.categoryId || ""} onChange={e => set("categoryId", e.target.value || null)} onFocus={focusIn} onBlur={focusOut}>
                      <option value="">— No category —</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </Field>
                  <Field label="Status flags">
                    <div style={{ display: "flex", gap: "1.5rem", padding: "0.75rem 1rem", background: "color-mix(in srgb, var(--text) 4%, transparent)", border: `1px solid ${border}` }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: textMuted }}>
                        <input type="checkbox" checked={form.comingSoon} onChange={e => set("comingSoon", e.target.checked)} />
                        Coming Soon
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: textMuted }}>
                        <input type="checkbox" checked={form.inProgress} onChange={e => set("inProgress", e.target.checked)} />
                        In Progress
                      </label>
                    </div>
                  </Field>
                  <Field label="Live URL">
                    <input style={fieldInput} value={form.live || ""} onChange={e => set("live", e.target.value)} placeholder="https://..." onFocus={focusIn} onBlur={focusOut} />
                  </Field>
                  <Field label="GitHub URL">
                    <input style={fieldInput} value={form.github || ""} onChange={e => set("github", e.target.value)} placeholder="https://github.com/..." onFocus={focusIn} onBlur={focusOut} />
                  </Field>
                  <Field label="Role / Responsibility">
                    <input style={fieldInput} value={form.responsibility || ""} onChange={e => set("responsibility", e.target.value)} placeholder="Lead Developer..." onFocus={focusIn} onBlur={focusOut} />
                  </Field>
                  <Field label="Impact">
                    <input style={fieldInput} value={form.impact || ""} onChange={e => set("impact", e.target.value)} placeholder="10k users, awarded..." onFocus={focusIn} onBlur={focusOut} />
                  </Field>
                </div>

                {/* Tech tags */}
                <Field label="Tech / Tools (comma-separated)">
                  <input
                    style={fieldInput}
                    value={techList.join(", ")}
                    onChange={e => set("tech", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                    placeholder="React, TypeScript, Figma..."
                    onFocus={focusIn} onBlur={focusOut}
                  />
                  {techList.length > 0 && (
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.6rem" }}>
                      {techList.map((t, i) => (
                        <span key={i} style={{ padding: "0.2rem 0.65rem", border: `1px solid color-mix(in srgb, var(--accent) 44%, transparent)`, color: ACCENT, fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          {t}
                          <span onClick={() => removeTech(i)} style={{ cursor: "pointer", opacity: 0.5, fontSize: "0.8rem" }}>×</span>
                        </span>
                      ))}
                    </div>
                  )}
                </Field>

                <Field label="Description *" span2>
                  <textarea style={{ ...fieldInput, minHeight: "120px", resize: "vertical" }}
                    value={form.description} onChange={e => set("description", e.target.value)}
                    placeholder="Multi-line project description..." onFocus={focusIn} onBlur={focusOut} />
                </Field>

                <Field label="Key Features (one per line)" span2>
                  <textarea style={{ ...fieldInput, minHeight: "90px", resize: "vertical" }}
                    value={Array.isArray(form.features) ? (form.features as string[]).join("\n") : String(form.features || "")}
                    onChange={e => set("features", e.target.value.split("\n").map(s => s.trim()).filter(Boolean))}
                    placeholder="Feature one&#10;Feature two&#10;..." onFocus={focusIn} onBlur={focusOut} />
                </Field>

                {/* ─── Image Upload Section ─────────────────── */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={monoLabel}>Project Images</label>

                  {/* Drag-and-drop zone */}
                  <div
                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                    onDragEnter={e => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={e => {
                      e.preventDefault();
                      setIsDragging(false);
                      handleFiles(e.dataTransfer.files);
                    }}
                    onClick={() => document.getElementById("file-upload-input")?.click()}
                    style={{
                      border: `2px dashed ${isDragging ? ACCENT : border}`,
                      padding: "2rem",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      background: isDragging ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "color-mix(in srgb, var(--text) 2%, transparent)",
                      marginBottom: "1rem",
                      position: "relative",
                    }}
                  >
                    <input
                      id="file-upload-input"
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: "none" }}
                      onChange={e => { if (e.target.files) handleFiles(e.target.files); e.target.value = ""; }}
                    />
                    {uploading ? (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", color: ACCENT }}>
                        <span style={{ width: "18px", height: "18px", border: `2px solid ${ACCENT}`, borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.15em" }}>UPLOADING TO SUPABASE...</span>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem", opacity: isDragging ? 1 : 0.3 }}>⬆</div>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.12em", color: isDragging ? ACCENT : textMuted }}>
                          {isDragging ? "DROP TO UPLOAD" : "DRAG & DROP or CLICK TO SELECT"}
                        </p>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: textMuted, marginTop: "0.3rem", opacity: 0.5 }}>
                          Supports multiple files · JPG, PNG, WebP
                        </p>
                      </div>
                    )}
                  </div>

                  {/* URL input row */}
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                    <input
                      id="new-img-input"
                      style={{ ...fieldInput, flex: 1, fontSize: "0.75rem" }}
                      placeholder="Or paste an image URL and press Enter..."
                      onFocus={focusIn} onBlur={focusOut}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value;
                          addImageUrl(val);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const el = document.getElementById("new-img-input") as HTMLInputElement;
                        if (el) { addImageUrl(el.value); el.value = ""; }
                      }}
                      style={{ padding: "0 1rem", background: "color-mix(in srgb, var(--accent) 22%, transparent)", border: `1px solid color-mix(in srgb, var(--accent) 44%, transparent)`, color: ACCENT, fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.12em", cursor: "pointer", whiteSpace: "nowrap" }}
                    >
                      + ADD URL
                    </button>
                  </div>

                  {/* Image preview grid */}
                  {imageList.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "0.6rem" }}>
                      {imageList.map((img, i) => (
                        <div key={i} style={{ position: "relative", paddingTop: "75%", background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                          <img src={img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 50%, rgba(0,0,0,0.7))" }} />
                          <button onClick={() => removeImage(i)}
                            style={{ position: "absolute", top: "0.35rem", right: "0.35rem", width: "22px", height: "22px", background: "rgba(180,30,30,0.9)", border: "none", color: "white", fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "2px" }}>
                            ×
                          </button>
                          <div style={{ position: "absolute", bottom: "0.3rem", left: "0.4rem", fontFamily: "var(--font-mono)", fontSize: "0.45rem", color: "rgba(255,255,255,0.55)" }}>
                            {i + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state when no form open */}
        {!isFormOpen && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", color: textMuted }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "3rem", fontWeight: 300, opacity: 0.2 }}>↑</div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.15em", opacity: 0.5 }}>SELECT A PROJECT OR CREATE NEW</p>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "color-mix(in srgb, var(--bg) 85%, transparent)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
            onClick={() => setConfirmDelete(null)}>
            <motion.div initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "var(--bg)", border: `1px solid rgba(200,50,50,0.3)`, borderTop: "3px solid #c83232", padding: "2.5rem", maxWidth: "380px", width: "90%", textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: "0.6rem", color: "#e57373" }}>Permanent Deletion</div>
              <p style={{ fontSize: "0.82rem", color: textMuted, lineHeight: 1.7, marginBottom: "2rem" }}>
                This project will be <strong>permanently deleted</strong> from the Supabase database. This action cannot be undone.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <button onClick={() => setConfirmDelete(null)}
                  style={{ padding: "0.7rem 1.5rem", background: "transparent", border: `1px solid ${border}`, color: textMuted, fontFamily: "var(--font-mono)", fontSize: "0.62rem", cursor: "pointer" }}>
                  CANCEL
                </button>
                <button onClick={() => handleDelete(confirmDelete)}
                  style={{ padding: "0.7rem 1.5rem", background: "#c83232", color: "white", border: "none", fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.1em", cursor: "pointer" }}>
                  DELETE FOREVER
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
