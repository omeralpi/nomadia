import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";

export const conversations = pgTable("conversations", {
    id: serial("id").primaryKey(),
    user1Id: text("user1_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    user2Id: text("user2_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
    id: serial("id").primaryKey(),
    content: text("content").notNull(),
    conversationId: serial("conversation_id").references(() => conversations.id, { onDelete: "cascade" }),
    senderId: text("sender_id").references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
    user1: one(users, {
        fields: [conversations.user1Id],
        references: [users.id],
    }),
    user2: one(users, {
        fields: [conversations.user2Id],
        references: [users.id],
    }),
    messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
    conversation: one(conversations, {
        fields: [messages.conversationId],
        references: [conversations.id],
    }),
    sender: one(users, {
        fields: [messages.senderId],
        references: [users.id],
    }),
})); 