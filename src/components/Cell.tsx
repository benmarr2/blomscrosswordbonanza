import { forwardRef } from 'react';

interface CellProps {
  letter: string;
  number: number | null;
  isActive: boolean;
  isInActiveWord: boolean;
  onClick: () => void;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const Cell = forwardRef<HTMLInputElement, CellProps>(function Cell(
  { letter, number, isActive, isInActiveWord, onClick, onChange, onKeyDown },
  ref,
) {
  const className = [
    'cell',
    isActive ? 'cell--active' : '',
    isInActiveWord && !isActive ? 'cell--in-word' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className} onClick={onClick}>
      {number !== null && <span className="cell__number">{number}</span>}
      <input
        ref={ref}
        className="cell__input"
        type="text"
        inputMode="text"
        value={letter}
        maxLength={1}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck={false}
        onFocus={(e) => e.target.select()}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
});
