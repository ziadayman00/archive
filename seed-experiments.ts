import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./app/lib/db/schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.POSTGRES_URL_NON_POOLING!.replace("?schema=public", "");
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

async function seed() {
  console.log("🌱 Seeding experiments and notes...");

  // 1. Seed Experiments (Lab)
  console.log("Seeding experiments...");
  await db.insert(schema.experiments).values([
    {
      title: "Magnetic Button & Cursor",
      description: "A custom Framer Motion implementation of a magnetic button that pulls towards the user's cursor when hovered.",
      tech: ["React", "Framer Motion", "TypeScript", "Math"],
      previewUrl: "https://codesandbox.io/embed/framer-motion-magnetic-button-v2",
      codeUrl: "https://github.com/ziadayman/magnetic-button",
      category: "interaction",
      slug: "magnetic-button",
      published: true,
      order: 1,
    },
    {
      title: "Noise Texture Generator",
      description: "A tiny WebGL shader to generate customizable SVG/Canvas grain and noise textures for UI backgrounds, preventing color banding.",
      tech: ["WebGL", "GLSL", "React Three Fiber"],
      previewUrl: "https://codesandbox.io/embed/webgl-noise-texture",
      codeUrl: "https://github.com/ziadayman/noise-shader",
      category: "animation",
      slug: "noise-texture",
      published: true,
      order: 2,
    },
    {
      title: "Dynamic Fluid Typography",
      description: "A pure CSS solution utilizing CSS clamp() and viewport units to create typography that scales perfectly between mobile and ultra-wide desktops without media queries.",
      tech: ["CSS", "Design Tokens", "PostCSS"],
      previewUrl: null, // No iframe preview for this one
      codeUrl: "https://gist.github.com/ziadayman/fluid-typography",
      category: "typography",
      slug: "fluid-typography",
      published: true,
      order: 3,
    }
  ]).onConflictDoNothing();

  // 2. Seed Notes
  console.log("Seeding notes...");
  await db.insert(schema.notes).values([
    {
      title: "Why I switched from Prisma to Drizzle ORM",
      body: `Here are my field notes on migrating this very archive from Prisma to Drizzle ORM.

### The Problem with Prisma
Prisma is fantastic for DX. The schema file is easy to read, and the types are generated automatically. However, I ran into a few issues:
1. **Cold Starts**: Prisma engine binary size creates noticeable cold-starts in Serverless environments (like Vercel).
2. **Complex Queries**: Sometimes I needed to write complex raw SQL, and Prisma's raw query API felt a bit detached from the type-safety it promised.

### Enter Drizzle
Drizzle ORM is essentially a **SQL-like query builder** but in TypeScript.

\`\`\`typescript
import { eq } from 'drizzle-orm';
import { users } from './schema';

// This reads exactly like SQL
const result = await db.select().from(users).where(eq(users.id, 42));
\`\`\`

**The benefits I found:**
- **Zero dependencies**: No Rust binary under the hood, meaning lightning-fast cold starts.
- **SQL familiarity**: If you know SQL, you basically know Drizzle.
- **Push vs Migrate**: \`drizzle-kit push\` makes fast iterations during the initial build phase a breeze.

### Conclusion
Prisma is still great for massive enterprise apps where you have dedicated DevOps. But for personal projects and speed-focused startups, Drizzle is King.`,
      tags: ["Drizzle ORM", "Database", "Performance", "Next.js"],
      slug: "why-drizzle-orm",
      published: true,
    },
    {
      title: "Framer Motion: Layout Animations Explained",
      body: `One of the most powerful features of Framer Motion is the \`layout\` prop. Behind the scenes, it performs a FLIP (First, Last, Invert, Play) animation.

When you add the \`layout\` prop to a \`<motion.div>\`, Framer Motion measures its bounding box before the render cycle, measures it after, calculates the transform difference, and applies it instantly.

> "UI animation shouldn't feel like you are watching a movie segment. It should feel like physical objects moving on a desk."

### Common Pitfalls
- **Layout shift jumps**: If text changes size inside a layout element, the width might jump. Use \`layout="position"\` to only animate the X/Y coordinates rather than the scale.
- **Border radius distortion**: Because FLIP uses CSS transforms (scaleX, scaleY), border radius can look squished during animation. Add \`style={{ borderRadius: px }}\` to fix it!`,
      tags: ["React", "Framer Motion", "Animations"],
      slug: "framer-motion-layout",
      published: true,
    }
  ]).onConflictDoNothing();

  console.log("✅ Seeding complete!");
  process.exit(0);
}

seed().catch((e) => {
  console.error("❌ Seeding failed:", e);
  process.exit(1);
});
