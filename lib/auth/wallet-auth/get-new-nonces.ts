'use server'

import crypto from 'crypto'
import { getSignedNonce } from './get-signed-nonce'

export const getNewNonces = async () => {
    const nonce = crypto.randomUUID().replace(/-/g, '')
    const signedNonce = getSignedNonce({ nonce })

    return {
        nonce,
        signedNonce,
    }
}