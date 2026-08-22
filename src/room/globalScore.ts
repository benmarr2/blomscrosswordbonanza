import { useEffect, useState } from 'react';
import { onValue, ref, runTransaction } from 'firebase/database';
import { db, ensureSignedIn } from '../firebase';
import { isBlack, type Puzzle } from '../puzzles/schema';
import type { CellMeta, Presence } from './useRoomSync';

export interface PlayerScore {
  uid: string;
  name: string;
  totalScore: number;
  puzzlesSolved: number;
}

/** Awards each contributor's correctly-filled-cell count to their persistent
 * global tally, exactly once per room solve - guarded by a transaction on
 * meta/solvedAwarded so it doesn't matter which client notices first or if
 * multiple clients race to call this. */
export async function awardPuzzleCompletion(
  roomCode: string,
  puzzle: Puzzle,
  cells: Record<string, CellMeta>,
  presence: Record<string, Presence>,
): Promise<void> {
  const guardRef = ref(db, `rooms/${roomCode}/meta/solvedAwarded`);
  const result = await runTransaction(guardRef, (current) => {
    if (current === true) return; // abort: already awarded
    return true;
  });
  if (!result.committed) return;

  const scores: Record<string, number> = {};
  for (let row = 0; row < puzzle.height; row++) {
    for (let col = 0; col < puzzle.width; col++) {
      const solution = puzzle.grid[row][col];
      if (isBlack(solution)) continue;
      const cell = cells[`${row}-${col}`];
      if (!cell?.lastEditedBy) continue;
      if (cell.value?.toUpperCase() !== solution.toUpperCase()) continue;
      scores[cell.lastEditedBy] = (scores[cell.lastEditedBy] ?? 0) + 1;
    }
  }

  for (const [uid, gained] of Object.entries(scores)) {
    if (gained <= 0) continue;
    const name = presence[uid]?.name ?? 'Player';
    await runTransaction(ref(db, `players/${uid}`), (current) => ({
      name,
      totalScore: (current?.totalScore ?? 0) + gained,
      puzzlesSolved: (current?.puzzlesSolved ?? 0) + 1,
    }));
  }
}

export function useGlobalLeaderboard(limit = 10): PlayerScore[] {
  const [players, setPlayers] = useState<PlayerScore[]>([]);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    let cancelled = false;

    ensureSignedIn().then(() => {
      if (cancelled) return;
      unsub = onValue(ref(db, 'players'), (snapshot) => {
        const raw = (snapshot.val() as Record<string, { name: string; totalScore: number; puzzlesSolved: number }>) ?? {};
        const list = Object.entries(raw)
          .map(([uid, p]) => ({ uid, name: p.name, totalScore: p.totalScore ?? 0, puzzlesSolved: p.puzzlesSolved ?? 0 }))
          .sort((a, b) => b.totalScore - a.totalScore)
          .slice(0, limit);
        setPlayers(list);
      });
    });

    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [limit]);

  return players;
}
