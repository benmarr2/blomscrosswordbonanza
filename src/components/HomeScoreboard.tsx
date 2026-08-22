import { useGlobalLeaderboard } from '../room/globalScore';

export function HomeScoreboard() {
  const players = useGlobalLeaderboard();

  if (players.length === 0) return null;

  return (
    <div className="home-scoreboard">
      <h3>All-Time Leaderboard</h3>
      <ul className="scoreboard__list">
        {players.map((p, i) => (
          <li key={p.uid}>
            <span className="scoreboard__name">
              {i + 1}. {p.name}
            </span>
            <span className="scoreboard__score">{p.totalScore}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
