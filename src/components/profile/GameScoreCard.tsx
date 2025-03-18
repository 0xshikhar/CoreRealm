"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { Trophy, GamepadIcon, Clock, BarChart } from "lucide-react"

interface GameStat {
    game: {
        id: string
        name: string
        description: string
        imageUrl: string
    }
    playCount: number
    lastPlayed: string | null
    highScore: number
    recentScores: Array<{
        score: number
        achievedAt: string
    }>
}

interface GameScoreCardProps {
    walletAddress: string
}

export function GameScoreCard({ walletAddress }: GameScoreCardProps) {
    const [scores, setScores] = useState<GameScore[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchGameStats() {
            if (!walletAddress) return

            try {
                setIsLoading(true)
                setError(null)
                const response = await fetch(`/api/profile/games/scores?address=${walletAddress}`)

                if (!response.ok) {
                    throw new Error(`Failed to fetch scores: ${response.status}`)
                }

                const data = await response.json()
                setScores(data.scores || [])
            } catch (err) {
                console.error("Error fetching game scores:", err)
                // Convert error to string to avoid rendering objects directly
                setError(err instanceof Error ? err.message : String(err))
            } finally {
                setIsLoading(false)
            }
        }

        fetchGameStats()
    }, [walletAddress])

    if (isLoading) {
        return (
            <Card className="bg-[#202020] border-gray-700 text-white">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Trophy className="mr-2 h-5 w-5" />
                        Top Scores
                    </CardTitle>
                    <CardDescription className="text-gray-400">Your highest game scores</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-20 w-full bg-gray-700" />
                        <Skeleton className="h-20 w-full bg-gray-700" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Handle error state
    if (error) {
        return (
            <Card className="bg-[#202020] border-gray-700 text-white">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Trophy className="mr-2 h-5 w-5" />
                        Top Scores
                    </CardTitle>
                    <CardDescription className="text-gray-400">Your highest game scores</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-red-900/30 rounded-md text-red-300">
                        <p>Failed to load scores: {error}</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (scores.length === 0) {
        return (
            <Card className="bg-[#202020] border-gray-700 text-white">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Trophy className="mr-2 h-5 w-5" />
                        Top Scores
                    </CardTitle>
                    <CardDescription className="text-gray-400">Your highest game scores</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-6">
                        <p className="text-gray-400">No game scores yet. Start playing to see your scores here!</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-[#202020] border-gray-700 text-white">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Trophy className="mr-2 h-5 w-5" />
                    Top Scores
                </CardTitle>
                <CardDescription className="text-gray-400">Your highest game scores</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {scores.map((score) => (
                        <div key={score.id} className="bg-[#151515] p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold">{score.game?.name || "Unknown Game"}</h3>
                                    <p className="text-sm text-gray-400">
                                        {typeof score.achievedAt === 'string'
                                            ? new Date(score.achievedAt).toLocaleDateString()
                                            : 'Unknown date'}
                                    </p>
                                </div>
                                <div className="text-2xl font-bold text-[#98ee2c]">{score.score}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function GameScoreCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />

                {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-start space-x-4 p-3 rounded-lg border">
                        <Skeleton className="h-12 w-12 rounded-md" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-40" />
                            <div className="flex gap-2">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
} 