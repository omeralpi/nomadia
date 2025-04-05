import { db } from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const transactionRouter = createTRPCRouter({
    list: protectedProcedure
        .query(async ({ ctx }) => {
            const userTransactions = await db.query.transactions.findMany({
                where: (transactions, { eq }) => eq(transactions.fromWalletAddress, ctx.user.address),
                orderBy: (transactions, { desc }) => [desc(transactions.updatedAt)]
            });

            return userTransactions;
        }),
}); 