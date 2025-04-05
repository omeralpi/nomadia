import { relations } from "drizzle-orm";
import { decimal, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";

export const listingTypeEnum = pgEnum("listing_type", ["buying", "selling"]);
export const currencyEnum = pgEnum("currency", ["TWD", "USD", "EUR", "USDC", "WLD"]);
export const listingStatusEnum = pgEnum("listing_status", ["active", "completed", "cancelled"]);

export const listings = pgTable("listings", {
    id: serial("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    type: listingTypeEnum("type").notNull(),
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    currency: currencyEnum("currency").notNull(),
    description: text("description"),
    location: text("location"),
    latitude: decimal("latitude", { precision: 10, scale: 8 }),
    longitude: decimal("longitude", { precision: 11, scale: 8 }),
    status: listingStatusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const listingsRelations = relations(listings, ({ one }) => ({
    user: one(users, {
        fields: [listings.userId],
        references: [users.id],
    }),
}));

export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert; 