import { DefaultSession } from "next-auth";

declare module 'next-auth' {
    interface User {
        address: string
    }

    interface Session {
        user: {
            id: string
            address: string
        } & DefaultSession['user']
    }
}


declare module "next-auth/jwt" {
    interface JWT {
        id: string
        address: string;
    }
}