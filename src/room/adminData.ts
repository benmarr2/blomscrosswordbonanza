import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { db } from '../firebase';
import { loadPuzzle } from '../puzzles/loadPuzzle';

export interface RoomSummary {
  code: string;
  puzzleTitle: string;
  started: boolean;
  createdAt: number | null;
  playerNames: string[];
}

interface RawRoom {
  meta?: { puzzleId?: string; createdAt?: number; started?: boolean };
  presence?: Record<string, { name?: string }>;
}

/** Admin-only: subscribes to the entire /rooms tree. Requires the
 * signed-in user's uid to match the admin uid allowed by the database
 * rules - a non-admin subscriber gets a permission-denied error instead
 * of data. */
export function useAllRooms(): { rooms: RoomSummary[]; error: string | null } {
  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onValue(
      ref(db, 'rooms'),
      (snapshot) => {
        const raw = (snapshot.val() as Record<string, RawRoom>) ?? {};
        const list: RoomSummary[] = Object.entries(raw).map(([code, room]) => ({
          code,
          puzzleTitle: (room.meta?.puzzleId && loadPuzzle(room.meta.puzzleId)?.title) ?? room.meta?.puzzleId ?? 'Unknown',
          started: !!room.meta?.started,
          createdAt: room.meta?.createdAt ?? null,
          playerNames: Object.values(room.presence ?? {}).map((p) => p.name ?? 'Player'),
        }));
        list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
        setRooms(list);
        setError(null);
      },
      (err) => {
        setError(err.message);
      },
    );
    return unsub;
  }, []);

  return { rooms, error };
}
