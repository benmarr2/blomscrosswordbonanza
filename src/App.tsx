import { useRoute } from './room/useRoute';
import { RoomEntry } from './components/RoomEntry';
import { Room } from './components/Room';

function App() {
  const { roomCode, navigateToRoom } = useRoute();

  return (
    <div className="app">
      {roomCode ? (
        <Room roomCode={roomCode} />
      ) : (
        <>
          <header className="app__header">
            <h1>Crossword Bonanza</h1>
            <p>Play a crossword together, live, wherever you are.</p>
          </header>
          <RoomEntry onNavigate={navigateToRoom} />
        </>
      )}
    </div>
  );
}

export default App;
