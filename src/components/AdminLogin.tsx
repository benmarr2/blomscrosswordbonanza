import { useState } from 'react';
import { adminSignIn } from '../room/adminAuth';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await adminSignIn(email, password);
    } catch {
      setError('Invalid email or password.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="room-entry" onSubmit={handleSubmit}>
      <h2>Admin Login</h2>
      <input
        className="room-entry__name"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="username"
      />
      <input
        className="room-entry__name"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      <button type="submit" disabled={busy}>
        Log in
      </button>
      {error && <p className="room-entry__error">{error}</p>}
    </form>
  );
}
