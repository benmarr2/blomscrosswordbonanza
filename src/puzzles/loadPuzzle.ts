import type { Puzzle } from './schema';
import sample from './data/sample.json';
import barnyard from './data/barnyard.json';
import stars from './data/stars.json';

const bundled: Record<string, Puzzle> = {
  sample: sample as Puzzle,
  barnyard: barnyard as Puzzle,
  stars: stars as Puzzle,
};

export function listBundledPuzzles(): Puzzle[] {
  return Object.values(bundled);
}

export function loadPuzzle(id: string): Puzzle | undefined {
  return bundled[id];
}
