import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/getAuthUser';
import { db } from '@/lib/db';

// This endpoint is used to verify if a user's token is valid and return user data
export async function GET(request: NextRequest) {
    // Get the authenticated user from the request headers (set by middleware)
    const user = getAuthUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Fetch user data from the database
        const userData = await db.user.findUnique({
            where: { id: user.userId },
            select: {
                id: true,
                walletAddress: true,
                username: true,
                name: true,
                createdAt: true,
            }
        });

        if (!userData) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Return both authentication status and user data
        return NextResponse.json({
            authenticated: true,
            user: userData
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        // Even if we can't fetch user data, the token is still valid
        return NextResponse.json({ authenticated: true });
    }
} 