import { useEffect, useMemo, useRef, useState } from 'react';
import { useGridStore } from '../state/gridStore';
import { loadPuzzle, listBundledPuzzles } from '../puzzles/loadPuzzle';
import { isPuzzleSolved } from '../puzzles/completion';
import { useRoomSync, changePuzzle, startRoom, backToLobby } from '../room/useRoomSync';
import { useNickname } from '../room/useNickname';
import { awardPuzzleCompletion } from '../room/globalScore';
import { PuzzleGrid } from './PuzzleGrid';
import { ClueList } from './ClueList';
import { ConnectionBanner } from './ConnectionBanner';
import { Scoreboard } from './Scoreboard';
import { SolvedBanner } from './SolvedBanner';
import { PuzzlePicker } from './PuzzlePicker';
import { Lobby } from './Lobby';

interface RoomProps {
  roomCode: string;
}

export function Room({ roomCode }: RoomProps) {
  const load = useGridStore((s) => s.loadPuzzle);
  const puzzle = useGridStore((s) => s.puzzle);
  const [nickname] = useNickname();
  const { connected, meta, loading, cells, presence, writeCell } = useRoomSync(roomCode, nickname);
  const [nextPuzzleId, setNextPuzzleId] = useState('');
  const [lobbyPuzzleId, setLobbyPuzzleId] = useState('');
  const puzzles = useMemo(() => listBundledPuzzles(), []);

  useEffect(() => {
    if (!meta) return;
    // Only reload the puzzle (which resets the local letters map) when the
    // puzzle actually changed - meta also updates for unrelated reasons
    // (started toggling, the solved-score-award transaction) and reloading
    // on every one of those would silently wipe in-progress letters.
    if (puzzle?.id !== meta.puzzleId) {
      const p = loadPuzzle(meta.puzzleId);
      if (p) load(p);
    }
    setNextPuzzleId(puzzles.find((x) => x.id !== meta.puzzleId)?.id ?? puzzles[0].id);
    setLobbyPuzzleId(meta.puzzleId);
  }, [meta, load, puzzle?.id, puzzles]);

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

  function handleLobbyStart() {
    if (lobbyPuzzleId && lobbyPuzzleId !== meta!.puzzleId) {
      void changePuzzle(roomCode, lobbyPuzzleId);
    } else {
      void startRoom(roomCode);
    }
  }

  if (!meta.started) {
    return (
      <div className="room">
        <div className="room__header">
          <span className="room__code">Room: {roomCode}</span>
          <ConnectionBanner connected={connected} />
        </div>
        <Lobby
          roomCode={roomCode}
          puzzles={puzzles}
          selectedPuzzleId={lobbyPuzzleId}
          onSelectPuzzle={setLobbyPuzzleId}
          presence={presence}
          onStart={handleLobbyStart}
        />
      </div>
    );
  }

  return (
    <div className="room">
      <div className="room__header">
        <span className="room__code">Room: {roomCode}</span>
        <ConnectionBanner connected={connected} />
      </div>
      <div className="room__title-row">
        <h1>{puzzle?.title ?? 'Crossword Bonanza'}</h1>
        <button className="room__lobby-link" onClick={() => backToLobby(roomCode)}>
          ← Back to lobby
        </button>
      </div>

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
