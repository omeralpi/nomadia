import { verifySiweMessage } from '@worldcoin/minikit-js'
import { eq } from 'drizzle-orm'
import { NextAuthOptions, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import Credentials from 'next-auth/providers/credentials'
import { db } from '../db'
import { users } from '../db/schema'
import { getSignedNonce } from './wallet-auth/get-signed-nonce'

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt' },
    providers: [
        Credentials({
            name: 'Wallet',
            credentials: {
                nonce: { label: 'Nonce', type: 'text' },
                signedNonce: { label: 'Signed Nonce', type: 'text' },
                finalPayloadJson: { label: 'Final Payload', type: 'text' },
            },
            async authorize(credentials): Promise<User | null> {
                if (!credentials?.nonce || !credentials?.signedNonce || !credentials?.finalPayloadJson) {
                    return null
                }

                const { nonce, signedNonce, finalPayloadJson } = credentials
                const expectedSignedNonce = getSignedNonce({ nonce })

                if (signedNonce !== expectedSignedNonce) {
                    console.log('Invalid signed nonce')
                    return null
                }

                const finalPayload = JSON.parse(finalPayloadJson)
                const result = await verifySiweMessage(finalPayload, nonce)

                if (!result.isValid || !result.siweMessageData.address) {
                    console.log('Invalid final payload')
                    return null
                }

                const user = await db.query.users.findFirst({
                    where: eq(users.address, result.siweMessageData.address),
                })

                if (user) {
                    return {
                        id: user.id,
                        name: user.name,
                        image: user.image,
                        address: user.address,
                        email: null
                    }
                }

                const [newUser] = await db.insert(users).values({
                    address: result.siweMessageData.address,
                }).returning()

                return {
                    id: newUser.id,
                    name: newUser.name,
                    image: newUser.image,
                    address: newUser.address,
                    email: null
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger }) {
            if (trigger === 'update') {
                return await handleTokenUpdate(token)
            }

            if (user) {
                return {
                    ...token,
                    userId: user.id,
                    name: user.name,
                    image: user.image,
                    address: user.address,
                }
            }

            return token
        },
        session: async ({ session, token }) => {
            if (token.userId) {
                session.user.id = token.userId as string
                session.user.name = token.name as string
                session.user.image = token.image as string
                session.user.address = token.address as string
            }

            return session
        },
    },
    debug: process.env.NODE_ENV === "development",
}

async function handleTokenUpdate(token: JWT) {
    const dbUser = await db.query.users.findFirst({
        where: eq(users.address, token.address as string),
    })

    if (!dbUser) {
        return token
    }

    return {
        ...token,
        name: dbUser.name,
        image: dbUser.image,
    }
}