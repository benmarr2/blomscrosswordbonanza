import type { Puzzle } from './schema';
import animalsMedium from './data/animals-medium.json';
import architectureHard from './data/architecture-hard.json';
import artMedium from './data/art-medium.json';
import astronomyHard from './data/astronomy-hard.json';
import bakingMedium from './data/baking-medium.json';
import barnyard from './data/barnyard.json';
import birdsEasy from './data/birds-easy.json';
import boardgamesMedium from './data/boardgames-medium.json';
import capitalsMedium from './data/capitals-medium.json';
import carsEasy from './data/cars-easy.json';
import cartoonsMedium from './data/cartoons-medium.json';
import castlesMedium from './data/castles-medium.json';
import catsEasy from './data/cats-easy.json';
import chemistryHard from './data/chemistry-hard.json';
import coffeeMedium from './data/coffee-medium.json';
import computersMedium from './data/computers-medium.json';
import cookingMedium from './data/cooking-medium.json';
import dinosaursMedium from './data/dinosaurs-medium.json';
import dogsEasy from './data/dogs-easy.json';
import economicsHard from './data/economics-hard.json';
import fashionMedium from './data/fashion-medium.json';
import flowersEasy from './data/flowers-easy.json';
import foodEasy from './data/food-easy.json';
import geographyMedium from './data/geography-medium.json';
import historyHard from './data/history-hard.json';
import holidaysEasy from './data/holidays-easy.json';
import insectsMedium from './data/insects-medium.json';
import inventionsMedium from './data/inventions-medium.json';
import jazzHard from './data/jazz-hard.json';
import literatureMedium from './data/literature-medium.json';
import magicMedium from './data/magic-medium.json';
import mountainsMedium from './data/mountains-medium.json';
import moviesMedium from './data/movies-medium.json';
import musicMedium from './data/music-medium.json';
import mythologyMedium from './data/mythology-medium.json';
import natureEasy from './data/nature-easy.json';
import oceanMedium from './data/ocean-medium.json';
import operaHard from './data/opera-hard.json';
import petsEasy from './data/pets-easy.json';
import philosophyHard from './data/philosophy-hard.json';
import physicsHard from './data/physics-hard.json';
import piratesMedium from './data/pirates-medium.json';
import presidentsMedium from './data/presidents-medium.json';
import riversMedium from './data/rivers-medium.json';
import sample from './data/sample.json';
import scienceMedium from './data/science-medium.json';
import spaceMedium from './data/space-medium.json';
import sportsEasy from './data/sports-easy.json';
import stars from './data/stars.json';
import superheroesMedium from './data/superheroes-medium.json';
import technologyMedium from './data/technology-medium.json';
import travelMedium from './data/travel-medium.json';
import videogamesMedium from './data/videogames-medium.json';
import weatherHard from './data/weather-hard.json';

const bundled: Record<string, Puzzle> = {
  'animals-medium': animalsMedium as Puzzle,
  'architecture-hard': architectureHard as Puzzle,
  'art-medium': artMedium as Puzzle,
  'astronomy-hard': astronomyHard as Puzzle,
  'baking-medium': bakingMedium as Puzzle,
  'barnyard': barnyard as Puzzle,
  'birds-easy': birdsEasy as Puzzle,
  'boardgames-medium': boardgamesMedium as Puzzle,
  'capitals-medium': capitalsMedium as Puzzle,
  'cars-easy': carsEasy as Puzzle,
  'cartoons-medium': cartoonsMedium as Puzzle,
  'castles-medium': castlesMedium as Puzzle,
  'cats-easy': catsEasy as Puzzle,
  'chemistry-hard': chemistryHard as Puzzle,
  'coffee-medium': coffeeMedium as Puzzle,
  'computers-medium': computersMedium as Puzzle,
  'cooking-medium': cookingMedium as Puzzle,
  'dinosaurs-medium': dinosaursMedium as Puzzle,
  'dogs-easy': dogsEasy as Puzzle,
  'economics-hard': economicsHard as Puzzle,
  'fashion-medium': fashionMedium as Puzzle,
  'flowers-easy': flowersEasy as Puzzle,
  'food-easy': foodEasy as Puzzle,
  'geography-medium': geographyMedium as Puzzle,
  'history-hard': historyHard as Puzzle,
  'holidays-easy': holidaysEasy as Puzzle,
  'insects-medium': insectsMedium as Puzzle,
  'inventions-medium': inventionsMedium as Puzzle,
  'jazz-hard': jazzHard as Puzzle,
  'literature-medium': literatureMedium as Puzzle,
  'magic-medium': magicMedium as Puzzle,
  'mountains-medium': mountainsMedium as Puzzle,
  'movies-medium': moviesMedium as Puzzle,
  'music-medium': musicMedium as Puzzle,
  'mythology-medium': mythologyMedium as Puzzle,
  'nature-easy': natureEasy as Puzzle,
  'ocean-medium': oceanMedium as Puzzle,
  'opera-hard': operaHard as Puzzle,
  'pets-easy': petsEasy as Puzzle,
  'philosophy-hard': philosophyHard as Puzzle,
  'physics-hard': physicsHard as Puzzle,
  'pirates-medium': piratesMedium as Puzzle,
  'presidents-medium': presidentsMedium as Puzzle,
  'rivers-medium': riversMedium as Puzzle,
  'sample': sample as Puzzle,
  'science-medium': scienceMedium as Puzzle,
  'space-medium': spaceMedium as Puzzle,
  'sports-easy': sportsEasy as Puzzle,
  'stars': stars as Puzzle,
  'superheroes-medium': superheroesMedium as Puzzle,
  'technology-medium': technologyMedium as Puzzle,
  'travel-medium': travelMedium as Puzzle,
  'videogames-medium': videogamesMedium as Puzzle,
  'weather-hard': weatherHard as Puzzle,
};

export function listBundledPuzzles(): Puzzle[] {
  return Object.values(bundled);
}

export function loadPuzzle(id: string): Puzzle | undefined {
  return bundled[id];
}
