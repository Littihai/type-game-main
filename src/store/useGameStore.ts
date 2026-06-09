import { create } from 'zustand';
import { playGlassBreak } from './audio';

interface GameState {
  lives: number;
  isPaused: boolean;
  isGameOver: boolean;
  decreaseLife: () => void;
  togglePause: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  lives: 3,
  isPaused: false,
  isGameOver: false,

  decreaseLife: () => set((state) => {
    if (state.isPaused || state.isGameOver) return state;
    
    playGlassBreak(); // เล่นเสียงแก้วแตกเมื่อเลือดลด
    const newLives = state.lives - 1;
    return {
      lives: newLives,
      isGameOver: newLives <= 0
    };
  }),

  togglePause: () => set((state) => ({
    isPaused: !state.isGameOver ? !state.isPaused : false
  })),

  resetGame: () => set({ lives: 3, isPaused: false, isGameOver: false }),
}));