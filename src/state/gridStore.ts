import { create } from 'zustand';
import { computeNumbering, isBlack, type NumberedCell, type Puzzle } from '../puzzles/schema';

export type Direction = 'across' | 'down';

interface GridState {
  puzzle: Puzzle | null;
  numbering: NumberedCell[];
  letters: Record<string, string>;
  activeRow: number;
  activeCol: number;
  activeDirection: Direction;
  loadPuzzle: (puzzle: Puzzle) => void;
  setCell: (row: number, col: number, value: string) => void;
  setLetterFromRemote: (row: number, col: number, value: string) => void;
  setActive: (row: number, col: number) => void;
  setDirection: (direction: Direction) => void;
  toggleDirection: () => void;
  move: (dRow: number, dCol: number) => void;
}

function cellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

function inBounds(puzzle: Puzzle, row: number, col: number): boolean {
  return row >= 0 && row < puzzle.height && col >= 0 && col < puzzle.width;
}

export const useGridStore = create<GridState>((set, get) => ({
  puzzle: null,
  numbering: [],
  letters: {},
  activeRow: 0,
  activeCol: 0,
  activeDirection: 'across',

  loadPuzzle: (puzzle) => {
    const numbering = computeNumbering(puzzle.grid);
    const firstOpen = numbering.find((c) => c.startsAcross) ?? numbering[0];
    set({
      puzzle,
      numbering,
      letters: {},
      activeRow: firstOpen?.row ?? 0,
      activeCol: firstOpen?.col ?? 0,
      activeDirection: firstOpen?.startsAcross ? 'across' : 'down',
    });
  },

  setCell: (row, col, value) => {
    set((state) => ({ letters: { ...state.letters, [cellKey(row, col)]: value } }));
  },

  setLetterFromRemote: (row, col, value) => {
    set((state) => ({ letters: { ...state.letters, [cellKey(row, col)]: value } }));
  },

  setActive: (row, col) => {
    set({ activeRow: row, activeCol: col });
  },

  setDirection: (direction) => {
    set({ activeDirection: direction });
  },

  toggleDirection: () => {
    set((state) => ({ activeDirection: state.activeDirection === 'across' ? 'down' : 'across' }));
  },

  move: (dRow, dCol) => {
    const { puzzle, activeRow, activeCol } = get();
    if (!puzzle) return;
    let row = activeRow;
    let col = activeCol;
    do {
      row += dRow;
      col += dCol;
    } while (inBounds(puzzle, row, col) && isBlack(puzzle.grid[row][col]));
    if (inBounds(puzzle, row, col)) {
      set({ activeRow: row, activeCol: col });
    }
  },
}));

export function getLetter(letters: Record<string, string>, row: number, col: number): string {
  return letters[cellKey(row, col)] ?? '';
}
