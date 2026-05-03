import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  business: varchar("business", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  website: varchar("website", { length: 500 }),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const volunteers = pgTable("volunteers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  interest: varchar("interest", { length: 100 }).notNull(),
  experience: text("experience"),
  availability: varchar("availability", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const newsletter = pgTable("newsletter", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  message: text("message").notNull(),
  source: varchar("source", { length: 100 }).default("message_form").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
