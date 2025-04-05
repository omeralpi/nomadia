import { db } from "@/lib/db";
import { createListingSchema, listings, updateListingSchema } from "@/lib/db/schema";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const listingRouter = createTRPCRouter({
    nearby: protectedProcedure
        .input(z.object({
            latitude: z.number(),
            longitude: z.number(),
            type: z.enum(["buying", "selling"]).optional(),
            currency: z.enum(["TWD", "USD", "EUR", "USDC"]).optional(),
        }))
        .query(async ({ ctx, input }) => {
            const listingsList = await db.query.listings.findMany({
                where: and(
                    eq(listings.status, "active"),
                    input.type ? eq(listings.type, input.type) : undefined,
                    input.currency ? eq(listings.currencyCode, input.currency) : undefined,
                ),
                with: {
                    user: true,
                    currency: true,
                },
                orderBy: desc(listings.createdAt),
            });

            return listingsList;
        }),

    create: protectedProcedure
        .input(createListingSchema)
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

    edit: protectedProcedure
        .input(z.object({
            id: z.number(),
            data: updateListingSchema,
        }))
        .mutation(async ({ ctx, input }) => {
            const [listing] = await db
                .update(listings)
                .set({
                    ...input.data,
                    updatedAt: new Date(),
                })
                .where(and(
                    eq(listings.id, input.id),
                    eq(listings.userId, ctx.session.user.id)
                ))
                .returning();

            if (!listing) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Listing not found or you don't have permission to edit it",
                });
            }

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

    currencies: protectedProcedure
        .query(async () => {
            const currencies = await db.query.currencies.findMany();

            return currencies;
        }),

    myListings: protectedProcedure
        .query(async ({ ctx }) => {
            const listingsList = await db.query.listings.findMany({
                where: and(
                    eq(listings.status, "active"),
                    eq(listings.userId, ctx.session.user.id)
                ),
                with: {
                    user: true,
                    currency: true,
                },
                orderBy: desc(listings.createdAt),
            });

            return listingsList;
        }),
}); 