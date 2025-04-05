import { relations } from "drizzle-orm";
import { boolean, index, pgTable, primaryKey, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";

export const conversations = pgTable("conversations", {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const conversationParticipants = pgTable("conversation_participants", {
    conversationId: serial("conversation_id").references(() => conversations.id, { onDelete: "cascade" }).notNull(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
}, (table) => ({
    pk: primaryKey(table.conversationId, table.userId),
}));

export const messages = pgTable("messages", {
    id: serial("id").primaryKey(),
    content: text("content").notNull(),
    conversationId: serial("conversation_id").references(() => conversations.id, { onDelete: "cascade" }).notNull(),
    senderId: text("sender_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
    conversationIdx: index("conversation_idx").on(table.conversationId),
    senderIdx: index("sender_idx").on(table.senderId),
    createdAtIdx: index("created_at_idx").on(table.createdAt),
}));

export const conversationsRelations = relations(conversations, ({ many }) => ({
    participants: many(conversationParticipants),
    messages: many(messages),
}));

export const conversationParticipantsRelations = relations(conversationParticipants, ({ one }) => ({
    conversation: one(conversations, {
        fields: [conversationParticipants.conversationId],
        references: [conversations.id],
    }),
    user: one(users, {
        fields: [conversationParticipants.userId],
        references: [users.id],
    }),
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