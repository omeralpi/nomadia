import { authRouter } from "./routers/auth"
import { userRouter } from "./routers/user"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
    user: userRouter,
    auth: authRouter,
})

export type AppRouter = typeof appRouter