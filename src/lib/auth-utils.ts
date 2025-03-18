import { SiweMessage, generateNonce as siweGenerateNonce } from 'siwe'
import publicClient from './customChain'

// Generate a nonce for authentication
export function generateNonce(): string {
    return siweGenerateNonce();
}

/**
 * Verifies a message signature using SIWE
 * @param message The SIWE message that was signed
 * @param signature The signature to verify
 * @returns Promise that resolves when verification is successful
 */
export async function verifySignature(message: string, signature: string): Promise<boolean> {
    try {
        const siweMessage = new SiweMessage(message);
        const { success, data } = await siweMessage.verify({ signature });

        if (!success) {
            console.error('SIWE verification failed:', data);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error verifying SIWE signature:', error);
        return false;
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

// Create a SIWE message for signing
export function createSiweMessage(address: string, nonce: string, chainId: number) {
    // Ensure the domain matches exactly what your server expects
    const domain = window.location.host;
    const origin = window.location.origin;

    console.log('Creating SIWE message with:', {
        domain,
        origin,
        address,
        chainId,
        nonce
    });

    const message = new SiweMessage({
        domain,
        address,
        statement: 'Sign in to Core Realm',
        uri: origin,
        version: '1',
        chainId,
        nonce,
        issuedAt: new Date().toISOString(),
    });

    const preparedMessage = message.prepareMessage();
    console.log('Prepared SIWE message:', preparedMessage);

    return preparedMessage;
}

/**
 * Check if the user is authenticated via JWT token
 * @returns True if the user has a valid auth token, false otherwise
 */
export function isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token')
}

/**
 * Get the stored auth token
 * @returns The JWT token or null if not authenticated
 */
export function getAuthToken(): string | null {
    return localStorage.getItem('auth_token')
} 