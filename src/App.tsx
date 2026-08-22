import { useRoute } from './room/useRoute';
import { useAdminAuthState } from './room/adminAuth';
import { RoomEntry } from './components/RoomEntry';
import { Room } from './components/Room';
import { HomeScoreboard } from './components/HomeScoreboard';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';

function App() {
  const { route, navigateToRoom } = useRoute();
  const { user, isAdmin, loading } = useAdminAuthState();

  if (route.type === 'room') {
    return (
      <div className="app">
        <Room roomCode={route.roomCode} />
      </div>
    );
  }

  if (route.type === 'admin') {
    return (
      <div className="app">
        {loading ? <p>Loading…</p> : isAdmin && user ? <AdminDashboard user={user} /> : <AdminLogin />}
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Blom's Crossword Bonanza</h1>
        <p>Let's play crosswords cha-ching baby</p>
      </header>
      <RoomEntry onNavigate={navigateToRoom} />
      <HomeScoreboard />
    </div>
  );
}

export default App;
