import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema } from "drizzle-zod"
import { nanoid } from "nanoid"

export const users = pgTable("users", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid()),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  name: text("name"),
  image: text("image"),
})

export type User = typeof users.$inferSelect

export const createUserSchema = createInsertSchema(users)

export const updateUserSchema = createInsertSchema(users).pick({
  name: true,
  image: true,
}).required({
  name: true,
})