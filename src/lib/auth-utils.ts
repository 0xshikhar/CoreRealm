import { verifyMessage } from 'viem'

export function generateNonce(): string {
    return Math.floor(Math.random() * 1000000).toString()
}

export function verifySignature(
    message: string,
    signature: string,
    address: string
): boolean {
    try {
        return verifyMessage({ message, signature, address })
    } catch (error) {
        console.error('Error verifying signature:', error)
        return false
    }
}

// Simple in-memory session store (in a real app, use a more persistent solution)
const sessions: Record<string, { address: string; expiry: number }> = {}

export function createSession(address: string): string {
    const sessionId = crypto.randomUUID()
    sessions[sessionId] = {
        address,
        expiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }
    return sessionId
}

export function getSession(sessionId: string): string | null {
    const session = sessions[sessionId]
    if (!session) return null

    if (session.expiry < Date.now()) {
        delete sessions[sessionId]
        return null
    }

    return session.address
} 