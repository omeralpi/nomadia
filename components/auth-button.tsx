'use client'

import { walletAuth } from '@/lib/auth/wallet-auth'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import { SubmitButton } from './ui/submit-button'

export const AuthButton = () => {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)

    const onClick = useCallback(async () => {
        setIsPending(true)

        let result

        try {
            result = await walletAuth()
        } catch (error) {
            console.error('Wallet authentication failed', error)
            setIsPending(false)
            return
        }

        if (result?.error) {
            console.error('Wallet authentication failed', result)
        }

        setIsPending(false)
    }, [router])

    return (
        <SubmitButton
            className="w-[200px] animate-in fade-in-50 duration-500"
            onClick={onClick}
            isSubmitting={isPending}
        >
            Start trading
        </SubmitButton>
    )
}