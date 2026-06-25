import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const scripts = pgTable("scripts", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull(),
  version: integer("version").notNull().default(1),
  title: text("title").notNull().default("Untitled"),
  content: text("content").notNull(),
  language: text("language").notNull().default("lua"),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Script = typeof scripts.$inferSelect
