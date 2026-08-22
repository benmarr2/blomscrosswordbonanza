import type { Puzzle } from '../puzzles/schema';

interface PuzzlePickerProps {
  puzzles: Puzzle[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function PuzzlePicker({ puzzles, selectedId, onSelect }: PuzzlePickerProps) {
  return (
    <div className="puzzle-picker">
      {puzzles.map((p) => (
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
    </div>
  );
}
