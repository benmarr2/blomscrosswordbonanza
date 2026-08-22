import { useState } from 'react';
import { generateRoomCode, isValidRoomCode, normalizeRoomCode } from '../room/roomCode';
import { createRoom, roomExists } from '../room/useRoomSync';
import { listBundledPuzzles } from '../puzzles/loadPuzzle';

interface RoomEntryProps {
  onNavigate: (code: string) => void;
}

export function RoomEntry({ onNavigate }: RoomEntryProps) {
  const [joinInput, setJoinInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const puzzles = listBundledPuzzles();

  async function handleCreate() {
    setError(null);
    setBusy(true);
    try {
      const code = generateRoomCode();
      await createRoom(code, puzzles[0].id);
      onNavigate(code);
    } catch {
      setError('Could not create a room. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin() {
    setError(null);
    const code = normalizeRoomCode(joinInput);
    if (!isValidRoomCode(code)) {
      setError('That room code doesn’t look right.');
      return;
    }
    setBusy(true);
    try {
      const exists = await roomExists(code);
      if (!exists) {
        setError('No room found with that code.');
        return;
      }
      onNavigate(code);
    } catch {
      setError('Could not check that room. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="room-entry">
      <button disabled={busy} onClick={handleCreate}>
        Create a room
      </button>

      <div className="room-entry__divider">or</div>

      <div className="room-entry__join">
        <input
          placeholder="Room code"
          value={joinInput}
          maxLength={5}
          onChange={(e) => setJoinInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
        />
        <button disabled={busy} onClick={handleJoin}>
          Join
        </button>
      </div>

      {error && <p className="room-entry__error">{error}</p>}
    </div>
  );
}
