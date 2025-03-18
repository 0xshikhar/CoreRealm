import { generateNonce, SiweMessage } from 'siwe';
// import { prisma } from './prisma';
import jwt from 'jsonwebtoken';
import { JwtPayload as JwtPayloadType } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Extended JWT payload with our custom fields
interface CustomJwtPayload extends JwtPayloadType {
    userId: string;
    address: string;
}

// Create a JWT token
export function createJwtToken(payload: { userId: string; address: string }) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify a JWT token
export async function verifyJwtToken(token: string): Promise<CustomJwtPayload> {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
        return decoded;
    } catch (error) {
        console.error('JWT verification failed:', error);
        throw error;
    }
}

// Create an authentication message for signing
export function createAuthMessage(address: string, nonce: string, chainId?: number): string {
    return `Sign this message to authenticate with CoreRealm.

Wallet: ${address}
Nonce: ${nonce}
Chain ID: ${chainId || 1}
Timestamp: ${Date.now()}`;
}

export async function verifySignature(message: string, signature: string) {
    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.verify({ signature });
    return fields.data;
}

// Define the user type for the JWT payload
export interface JwtPayload {
    userId: string;
    address: string;
    iat?: number;
    exp?: number;
}

// Generate a JWT token
export function generateJwtToken(payload: Omit<JwtPayload, 'iat' | 'exp'>) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.sign(payload, secret, { expiresIn: '1d' });
}

// Debug function to check token validity
export function debugJwtToken(token: string): { valid: boolean; payload?: JwtPayload; error?: string } {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        return { valid: false, error: 'JWT_SECRET is not defined' };
    }

    try {
        const decoded = jwt.verify(token, secret);
        return { valid: true, payload: decoded as JwtPayload };
    } catch (error) {
        return {
            valid: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
