import { boolean, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  business: varchar("business", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  website: varchar("website", { length: 500 }),
  description: text("description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const volunteers = pgTable("volunteers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  interest: varchar("interest", { length: 100 }).notNull(),
  experience: text("experience"),
  availability: varchar("availability", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const newsletter = pgTable("newsletter", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  message: text("message").notNull(),
  source: varchar("source", { length: 100 }).default("message_form").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sponsors = pgTable("sponsors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }).notNull(),
  website: varchar("website", { length: 500 }),
  interests: text("interests").notNull(),
  budgetRange: varchar("budget_range", { length: 50 }).notNull(),
  goals: text("goals").notNull(),
  source: varchar("source", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const instructorWaitlist = pgTable("instructor_waitlist", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  modality: varchar("modality", { length: 255 }).notNull(),
  yearsTeaching: integer("years_teaching"),
  website: varchar("website", { length: 500 }),
  interestedIn2026: boolean("interested_in_2026").default(false).notNull(),
  interestedIn2027: boolean("interested_in_2027").default(false).notNull(),
  offering: text("offering").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
