import { useEffect, useState } from 'react';

export type Route = { type: 'entry' } | { type: 'room'; roomCode: string } | { type: 'admin' };

function parseRoute(hash: string): Route {
  const roomMatch = hash.match(/^#\/room\/([A-Z0-9]+)$/i);
  if (roomMatch) return { type: 'room', roomCode: roomMatch[1].toUpperCase() };
  if (hash === '#/admin') return { type: 'admin' };
  return { type: 'entry' };
}

export function useRoute(): { route: Route; navigateToRoom: (code: string) => void } {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  function navigateToRoom(code: string) {
    window.location.hash = `#/room/${code}`;
  }

  return { route, navigateToRoom };
}
