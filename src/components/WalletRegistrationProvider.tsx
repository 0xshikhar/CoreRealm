"use client"
import { useWalletConnection } from '@/hooks/useWalletConnection'
import { ReactNode } from 'react'

export function WalletRegistrationProvider({ children }: { children: ReactNode }) {
    // This will automatically register users when they connect
    useWalletConnection()

    // Just render children, this component only handles the registration
    return <>{children}</>
} 