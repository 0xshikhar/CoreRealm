import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { PrismaClient } from "@prisma/client"

// Define interfaces for our data structures
interface GamePlaysByGame {
    [gameId: string]: {
        game: any;
        playCount: number;
        lastPlayed: Date | null;
    }
}

interface ScoresByGame {
    [gameId: string]: {
        game: any;
        highScore: number;
        recentScores: Array<{
            score: number;
            achievedAt: Date;
        }>;
    }
}

interface GameStat {
    game: any;
    playCount: number;
    lastPlayed: Date | null;
    highScore: number;
    recentScores: Array<{
        score: number;
        achievedAt: Date;
    }>;
}

export async function GET(req: NextRequest) {
    try {
        // Get the address from the query parameters
        const { searchParams } = new URL(req.url);
        const address = searchParams.get('address');

        if (!address) {
            return NextResponse.json(
                { error: "Wallet address is required" },
                { status: 400 }
            )
        }

        // Find the user by wallet address
        const user = await db.user.findUnique({
            where: { walletAddress: address.toLowerCase() },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // After finding the user, fetch their transactions
        const transactions = await db.transaction.findMany({
            where: {
                userId: user.id,
                type: "GAME_PAYMENT"
            },
            orderBy: { createdAt: 'desc' },
            select: { gameId: true, createdAt: true }
        });

        // Group transactions by gameId
        const transactionTimesByGameId = transactions.reduce((acc, tx) => {
            if (tx.gameId) {
                if (!acc[tx.gameId]) {
                    acc[tx.gameId] = [];
                }
                acc[tx.gameId].push(tx.createdAt);
            }
            return acc;
        }, {} as Record<string, Date[]>);

        // Check if the gameStats table exists in the schema
        let gameStats = [];

        try {
            // Try to fetch game stats if the table exists
            // This is a safer approach that won't crash if the table doesn't exist
            gameStats = await db.$queryRaw<any[]>`
                SELECT * FROM "Game" g
                LEFT JOIN (
                    SELECT "gameId", COUNT(*) as "playCount", MAX("createdAt") as "lastPlayed", 
                           MAX("score") as "highScore", "userId"
                    FROM "GamePlay"
                    WHERE "userId" = ${user.id}
                    GROUP BY "gameId", "userId"
                ) gp ON g.id = gp."gameId"
                WHERE gp."userId" = ${user.id} OR g.id IN (
                    SELECT DISTINCT "gameId" FROM "GamePlay" WHERE "userId" = ${user.id}
                )
            `;
        } catch (dbError) {
            console.log('Game stats query failed, returning empty array:', dbError);
            // If the query fails (e.g., tables don't exist), just return an empty array
            // This prevents the API from returning a 500 error
        }

        // Return the game stats with transaction times
        return NextResponse.json({
            gameStats: gameStats.map(stat => ({
                game: {
                    id: stat.id,
                    name: stat.name,
                    slug: stat.slug,
                    imagePath: stat.imagePath || null
                },
                playCount: parseInt(stat.playCount || 0),
                lastPlayed: stat.lastPlayed instanceof Date ? stat.lastPlayed.toISOString() : stat.lastPlayed,
                highScore: parseInt(stat.highScore || 0),
                recentScores: [],
                // Format transaction times as ISO strings
                transactionTimes: (transactionTimesByGameId[stat.id] || []).map(date =>
                    date instanceof Date ? date.toISOString() : date
                )
            }))
        });
    } catch (error) {
        console.error('Profile API: Error fetching game stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch game stats' },
            { status: 500 }
        );
    }
} 