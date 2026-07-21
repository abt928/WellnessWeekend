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

export const affiliates = pgTable("affiliates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  company: varchar("company", { length: 255 }),
  website: varchar("website", { length: 500 }),
  description: text("description"),
  commissionPct: integer("commission_pct").notNull().default(10),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  passwordHash: text("password_hash").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const referralEvents = pgTable("referral_events", {
  id: serial("id").primaryKey(),
  affiliateCode: varchar("affiliate_code", { length: 20 }).notNull(),
  eventType: varchar("event_type", { length: 20 }).notNull(),
  orderId: varchar("order_id", { length: 100 }),
  orderAmountCents: integer("order_amount_cents"),
  commissionCents: integer("commission_cents"),
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  squareOrderId: varchar("square_order_id", { length: 100 }).unique(),
  squarePaymentId: varchar("square_payment_id", { length: 100 }).unique(),
  amountCents: integer("amount_cents").notNull(),
  currency: varchar("currency", { length: 10 }).notNull().default("USD"),
  customerEmail: varchar("customer_email", { length: 255 }),
  referralCode: varchar("referral_code", { length: 20 }),
  lineItems: text("line_items"),
  status: varchar("status", { length: 20 }).notNull().default("completed"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const budgetItems = pgTable("budget_items", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 20 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  amountCents: integer("amount_cents").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  pointsBalance: integer("points_balance").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const memberReferrals = pgTable("member_referrals", {
  id: serial("id").primaryKey(),
  referrerCode: varchar("referrer_code", { length: 20 }).notNull(),
  refereeEmail: varchar("referee_email", { length: 255 }).notNull(),
  pointsEarned: integer("points_earned").notNull().default(50),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const warriors = pgTable("warriors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  familySize: integer("family_size").notNull(),
  bedsNeeded: integer("beds_needed").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const volunteerRegistrations = pgTable("volunteer_registrations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  shiftIds: text("shift_ids").notNull(),
  rewardEarned: varchar("reward_earned", { length: 50 }),
  agreedWaiver: boolean("agreed_waiver").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const volunteerShiftClaims = pgTable("volunteer_shift_claims", {
  id: serial("id").primaryKey(),
  registrationId: integer("registration_id"),
  shiftId: varchar("shift_id", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const memberRedemptions = pgTable("member_redemptions", {
  id: serial("id").primaryKey(),
  memberCode: varchar("member_code", { length: 20 }).notNull(),
  rewardType: varchar("reward_type", { length: 20 }).notNull(),
  pointsCost: integer("points_cost").notNull(),
  discountCents: integer("discount_cents").notNull().default(0),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
});
