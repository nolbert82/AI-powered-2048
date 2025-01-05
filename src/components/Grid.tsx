import React from 'react';
import Tile from './Tile';
import type { Grid as GridType } from '../utils/gameLogic';

interface GridProps {
  grid: GridType;
}

const Grid: React.FC<GridProps> = ({ grid }) => {
  return (
    <div className="bg-[#bbada0] p-3 rounded-lg">
      <div className="grid grid-cols-4 gap-3">
        {grid.flat().map((value, index) => (
          <Tile key={index} value={value} />
        ))}
      </div>
    </div>
  );
};

export default Grid;