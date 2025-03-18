import { NextRequest, NextResponse } from 'next/server';
import { SiweMessage } from 'siwe';

export async function POST(request: NextRequest) {
    try {
        const { message, signature } = await request.json();

        if (!message || !signature) {
            return NextResponse.json(
                { error: 'Message and signature are required' },
                { status: 400 }
            );
        }

        console.log('Test SIWE API: Received message:', message);
        console.log('Test SIWE API: Received signature (first 20 chars):', signature.substring(0, 20) + '...');

        try {
            // Parse the SIWE message
            const siweMessage = new SiweMessage(message);

            // Log the parsed message
            console.log('Test SIWE API: Parsed message:', {
                domain: siweMessage.domain,
                address: siweMessage.address,
                statement: siweMessage.statement,
                uri: siweMessage.uri,
                version: siweMessage.version,
                chainId: siweMessage.chainId,
                nonce: siweMessage.nonce,
                issuedAt: siweMessage.issuedAt
            });

            // Verify the signature
            const verificationResult = await siweMessage.verify({ signature });

            console.log('Test SIWE API: Verification result:', verificationResult);

            return NextResponse.json({
                success: verificationResult.success,
                data: verificationResult.data,
                error: verificationResult.error
            });
        } catch (error) {
            console.error('Test SIWE API: Error verifying message:', error);
            return NextResponse.json(
                { error: 'Failed to verify message', details: JSON.stringify(error) },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Test SIWE API: Error processing request:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
} 