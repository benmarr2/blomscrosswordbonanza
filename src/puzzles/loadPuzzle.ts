import type { Puzzle } from './schema';
import sample from './data/sample.json';
import barnyard from './data/barnyard.json';
import stars from './data/stars.json';
import animalsMedium from './data/animals-medium.json';
import sportsEasy from './data/sports-easy.json';
import foodEasy from './data/food-easy.json';
import moviesMedium from './data/movies-medium.json';
import geographyMedium from './data/geography-medium.json';

const bundled: Record<string, Puzzle> = {
  sample: sample as Puzzle,
  barnyard: barnyard as Puzzle,
  stars: stars as Puzzle,
  'animals-medium': animalsMedium as Puzzle,
  'sports-easy': sportsEasy as Puzzle,
  'food-easy': foodEasy as Puzzle,
  'movies-medium': moviesMedium as Puzzle,
  'geography-medium': geographyMedium as Puzzle,
};

export function listBundledPuzzles(): Puzzle[] {
  return Object.values(bundled);
}

export function loadPuzzle(id: string): Puzzle | undefined {
  return bundled[id];
}
