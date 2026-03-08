import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { categories, projects } from "./app/lib/db/schema.js";

const connectionString = "postgres://postgres.hdmcfnoapdndltnjkbey:2xbCujabHEFmVtGN@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require";
const client = postgres(connectionString);
const db = drizzle(client);

async function main() {
  try {
    const allCategories = await db.select().from(categories);
    console.log("Categories in DB:", allCategories);

    const allProjects = await db.select().from(projects);
    console.log("Projects in DB:", allProjects.length);
    if (allProjects.length > 0) {
        console.log("Sample Project:", allProjects[0]);
    } else {
        console.log("No projects found in the database. You currently only have local projects.");
    }
  } catch (e) {
    console.error("DB Error:", e);
  } finally {
    process.exit(0);
  }
}

main();
