import { appRouter } from "@/server/api/root"
import { createTRPCContext } from "@/server/api/trpc"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { NextApiRequest, NextApiResponse } from "next"

const handler = async (
  req: NextApiRequest & Request,
  res: Request & NextApiResponse
) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () =>
      await createTRPCContext({
        req,
        res,
      })
  })

export { handler as GET, handler as POST }
