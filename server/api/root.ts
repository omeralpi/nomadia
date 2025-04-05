import { authRouter } from "./routers/auth"
import { chatRouter } from "./routers/chat"
import { listingRouter } from "./routers/listing"
import { userRouter } from "./routers/user"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
    user: userRouter,
    auth: authRouter,
    chat: chatRouter,
    listing: listingRouter,
})

export type AppRouter = typeof appRouter