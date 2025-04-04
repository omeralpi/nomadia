import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { initTRPC, TRPCError } from "@trpc/server"
import type { CreateNextContextOptions } from "@trpc/server/adapters/next"
import { getServerSession } from "next-auth"
import superjson from "superjson"
import { ZodError } from "zod"

export const createTRPCContext = async (
  opts: Omit<CreateNextContextOptions, "info">
) => {
  const session = await getServerSession(authOptions);

  return {
    session,
    db,
    req: opts.req,
    res: opts.res,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})


export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return next({
    ctx: {
      session: ctx.session,
      user: ctx.session.user,
    },
  })
})
