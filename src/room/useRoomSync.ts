import { useEffect, useRef, useState } from 'react';
import { onDisconnect, onValue, ref, remove, serverTimestamp, set } from 'firebase/database';
import { db, ensureSignedIn } from '../firebase';
import { useGridStore } from '../state/gridStore';

interface RoomMeta {
  puzzleId: string;
  createdAt: number;
}

export interface CellMeta {
  value: string;
  lastEditedBy?: string;
}

export interface Presence {
  name: string;
}

interface RoomSyncState {
  connected: boolean;
  meta: RoomMeta | null;
  loading: boolean;
  cells: Record<string, CellMeta>;
  presence: Record<string, Presence>;
  writeCell: (row: number, col: number, value: string) => void;
}

export async function createRoom(roomCode: string, puzzleId: string): Promise<void> {
  await ensureSignedIn();
  await set(ref(db, `rooms/${roomCode}/meta`), {
    puzzleId,
    createdAt: serverTimestamp(),
  });
}

export async function roomExists(roomCode: string): Promise<boolean> {
  await ensureSignedIn();
  return new Promise((resolve, reject) => {
    onValue(
      ref(db, `rooms/${roomCode}/meta`),
      (snapshot) => resolve(snapshot.exists()),
      (error) => reject(error),
      { onlyOnce: true },
    );
  });
}

export function useRoomSync(roomCode: string | null, displayName: string): RoomSyncState {
  const [connected, setConnected] = useState(false);
  const [meta, setMeta] = useState<RoomMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [cells, setCells] = useState<Record<string, CellMeta>>({});
  const [presence, setPresence] = useState<Record<string, Presence>>({});
  const setLetterFromRemote = useGridStore((s) => s.setLetterFromRemote);
  const uidRef = useRef<string | null>(null);

  useEffect(() => {
    if (!roomCode) return;
    let cancelled = false;

    ensureSignedIn().then((user) => {
      if (cancelled) return;
      uidRef.current = user.uid;
      const presenceRef = ref(db, `rooms/${roomCode}/presence/${user.uid}`);
      set(presenceRef, { name: displayName || 'Player' });
      onDisconnect(presenceRef).remove();
    });

    const connectedRef = ref(db, '.info/connected');
    const unsubConnected = onValue(connectedRef, (snapshot) => {
      setConnected(snapshot.val() === true);
    });

    const metaRef = ref(db, `rooms/${roomCode}/meta`);
    const unsubMeta = onValue(metaRef, (snapshot) => {
      setMeta(snapshot.val());
      setLoading(false);
    });

    const cellsRef = ref(db, `rooms/${roomCode}/cells`);
    const unsubCells = onValue(cellsRef, (snapshot) => {
      const remoteCells = (snapshot.val() as Record<string, CellMeta>) ?? {};
      setCells(remoteCells);
      for (const key of Object.keys(remoteCells)) {
        const [row, col] = key.split('-').map(Number);
        setLetterFromRemote(row, col, remoteCells[key]?.value ?? '');
      }
    });

    const presenceRef = ref(db, `rooms/${roomCode}/presence`);
    const unsubPresence = onValue(presenceRef, (snapshot) => {
      setPresence((snapshot.val() as Record<string, Presence>) ?? {});
    });

    return () => {
      cancelled = true;
      unsubConnected();
      unsubMeta();
      unsubCells();
      unsubPresence();
      if (uidRef.current) {
        remove(ref(db, `rooms/${roomCode}/presence/${uidRef.current}`));
      }
    };
  }, [roomCode, displayName, setLetterFromRemote]);

  function writeCell(row: number, col: number, value: string) {
    if (!roomCode) return;
    void set(ref(db, `rooms/${roomCode}/cells/${row}-${col}`), {
      value,
      lastEditedBy: uidRef.current,
      lastEditedAt: serverTimestamp(),
    });
  }

  return { connected, meta, loading, cells, presence, writeCell };
}
