CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"subtitle" text NOT NULL,
	"year" varchar(4) NOT NULL,
	"sector" varchar(100) NOT NULL,
	"responsibility" text,
	"impact" text,
	"tech" text[] NOT NULL,
	"description" text NOT NULL,
	"features" text[],
	"images" text[] NOT NULL,
	"live" varchar(500) DEFAULT '#',
	"github" varchar(500) DEFAULT '#',
	"coming_soon" boolean DEFAULT false,
	"in_progress" boolean DEFAULT false,
	"category_id" uuid,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;