import { useEffect, useState } from 'react';

function parseRoomCode(hash: string): string | null {
  const match = hash.match(/^#\/room\/([A-Z0-9]+)$/i);
  return match ? match[1].toUpperCase() : null;
}

export function useRoute(): { roomCode: string | null; navigateToRoom: (code: string) => void } {
  const [roomCode, setRoomCode] = useState(() => parseRoomCode(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setRoomCode(parseRoomCode(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  function navigateToRoom(code: string) {
    window.location.hash = `#/room/${code}`;
  }

  return { roomCode, navigateToRoom };
}
