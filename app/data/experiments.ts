export const experiments = [
  {
    id: "E-001",
    title: "Magnetic Cursor",
    description: "A cursor that magnetically attracts to interactive elements using spring physics.",
    tags: ["Interaction", "Animation"],
    year: "2024",
    status: "Complete",
  },
  {
    id: "E-002",
    title: "Liquid Text Morph",
    description: "SVG feMorphology filter morphing between text states with organic, liquefied transitions.",
    tags: ["CSS", "SVG"],
    year: "2024",
    status: "Complete",
  },
  {
    id: "E-003",
    title: "Scroll Velocity Blur",
    description: "Elements blur proportionally to scroll velocity, creating a cinematic motion effect.",
    tags: ["Scroll", "Animation"],
    year: "2024",
    status: "Complete",
  },
  {
    id: "E-004",
    title: "Noise Gradient Field",
    description: "Procedural gradient backgrounds driven by Perlin noise — a generative canvas study.",
    tags: ["Canvas", "Generative"],
    year: "2024",
    status: "Ongoing",
  },
  {
    id: "E-005",
    title: "Typewriter Stagger",
    description: "Character-by-character text reveal with variable timing for an organic typing feel.",
    tags: ["Typography", "Animation"],
    year: "2023",
    status: "Complete",
  },
  {
    id: "E-006",
    title: "Accordion with FLIP",
    description: "Height animation using the FLIP technique — layout animations with no reflow cost.",
    tags: ["UI", "Performance"],
    year: "2023",
    status: "Complete",
  },
];

export type Experiment = (typeof experiments)[0];
