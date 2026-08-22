import { useRef } from 'react';
import { useGridStore, getLetter } from '../state/gridStore';
import { isBlack } from '../puzzles/schema';
import { getWordCells } from '../puzzles/words';
import { Cell } from './Cell';

interface PuzzleGridProps {
  onLetterChange?: (row: number, col: number, value: string) => void;
}

export function PuzzleGrid({ onLetterChange }: PuzzleGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const puzzle = useGridStore((s) => s.puzzle);
  const numbering = useGridStore((s) => s.numbering);
  const letters = useGridStore((s) => s.letters);
  const activeRow = useGridStore((s) => s.activeRow);
  const activeCol = useGridStore((s) => s.activeCol);
  const activeDirection = useGridStore((s) => s.activeDirection);
  const setCell = useGridStore((s) => s.setCell);
  const setActive = useGridStore((s) => s.setActive);
  const setDirection = useGridStore((s) => s.setDirection);
  const toggleDirection = useGridStore((s) => s.toggleDirection);
  const move = useGridStore((s) => s.move);

  if (!puzzle) return null;

  const activeWord = getWordCells(puzzle, activeRow, activeCol, activeDirection);
  const isInActiveWord = (row: number, col: number) =>
    activeWord.some((c) => c.row === row && c.col === col);

  function numberAt(row: number, col: number): number | null {
    return numbering.find((c) => c.row === row && c.col === col)?.number ?? null;
  }

  function handleCellClick(row: number, col: number) {
    if (row === activeRow && col === activeCol) {
      toggleDirection();
    } else {
      setActive(row, col);
    }
    containerRef.current?.focus();
  }

  function writeLetter(row: number, col: number, value: string) {
    setCell(row, col, value);
    onLetterChange?.(row, col, value);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!puzzle) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setDirection('across');
      move(0, 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setDirection('across');
      move(0, -1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setDirection('down');
      move(1, 0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setDirection('down');
      move(-1, 0);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      const current = getLetter(letters, activeRow, activeCol);
      if (current) {
        writeLetter(activeRow, activeCol, '');
      } else {
        const dRow = activeDirection === 'down' ? -1 : 0;
        const dCol = activeDirection === 'across' ? -1 : 0;
        move(dRow, dCol);
      }
    } else if (e.key === 'Tab') {
      // Let default tab-order be overridden by our own clue-hop behavior.
      e.preventDefault();
      toggleDirection();
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
      writeLetter(activeRow, activeCol, e.key.toUpperCase());
      const dRow = activeDirection === 'down' ? 1 : 0;
      const dCol = activeDirection === 'across' ? 1 : 0;
      move(dRow, dCol);
    }
  }

  return (
    <div
      ref={containerRef}
      id="puzzle-grid"
      className="puzzle-grid"
      style={{ gridTemplateColumns: `repeat(${puzzle.width}, var(--cell-size))` }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {puzzle.grid.map((rowCells, row) =>
        rowCells.map((cellValue, col) =>
          isBlack(cellValue) ? (
            <div key={`${row}-${col}`} className="cell cell--black" />
          ) : (
            <Cell
              key={`${row}-${col}`}
              letter={getLetter(letters, row, col)}
              number={numberAt(row, col)}
              isActive={row === activeRow && col === activeCol}
              isInActiveWord={isInActiveWord(row, col)}
              onClick={() => handleCellClick(row, col)}
            />
          ),
        ),
      )}
    </div>
  );
}
