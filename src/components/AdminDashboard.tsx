import { useAllRooms } from '../room/adminData';
import { adminSignOut } from '../room/adminAuth';
import type { User } from 'firebase/auth';

interface AdminDashboardProps {
  user: User;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const { rooms, error } = useAllRooms();

  return (
    <div className="admin">
      <div className="admin__header">
        <h2>Active Rooms</h2>
        <div>
          <span className="admin__email">{user.email}</span>
          <button onClick={() => adminSignOut()}>Sign out</button>
        </div>
      </div>

      {error && <p className="room-entry__error">{error}</p>}

      {rooms.length === 0 && !error && <p className="puzzle-picker__empty">No active rooms right now.</p>}

      {rooms.length > 0 && (
        <table className="admin__table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Puzzle</th>
              <th>Status</th>
              <th>Players</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r.code}>
                <td>{r.code}</td>
                <td>{r.puzzleTitle}</td>
                <td>{r.started ? 'Playing' : 'In lobby'}</td>
                <td>{r.playerNames.length > 0 ? r.playerNames.join(', ') : '—'}</td>
                <td>{r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
