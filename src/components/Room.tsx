import { useEffect, useMemo, useRef, useState } from 'react';
import { useGridStore } from '../state/gridStore';
import { loadPuzzle, listBundledPuzzles } from '../puzzles/loadPuzzle';
import { isPuzzleSolved } from '../puzzles/completion';
import { useRoomSync, changePuzzle } from '../room/useRoomSync';
import { useNickname } from '../room/useNickname';
import { awardPuzzleCompletion } from '../room/globalScore';
import { PuzzleGrid } from './PuzzleGrid';
import { ClueList } from './ClueList';
import { ConnectionBanner } from './ConnectionBanner';
import { Scoreboard } from './Scoreboard';
import { SolvedBanner } from './SolvedBanner';
import { PuzzlePicker } from './PuzzlePicker';

interface RoomProps {
  roomCode: string;
}

export function Room({ roomCode }: RoomProps) {
  const load = useGridStore((s) => s.loadPuzzle);
  const puzzle = useGridStore((s) => s.puzzle);
  const [nickname] = useNickname();
  const { connected, meta, loading, cells, presence, writeCell } = useRoomSync(roomCode, nickname);
  const [nextPuzzleId, setNextPuzzleId] = useState('');
  const puzzles = useMemo(() => listBundledPuzzles(), []);

  useEffect(() => {
    if (!meta) return;
    const p = loadPuzzle(meta.puzzleId);
    if (p) load(p);
    setNextPuzzleId(puzzles.find((x) => x.id !== meta.puzzleId)?.id ?? puzzles[0].id);
  }, [meta, load, puzzles]);

  const solved = useMemo(() => (puzzle ? isPuzzleSolved(puzzle, cells) : false), [puzzle, cells]);
  const awardedFor = useRef<string | null>(null);

  useEffect(() => {
    if (solved && puzzle && awardedFor.current !== roomCode) {
      awardedFor.current = roomCode;
      void awardPuzzleCompletion(roomCode, puzzle, cells, presence);
    }
    if (!solved) {
      awardedFor.current = null;
    }
  }, [solved, puzzle, roomCode, cells, presence]);

  if (loading) return <p>Loading room…</p>;
  if (!meta) return <p>No room found with code {roomCode}.</p>;

  return (
    <div className="room">
      <div className="room__header">
        <span className="room__code">Room: {roomCode}</span>
        <ConnectionBanner connected={connected} />
      </div>
      <h1>{puzzle?.title ?? 'Crossword Bonanza'}</h1>

      {solved && (
        <div className="solved-panel">
          <SolvedBanner />
          <p className="room-entry__label">Play another:</p>
          <PuzzlePicker puzzles={puzzles} selectedId={nextPuzzleId} onSelect={setNextPuzzleId} />
          <button onClick={() => changePuzzle(roomCode, nextPuzzleId)}>Start next puzzle</button>
        </div>
      )}

      <div className="app__main">
        <PuzzleGrid onLetterChange={writeCell} />
        <ClueList />
        {puzzle && <Scoreboard puzzle={puzzle} cells={cells} presence={presence} />}
      </div>
    </div>
  );
}
