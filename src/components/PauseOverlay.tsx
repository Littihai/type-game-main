import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export const PauseOverlay: React.FC = () => {
  const { isPaused, togglePause, status } = useGameStore();
  const isGameOver = status === 'gameover';

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isGameOver) {
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, togglePause]);

  if (!isPaused || isGameOver) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border-2 border-blue-500 text-center">
        <h2 className="text-4xl font-black text-white mb-6 tracking-widest">PAUSED</h2>
        <div className="space-y-4">
          <button
            onClick={togglePause}
            className="w-full py-3 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all transform hover:scale-105"
          >
            RESUME (ESC)
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-8 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold rounded-lg transition-all"
          >
            QUIT TO MENU
          </button>
        </div>
      </div>
    </div>
  );
};