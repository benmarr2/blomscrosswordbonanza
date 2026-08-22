import type { Puzzle } from './schema';
import animalsMedium from './data/animals-medium.json';
import barnyard from './data/barnyard.json';
import foodEasy from './data/food-easy.json';
import geographyMedium from './data/geography-medium.json';
import historyHard from './data/history-hard.json';
import moviesMedium from './data/movies-medium.json';
import musicMedium from './data/music-medium.json';
import oceanMedium from './data/ocean-medium.json';
import sample from './data/sample.json';
import spaceMedium from './data/space-medium.json';
import sportsEasy from './data/sports-easy.json';
import stars from './data/stars.json';
import technologyMedium from './data/technology-medium.json';
import weatherHard from './data/weather-hard.json';

const bundled: Record<string, Puzzle> = {
  'animals-medium': animalsMedium as Puzzle,
  'barnyard': barnyard as Puzzle,
  'food-easy': foodEasy as Puzzle,
  'geography-medium': geographyMedium as Puzzle,
  'history-hard': historyHard as Puzzle,
  'movies-medium': moviesMedium as Puzzle,
  'music-medium': musicMedium as Puzzle,
  'ocean-medium': oceanMedium as Puzzle,
  'sample': sample as Puzzle,
  'space-medium': spaceMedium as Puzzle,
  'sports-easy': sportsEasy as Puzzle,
  'stars': stars as Puzzle,
  'technology-medium': technologyMedium as Puzzle,
  'weather-hard': weatherHard as Puzzle,
};

export function listBundledPuzzles(): Puzzle[] {
  return Object.values(bundled);
}

export function loadPuzzle(id: string): Puzzle | undefined {
  return bundled[id];
}
