import React from 'react';

interface AIPlayButtonProps {
  isPlaying: boolean;
  onClick: () => void;
}

const AIPlayButton: React.FC<AIPlayButtonProps> = ({ isPlaying, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-5 font-semibold rounded-lg
        ${isPlaying ? 'bg-blue-500' : 'bg-blue-500'}
        text-white transition-all duration-200
        hover:bg-blue-800
      `}
    >
      {isPlaying ? 'Stop the AI' : 'Let the AI Play'}
    </button>
  );
}

export default AIPlayButton;