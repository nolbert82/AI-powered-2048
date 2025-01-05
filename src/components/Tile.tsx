import React from 'react';

interface TileProps {
  value: number;
}

const getTileColor = (value: number): string => {
  const colors: Record<number, string> = {
    2: 'bg-[#eee4da] text-[#776e65]',
    4: 'bg-[#ede0c8] text-[#776e65]',
    8: 'bg-[#f2b179] text-white',
    16: 'bg-[#f59563] text-white',
    32: 'bg-[#f67c5f] text-white',
    64: 'bg-[#f65e3b] text-white',
    128: 'bg-[#edcf72] text-white',
    256: 'bg-[#edcc61] text-white',
    512: 'bg-[#edc850] text-white',
    1024: 'bg-[#edc53f] text-white',
    2048: 'bg-[#edc22e] text-white',
    4096: 'bg-[#edb81e] text-white',
    8192: 'bg-[#edb00e] text-white'
  };
  return colors[value] || 'bg-[#cdc1b4] text-white';
};

const getFontSize = (value: number): string => {
  if (value < 100) return 'text-4xl';
  if (value < 1000) return 'text-3xl';
  return 'text-2xl';
};

const Tile: React.FC<TileProps> = ({ value }) => {
  return (
    <div
      className={`
        w-16 h-16 flex items-center justify-center
        rounded-md font-bold transition-all duration-100
        ${getTileColor(value)}
        ${getFontSize(value)}
      `}
    >
      {value !== 0 ? value : ''}
    </div>
  );
};

export default Tile;