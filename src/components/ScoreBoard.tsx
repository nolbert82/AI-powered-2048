import React from 'react';

interface ScoreBoardProps {
  currentScore: number;
  bestScore: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ currentScore, bestScore }) => {
  return (
    <div className="flex gap-4 mb-4">
      <div className="bg-[#bbada0] rounded-md p-4 text-white">
        <h2 className="text-sm font-semibold mb-1">SCORE</h2>
        <p className="text-2xl font-bold">{currentScore}</p>
      </div>
      <div className="bg-[#bbada0] rounded-md p-4 text-white">
        <h2 className="text-sm font-semibold mb-1">BEST</h2>
        <p className="text-2xl font-bold">{bestScore}</p>
      </div>
    </div>
  );
};

export default ScoreBoard;