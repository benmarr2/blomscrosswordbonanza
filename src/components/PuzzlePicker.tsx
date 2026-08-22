import { useMemo, useState } from 'react';
import type { Difficulty, Puzzle } from '../puzzles/schema';

interface PuzzlePickerProps {
  puzzles: Puzzle[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const FILTERS: (Difficulty | 'all')[] = ['all', 'easy', 'medium', 'hard'];
const PAGE_SIZE = 6;

export function PuzzlePicker({ puzzles, selectedId, onSelect }: PuzzlePickerProps) {
  const [filter, setFilter] = useState<Difficulty | 'all'>('all');
  const [page, setPage] = useState(0);

  const filtered = useMemo(
    () => (filter === 'all' ? puzzles : puzzles.filter((p) => p.difficulty === filter)),
    [puzzles, filter],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, pageCount - 1);
  const pageItems = filtered.slice(clampedPage * PAGE_SIZE, clampedPage * PAGE_SIZE + PAGE_SIZE);

  function changeFilter(next: Difficulty | 'all') {
    setFilter(next);
    setPage(0);
  }

  return (
    <div className="puzzle-picker">
      <div className="puzzle-picker__tabs">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`puzzle-picker__tab ${f === filter ? 'puzzle-picker__tab--active' : ''}`}
            onClick={() => changeFilter(f)}
          >
            {f === 'all' ? 'All' : f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="puzzle-picker__list">
        {pageItems.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`puzzle-picker__option ${p.id === selectedId ? 'puzzle-picker__option--selected' : ''}`}
            onClick={() => onSelect(p.id)}
          >
            <span className="puzzle-picker__title">{p.title}</span>
            <span className={`puzzle-picker__difficulty puzzle-picker__difficulty--${p.difficulty}`}>
              {p.difficulty}
            </span>
          </button>
        ))}
        {pageItems.length === 0 && <p className="puzzle-picker__empty">No puzzles in this difficulty yet.</p>}
      </div>

      {pageCount > 1 && (
        <div className="puzzle-picker__pagination">
          <button type="button" disabled={clampedPage === 0} onClick={() => setPage(clampedPage - 1)}>
            ← Prev
          </button>
          <span>
            Page {clampedPage + 1} of {pageCount}
          </span>
          <button
            type="button"
            disabled={clampedPage >= pageCount - 1}
            onClick={() => setPage(clampedPage + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
