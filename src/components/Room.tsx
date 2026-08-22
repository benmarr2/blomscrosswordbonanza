import { useEffect } from 'react';
import { useGridStore } from '../state/gridStore';
import { loadPuzzle } from '../puzzles/loadPuzzle';
import { useRoomSync } from '../room/useRoomSync';
import { PuzzleGrid } from './PuzzleGrid';
import { ClueList } from './ClueList';
import { ConnectionBanner } from './ConnectionBanner';

interface RoomProps {
  roomCode: string;
}

export function Room({ roomCode }: RoomProps) {
  const load = useGridStore((s) => s.loadPuzzle);
  const puzzle = useGridStore((s) => s.puzzle);
  const { connected, meta, loading, writeCell } = useRoomSync(roomCode);

  useEffect(() => {
    if (!meta) return;
    const p = loadPuzzle(meta.puzzleId);
    if (p) load(p);
  }, [meta, load]);

  if (loading) return <p>Loading room…</p>;
  if (!meta) return <p>No room found with code {roomCode}.</p>;

  return (
    <div className="room">
      <div className="room__header">
        <span className="room__code">Room: {roomCode}</span>
        <ConnectionBanner connected={connected} />
      </div>
      <h1>{puzzle?.title ?? 'Crossword Bonanza'}</h1>
      <div className="app__main">
        <PuzzleGrid onLetterChange={writeCell} />
        <ClueList />
      </div>
    </div>
  );
}
