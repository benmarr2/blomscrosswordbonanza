import { useRoute } from './room/useRoute';
import { RoomEntry } from './components/RoomEntry';
import { Room } from './components/Room';
import { HomeScoreboard } from './components/HomeScoreboard';

function App() {
  const { roomCode, navigateToRoom } = useRoute();

  return (
    <div className="app">
      {roomCode ? (
        <Room roomCode={roomCode} />
      ) : (
        <>
          <header className="app__header">
            <h1>Blom's Crossword Bonanza</h1>
            <p>Let's play crosswords cha-ching baby</p>
          </header>
          <RoomEntry onNavigate={navigateToRoom} />
          <HomeScoreboard />
        </>
      )}
    </div>
  );
}

export default App;
