import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const listingRouter = createTRPCRouter({
    nearby: protectedProcedure
        .input(z.object({
            latitude: z.number(),
            longitude: z.number(),
            radius: z.number().default(10),
            type: z.enum(["buying", "selling"]).optional(),
            currency: z.enum(["TWD", "USD", "EUR", "USDC"]).optional(),
        }))
        .query(async ({ ctx, input }) => {
            const listingsList = await db.query.listings.findMany({
                where: and(
                    eq(listings.status, "active"),
                    input.type ? eq(listings.type, input.type) : undefined,
                    input.currency ? eq(listings.currency, input.currency) : undefined,
                ),
                with: {
                    user: true,
                },
                orderBy: desc(listings.createdAt),
            });

            return listingsList;
        }),

    create: protectedProcedure
        .input(z.object({
            type: z.enum(["buying", "selling"]),
            amount: z.number().positive(),
            currency: z.enum(["TWD", "USD", "EUR", "USDC"]),
            description: z.string(),
            location: z.string(),
            latitude: z.number(),
            longitude: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {
            const [listing] = await db.insert(listings)
                .values({
                    ...input,
                    userId: ctx.session.user.id,
                    status: "active",
                })
                .returning();

            return listing;
        }),

    delete: protectedProcedure
        .input(z.object({
            id: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {
            const [listing] = await db
                .delete(listings)
                .where(and(
                    eq(listings.id, input.id),
                    eq(listings.userId, ctx.session.user.id)
                ))
                .returning();

            if (!listing) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Listing not found or you don't have permission to delete it",
                });
            }

            return listing;
        }),
}); 