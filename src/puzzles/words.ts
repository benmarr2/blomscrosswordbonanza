import { isBlack, type NumberedCell, type Puzzle } from './schema';
import type { Direction } from '../state/gridStore';

export interface WordCell {
  row: number;
  col: number;
}

/** All cells belonging to the word running through (row, col) in the given direction. */
export function getWordCells(puzzle: Puzzle, row: number, col: number, direction: Direction): WordCell[] {
  const dRow = direction === 'down' ? 1 : 0;
  const dCol = direction === 'across' ? 1 : 0;

  let startRow = row;
  let startCol = col;
  while (
    startRow - dRow >= 0 &&
    startCol - dCol >= 0 &&
    !isBlack(puzzle.grid[startRow - dRow][startCol - dCol])
  ) {
    startRow -= dRow;
    startCol -= dCol;
  }

  const cells: WordCell[] = [];
  let r = startRow;
  let c = startCol;
  while (r < puzzle.height && c < puzzle.width && !isBlack(puzzle.grid[r][c])) {
    cells.push({ row: r, col: c });
    r += dRow;
    c += dCol;
  }
  return cells;
}

/** The clue number for the word running through (row, col) in the given direction, if any. */
export function getClueNumber(numbering: NumberedCell[], puzzle: Puzzle, row: number, col: number, direction: Direction): number | null {
  const word = getWordCells(puzzle, row, col, direction);
  if (word.length === 0) return null;
  const start = word[0];
  const entry = numbering.find((c) => c.row === start.row && c.col === start.col);
  return entry?.number ?? null;
}

/** Cell keys ("row-col") belonging to any across/down entry that's fully
 * filled in and matches the solution. A cell counts as correct as soon as
 * one of its words is complete, even if a crossing word isn't finished yet. */
export function getCorrectCellKeys(
  puzzle: Puzzle,
  numbering: NumberedCell[],
  letters: Record<string, string>,
): Set<string> {
  const correct = new Set<string>();

  function checkWord(startRow: number, startCol: number, direction: Direction) {
    const word = getWordCells(puzzle, startRow, startCol, direction);
    const isComplete = word.every(({ row, col }) => {
      const solution = puzzle.grid[row][col];
      const letter = letters[`${row}-${col}`] ?? '';
      return letter !== '' && letter.toUpperCase() === solution.toUpperCase();
    });
    if (isComplete) {
      for (const { row, col } of word) correct.add(`${row}-${col}`);
    }
  }

  for (const n of numbering) {
    if (n.startsAcross) checkWord(n.row, n.col, 'across');
    if (n.startsDown) checkWord(n.row, n.col, 'down');
  }

  return correct;
}
