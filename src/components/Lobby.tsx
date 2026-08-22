import type { Presence } from '../room/useRoomSync';

interface LobbyProps {
  roomCode: string;
  puzzleTitle: string;
  presence: Record<string, Presence>;
  onStart: () => void;
}

export function Lobby({ roomCode, puzzleTitle, presence, onStart }: LobbyProps) {
  const players = Object.values(presence);

  return (
    <div className="lobby">
      <p className="lobby__code">
        Room code: <strong>{roomCode}</strong>
      </p>
      <p className="room-entry__label">Puzzle: {puzzleTitle}</p>

      <div className="lobby__players">
        <h3>Players ({players.length})</h3>
        <ul className="scoreboard__list">
          {players.map((p, i) => (
            <li key={i}>
              <span>{p.name}</span>
            </li>
          ))}
          {players.length === 0 && <li className="puzzle-picker__empty">Waiting for players to join…</li>}
        </ul>
      </div>

      <button onClick={onStart}>Start Puzzle</button>
      <p className="lobby__hint">Share the room code with friends - anyone can start once everyone's in.</p>
    </div>
  );
}
