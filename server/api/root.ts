import { authRouter } from "./routers/auth"
import { chatRouter } from "./routers/chat"
import { listingRouter } from "./routers/listing"
import { paymentRouter } from "./routers/payment"
import { transactionRouter } from "./routers/transaction"
import { userRouter } from "./routers/user"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
    user: userRouter,
    auth: authRouter,
    chat: chatRouter,
    listing: listingRouter,
    payment: paymentRouter,
    transaction: transactionRouter,
})

export type AppRouter = typeof appRouter