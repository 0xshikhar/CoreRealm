import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// This endpoint should be accessible without authentication
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { address } = body;

        if (!address) {
            console.log('Register API: Missing address');
            return NextResponse.json(
                { error: 'Wallet address is required' },
                { status: 400 }
            );
        }

        console.log(`Register API: Registering address ${address}`);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { walletAddress: address.toLowerCase() },
            select: { id: true }
        });

        if (existingUser) {
            console.log(`Register API: User already exists for address ${address}`);
            return NextResponse.json({
                success: true,
                exists: true,
                userId: existingUser.id
            });
        }

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                walletAddress: address.toLowerCase(),
            }
        });

        console.log(`Register API: Created new user with ID ${newUser.id}`);
        return NextResponse.json({
            success: true,
            exists: false,
            userId: newUser.id
        });
    } catch (error) {
        console.error('Register API: Error registering user:', error);
        return NextResponse.json(
            { error: 'Failed to register user' },
            { status: 500 }
        );
    }
} 