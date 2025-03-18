import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

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

        console.log("Fetching transactions for address:", address);

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

        // Fetch transactions for the user
        const transactions = await db.transaction.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });

        console.log("User found:", user);
        console.log("Transactions found:", transactions.length);
        console.log("First few transactions:", transactions.slice(0, 2));

        return NextResponse.json({
            transactions: transactions.map(tx => ({
                ...tx,
                createdAt: tx.createdAt instanceof Date ? tx.createdAt.toISOString() : tx.createdAt
            }))
        });
    } catch (error) {
        console.error('Profile API: Error fetching transactions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const address = req.nextUrl.searchParams.get("address")

        if (!address) {
            return NextResponse.json(
                { error: "Wallet address is required" },
                { status: 400 }
            )
        }

        const user = await db.user.findUnique({
            where: { walletAddress: address.toLowerCase() },
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        const data = await req.json()
        const { type, amount, txHash, status, description, tokenSymbol = "REALM" } = data

        const transaction = await db.transaction.create({
            data: {
                userId: user.id,
                type,
                amount,
                txHash,
                status,
                description,
                tokenSymbol,
            },
        })

        return NextResponse.json({ transaction })
    } catch (error) {
        console.error("Error creating transaction:", error)
        return NextResponse.json(
            { error: "Failed to create transaction" },
            { status: 500 }
        )
    }
} 