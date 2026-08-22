import { useGridStore } from '../state/gridStore';
import { getClueNumber } from '../puzzles/words';
import type { Clue } from '../puzzles/schema';
import type { Direction } from '../state/gridStore';

export function ClueList() {
  const puzzle = useGridStore((s) => s.puzzle);
  const numbering = useGridStore((s) => s.numbering);
  const activeRow = useGridStore((s) => s.activeRow);
  const activeCol = useGridStore((s) => s.activeCol);
  const activeDirection = useGridStore((s) => s.activeDirection);
  const setActive = useGridStore((s) => s.setActive);
  const setDirection = useGridStore((s) => s.setDirection);

  if (!puzzle) return null;

  const activeNumber = getClueNumber(numbering, puzzle, activeRow, activeCol, activeDirection);

  function selectClue(clue: Clue, direction: Direction) {
    setActive(clue.row, clue.col);
    setDirection(direction);
  }

  function renderList(clues: Clue[], direction: Direction) {
    return (
      <ul className="clue-list__items">
        {clues.map((clue) => {
          const isActive = direction === activeDirection && clue.number === activeNumber;
          return (
            <li
              key={clue.number}
              className={isActive ? 'clue--active' : ''}
              onClick={() => selectClue(clue, direction)}
            >
              <strong>{clue.number}.</strong> {clue.text}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="clue-list">
      <div className="clue-list__group">
        <h3>Across</h3>
        {renderList(puzzle.clues.across, 'across')}
      </div>
      <div className="clue-list__group">
        <h3>Down</h3>
        {renderList(puzzle.clues.down, 'down')}
      </div>
    </div>
  );
}
