import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const users = pgTable("users", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid()),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export type User = typeof users.$inferSelect
