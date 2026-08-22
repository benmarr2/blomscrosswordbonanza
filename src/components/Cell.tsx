interface CellProps {
  letter: string;
  number: number | null;
  isActive: boolean;
  isInActiveWord: boolean;
  onClick: () => void;
}

export function Cell({ letter, number, isActive, isInActiveWord, onClick }: CellProps) {
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
      <span className="cell__letter">{letter}</span>
    </div>
  );
}
