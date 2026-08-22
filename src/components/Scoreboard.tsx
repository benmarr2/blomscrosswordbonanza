import type { Puzzle } from '../puzzles/schema';
import { isBlack } from '../puzzles/schema';
import type { CellMeta, Presence } from '../room/useRoomSync';

interface ScoreboardProps {
  puzzle: Puzzle;
  cells: Record<string, CellMeta>;
  presence: Record<string, Presence>;
}

export function Scoreboard({ puzzle, cells, presence }: ScoreboardProps) {
  const scores: Record<string, number> = {};

  for (let row = 0; row < puzzle.height; row++) {
    for (let col = 0; col < puzzle.width; col++) {
      const solution = puzzle.grid[row][col];
      if (isBlack(solution)) continue;

      const cell = cells[`${row}-${col}`];
      if (!cell?.lastEditedBy) continue;
      if (cell.value?.toUpperCase() !== solution.toUpperCase()) continue;

      scores[cell.lastEditedBy] = (scores[cell.lastEditedBy] ?? 0) + 1;
    }
  }

  const rows = Object.entries(presence)
    .map(([uid, p]) => ({ uid, name: p.name, score: scores[uid] ?? 0 }))
    .sort((a, b) => b.score - a.score);

  if (rows.length === 0) return null;

  return (
    <div className="scoreboard">
      <h3>Scoreboard</h3>
      <ul className="scoreboard__list">
        {rows.map((r) => (
          <li key={r.uid}>
            <span className="scoreboard__name">{r.name}</span>
            <span className="scoreboard__score">{r.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
