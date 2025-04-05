import { conversationParticipants, conversations, messages } from "@/lib/db/schema/chat";
import { users } from "@/lib/db/schema/user";
import { and, asc, desc, eq, exists, not } from "drizzle-orm";
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
        const baseQuery = ctx.db
            .select({
                id: conversations.id,
                createdAt: conversations.createdAt,
                updatedAt: conversations.updatedAt,
            })
            .from(conversations)
            .innerJoin(
                conversationParticipants,
                and(
                    eq(conversations.id, conversationParticipants.conversationId),
                    eq(conversationParticipants.userId, ctx.session.user.id)
                )
            )
            .orderBy(desc(conversations.updatedAt));

        const results = await Promise.all((await baseQuery).map(async (conv) => {
            const participants = await ctx.db
                .select({
                    userId: conversationParticipants.userId,
                    user: {
                        id: users.id,
                        name: users.name,
                        image: users.image,
                    }
                })
                .from(conversationParticipants)
                .innerJoin(users, eq(users.id, conversationParticipants.userId))
                .where(eq(conversationParticipants.conversationId, conv.id));

            const unreadMessages = await ctx.db
                .select({ id: messages.id })
                .from(messages)
                .where(and(
                    eq(messages.conversationId, conv.id),
                    eq(messages.isRead, false),
                    not(eq(messages.senderId, ctx.session.user.id))
                ));

            const lastMessage = await ctx.db
                .select({
                    id: messages.id,
                    content: messages.content,
                    createdAt: messages.createdAt,
                    senderId: messages.senderId,
                    isRead: messages.isRead
                })
                .from(messages)
                .where(eq(messages.conversationId, conv.id))
                .orderBy(desc(messages.createdAt))
                .limit(1);

            return {
                ...conv,
                participants: participants.filter(p => p.userId !== ctx.session.user.id).map(p => p.user),
                lastMessage: lastMessage[0],
                unreadCount: unreadMessages.length
            };
        }));

        return results;
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

    markMessagesAsRead: protectedProcedure
        .input(z.object({
            userId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { userId } = input;

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
                return;
            }

            await ctx.db.update(messages)
                .set({ isRead: true })
                .where(
                    and(
                        eq(messages.conversationId, conversation[0].conversations.id),
                        eq(messages.senderId, userId),
                        eq(messages.isRead, false)
                    )
                );
        }),

    getTotalUnreadCount: protectedProcedure.query(async ({ ctx }) => {
        const unreadMessages = await ctx.db
            .select({ id: messages.id })
            .from(messages)
            .innerJoin(
                conversationParticipants,
                eq(messages.conversationId, conversationParticipants.conversationId)
            )
            .where(and(
                eq(conversationParticipants.userId, ctx.session.user.id),
                eq(messages.isRead, false),
                not(eq(messages.senderId, ctx.session.user.id))
            ));

        return unreadMessages.length;
    }),
}); 