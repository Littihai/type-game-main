export interface PlayerStorage {
  highScore: number
  totalGames: number
  bestWave: number
}

const KEY = 'ztype_player'

export function loadStorage(): PlayerStorage {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { highScore: 0, totalGames: 0, bestWave: 1 }
    return JSON.parse(raw) as PlayerStorage
  } catch {
    return { highScore: 0, totalGames: 0, bestWave: 1 }
  }
}

export function saveStorage(data: PlayerStorage): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    console.warn('localStorage unavailable')
  }
}

export function updateHighScore(score: number, wave: number): void {
  const current = loadStorage()
  saveStorage({
    highScore: Math.max(current.highScore, score),
    bestWave: Math.max(current.bestWave, wave),
    totalGames: current.totalGames + 1,
  })
}