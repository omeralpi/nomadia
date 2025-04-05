import { MiniKit, verifySiweMessage } from '@worldcoin/minikit-js'
import { eq } from 'drizzle-orm'
import { NextAuthOptions } from 'next-auth'
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
            authorize: async ({
                nonce,
                signedNonce,
                finalPayloadJson,
            }: {
                nonce: string
                signedNonce: string
                finalPayloadJson: string
            }) => {
                console.log({
                    nonce,
                    signedNonce,
                    finalPayloadJson,
                })
                const expectedSignedNonce = getSignedNonce({ nonce })

                if (signedNonce !== expectedSignedNonce) {
                    console.log('Invalid signed nonce')
                    return null
                }

                console.log({ MiniKit, nonce, finalPayloadJson })
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
                    return user
                }

                const newUser = await db.insert(users).values({
                    address: result.siweMessageData.address,
                }).returning()

                return newUser
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.userId = user.id
                token.name = user.name
                token.image = user.image
                token.address = user.address
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