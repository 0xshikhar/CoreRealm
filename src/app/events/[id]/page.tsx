import React from "react";
import { BroadcastLoad, BroadcastPlayer } from "@/components/stream/BroadcastLoad";
import { Src } from "@livepeer/react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import { BiChat, BiHeart, BiShare } from "react-icons/bi";

// Mock data for events - in a real app, this would come from a database
const events = [
    {
        id: "1",
        title: "Gaming Trends on Core Blockchain",
        description: "Join us for an exciting discussion about the latest gaming trends on Core Blockchain.",
        date: "March 20",
        time: "6:00PM",
        playbackId: "f5eese9wwl7c7htl",
        thumbnail: "/images/portals.png",
        viewers: 1243,
        likes: 342
    },
    {
        id: "2",
        title: "Tutorial: How to play Umi's Friends and setup account",
        description: "Learn how to get started with Umi's Friends and set up your gaming account.",
        date: "March 26",
        time: "6:00PM",
        playbackId: "f5eese9wwl7c7htl",
        thumbnail: "/images/howtoplayumi.jpeg",
        viewers: 876,
        likes: 231
    },
    {
        id: "3",
        title: "Update: CyberPet introduces new skins and muchmore!",
        description: "Discover the latest updates to CyberPet including new skins and exciting features.",
        date: "March 27",
        time: "6:00PM",
        playbackId: "f5eese9wwl7c7htl",
        thumbnail: "/images/Cyberpet.png",
        viewers: 2156,
        likes: 543
    }
];

export default function EventPage({ params }: { params: { id: string } }) {
    const event = events.find(e => e.id === params.id);

    if (!event) {
        return notFound();
    }

    // Create source for the player
    // 
    const src: Src[] = [
        // @ts-ignore
        {
            type: "hls",
            src: event.playbackId,
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-4">
                <Link
                    href="/events"
                    className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
                >
                    <BsArrowLeft className="mr-2" />
                    Back to Events
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content - Video player and info */}
                <div className="lg:col-span-2">
                    <div className="bg-[#151515] rounded-lg overflow-hidden">
                        <div className="aspect-video">
                            <BroadcastPlayer src={src} />
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h1 className="text-2xl font-bold text-white">{event.title}</h1>
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-1 text-gray-400 hover:text-[#98ee2c]">
                                        <BiHeart className="text-xl" />
                                        <span>{event.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-1 text-gray-400 hover:text-[#98ee2c]">
                                        <BiShare className="text-xl" />
                                        <span>Share</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                <div className="font-Agda uppercase text-[#98ee2c]">{event.date}</div>
                                <div>Starting at {event.time}</div>
                                <div>{event.viewers.toLocaleString()} viewers</div>
                            </div>

                            <p className="text-gray-300">{event.description}</p>
                        </div>
                    </div>
                </div>

                {/* Chat section */}
                <div className="bg-[#151515] rounded-lg p-4 h-[600px] flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <BiChat className="mr-2" />
                            Live Chat
                        </h2>
                        <span className="text-sm text-gray-400">{Math.floor(event.viewers * 0.3)} chatting</span>
                    </div>

                    <div className="flex-grow overflow-y-auto mb-4 bg-[#0c0c0c] rounded-md p-3">
                    </div>

                    <div className="mt-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Send a message..."
                                className="w-full bg-[#0c0c0c] border border-gray-800 rounded-md py-2 px-4 text-white focus:outline-none focus:border-[#98ee2c]"
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#98ee2c] font-medium">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 