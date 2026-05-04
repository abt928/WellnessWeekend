-- Wellness Weekend — add sponsor inquiry + instructor waitlist tables
-- Apply with `npx drizzle-kit push` from WellnessWeekend/, or paste into Neon SQL editor.

CREATE TABLE IF NOT EXISTS "sponsors" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(50),
  "company" VARCHAR(255) NOT NULL,
  "website" VARCHAR(500),
  "interests" TEXT NOT NULL,
  "budget_range" VARCHAR(50) NOT NULL,
  "goals" TEXT NOT NULL,
  "source" VARCHAR(255),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "instructor_waitlist" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(50),
  "modality" VARCHAR(255) NOT NULL,
  "years_teaching" INTEGER,
  "website" VARCHAR(500),
  "interested_in_2026" BOOLEAN DEFAULT FALSE NOT NULL,
  "interested_in_2027" BOOLEAN DEFAULT FALSE NOT NULL,
  "offering" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
