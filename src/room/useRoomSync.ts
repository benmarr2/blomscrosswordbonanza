import { useEffect, useRef, useState } from 'react';
import { onValue, ref, serverTimestamp, set } from 'firebase/database';
import { db, ensureSignedIn } from '../firebase';
import { useGridStore } from '../state/gridStore';

interface RoomMeta {
  puzzleId: string;
  createdAt: number;
}

interface RoomSyncState {
  connected: boolean;
  meta: RoomMeta | null;
  loading: boolean;
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

export function useRoomSync(roomCode: string | null): RoomSyncState {
  const [connected, setConnected] = useState(false);
  const [meta, setMeta] = useState<RoomMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const setLetterFromRemote = useGridStore((s) => s.setLetterFromRemote);
  const signedIn = useRef(false);

  useEffect(() => {
    if (!roomCode) return;
    let cancelled = false;

    ensureSignedIn().then(() => {
      if (cancelled) return;
      signedIn.current = true;
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
      const cells = snapshot.val() as Record<string, { value?: string }> | null;
      if (!cells) return;
      for (const key of Object.keys(cells)) {
        const [row, col] = key.split('-').map(Number);
        setLetterFromRemote(row, col, cells[key]?.value ?? '');
      }
    });

    return () => {
      cancelled = true;
      unsubConnected();
      unsubMeta();
      unsubCells();
    };
  }, [roomCode, setLetterFromRemote]);

  function writeCell(row: number, col: number, value: string) {
    if (!roomCode) return;
    void set(ref(db, `rooms/${roomCode}/cells/${row}-${col}`), {
      value,
      lastEditedAt: serverTimestamp(),
    });
  }

  return { connected, meta, loading, writeCell };
}
