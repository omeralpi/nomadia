import { db } from "@/lib/db"
import { updateUserSchema, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const authRouter = createTRPCRouter({
    updateUser: protectedProcedure
        .input(updateUserSchema)
        .mutation(async ({ ctx, input }) => {
            const user = await db.update(users)
                .set(input)
                .where(eq(users.id, ctx.user.id))
                .returning()

            return user[0]
        }),
}) 