import { relations } from "drizzle-orm";
import { decimal, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { User, users } from "./user";

export const listingTypeEnum = pgEnum("listing_type", ["buying", "selling"]);
export const listingStatusEnum = pgEnum("listing_status", ["active", "completed", "cancelled"]);
export const currencyTypeEnum = pgEnum("currency_type", ["fiat", "crypto"]);

export const listings = pgTable("listings", {
    id: serial("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    type: listingTypeEnum("type").notNull(),
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    currencyCode: text("currency_code").references(() => currencies.code, { onDelete: "cascade" }).notNull(),
    latitude: decimal("latitude", { precision: 10, scale: 8 }),
    longitude: decimal("longitude", { precision: 11, scale: 8 }),
    status: listingStatusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const currencies = pgTable("currencies", {
    code: text("code").primaryKey(),
    name: text("name").notNull(),
    iconUrl: text("icon_url"),
    type: currencyTypeEnum("type").notNull(),
});

export const listingsRelations = relations(listings, ({ one }) => ({
    user: one(users, {
        fields: [listings.userId],
        references: [users.id],
    }),
    currency: one(currencies, {
        fields: [listings.currencyCode],
        references: [currencies.code],
    }),
}));

export type Listing = typeof listings.$inferSelect;
export type ListingWithRelations = typeof listings.$inferSelect & {
    user: User;
    currency: Currency;
};
export type NewListing = typeof listings.$inferInsert;
export type Currency = typeof currencies.$inferSelect;
export type NewCurrency = typeof currencies.$inferInsert;

export const createListingSchema = createInsertSchema(listings).pick({
    type: true,
    amount: true,
    currencyCode: true,
    latitude: true,
    longitude: true,
})

export const updateListingSchema = createInsertSchema(listings).omit({
    userId: true,
    createdAt: true,
    updatedAt: true,
})