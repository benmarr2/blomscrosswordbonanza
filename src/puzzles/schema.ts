export interface Clue {
  number: number;
  row: number;
  col: number;
  text: string;
  answer: string;
}

export interface Puzzle {
  id: string;
  title: string;
  author?: string;
  width: number;
  height: number;
  /** Row-major grid. "#" marks a black square; anything else is the solution letter. */
  grid: string[][];
  clues: {
    across: Clue[];
    down: Clue[];
  };
}

export function isBlack(cell: string | undefined): boolean {
  return cell === undefined || cell === '#';
}

export interface NumberedCell {
  row: number;
  col: number;
  number: number;
  startsAcross: boolean;
  startsDown: boolean;
}

/** Standard crossword numbering: a cell gets a number if it starts an across and/or down word. */
export function computeNumbering(grid: string[][]): NumberedCell[] {
  const height = grid.length;
  const width = height > 0 ? grid[0].length : 0;
  const cells: NumberedCell[] = [];
  let next = 1;

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (isBlack(grid[row][col])) continue;

      const leftBlack = col === 0 || isBlack(grid[row][col - 1]);
      const rightBlack = col === width - 1 || isBlack(grid[row][col + 1]);
      const startsAcross = leftBlack && !rightBlack;

      const upBlack = row === 0 || isBlack(grid[row - 1][col]);
      const downBlack = row === height - 1 || isBlack(grid[row + 1][col]);
      const startsDown = upBlack && !downBlack;

      if (startsAcross || startsDown) {
        cells.push({ row, col, number: next, startsAcross, startsDown });
        next++;
      }
    }
  }

  return cells;
}
