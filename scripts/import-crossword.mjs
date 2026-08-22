// One-off content-generation tool: converts an APIVerve Crossword API response
// into this app's bundled Puzzle JSON schema (src/puzzles/data/*.json).
// Never called at runtime by the app - the API key stays server-side and the
// output is baked into static files committed to the repo.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'src', 'puzzles', 'data');

function isBlack(cell) {
  return cell === undefined || cell === null || cell === '#';
}

function computeNumbering(grid) {
  const height = grid.length;
  const width = height > 0 ? grid[0].length : 0;
  const cells = [];
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

function trimGrid(rawGrid) {
  let minRow = Infinity, maxRow = -1, minCol = Infinity, maxCol = -1;
  for (let r = 0; r < rawGrid.length; r++) {
    for (let c = 0; c < rawGrid[r].length; c++) {
      if (!isBlack(rawGrid[r][c])) {
        minRow = Math.min(minRow, r);
        maxRow = Math.max(maxRow, r);
        minCol = Math.min(minCol, c);
        maxCol = Math.max(maxCol, c);
      }
    }
  }
  const trimmed = [];
  for (let r = minRow; r <= maxRow; r++) {
    const row = [];
    for (let c = minCol; c <= maxCol; c++) {
      row.push(isBlack(rawGrid[r][c]) ? '#' : rawGrid[r][c]);
    }
    trimmed.push(row);
  }
  return trimmed;
}

function readWord(grid, row, col, dir) {
  const dRow = dir === 'down' ? 1 : 0;
  const dCol = dir === 'across' ? 1 : 0;
  let word = '';
  let r = row, c = col;
  while (r < grid.length && c < grid[0].length && !isBlack(grid[r][c])) {
    word += grid[r][c];
    r += dRow;
    c += dCol;
  }
  return word;
}

export function convertApiverveCrossword(apiData, { id, title }) {
  const grid = trimGrid(apiData.grid);
  const numbering = computeNumbering(grid);

  function buildClues(apiClues, dir) {
    return apiClues.map((c) => {
      const cell = numbering.find(
        (n) => n.number === c.number && (dir === 'across' ? n.startsAcross : n.startsDown),
      );
      if (!cell) {
        throw new Error(`No ${dir} cell found for clue number ${c.number} ("${c.clue}")`);
      }
      const reconstructed = readWord(grid, cell.row, cell.col, dir);
      if (reconstructed.toUpperCase() !== c.answer.toUpperCase()) {
        throw new Error(
          `Mismatch for ${dir} ${c.number}: grid reads "${reconstructed}", API said "${c.answer}"`,
        );
      }
      return { number: c.number, row: cell.row, col: cell.col, text: c.clue, answer: c.answer };
    });
  }

  const across = buildClues(apiData.across, 'across');
  const down = buildClues(apiData.down, 'down');

  const puzzle = {
    id,
    title,
    difficulty: apiData.difficulty,
    width: grid[0].length,
    height: grid.length,
    grid,
    clues: { across, down },
  };

  return puzzle;
}

export function writePuzzle(puzzle) {
  const outPath = path.join(DATA_DIR, `${puzzle.id}.json`);
  writeFileSync(outPath, JSON.stringify(puzzle, null, 2) + '\n');
  console.log(`Wrote ${outPath} (${puzzle.clues.across.length + puzzle.clues.down.length} entries)`);
  return outPath;
}
