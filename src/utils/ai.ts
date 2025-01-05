import { Grid, Direction, moveGrid, isGameOver } from './gameLogic';

// Heuristic function to evaluate the grid
const evaluateGrid = (grid: Grid): number => {
  let score = 0;

  // 1. Prioritize empty tiles (high weight to avoid getting stuck)
  const emptyTiles = grid.flat().filter(tile => tile === 0).length;
  score += emptyTiles * 100;

  // 2. Smoothness: Penalize differences between adjacent tiles
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      score -= Math.abs(grid[i][j] - grid[i][j + 1]); // Horizontal smoothness
      score -= Math.abs(grid[j][i] - grid[j + 1][i]); // Vertical smoothness
    }
  }

  // 3. Monotonicity: Encourage rows/columns to have increasing or decreasing values
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i][j] > grid[i][j + 1]) score -= 5; // Penalize decreasing rows
      if (grid[j][i] > grid[j + 1][i]) score -= 5; // Penalize decreasing columns
    }
  }

  // 4. Merge opportunities: Reward tiles that can be merged
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i][j] === grid[i][j + 1]) score += 50; // Horizontal merge
      if (grid[j][i] === grid[j + 1][i]) score += 50; // Vertical merge
    }
  }

  // 5. Weighted grid: Encourage large tiles to be in specific positions
  const weightMatrix = [
    [10, 8, 5, 3],
    [8, 5, 3, 2],
    [5, 3, 2, 1],
    [3, 2, 1, 0]
  ];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      score += grid[i][j] * weightMatrix[i][j];
    }
  }

  return score;
};

// Recursive function for Expectimax
const expectimax = (grid: Grid, depth: number, isMaximizing: boolean): number => {
  if (depth === 0 || isGameOver(grid)) {
    return evaluateGrid(grid); // Base case: Return the heuristic score
  }

  if (isMaximizing) {
    // Maximizing step: AI chooses the best move
    let maxScore = -Infinity;
    const directions: Direction[] = ['up', 'right', 'down', 'left'];
    for (const direction of directions) {
      const [newGrid, _score] = moveGrid(grid, direction);

      // Skip if the move doesn't change the grid
      if (JSON.stringify(newGrid) === JSON.stringify(grid)) continue;

      const score = expectimax(newGrid, depth - 1, false);
      maxScore = Math.max(maxScore, score);
    }
    return maxScore;
  } else {
    // Expectation step: Simulate random tile placement
    let totalScore = 0;
    let count = 0;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) {
          const newGrid2 = grid.map(row => [...row]);
          const newGrid4 = grid.map(row => [...row]);

          newGrid2[i][j] = 2; // Simulate adding a "2"
          newGrid4[i][j] = 4; // Simulate adding a "4"

          totalScore += 0.9 * expectimax(newGrid2, depth - 1, true); // 90% chance for "2"
          totalScore += 0.1 * expectimax(newGrid4, depth - 1, true); // 10% chance for "4"
          count++;
        }
      }
    }

    return count === 0 ? 0 : totalScore / count; // Average score
  }
};

// AI move function using Expectimax
export const getAIMove = (grid: Grid): Direction => {
  const directions: Direction[] = ['up', 'right', 'down', 'left'];
  let bestDirection: Direction = 'up';
  let bestScore = -Infinity;

  for (const direction of directions) {
    const [newGrid, _] = moveGrid(grid, direction);

    // Skip if the move doesn't change the grid
    if (JSON.stringify(newGrid) === JSON.stringify(grid)) continue;

    const score = expectimax(newGrid, 2, false); // Depth of 2 for performance
    if (score > bestScore) {
      bestScore = score;
      bestDirection = direction;
    }
  }

  return bestDirection;
};
