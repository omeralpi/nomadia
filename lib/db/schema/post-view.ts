import { eq, sql } from "drizzle-orm";
import { alias, pgView } from "drizzle-orm/pg-core";
import { likes, posts } from "./post";
import { users } from "./user";

export const postView = pgView('post_view').as((qb) => {
    const repliesAlias = alias(posts, 'replies');

    return qb
        .select({
            id: posts.id,
            content: posts.content,
            image: sql<string>`${posts.image}`.as('post_image'),
            createdAt: sql<Date>`${posts.createdAt}`.as('post_created_at'),
            userId: posts.userId,
            user: {
                name: users.name,
                image: sql<string>`${users.image}`.as('user_image'),
            },
            stats: {
                likesCount: sql<number>`COUNT(DISTINCT ${likes.id})`.as('likes_count'),
                repliesCount: sql<number>`COUNT(DISTINCT ${repliesAlias.id})`.as('replies_count'),
            },
            viewer: {
                isLiked: sql<boolean>`COALESCE(bool_or(${likes.userId}::text = current_setting('app.user_id')), false)`.as('is_liked'),
                isOwner: sql<boolean>`${posts.userId}::text = current_setting('app.user_id')`.as('is_owner'),
            },
        })
        .from(posts)
        .innerJoin(users, eq(users.id, posts.userId))
        .leftJoin(likes, eq(likes.postId, posts.id))
        .leftJoin(repliesAlias, eq(repliesAlias.replyToId, posts.id))
        .groupBy(
            posts.id,
            posts.content,
            posts.createdAt,
            posts.userId,
            posts.image,
            users.name,
            users.image,
        );
});

export type PostView = typeof postView.$inferSelect;