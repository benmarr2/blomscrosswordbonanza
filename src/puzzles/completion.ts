import { isBlack, type Puzzle } from './schema';
import type { CellMeta } from '../room/useRoomSync';

export function isPuzzleSolved(puzzle: Puzzle, cells: Record<string, CellMeta>): boolean {
  for (let row = 0; row < puzzle.height; row++) {
    for (let col = 0; col < puzzle.width; col++) {
      const solution = puzzle.grid[row][col];
      if (isBlack(solution)) continue;

      const value = cells[`${row}-${col}`]?.value;
      if (!value || value.toUpperCase() !== solution.toUpperCase()) return false;
    }
  }
  return true;
}
