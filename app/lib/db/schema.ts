import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: text("subtitle").notNull(),
  year: varchar("year", { length: 4 }).notNull(),
  sector: varchar("sector", { length: 100 }).notNull(),
  responsibility: text("responsibility"),
  impact: text("impact"),
  tech: text("tech").array().notNull(),
  description: text("description").notNull(),
  features: text("features").array(),
  images: text("images").array().notNull(),
  live: varchar("live", { length: 500 }).default("#"),
  github: varchar("github", { length: 500 }).default("#"),
  comingSoon: boolean("coming_soon").default(false),
  inProgress: boolean("in_progress").default(false),
  categoryId: uuid("category_id").references(() => categories.id),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const experiments = pgTable("experiments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  tech: text("tech").array().notNull().default(sql`'{}'::text[]`),
  previewUrl: varchar("preview_url", { length: 500 }),
  codeUrl: varchar("code_url", { length: 500 }),
  category: varchar("category", { length: 100 }).default("animation"),
  image: varchar("image", { length: 500 }),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  published: boolean("published").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notes = pgTable("notes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

