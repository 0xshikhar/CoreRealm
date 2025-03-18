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

        // Find the user by wallet address
        const user = await db.user.findUnique({
            where: { walletAddress: address.toLowerCase() },
            select: {
                id: true,
                walletAddress: true,
                name: true,
                createdAt: true,
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Profile API: Error fetching user profile:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user profile' },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const address = req.nextUrl.searchParams.get("address")

        if (!address) {
            return NextResponse.json(
                { error: "Wallet address is required" },
                { status: 400 }
            )
        }

        const data = await req.json()

        // Only allow updating certain fields
        const { name } = data

        const updatedUser = await db.user.update({
            where: { walletAddress: address },
            data: { name },
            select: {
                id: true,
                name: true,
                walletAddress: true,
            },
        })

        return NextResponse.json({ user: updatedUser })
    } catch (error) {
        console.error("Error updating profile:", error)
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        )
    }
} 