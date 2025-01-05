import React, { useState, useEffect, useCallback, useRef } from 'react';
import Grid from './components/Grid';
import ScoreBoard from './components/ScoreBoard';
import AIPlayButton from './components/AIPlayButton';
import {
  createEmptyGrid,
  addRandomTile,
  moveGrid,
  isGameOver,
  type Direction,
  type Grid as GridType,
} from './utils/gameLogic';
import { getAIMove } from './utils/ai';

function App() {
  const [grid, setGrid] = useState<GridType>(() => {
    const initialGrid = createEmptyGrid();
    return addRandomTile(addRandomTile(initialGrid));
  });
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('2048-best-score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const aiIntervalRef = useRef<number>();

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('2048-best-score', score.toString());
    }
  }, [score, bestScore]);

  const resetGame = useCallback(() => {
    const initialGrid = createEmptyGrid();
    const newGrid = addRandomTile(addRandomTile(initialGrid));
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setIsAIPlaying(false);
  }, []);

  const handleMove = useCallback(
    (direction: Direction) => {
      if (gameOver) return;

      const [newGrid, moveScore] = moveGrid(grid, direction);
      if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
        const gridWithNewTile = addRandomTile(newGrid);
        setGrid(gridWithNewTile);
        setScore((prev) => prev + moveScore);

        if (isGameOver(gridWithNewTile)) {
          setGameOver(true);
          setIsAIPlaying(false);
        }
      }
    },
    [grid, gameOver]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (isAIPlaying) return;

      const keyToDirection: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      };

      const direction = keyToDirection[event.key];
      if (direction) {
        event.preventDefault();
        handleMove(direction);
      }
    },
    [handleMove, isAIPlaying]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const toggleAI = useCallback(() => {
    setIsAIPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isAIPlaying && !gameOver) {
      aiIntervalRef.current = window.setInterval(async () => {
        const aiMove = await getAIMove(grid);
        handleMove(aiMove);
      }, 20);
    } else {
      if (aiIntervalRef.current) {
        clearInterval(aiIntervalRef.current);
      }
    }

    return () => {
      if (aiIntervalRef.current) {
        clearInterval(aiIntervalRef.current);
      }
    };
  }, [isAIPlaying, gameOver, grid, handleMove]);

  return (
    <div className="min-h-screen bg-[#faf8ef] flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <div className="mb-5">
          <h1 className="text-5xl font-bold text-[#776e65] mb-10">2048</h1>
          <div className="flex justify-between items-center">
            <ScoreBoard currentScore={score} bestScore={bestScore} />
            <AIPlayButton isPlaying={isAIPlaying} onClick={toggleAI} />
          </div>
        </div>

        <Grid grid={grid} />

        {gameOver && (
          <div className="mt-4 text-center">
            <p className="text-xl font-bold text-[#776e65] mb-2">Game Over!</p>
            <button
              onClick={resetGame}
              className="bg-[#8f7a66] text-white px-4 py-2 rounded hover:bg-[#a18979]"
            >
              Play Again
            </button>
          </div>
        )}

        <div className="mt-4 text-sm text-[#776e65] text-center">
          <p>Use arrow keys to move the tiles.</p>
          <p>
            Made by Nolan GILBERT -{' '}
            <a
              href="https://github.com/nolbert82"
              className="text-blue-600 hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
