import ExperimentsClient from "./ExperimentsClient";

export const metadata = {
  title: "Experiments — The Lab | Ziad's Archive",
  description: "UI experiments, animation studies, and engineering field notes.",
};

async function getExperiments() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/experiments`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.experiments || [];
  } catch {
    return [];
  }
}

async function getNotes() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/notes`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.notes || [];
  } catch {
    return [];
  }
}

export default async function ExperimentsPage() {
  const [experiments, notes] = await Promise.all([getExperiments(), getNotes()]);
  return <ExperimentsClient experiments={experiments} notes={notes} />;
}
