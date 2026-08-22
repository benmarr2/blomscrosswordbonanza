import type { Puzzle } from './schema';
import sample from './data/sample.json';
import barnyard from './data/barnyard.json';
import stars from './data/stars.json';
import animalsMedium from './data/animals-medium.json';
import sportsEasy from './data/sports-easy.json';
import foodEasy from './data/food-easy.json';
import moviesMedium from './data/movies-medium.json';
import geographyMedium from './data/geography-medium.json';
import spaceMedium from './data/space-medium.json';
import musicMedium from './data/music-medium.json';
import technologyMedium from './data/technology-medium.json';
import oceanMedium from './data/ocean-medium.json';
import historyHard from './data/history-hard.json';
import weatherHard from './data/weather-hard.json';

const bundled: Record<string, Puzzle> = {
  sample: sample as Puzzle,
  barnyard: barnyard as Puzzle,
  stars: stars as Puzzle,
  'animals-medium': animalsMedium as Puzzle,
  'sports-easy': sportsEasy as Puzzle,
  'food-easy': foodEasy as Puzzle,
  'movies-medium': moviesMedium as Puzzle,
  'geography-medium': geographyMedium as Puzzle,
  'space-medium': spaceMedium as Puzzle,
  'music-medium': musicMedium as Puzzle,
  'technology-medium': technologyMedium as Puzzle,
  'ocean-medium': oceanMedium as Puzzle,
  'history-hard': historyHard as Puzzle,
  'weather-hard': weatherHard as Puzzle,
};

export function listBundledPuzzles(): Puzzle[] {
  return Object.values(bundled);
}

export function loadPuzzle(id: string): Puzzle | undefined {
  return bundled[id];
}
