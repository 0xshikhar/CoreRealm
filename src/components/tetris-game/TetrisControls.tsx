import { Button } from "@/components/ui";
import { ChevronLeft, ChevronDown, ChevronRight, RotateCw, Play, Pause } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui";
import { GameControlsProps, GameOverlayProps } from "./TetrisTypes";

// Component GameControls
const GameControls: React.FC<GameControlsProps> = ({ onMove, onRotate, onDrop, onPause, onResume, isPaused }) => {
    return (
        <div className="w-full">
            <div className="grid grid-cols-3 gap-2 mb-2">
                <Button onClick={() => onMove(-1)} variant="outline" size="icon" className="aspect-square">
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button onClick={onDrop} variant="default" size="icon" className="aspect-square">
                    <ChevronDown className="h-6 w-6" />
                </Button>
                <Button onClick={() => onMove(1)} variant="outline" size="icon" className="aspect-square">
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Button onClick={onRotate} variant="outline" className="w-full">
                    <RotateCw className="mr-2 h-4 w-4" /> Rotate
                </Button>
                <Button
                    onClick={isPaused ? onResume : onPause}
                    variant={isPaused ? "default" : "secondary"}
                    className="w-full"
                >
                    {isPaused ? (
                        <><Play className="mr-2 h-4 w-4" /> Resume</>
                    ) : (
                        <><Pause className="mr-2 h-4 w-4" /> Pause</>
                    )}
                </Button>
            </div>
        </div>
    );
};

// Component GameOverlay
const GameOverlay: React.FC<GameOverlayProps> = ({ isGameOver, score, onRestart, highScore }) => {
    if (!isGameOver) return null;

    const isNewHighScore = score > highScore;

    return (
        <AlertDialog open={isGameOver}>
            <AlertDialogContent className="bg-background border-border">
                <AlertDialogHeader>
                    <AlertDialogTitle>{isNewHighScore ? "New High Score!" : "Game Over"}</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    <div className="space-y-2 text-sm my-4">
                        {isNewHighScore ? (
                            <p>Congratulations! You&apos;ve set a new high score of <span className="font-bold">{score}</span>!</p>
                        ) : (
                            <p>Your final score is <span className="font-bold">{score}</span>. The high score is <span className="font-bold">{highScore}</span>.</p>
                        )}
                        <p>Would you like to play again?</p>
                    </div>
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={onRestart} className="w-full">
                        Play Again
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export { GameControls, GameOverlay };