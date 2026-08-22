// Usage: APIVERVE_API_KEY=xxx node scripts/fetch-crossword.mjs --theme animals --difficulty medium --size 15 --id animals-medium --title "Animal Kingdom"
// One-off content generation - never run by the deployed app, spends real API credits.

import { convertApiverveCrossword, writePuzzle } from './import-crossword.mjs';

function parseArgs() {
  const args = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 2) {
    args[argv[i].replace(/^--/, '')] = argv[i + 1];
  }
  return args;
}

const args = parseArgs();
const apiKey = process.env.APIVERVE_API_KEY;

if (!apiKey) {
  console.error('Set APIVERVE_API_KEY in your environment first.');
  process.exit(1);
}
for (const required of ['theme', 'difficulty', 'id', 'title']) {
  if (!args[required]) {
    console.error(`Missing --${required}`);
    process.exit(1);
  }
}

const url = new URL('https://api.apiverve.com/v1/crossword');
url.searchParams.set('theme', args.theme);
url.searchParams.set('difficulty', args.difficulty);
url.searchParams.set('size', args.size ?? 'medium');

const res = await fetch(url, { headers: { 'x-api-key': apiKey } });
const body = await res.json();

if (body.status !== 'ok') {
  console.error('API error:', body.error);
  process.exit(1);
}

const puzzle = convertApiverveCrossword(body.data, { id: args.id, title: args.title });
writePuzzle(puzzle);
console.log(`Now add "${args.id}" to src/puzzles/loadPuzzle.ts`);
