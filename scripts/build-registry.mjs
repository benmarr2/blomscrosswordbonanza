// Regenerates src/puzzles/loadPuzzle.ts from whatever's in src/puzzles/data/*.json.
// Run after adding/removing puzzle files so the import list never has to be hand-edited.

import { readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'src', 'puzzles', 'data');
const OUT_FILE = path.join(__dirname, '..', 'src', 'puzzles', 'loadPuzzle.ts');

function toVarName(id) {
  return id.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

const ids = readdirSync(DATA_DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''))
  .sort();

const imports = ids
  .map((id) => `import ${toVarName(id)} from './data/${id}.json';`)
  .join('\n');

const entries = ids
  .map((id) => `  '${id}': ${toVarName(id)} as Puzzle,`)
  .join('\n');

const content = `import type { Puzzle } from './schema';
${imports}

const bundled: Record<string, Puzzle> = {
${entries}
};

export function listBundledPuzzles(): Puzzle[] {
  return Object.values(bundled);
}

export function loadPuzzle(id: string): Puzzle | undefined {
  return bundled[id];
}
`;

writeFileSync(OUT_FILE, content);
console.log(`Wrote ${OUT_FILE} with ${ids.length} puzzles.`);
