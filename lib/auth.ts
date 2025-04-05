import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,

    providers: [
        {
            id: "worldcoin",
            name: "Worldcoin",
            type: "oauth",
            wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
            authorization: { params: { scope: "openid" } },
            clientId: process.env.WLD_CLIENT_ID,
            clientSecret: process.env.WLD_CLIENT_SECRET,
            idToken: true,
            checks: ["state", "nonce", "pkce"],
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.sub,
                    verificationLevel:
                        profile["https://id.worldcoin.org/v1"].verification_level,
                };
            },
        },
    ],
    callbacks: {
        async signIn({ user }) {
            await db
                .insert(users)
                .values({
                    id: user.id,
                })
                .onConflictDoNothing()
                .catch((e) => {
                    console.error("error inserting user", e);
                });

            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }

            return token;
        },

        async session({ session, token }) {
            if (!session.user) {
                return session;
            }

            const dbUser = await db.query.users.findFirst({
                where: eq(users.id, token.sub as string),
            });

            if (dbUser) {
                session.user.id = dbUser.id;
                session.user.name = dbUser.name;
                session.user.bio = dbUser.bio ?? undefined;
                session.user.image = dbUser.image ?? undefined;
            }

            return session;
        },
    },
    debug: process.env.NODE_ENV === "development",
};
