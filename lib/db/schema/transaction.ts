import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const transactions = pgTable("transactions", {
    transactionId: text("transaction_id").primaryKey(),
    transactionHash: text("transaction_hash"),
    transactionStatus: text("transaction_status"),
    reference: text("reference"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    inputToken: text("input_token"),
    inputTokenAmount: text("input_token_amount"),
    fromWalletAddress: text("from_wallet_address").notNull(),
    recipientAddress: text("recipient_address").notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;