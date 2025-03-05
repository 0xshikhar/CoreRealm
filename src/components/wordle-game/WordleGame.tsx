"use client"
import React, { useContext, useEffect } from 'react';
import { GameContext, GameProvider } from './WordleContext';
import { GameBoard, Keyboard, GameHeader, WordDefinition } from './WordleComponents';

// The main game component
const WordleGameInner: React.FC = () => {
    const { gameState, handleKeyPress, lookupWord } = useContext(GameContext);

    // Handle keyboard events
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();

            if (key === 'enter' || key === 'backspace' || /^[a-z]$/.test(key)) {
                e.preventDefault();
                handleKeyPress(key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyPress]);

    // Look up word definition when game ends
    useEffect(() => {
        if (gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') {
            lookupWord(gameState.dailyWord);
        }
    }, [gameState.gameStatus, gameState.dailyWord, lookupWord]);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <GameHeader />

            <main className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 md:p-8">
                <div className="w-full max-w-md mx-auto md:max-w-lg lg:max-w-xl">
                    <GameBoard />
                </div>

                <div className="w-full max-w-md mx-auto md:max-w-lg">
                    <Keyboard />
                </div>

                {(gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') && (
                    <div className="w-full max-w-md md:max-w-lg mt-6 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-md">
                        <h2 className="font-bold text-lg mb-2">Word Definition</h2>
                        <WordDefinition />
                    </div>
                )}
            </main>
        </div>
    );
};

interface WordleGameProps {
    gameWords: string[];  // From words.json
    validWords: string[]; // From validWords.json
}

const WordleGame: React.FC<WordleGameProps> = ({ gameWords, validWords }) => {
    return (
        <GameProvider gameWords={gameWords} validWords={validWords}>
            <WordleGameInner />
        </GameProvider>
    );
};

export default WordleGame;