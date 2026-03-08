"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "../../components/ThemeToggle";
import ArchiveNav from "../../components/ArchiveNav";

interface Experiment {
  id: string;
  title: string;
  description: string;
  tech: string[];
  previewUrl: string | null;
  codeUrl: string | null;
  category: string;
  image: string | null;
  slug: string;
  published: boolean;
  order: number;
}

interface Note {
  id: string;
  title: string;
  body: string;
  tags: string[];
  slug: string;
  published: boolean;
}

const ACCENT = "var(--accent)";
const base = "var(--bg)";
const surface = "var(--surface)";
const border = "var(--border)";
const textPrimary = "var(--text)";
const textMuted = "var(--text-muted)";
const MONO = "var(--font-mono,monospace)";

const fieldInput: React.CSSProperties = {
  width: "100%", padding: "0.75rem 1rem",
  background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`,
  color: textPrimary, fontFamily: "var(--font-body)", fontSize: "0.82rem",
  outline: "none", transition: "border-color 0.2s, background 0.2s", boxSizing: "border-box",
};
const monoLabel: React.CSSProperties = {
  display: "block", fontFamily: MONO, fontSize: "0.58rem",
  letterSpacing: "0.2em", textTransform: "uppercase", color: textMuted, marginBottom: "0.55rem",
};
function focusIn(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = "var(--accent)"; e.target.style.background = "color-mix(in srgb, var(--accent) 8%, transparent)";
}
function focusOut(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = border; e.target.style.background = "color-mix(in srgb, var(--text) 4%, transparent)";
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={monoLabel}>{label}</label>
      {children}
    </div>
  );
}

const EMPTY_EXP: Omit<Experiment, "id"> = {
  title: "", description: "", tech: [], previewUrl: "", codeUrl: "",
  category: "animation", image: "", slug: "", published: true, order: 0,
};
const EMPTY_NOTE: Omit<Note, "id"> = {
  title: "", body: "", tags: [], slug: "", published: true,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminExperiments() {
  const router = useRouter();
  const [tab, setTab] = useState<"experiments" | "notes">("experiments");
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Experiment form state
  const [selExp, setSelExp] = useState<Experiment | null>(null);
  const [addingExp, setAddingExp] = useState(false);
  const [expForm, setExpForm] = useState<Omit<Experiment, "id">>(EMPTY_EXP);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Note form state
  const [selNote, setSelNote] = useState<Note | null>(null);
  const [addingNote, setAddingNote] = useState(false);
  const [noteForm, setNoteForm] = useState<Omit<Note, "id">>(EMPTY_NOTE);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const checkAuth = useCallback(async (res: Response) => {
    if (res.status === 401) { router.push("/admin/login"); return false; }
    return true;
  }, [router]);

  const loadAll = useCallback(async () => {
    const [expRes, noteRes] = await Promise.all([
      fetch("/api/experiments"),
      fetch("/api/notes"),
    ]);
    if (!await checkAuth(expRes)) return;
    const expData = await expRes.json();
    const noteData = await noteRes.json();
    setExperiments(expData.experiments || []);
    setNotes(noteData.notes || []);
  }, [checkAuth]);

  useEffect(() => { loadAll(); }, [loadAll]);

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
        setExpForm(p => ({ ...p, image: data.urls[0] }));
        showToast("Image uploaded successfully!");
      } else {
        showToast(data.error || "Upload failed", "error");
      }
    } catch { showToast("Upload error", "error"); }
    finally { setUploading(false); }
  };

  /* ─── Experiment CRUD ─── */
  const saveExp = async () => {
    setSaving(true);
    const techArr = Array.isArray(expForm.tech) ? expForm.tech : String(expForm.tech).split(",").map(s => s.trim()).filter(Boolean);
    const payload = { ...expForm, tech: techArr, slug: expForm.slug || slugify(expForm.title), ...(selExp ? { id: selExp.id } : {}) };
    const res = await fetch("/api/experiments", {
      method: selExp ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) { showToast(selExp ? "Experiment updated!" : "Experiment created! 🎉"); setSelExp(null); setAddingExp(false); setExpForm(EMPTY_EXP); loadAll(); }
    else { const d = await res.json(); showToast(d.error || "Failed", "error"); }
    setSaving(false);
  };

  const deleteExp = async (id: string) => {
    const res = await fetch("/api/experiments", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (res.ok) { showToast("Deleted."); setConfirmDelete(null); setSelExp(null); setAddingExp(false); loadAll(); }
    else showToast("Failed to delete.", "error");
  };

  /* ─── Notes CRUD ─── */
  const saveNote = async () => {
    setSaving(true);
    const tagsArr = Array.isArray(noteForm.tags) ? noteForm.tags : String(noteForm.tags).split(",").map(s => s.trim()).filter(Boolean);
    const payload = { ...noteForm, tags: tagsArr, slug: noteForm.slug || slugify(noteForm.title), ...(selNote ? { id: selNote.id } : {}) };
    const res = await fetch("/api/notes", {
      method: selNote ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) { showToast(selNote ? "Note updated!" : "Note created! 🎉"); setSelNote(null); setAddingNote(false); setNoteForm(EMPTY_NOTE); loadAll(); }
    else { const d = await res.json(); showToast(d.error || "Failed", "error"); }
    setSaving(false);
  };

  const deleteNote = async (id: string) => {
    const res = await fetch("/api/notes", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (res.ok) { showToast("Deleted."); setConfirmDelete(null); setSelNote(null); setAddingNote(false); loadAll(); }
    else showToast("Failed to delete.", "error");
  };

  const expFormOpen = addingExp || !!selExp;
  const noteFormOpen = addingNote || !!selNote;
  const techList: string[] = Array.isArray(expForm.tech) ? expForm.tech : String(expForm.tech || "").split(",").map(s => s.trim()).filter(Boolean);
  const tagsList: string[] = Array.isArray(noteForm.tags) ? noteForm.tags : String(noteForm.tags || "").split(",").map(s => s.trim()).filter(Boolean);

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
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 300 }}>
            Archive <span style={{ color: ACCENT }}>/ Experiments</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <ThemeToggle />
          <a href="/admin/dashboard" style={{ padding: "0.5rem 1rem", background: "transparent", border: `1px solid ${border}`, color: textMuted, fontFamily: MONO, fontSize: "0.62rem", letterSpacing: "0.1em", textDecoration: "none", display: "flex", alignItems: "center" }}>
            ← PROJECTS
          </a>
          <button
            onClick={async () => { await fetch("/api/auth", { method: "DELETE" }); router.push("/admin/login"); }}
            style={{ padding: "0.5rem 1rem", background: "transparent", border: `1px solid ${border}`, color: textMuted, fontFamily: MONO, fontSize: "0.62rem", letterSpacing: "0.1em", cursor: "pointer" }}>
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

      {/* Section tabs */}
      <div style={{ borderBottom: `1px solid ${border}`, display: "flex", padding: "0 2rem" }}>
        {(["experiments", "notes"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "1rem 1.5rem", background: "none", border: "none", borderBottom: `2px solid ${tab === t ? ACCENT : "transparent"}`, color: tab === t ? textPrimary : textMuted, fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", marginBottom: "-1px" }}>
            {t === "experiments" ? `⚗ Lab (${experiments.length})` : `✍ Notes (${notes.length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ display: "grid", gridTemplateColumns: (expFormOpen || noteFormOpen) ? "360px 1fr" : "1fr", minHeight: "calc(100vh - 109px)" }}>

        {/* ─── EXPERIMENTS TAB ─── */}
        {tab === "experiments" && (
          <>
            {/* List */}
            <div style={{ borderRight: expFormOpen ? `1px solid ${border}` : "none", display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 109px)", overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${border}`, background: surface }}>
                <button onClick={() => { setSelExp(null); setAddingExp(true); setExpForm(EMPTY_EXP); }}
                  style={{ width: "100%", padding: "0.6rem", background: ACCENT, color: base, border: "none", fontFamily: MONO, fontSize: "0.62rem", letterSpacing: "0.18em", cursor: "pointer" }}>
                  + NEW EXPERIMENT
                </button>
              </div>
              <div style={{ overflowY: "auto", flex: 1 }}>
                {experiments.length === 0 && (
                  <div style={{ padding: "3rem", textAlign: "center", color: textMuted, fontSize: "0.8rem" }}>No experiments yet.</div>
                )}
                {experiments.map((exp) => (
                  <div key={exp.id} onClick={() => { setSelExp(exp); setAddingExp(false); setExpForm({ title: exp.title, description: exp.description, tech: exp.tech, previewUrl: exp.previewUrl || "", codeUrl: exp.codeUrl || "", category: exp.category, image: exp.image || "", slug: exp.slug, published: exp.published, order: exp.order }); }}
                    style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${border}`, cursor: "pointer", background: selExp?.id === exp.id ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "transparent", borderLeft: `3px solid ${selExp?.id === exp.id ? ACCENT : "transparent"}`, transition: "all 0.15s", display: "flex", gap: "0.85rem", alignItems: "center" }}>
                    
                    {/* Thumbnail */}
                    <div style={{ width: "45px", height: "35px", flexShrink: 0, background: "rgba(255,255,255,0.05)", overflow: "hidden", position: "relative" }}>
                      {exp.image ? (
                        <img src={exp.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", opacity: 0.85 }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: textMuted, fontSize: "0.5rem", fontFamily: MONO }}>IMG</div>
                      )}
                    </div>

                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", marginBottom: "0.2rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{exp.title}</p>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <span style={{ fontFamily: MONO, fontSize: "0.5rem", color: ACCENT, border: `1px solid color-mix(in srgb, var(--accent) 33%, transparent)`, padding: "0.1rem 0.4rem", letterSpacing: "0.1em" }}>{exp.category.toUpperCase()}</span>
                        {!exp.published && <span style={{ fontFamily: MONO, fontSize: "0.5rem", color: textMuted, border: `1px solid ${border}`, padding: "0.1rem 0.4rem" }}>DRAFT</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experiment Form */}
            <AnimatePresence>
              {expFormOpen && (
                <motion.div key="exp-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}
                  style={{ overflowY: "auto", maxHeight: "calc(100vh - 109px)", background: "rgba(255,255,255,0.01)" }}>
                  {/* Form header */}
                  <div style={{ padding: "1.25rem 2rem", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: base, zIndex: 10 }}>
                    <div>
                      <p style={monoLabel}>{selExp ? "Editing experiment" : "New experiment"}</p>
                      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "1.3rem" }}>{expForm.title || "Untitled"}</h2>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {selExp && (
                        <button onClick={() => setConfirmDelete(selExp.id + ":exp")}
                          style={{ padding: "0.45rem 0.9rem", background: "rgba(200,50,50,0.08)", border: "1px solid rgba(200,50,50,0.3)", color: "#e57373", fontFamily: MONO, fontSize: "0.58rem", cursor: "pointer" }}>
                          DELETE
                        </button>
                      )}
                      <button onClick={() => { setSelExp(null); setAddingExp(false); setExpForm(EMPTY_EXP); }}
                        style={{ padding: "0.45rem 0.9rem", background: "transparent", border: `1px solid ${border}`, color: textMuted, fontFamily: MONO, fontSize: "0.58rem", cursor: "pointer" }}>
                        CANCEL
                      </button>
                      <button onClick={saveExp} disabled={saving}
                        style={{ padding: "0.45rem 1.1rem", background: saving ? "color-mix(in srgb, var(--accent) 55%, transparent)" : ACCENT, color: "var(--bg)", border: "none", fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.15em", cursor: saving ? "wait" : "pointer" }}>
                        {saving ? "SAVING..." : selExp ? "SAVE" : "CREATE"}
                      </button>
                    </div>
                  </div>
                  {/* Form body */}
                  <div style={{ padding: "2rem" }}>
                    <Field label="Title *"><input style={fieldInput} value={expForm.title} onChange={e => setExpForm(p => ({ ...p, title: e.target.value }))} onFocus={focusIn} onBlur={focusOut} /></Field>
                    <Field label="Description *">
                      <textarea style={{ ...fieldInput, minHeight: "90px", resize: "vertical" }} value={expForm.description} onChange={e => setExpForm(p => ({ ...p, description: e.target.value }))} onFocus={focusIn} onBlur={focusOut} />
                    </Field>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1.5rem" }}>
                      <Field label="Category">
                        <select style={{ ...fieldInput, appearance: "none" as const }} value={expForm.category} onChange={e => setExpForm(p => ({ ...p, category: e.target.value }))} onFocus={focusIn} onBlur={focusOut}>
                          {["animation", "css", "interaction", "typography", "layout"].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </Field>
                      <Field label="Slug">
                        <input style={fieldInput} value={expForm.slug} placeholder={slugify(expForm.title) || "auto-generated"} onChange={e => setExpForm(p => ({ ...p, slug: e.target.value }))} onFocus={focusIn} onBlur={focusOut} />
                      </Field>
                    </div>
                    
                    {/* ─── Image Upload Section ─────────────────── */}
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={monoLabel}>Cover Image (Optional)</label>
                      <div
                        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                        onDragEnter={e => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={e => {
                          e.preventDefault();
                          setIsDragging(false);
                          handleFiles(e.dataTransfer.files);
                        }}
                        onClick={() => document.getElementById("exp-file-upload")?.click()}
                        style={{
                          border: `2px dashed ${isDragging ? ACCENT : border}`,
                          padding: "1.5rem",
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          background: isDragging ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "color-mix(in srgb, var(--text) 2%, transparent)",
                          marginBottom: "0.75rem",
                        }}
                      >
                        <input
                          id="exp-file-upload"
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={e => { if (e.target.files) handleFiles(e.target.files); e.target.value = ""; }}
                        />
                        {uploading ? (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", color: ACCENT }}>
                            <span style={{ width: "16px", height: "16px", border: `2px solid ${ACCENT}`, borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                            <span style={{ fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.15em" }}>UPLOADING...</span>
                          </div>
                        ) : (
                          <div>
                            <p style={{ fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.1em", color: isDragging ? ACCENT : textMuted }}>
                              {isDragging ? "DROP TO UPLOAD" : "DRAG & DROP or CLICK TO BROWSE"}
                            </p>
                          </div>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                        <input
                          id="exp-img-input"
                          style={{ ...fieldInput, flex: 1, fontSize: "0.75rem" }}
                          placeholder="Or paste an image URL and press Enter..."
                          value={expForm.image || ""}
                          onChange={e => setExpForm(p => ({ ...p, image: e.target.value }))}
                          onFocus={focusIn} onBlur={focusOut}
                        />
                        {expForm.image && (
                          <button
                            onClick={() => setExpForm(p => ({ ...p, image: "" }))}
                            style={{ padding: "0 1rem", background: "rgba(200,50,50,0.1)", border: "1px solid rgba(200,50,50,0.3)", color: "#e57373", fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.1em", cursor: "pointer" }}
                          >
                            CLEAR
                          </button>
                        )}
                      </div>

                      {expForm.image && (
                        <div style={{ position: "relative", width: "100%", height: "140px", background: "rgba(255,255,255,0.04)", overflow: "hidden", border: `1px solid ${border}` }}>
                          <img src={expForm.image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                        </div>
                      )}
                    </div>

                    <Field label="Preview URL (iframe)"><input style={fieldInput} value={expForm.previewUrl || ""} onChange={e => setExpForm(p => ({ ...p, previewUrl: e.target.value }))} placeholder="https://..." onFocus={focusIn} onBlur={focusOut} /></Field>
                    <Field label="Code URL"><input style={fieldInput} value={expForm.codeUrl || ""} onChange={e => setExpForm(p => ({ ...p, codeUrl: e.target.value }))} placeholder="https://github.com/..." onFocus={focusIn} onBlur={focusOut} /></Field>
                    <Field label="Tech / Tools (comma-separated)">
                      <input style={fieldInput} value={techList.join(", ")} onChange={e => setExpForm(p => ({ ...p, tech: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))} placeholder="CSS, GSAP, Canvas..." onFocus={focusIn} onBlur={focusOut} />
                      {techList.length > 0 && (
                        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                          {techList.map((t, i) => (
                            <span key={i} style={{ padding: "0.15rem 0.55rem", border: `1px solid color-mix(in srgb, var(--accent) 44%, transparent)`, color: ACCENT, fontFamily: MONO, fontSize: "0.52rem", letterSpacing: "0.08em" }}>{t}</span>
                          ))}
                        </div>
                      )}
                    </Field>
                    <Field label="Status">
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontFamily: MONO, fontSize: "0.62rem", color: textMuted, padding: "0.75rem 1rem", background: "color-mix(in srgb, var(--text) 4%, transparent)", border: `1px solid ${border}` }}>
                        <input type="checkbox" checked={expForm.published} onChange={e => setExpForm(p => ({ ...p, published: e.target.checked }))} />
                        Published (visible on site)
                      </label>
                    </Field>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {!expFormOpen && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: textMuted }}>
                <p style={{ fontFamily: MONO, fontSize: "0.65rem", letterSpacing: "0.15em", opacity: 0.5 }}>SELECT AN EXPERIMENT OR CREATE NEW</p>
              </div>
            )}
          </>
        )}

        {/* ─── NOTES TAB ─── */}
        {tab === "notes" && (
          <>
            {/* List */}
            <div style={{ borderRight: noteFormOpen ? `1px solid ${border}` : "none", display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 109px)", overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${border}`, background: surface }}>
                <button onClick={() => { setSelNote(null); setAddingNote(true); setNoteForm(EMPTY_NOTE); }}
                  style={{ width: "100%", padding: "0.6rem", background: ACCENT, color: base, border: "none", fontFamily: MONO, fontSize: "0.62rem", letterSpacing: "0.18em", cursor: "pointer" }}>
                  + NEW FIELD NOTE
                </button>
              </div>
              <div style={{ overflowY: "auto", flex: 1 }}>
                {notes.length === 0 && (
                  <div style={{ padding: "3rem", textAlign: "center", color: textMuted, fontSize: "0.8rem" }}>No notes yet.</div>
                )}
                {notes.map((note) => (
                  <div key={note.id} onClick={() => { setSelNote(note); setAddingNote(false); setNoteForm({ title: note.title, body: note.body, tags: note.tags, slug: note.slug, published: note.published }); }}
                    style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${border}`, cursor: "pointer", background: selNote?.id === note.id ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "transparent", borderLeft: `3px solid ${selNote?.id === note.id ? ACCENT : "transparent"}`, transition: "all 0.15s" }}>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", marginBottom: "0.25rem" }}>{note.title}</p>
                    <p style={{ fontSize: "0.7rem", color: textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{note.body.slice(0, 80)}</p>
                    {note.tags.length > 0 && (
                      <div style={{ display: "flex", gap: "0.35rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
                        {note.tags.map(t => <span key={t} style={{ fontFamily: MONO, fontSize: "0.48rem", color: ACCENT, border: `1px solid color-mix(in srgb, var(--accent) 33%, transparent)`, padding: "0.1rem 0.35rem" }}>{t}</span>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Note Form */}
            <AnimatePresence>
              {noteFormOpen && (
                <motion.div key="note-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}
                  style={{ overflowY: "auto", maxHeight: "calc(100vh - 109px)", background: "rgba(255,255,255,0.01)" }}>
                  <div style={{ padding: "1.25rem 2rem", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: base, zIndex: 10 }}>
                    <div>
                      <p style={monoLabel}>{selNote ? "Editing note" : "New field note"}</p>
                      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "1.3rem" }}>{noteForm.title || "Untitled"}</h2>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {selNote && (
                        <button onClick={() => setConfirmDelete(selNote.id + ":note")}
                          style={{ padding: "0.45rem 0.9rem", background: "rgba(200,50,50,0.08)", border: "1px solid rgba(200,50,50,0.3)", color: "#e57373", fontFamily: MONO, fontSize: "0.58rem", cursor: "pointer" }}>
                          DELETE
                        </button>
                      )}
                      <button onClick={() => { setSelNote(null); setAddingNote(false); setNoteForm(EMPTY_NOTE); }}
                        style={{ padding: "0.45rem 0.9rem", background: "transparent", border: `1px solid ${border}`, color: textMuted, fontFamily: MONO, fontSize: "0.58rem", cursor: "pointer" }}>
                        CANCEL
                      </button>
                      <button onClick={saveNote} disabled={saving}
                        style={{ padding: "0.45rem 1.1rem", background: saving ? "color-mix(in srgb, var(--accent) 55%, transparent)" : ACCENT, color: "var(--bg)", border: "none", fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.15em", cursor: saving ? "wait" : "pointer" }}>
                        {saving ? "SAVING..." : selNote ? "SAVE" : "CREATE"}
                      </button>
                    </div>
                  </div>
                  <div style={{ padding: "2rem" }}>
                    <Field label="Title *"><input style={fieldInput} value={noteForm.title} onChange={e => setNoteForm(p => ({ ...p, title: e.target.value }))} onFocus={focusIn} onBlur={focusOut} /></Field>
                    <Field label="Tags (comma-separated)">
                      <input style={fieldInput} value={tagsList.join(", ")} onChange={e => setNoteForm(p => ({ ...p, tags: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))} placeholder="CSS, Performance, TypeScript..." onFocus={focusIn} onBlur={focusOut} />
                      {tagsList.length > 0 && (
                        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                          {tagsList.map((t, i) => <span key={i} style={{ padding: "0.15rem 0.55rem", border: `1px solid color-mix(in srgb, var(--accent) 44%, transparent)`, color: ACCENT, fontFamily: MONO, fontSize: "0.52rem" }}>{t}</span>)}
                        </div>
                      )}
                    </Field>
                    <Field label="Slug">
                      <input style={fieldInput} value={noteForm.slug} placeholder={slugify(noteForm.title) || "auto-generated"} onChange={e => setNoteForm(p => ({ ...p, slug: e.target.value }))} onFocus={focusIn} onBlur={focusOut} />
                    </Field>
                    <Field label="Body (supports Markdown)">
                      <textarea
                        style={{ ...fieldInput, minHeight: "320px", resize: "vertical", fontFamily: "var(--font-mono,monospace)", fontSize: "0.78rem", lineHeight: 1.7 }}
                        value={noteForm.body}
                        onChange={e => setNoteForm(p => ({ ...p, body: e.target.value }))}
                        placeholder={"# Heading\n\nWrite your field note here...\n\n## Sub-heading\n\n`code` and **bold** are supported.\n\n```\ncode blocks too\n```"}
                        onFocus={focusIn} onBlur={focusOut}
                      />
                      <p style={{ fontFamily: "var(--font-mono,monospace)", fontSize: "0.5rem", color: textMuted, marginTop: "0.4rem", letterSpacing: "0.1em" }}>
                        SUPPORTS: # H1  ## H2  **bold**  `inline code`  ``` code blocks ```  &gt; blockquotes
                      </p>
                    </Field>
                    <Field label="Status">
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontFamily: "var(--font-mono,monospace)", fontSize: "0.62rem", color: textMuted, padding: "0.75rem 1rem", background: "color-mix(in srgb, var(--text) 4%, transparent)", border: `1px solid ${border}` }}>
                        <input type="checkbox" checked={noteForm.published} onChange={e => setNoteForm(p => ({ ...p, published: e.target.checked }))} />
                        Published (visible on site)
                      </label>
                    </Field>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {!noteFormOpen && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: textMuted }}>
                <p style={{ fontFamily: MONO, fontSize: "0.65rem", letterSpacing: "0.15em", opacity: 0.5 }}>SELECT A NOTE OR CREATE NEW</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "color-mix(in srgb, var(--bg) 85%, transparent)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
            onClick={() => setConfirmDelete(null)}>
            <motion.div initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "var(--bg)", border: "1px solid rgba(200,50,50,0.3)", borderTop: "3px solid #c83232", padding: "2.5rem", maxWidth: "380px", width: "90%", textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: "0.6rem", color: "#e57373" }}>Permanent Deletion</div>
              <p style={{ fontSize: "0.82rem", color: textMuted, lineHeight: 1.7, marginBottom: "2rem" }}>
                This record will be <strong>permanently deleted</strong>. This action cannot be undone.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <button onClick={() => setConfirmDelete(null)}
                  style={{ padding: "0.7rem 1.5rem", background: "transparent", border: `1px solid ${border}`, color: textMuted, fontFamily: MONO, fontSize: "0.62rem", cursor: "pointer" }}>
                  CANCEL
                </button>
                <button onClick={() => {
                  if (!confirmDelete) return;
                  const [id, type] = confirmDelete.split(":");
                  if (type === "exp") deleteExp(id);
                  else deleteNote(id);
                }}
                  style={{ padding: "0.7rem 1.5rem", background: "#c83232", color: "white", border: "none", fontFamily: MONO, fontSize: "0.62rem", letterSpacing: "0.1em", cursor: "pointer" }}>
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
