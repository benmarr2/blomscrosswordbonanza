import { useState } from 'react';

const STORAGE_KEY = 'crossword-nickname';

export function useNickname(): [string, (name: string) => void] {
  const [nickname, setNicknameState] = useState(() => localStorage.getItem(STORAGE_KEY) ?? '');

  function setNickname(name: string) {
    setNicknameState(name);
    localStorage.setItem(STORAGE_KEY, name);
  }

  return [nickname, setNickname];
}
