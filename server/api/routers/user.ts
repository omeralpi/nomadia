import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { TRPCError } from "@trpc/server"
import { eq, sql } from "drizzle-orm"
import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const userRouter = createTRPCRouter({
  get: protectedProcedure.input(z.object({
    id: z.string(),
  })).query(async ({ input }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, input.id),
    })

    return user
  }),

  getById: protectedProcedure.input(z.object({
    id: z.string(),
  })).query(async ({ input }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, input.id),
    })

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" })
    }

    return user
  }),

  list: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
      cursor: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;

      const items = await db.query.users.findMany({
        limit: limit + 1,
        where: cursor ? sql`${users.id} > ${cursor}` : undefined,
        orderBy: users.id,
      });

      let nextCursor: typeof cursor = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),
})
