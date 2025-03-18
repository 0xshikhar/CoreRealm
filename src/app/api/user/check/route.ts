import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Simple in-memory cache to prevent duplicate checks
const recentChecks: Record<string, { exists: boolean, timestamp: number }> = {};
const CACHE_TTL = 60000; // 60 seconds

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
        console.log('User check: Missing address parameter');
        return NextResponse.json(
            { error: 'Address parameter is required' },
            { status: 400 }
        );
    }

    const normalizedAddress = address.toLowerCase();
    console.log(`User check: Checking address ${normalizedAddress}`);

    // Check if we've recently processed this address
    const cachedResult = recentChecks[normalizedAddress];
    const now = Date.now();

    if (cachedResult && now - cachedResult.timestamp < CACHE_TTL) {
        console.log(`User check: Using cached result for address: ${normalizedAddress} (exists: ${cachedResult.exists})`);
        return NextResponse.json({
            exists: cachedResult.exists,
            cached: true
        });
    }

    try {
        console.log(`User check: Querying database for address: ${normalizedAddress}`);
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { walletAddress: normalizedAddress },
            select: { id: true } // Only select the ID for efficiency
        });

        const exists = !!user;

        // Update the cache
        recentChecks[normalizedAddress] = {
            exists,
            timestamp: now
        };

        console.log(`User check: Result for ${normalizedAddress}: exists=${exists}`);

        // Clean up old cache entries periodically
        if (Object.keys(recentChecks).length > 100) {
            console.log('User check: Cleaning up cache');
            for (const addr in recentChecks) {
                if (now - recentChecks[addr].timestamp > CACHE_TTL) {
                    delete recentChecks[addr];
                }
            }
        }

        return NextResponse.json({ exists });
    } catch (error) {
        console.error('User check: Error checking user:', error);
        return NextResponse.json(
            { error: 'Failed to check user' },
            { status: 500 }
        );
    }
} 