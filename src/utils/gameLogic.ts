// Game logic utilities
export type Grid = number[][];
export type Direction = 'up' | 'down' | 'left' | 'right';

export const createEmptyGrid = (): Grid => 
  Array(4).fill(null).map(() => Array(4).fill(0));

export const addRandomTile = (grid: Grid): Grid => {
  const newGrid = grid.map(row => [...row]);
  const emptyTiles = [];
  
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (newGrid[i][j] === 0) {
        emptyTiles.push({ i, j });
      }
    }
  }
  
  if (emptyTiles.length > 0) {
    const { i, j } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    newGrid[i][j] = Math.random() < 0.9 ? 2 : 4;
  }
  
  return newGrid;
};

const rotateGrid = (grid: Grid, times: number = 1): Grid => {
  let newGrid = grid.map(row => [...row]);
  for (let t = 0; t < times; t++) {
    const rotated: Grid = createEmptyGrid();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        rotated[j][3 - i] = newGrid[i][j];
      }
    }
    newGrid = rotated;
  }
  return newGrid;
};

const mergeLine = (line: number[]): [number[], number] => {
  // First, remove all zeros and get just the numbers
  let numbers = line.filter(cell => cell !== 0);
  let score = 0;
  let merged: number[] = [];
  
  // Process merges
  let i = 0;
  while (i < numbers.length) {
    if (i + 1 < numbers.length && numbers[i] === numbers[i + 1]) {
      merged.push(numbers[i] * 2);
      score += numbers[i] * 2;
      i += 2;
    } else {
      merged.push(numbers[i]);
      i++;
    }
  }
  
  // Pad with zeros to maintain grid size
  while (merged.length < 4) {
    merged.push(0);
  }
  
  return [merged, score];
};

export const moveGrid = (grid: Grid, direction: Direction): [Grid, number] => {
  let rotations = 0;
  switch (direction) {
    case 'up': rotations = 3; break;    // Changed from 1 to 3
    case 'right': rotations = 2; break;
    case 'down': rotations = 1; break;  // Changed from 3 to 1
    default: rotations = 0;
  }
  
  let newGrid = rotateGrid(grid, rotations);
  let totalScore = 0;
  
  // Merge all lines
  newGrid = newGrid.map(line => {
    const [newLine, score] = mergeLine(line);
    totalScore += score;
    return newLine;
  });
  
  // Rotate back
  newGrid = rotateGrid(newGrid, (4 - rotations) % 4);
  
  return [newGrid, totalScore];
};

export const isGameOver = (grid: Grid): boolean => {
  // Check for empty cells
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) return false;
    }
  }
  
  // Check for possible merges
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const current = grid[i][j];
      if (
        (i < 3 && current === grid[i + 1][j]) ||
        (j < 3 && current === grid[i][j + 1])
      ) {
        return false;
      }
    }
  }
  
  return true;
};