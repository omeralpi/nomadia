import { conversations, messages } from "@/lib/db/schema/chat";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, or } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const chatRouter = createTRPCRouter({
    getConversationByUser: protectedProcedure.input(z.object({
        userId: z.string(),
    })).query(async ({ ctx, input }) => {
        const { userId } = input;

        const conversation = await ctx.db.query.conversations.findFirst({
            where: or(
                and(
                    eq(conversations.user1Id, userId),
                    eq(conversations.user2Id, ctx.session.user.id)
                ),
                and(
                    eq(conversations.user1Id, ctx.session.user.id),
                    eq(conversations.user2Id, userId)
                )
            ),
            with: {
                user1: true,
                user2: true,
            },
        });

        return conversation;
    }),

    getConversations: protectedProcedure.query(async ({ ctx }) => {
        const userConversations = await ctx.db.query.conversations.findMany({
            where: or(
                eq(conversations.user1Id, ctx.session.user.id),
                eq(conversations.user2Id, ctx.session.user.id)
            ),
            with: {
                user1: true,
                user2: true,
                messages: {
                    limit: 1,
                    orderBy: [desc(messages.createdAt)],
                },
            },
            orderBy: [desc(conversations.updatedAt)],
        });

        return userConversations.map(conv => ({
            ...conv,
            participants: [conv.user1Id === ctx.session.user.id ? conv.user2 : conv.user1],
            lastMessage: conv.messages[0],
        }));
    }),

    getMessages: protectedProcedure
        .input(z.object({
            conversationId: z.number(),
            cursor: z.number().optional(),
            limit: z.number().min(1).max(100).default(50),
        }))
        .query(async ({ ctx, input }) => {
            const { conversationId, cursor, limit } = input;

            const conversation = await ctx.db.query.conversations.findFirst({
                where: and(
                    eq(conversations.id, conversationId),
                    or(
                        eq(conversations.user1Id, ctx.session.user.id),
                        eq(conversations.user2Id, ctx.session.user.id)
                    )
                ),
            });

            if (!conversation) {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            const items = await ctx.db.query.messages.findMany({
                where: eq(messages.conversationId, conversationId),
                with: {
                    sender: true,
                },
                limit: limit + 1,
                offset: cursor,
                orderBy: [desc(messages.createdAt)],
            });

            let nextCursor: typeof cursor = undefined;
            if (items.length > limit) {
                const nextItem = items.pop();
                nextCursor = cursor ? cursor + limit : limit;
            }

            return {
                items,
                nextCursor,
            };
        }),

    sendMessage: protectedProcedure
        .input(z.object({
            content: z.string().min(1),
            userId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { content, userId } = input;

            const existingConversation = await ctx.db.query.conversations.findFirst({
                where: or(
                    and(
                        eq(conversations.user1Id, userId),
                        eq(conversations.user2Id, ctx.session.user.id)
                    ),
                    and(
                        eq(conversations.user1Id, ctx.session.user.id),
                        eq(conversations.user2Id, userId)
                    )
                ),
            });

            let conversationId: number;
            if (existingConversation) {
                conversationId = existingConversation.id;
            } else {
                const [newConversation] = await ctx.db.insert(conversations).values({
                    user1Id: ctx.session.user.id,
                    user2Id: userId,
                }).returning();
                conversationId = newConversation.id;
            }

            const [message] = await ctx.db.insert(messages).values({
                conversationId,
                content,
                senderId: ctx.session.user.id,
            }).returning();

            await ctx.db.update(conversations)
                .set({ updatedAt: new Date() })
                .where(eq(conversations.id, conversationId));

            return message;
        }),

    createConversation: protectedProcedure
        .input(z.object({
            userId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { userId } = input;

            const existingConversation = await ctx.db.query.conversations.findFirst({
                where: or(
                    and(
                        eq(conversations.user1Id, userId),
                        eq(conversations.user2Id, ctx.session.user.id)
                    ),
                    and(
                        eq(conversations.user1Id, ctx.session.user.id),
                        eq(conversations.user2Id, userId)
                    )
                ),
            });

            if (existingConversation) {
                return existingConversation;
            }

            const [conversation] = await ctx.db.insert(conversations).values({
                user1Id: ctx.session.user.id,
                user2Id: userId,
            }).returning();

            return conversation;
        }),
}); 