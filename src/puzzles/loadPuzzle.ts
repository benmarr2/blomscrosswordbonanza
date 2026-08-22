import type { Puzzle } from './schema';
import sample from './data/sample.json';

const bundled: Record<string, Puzzle> = {
  sample: sample as Puzzle,
};

export function listBundledPuzzles(): Puzzle[] {
  return Object.values(bundled);
}

export function loadPuzzle(id: string): Puzzle | undefined {
  return bundled[id];
}
