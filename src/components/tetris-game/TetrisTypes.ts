export interface Tetromino {
    name: string;
    shape: number[][];
    color: string;
}

export interface GameBoardProps {
    board: (string | number)[][];
}

export interface ScorePanelProps {
    score: number;
    level: number;
    lines: number;
    nextPiece: Tetromino | null;
    highScore: number;
}

export interface GameControlsProps {
    onMove: (direction: number) => void;
    onRotate: () => void;
    onDrop: () => void;
    onPause: () => void;
    onResume: () => void;
    isPaused: boolean;
}

export interface GameOverlayProps {
    isGameOver: boolean;
    score: number;
    onRestart: () => void;
    highScore: number;
}

export interface InfoDialogProps {
    open: boolean;
    onClose: () => void;
}

export interface TetrisGameProps {
    // Any props for the main game component
}
