import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BsArrowRight } from "react-icons/bs";
import { BiHeart } from "react-icons/bi";
import { FaGamepad } from "react-icons/fa";

const GamesPage = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <figure className="flex flex-col items-center justify-center pt-10 pb-10">
                <div className="rounded-3xl bg-[url('/images/games-banner.png')] before:bg-center before:opacity-0">
                    <div className="text-left pb-10 align-middle min-w-[1100px] h-[300px] pl-10 p-5 dark:bg-black dark:border-gray-700">
                        <div className="text-white font-Agda text-[70px] uppercase max-w-[650px]">
                            Puzzle Games
                        </div>
                        <p className="text-white font-Outfit font-light pb-9">
                            Challenge your mind with our collection of puzzle games
                        </p>
                        <Link
                            href="/event"
                            className="inline-flex align-left items-center relative text-lg px-8 py-3 bg-white mr-5 uppercase font-Agda font-bold text-b hover:bg-[#f0f0f0] cursor-pointer"
                        >
                            Create Game Event
                            <BsArrowRight className="ml-2" />
                        </Link>
                    </div>
                </div>
            </figure>

            {/* Games Grid */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-Agda text-white mb-8">Featured Games</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Game Card 1 */}
                    <div className="bg-[#202020] rounded-lg overflow-hidden hover:shadow-[0_0_15px_rgba(152,238,44,0.3)] transition-all duration-300">
                        <div className="relative">
                            <Image
                                src="/images/puzzle-blocks.png"
                                alt="Block Puzzle"
                                width={500}
                                height={300}
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-[#98ee2c] text-black px-2 py-1 rounded text-sm font-bold">
                                Popular
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold text-white">Block Puzzle</h3>
                                <div className="flex items-center text-gray-400">
                                    <BiHeart className="mr-1" />
                                    <span>245</span>
                                </div>
                            </div>
                            <p className="text-gray-400 mb-4">Arrange blocks to complete lines and score points</p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center text-gray-400 text-sm">
                                    <FaGamepad className="mr-1" />
                                    <span>10K+ players</span>
                                </div>
                                <Link
                                    href="/games/block-puzzle"
                                    className="flex items-center bg-[#98ee2c] text-black px-4 py-2 rounded font-bold hover:bg-[#7bc922] transition-colors"
                                >
                                    Play Now
                                    <BsArrowRight className="ml-2" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Game Card 2 - Word Master (Wordle) */}
                    <div className="bg-[#202020] rounded-lg overflow-hidden hover:shadow-[0_0_15px_rgba(152,238,44,0.3)] transition-all duration-300">
                        <div className="relative">
                            <Image
                                src="/images/word-master.png"
                                alt="Word Master"
                                width={500}
                                height={300}
                                className="w-full h-48 object-cover"
                            />
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold text-white">Word Master</h3>
                                <div className="flex items-center text-gray-400">
                                    <BiHeart className="mr-1" />
                                    <span>189</span>
                                </div>
                            </div>
                            <p className="text-gray-400 mb-4">Guess the hidden word in six tries or less</p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center text-gray-400 text-sm">
                                    <FaGamepad className="mr-1" />
                                    <span>5K+ players</span>
                                </div>
                                <Link
                                    href="/games/wordle"
                                    className="flex items-center bg-[#98ee2c] text-black px-4 py-2 rounded font-bold hover:bg-[#7bc922] transition-colors"
                                >
                                    Play Now
                                    <BsArrowRight className="ml-2" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Game Card 3 */}
                    <div className="bg-[#202020] rounded-lg overflow-hidden hover:shadow-[0_0_15px_rgba(152,238,44,0.3)] transition-all duration-300">
                        <div className="relative">
                            <Image
                                src="/images/memory-match.png"
                                alt="Memory Match"
                                width={500}
                                height={300}
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-[#ff6b6b] text-white px-2 py-1 rounded text-sm font-bold">
                                New
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold text-white">Memory Match</h3>
                                <div className="flex items-center text-gray-400">
                                    <BiHeart className="mr-1" />
                                    <span>127</span>
                                </div>
                            </div>
                            <p className="text-gray-400 mb-4">Find matching pairs of cards in this memory game</p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center text-gray-400 text-sm">
                                    <FaGamepad className="mr-1" />
                                    <span>3K+ players</span>
                                </div>
                                <Link
                                    href="/games/memory-match"
                                    className="flex items-center bg-[#98ee2c] text-black px-4 py-2 rounded font-bold hover:bg-[#7bc922] transition-colors"
                                >
                                    Play Now
                                    <BsArrowRight className="ml-2" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Game Card 4 */}
                    <div className="bg-[#202020] rounded-lg overflow-hidden hover:shadow-[0_0_15px_rgba(152,238,44,0.3)] transition-all duration-300">
                        <div className="relative">
                            <Image
                                src="/images/number-slide.png"
                                alt="Number Slide"
                                width={500}
                                height={300}
                                className="w-full h-48 object-cover"
                            />
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold text-white">Number Slide</h3>
                                <div className="flex items-center text-gray-400">
                                    <BiHeart className="mr-1" />
                                    <span>156</span>
                                </div>
                            </div>
                            <p className="text-gray-400 mb-4">Slide numbered tiles to arrange them in order</p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center text-gray-400 text-sm">
                                    <FaGamepad className="mr-1" />
                                    <span>4K+ players</span>
                                </div>
                                <Link
                                    href="/games/number-slide"
                                    className="flex items-center bg-[#98ee2c] text-black px-4 py-2 rounded font-bold hover:bg-[#7bc922] transition-colors"
                                >
                                    Play Now
                                    <BsArrowRight className="ml-2" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Game Card 5 */}
                    <div className="bg-[#202020] rounded-lg overflow-hidden hover:shadow-[0_0_15px_rgba(152,238,44,0.3)] transition-all duration-300">
                        <div className="relative">
                            <Image
                                src="/images/sudoku.png"
                                alt="Sudoku Challenge"
                                width={500}
                                height={300}
                                className="w-full h-48 object-cover"
                            />
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold text-white">Sudoku Challenge</h3>
                                <div className="flex items-center text-gray-400">
                                    <BiHeart className="mr-1" />
                                    <span>203</span>
                                </div>
                            </div>
                            <p className="text-gray-400 mb-4">Fill the grid with numbers following sudoku rules</p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center text-gray-400 text-sm">
                                    <FaGamepad className="mr-1" />
                                    <span>7K+ players</span>
                                </div>
                                <Link
                                    href="/games/sudoku"
                                    className="flex items-center bg-[#98ee2c] text-black px-4 py-2 rounded font-bold hover:bg-[#7bc922] transition-colors"
                                >
                                    Play Now
                                    <BsArrowRight className="ml-2" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Game Card 6 */}
                    <div className="bg-[#202020] rounded-lg overflow-hidden hover:shadow-[0_0_15px_rgba(152,238,44,0.3)] transition-all duration-300">
                        <div className="relative">
                            <Image
                                src="/images/crypto-crossword.png"
                                alt="Crypto Crossword"
                                width={500}
                                height={300}
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-[#ff6b6b] text-white px-2 py-1 rounded text-sm font-bold">
                                New
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold text-white">Crypto Crossword</h3>
                                <div className="flex items-center text-gray-400">
                                    <BiHeart className="mr-1" />
                                    <span>98</span>
                                </div>
                            </div>
                            <p className="text-gray-400 mb-4">Solve crossword puzzles with blockchain terminology</p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center text-gray-400 text-sm">
                                    <FaGamepad className="mr-1" />
                                    <span>2K+ players</span>
                                </div>
                                <Link
                                    href="/games/crypto-crossword"
                                    className="flex items-center bg-[#98ee2c] text-black px-4 py-2 rounded font-bold hover:bg-[#7bc922] transition-colors"
                                >
                                    Play Now
                                    <BsArrowRight className="ml-2" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Games Section */}
            <div className="container mx-auto px-4 py-8 mb-16">
                <h2 className="text-3xl font-Agda text-white mb-8">Coming Soon</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Upcoming Game 1 */}
                    <div className="bg-[#202020] rounded-lg overflow-hidden border border-gray-700 p-6 flex items-center">
                        <div className="w-24 h-24 bg-gray-800 rounded-lg flex items-center justify-center mr-6">
                            <FaGamepad className="text-[#98ee2c] text-4xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Logic Puzzles</h3>
                            <p className="text-gray-400 mb-3">A collection of brain-teasing logic puzzles</p>
                            <div className="inline-block bg-gray-800 text-gray-300 px-3 py-1 rounded text-sm">
                                Release: Q3 2023
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Game 2 */}
                    <div className="bg-[#202020] rounded-lg overflow-hidden border border-gray-700 p-6 flex items-center">
                        <div className="w-24 h-24 bg-gray-800 rounded-lg flex items-center justify-center mr-6">
                            <FaGamepad className="text-[#98ee2c] text-4xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Pattern Match</h3>
                            <p className="text-gray-400 mb-3">Find and complete visual patterns in this relaxing game</p>
                            <div className="inline-block bg-gray-800 text-gray-300 px-3 py-1 rounded text-sm">
                                Release: Q4 2023
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamesPage;
