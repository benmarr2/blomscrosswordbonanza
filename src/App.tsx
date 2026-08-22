import { useEffect } from 'react';
import { useGridStore } from './state/gridStore';
import { loadPuzzle } from './puzzles/loadPuzzle';
import { PuzzleGrid } from './components/PuzzleGrid';
import { ClueList } from './components/ClueList';

function App() {
  const puzzle = useGridStore((s) => s.puzzle);
  const load = useGridStore((s) => s.loadPuzzle);

  useEffect(() => {
    const p = loadPuzzle('sample');
    if (p) load(p);
  }, [load]);

  return (
    <div className="app">
      <header className="app__header">
        <h1>{puzzle?.title ?? 'Crossword Bonanza'}</h1>
      </header>
      <main className="app__main">
        <PuzzleGrid />
        <ClueList />
      </main>
    </div>
  );
}

export default App;
