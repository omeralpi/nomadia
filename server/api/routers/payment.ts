import { db } from "@/lib/db";
import { transactions } from "@/lib/db/schema";
import { MiniAppPaymentSuccessPayload } from "@worldcoin/minikit-js";
import { cookies } from "next/headers";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const PayloadSchema = z.object({
    payload: z.custom<MiniAppPaymentSuccessPayload>()
});

export const paymentRouter = createTRPCRouter({
    generateNonce: publicProcedure.mutation(async () => {
        const uuid = crypto.randomUUID().replace(/-/g, "");

        cookies().set({
            name: "payment-nonce",
            value: uuid,
            httpOnly: true,
        });

        return { id: uuid };
    }),

    confirmPayment: publicProcedure
        .input(PayloadSchema)
        .mutation(async ({ input }) => {
            const cookieStore = cookies();
            const reference = cookieStore.get("payment-nonce")?.value;

            if (!reference) {
                return { success: false };
            }

            if (input.payload.reference === reference) {
                const response = await fetch(
                    `https://developer.worldcoin.org/api/v2/minikit/transaction/${input.payload.transaction_id}?app_id=${process.env.APP_ID}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
                        },
                    }
                );

                const transaction = await response.json();

                if (transaction.reference === reference && transaction.status !== "failed") {
                    await db.insert(transactions).values({
                        transactionId: transaction.transactionId,
                        transactionHash: transaction.transactionHash,
                        transactionStatus: transaction.transactionStatus,
                        reference: transaction.reference,
                        fromWalletAddress: transaction.fromWalletAddress,
                        recipientAddress: transaction.recipientAddress,
                        inputToken: transaction.inputToken,
                        inputTokenAmount: transaction.inputTokenAmount,
                    });

                    return { success: true };
                }
            }

            return { success: false };
        }),
}); 