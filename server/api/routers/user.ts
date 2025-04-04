import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
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
})
