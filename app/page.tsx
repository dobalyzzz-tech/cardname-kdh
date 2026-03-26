'use client';

import { useState } from 'react';
import Lobby from '@/components/Lobby';
import GameBoard from '@/components/GameBoard';

export default function Home() {
  const [view, setView] = useState<'lobby' | 'game'>('lobby');
  const [userName, setUserName] = useState('');

  const handleStart = (name: string) => {
    setUserName(name);
    setView('game');
  };

  const handleHome = () => {
    setView('lobby');
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {view === 'lobby' ? (
        <Lobby onStart={handleStart} />
      ) : (
        <GameBoard userName={userName} onHome={handleHome} />
      )}
    </main>
  );
}
