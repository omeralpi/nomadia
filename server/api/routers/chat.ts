import { conversationParticipants, conversations, messages } from "@/lib/db/schema/chat";
import { and, asc, desc, eq, exists } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const chatRouter = createTRPCRouter({
    getConversationByUser: protectedProcedure.input(z.object({
        userId: z.string(),
    })).query(async ({ ctx, input }) => {
        const { userId } = input;

        const conversation = await ctx.db.query.conversations.findFirst({
            where: eq(conversationParticipants.userId, userId),
            with: {
                participants: {
                    with: {
                        user: true,
                    },
                },
            },
        });

        return conversation;
    }),

    getConversations: protectedProcedure.query(async ({ ctx }) => {
        const userConversations = await ctx.db.query.conversations.findMany({
            where: exists(
                ctx.db.select()
                    .from(conversationParticipants)
                    .where(and(
                        eq(conversationParticipants.conversationId, conversations.id),
                        eq(conversationParticipants.userId, ctx.session.user.id)
                    ))
            ),
            with: {
                participants: {
                    with: {
                        user: true,
                    },
                },
                messages: {
                    limit: 1,
                    orderBy: [desc(messages.createdAt)],
                },
            },
            orderBy: [desc(conversations.updatedAt)],
        });

        return userConversations.map(conv => ({
            ...conv,
            participants: conv.participants
                .filter(p => p.userId !== ctx.session.user.id)
                .map(p => p.user),
            lastMessage: conv.messages[0],
        }));
    }),

    getMessages: protectedProcedure
        .input(z.object({
            userId: z.string(),
            cursor: z.number().optional(),
            limit: z.number().min(1).max(100).default(50),
        }))
        .query(async ({ ctx, input }) => {
            const { userId, cursor, limit } = input;

            const conversation = await ctx.db.select()
                .from(conversations)
                .innerJoin(conversationParticipants, eq(conversations.id, conversationParticipants.conversationId))
                .where(
                    and(
                        eq(conversationParticipants.userId, ctx.session.user.id),
                        exists(
                            ctx.db.select()
                                .from(conversationParticipants)
                                .where(
                                    and(
                                        eq(conversationParticipants.conversationId, conversations.id),
                                        eq(conversationParticipants.userId, userId)
                                    )
                                )
                        )
                    )
                )
                .limit(1);

            if (!conversation.length) {
                return {
                    items: [],
                    nextCursor: undefined,
                };
            }

            const items = await ctx.db.query.messages.findMany({
                where: eq(messages.conversationId, conversation[0].conversations.id),
                with: {
                    sender: true,
                },
                limit: limit + 1,
                offset: cursor,
                orderBy: [asc(messages.createdAt)],
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

            const participantsCount = await ctx.db.select({
                count: conversations.id
            })
                .from(conversations)
                .innerJoin(conversationParticipants, eq(conversations.id, conversationParticipants.conversationId))
                .where(
                    and(
                        eq(conversationParticipants.userId, ctx.session.user.id),
                        exists(
                            ctx.db.select()
                                .from(conversationParticipants)
                                .where(
                                    and(
                                        eq(conversationParticipants.conversationId, conversations.id),
                                        eq(conversationParticipants.userId, userId)
                                    )
                                )
                        )
                    )
                );

            let conversationId: number;
            if (participantsCount.length > 0) {
                const [conversation] = await ctx.db.select()
                    .from(conversations)
                    .innerJoin(conversationParticipants, eq(conversations.id, conversationParticipants.conversationId))
                    .where(
                        and(
                            eq(conversationParticipants.userId, ctx.session.user.id),
                            exists(
                                ctx.db.select()
                                    .from(conversationParticipants)
                                    .where(
                                        and(
                                            eq(conversationParticipants.conversationId, conversations.id),
                                            eq(conversationParticipants.userId, userId)
                                        )
                                    )
                            )
                        )
                    );
                conversationId = conversation.conversations.id;
            } else {
                const [newConversation] = await ctx.db.insert(conversations).values({}).returning();
                conversationId = newConversation.id;

                await ctx.db.insert(conversationParticipants).values([
                    {
                        conversationId,
                        userId: ctx.session.user.id,
                    },
                    {
                        conversationId,
                        userId,
                    },
                ]);
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
                where: and(
                    eq(conversationParticipants.userId, ctx.session.user.id),
                    eq(conversationParticipants.userId, userId)
                ),
            });

            if (existingConversation) {
                return existingConversation;
            }

            const [conversation] = await ctx.db.insert(conversations).values({}).returning();

            await ctx.db.insert(conversationParticipants).values([
                {
                    conversationId: conversation.id,
                    userId: ctx.session.user.id,
                },
                {
                    conversationId: conversation.id,
                    userId,
                },
            ]);

            return conversation;
        }),
}); 