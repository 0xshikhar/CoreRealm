import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createJwtToken } from '@/lib/auth';
import { SiweMessage } from 'siwe';

export async function POST(request: NextRequest) {
  try {
    const { address, message, signature } = await request.json();

    if (!address || !message || !signature) {
      console.error('Login API: Missing required fields');
      return NextResponse.json(
        { error: 'Address, message, and signature are required' },
        { status: 400 }
      );
    }

    console.log(`Login API: Verifying signature for ${address}`);
    console.log('Login API: Message:', message);
    console.log('Login API: Signature (first 20 chars):', signature.substring(0, 20) + '...');

    try {
      // Parse the SIWE message
      let siweMessage;
      try {
        siweMessage = new SiweMessage(message);

        // Log the parsed message for debugging
        console.log('Login API: Parsed SIWE message:', {
          domain: siweMessage.domain,
          address: siweMessage.address,
          statement: siweMessage.statement,
          uri: siweMessage.uri,
          version: siweMessage.version,
          chainId: siweMessage.chainId,
          nonce: siweMessage.nonce,
          issuedAt: siweMessage.issuedAt
        });
      } catch (parseError) {
        console.error('Login API: Failed to parse SIWE message:', parseError);
        return NextResponse.json(
          { error: 'Invalid message format' },
          { status: 400 }
        );
      }

      // Verify the signature
      const verificationResult = await siweMessage.verify({
        signature,
        // Add domain verification options if needed
        // domain: { 
        //   expected: 'localhost:3004' // or your domain
        // }
      });

      if (!verificationResult.success) {
        console.error('Login API: SIWE verification failed:', verificationResult.error);
        return NextResponse.json(
          { error: 'Failed to verify signature' },
          { status: 401 }
        );
      }

      const verifiedMessage = verificationResult.data;

      // Add additional logging to help debug
      console.log('Login API: Signature verification details:', {
        messageAddress: verifiedMessage.address,
        providedAddress: address,
        match: verifiedMessage.address.toLowerCase() === address.toLowerCase()
      });

      // Verify the address in the message matches the provided address
      if (verifiedMessage.address.toLowerCase() !== address.toLowerCase()) {
        console.error(`Login API: Address mismatch. Message: ${verifiedMessage.address}, Provided: ${address}`);
        return NextResponse.json(
          { error: 'Address mismatch' },
          { status: 401 }
        );
      }

      console.log(`Login API: Signature verified for ${address}`);

      // Find or create user
      let user = await db.user.findUnique({
        where: { walletAddress: address.toLowerCase() }
      });

      if (!user) {
        console.log(`Login API: Creating new user for ${address}`);
        try {
          user = await db.user.create({
            data: {
              walletAddress: address.toLowerCase(),
            }
          });
        } catch (dbError) {
          console.error('Login API: Failed to create user:', dbError);
          return NextResponse.json(
            { error: 'Failed to create user account' },
            { status: 500 }
          );
        }
      }

      // Generate JWT token
      const token = createJwtToken({
        userId: user.id,
        address: user.walletAddress
      });

      console.log(`Login API: Generated token for user ${user.id}`);

      return NextResponse.json({
        token,
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
          name: user.name
        }
      });
    } catch (error) {
      console.error('Login API: Signature verification failed:', error);
      console.error('Login API: Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: 'Failed to verify signature' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login API: Error processing request:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 