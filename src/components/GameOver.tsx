import { useGameStore } from '../store/gameStore'
import { updateHighScore, loadStorage } from '../store/storageStore'
import { useEffect, useRef, useState } from 'react'
import { useFirebaseAuth } from '../hooks/useFirebaseAuth'
import { saveBestScore } from '../services/leaderboardService'

export function GameOver() {
  const { score, wave, stats, language, difficulty, resetGame, setStatus } = useGameStore()
  const { user } = useFirebaseAuth()
  const { highScore } = loadStorage()
  const isNewRecord = score > highScore
  const hasSavedLocalScore = useRef(false)
  const hasSavedRemoteScore = useRef(false)
  const [remoteSaveStatus, setRemoteSaveStatus] = useState<string | null>(null)

  // Calculate score out of 100
  const maxPossibleScore = 10000 // arbitrary max
  const scoreOutOf100 = Math.min(Math.round((score / maxPossibleScore) * 100), 100)
  
  // Error rate calculation
  const totalAttempts = stats.totalChars
  const errorRate = totalAttempts > 0 ? Math.round((stats.errorCount / totalAttempts) * 100) : 0

  useEffect(() => {
    if (hasSavedLocalScore.current) return
    hasSavedLocalScore.current = true
    updateHighScore(score, wave)
  }, [score, wave])

  useEffect(() => {
    if (!user || hasSavedRemoteScore.current) return

    hasSavedRemoteScore.current = true
    saveBestScore(user, {
      score,
      wave,
      accuracy: stats.accuracy,
      words: stats.totalWords,
      language,
      difficulty,
    })
      .then((saved) => {
        setRemoteSaveStatus(saved ? 'saved to leaderboard' : 'leaderboard kept your best score')
      })
      .catch(() => setRemoteSaveStatus('leaderboard save failed'))
  }, [difficulty, language, score, stats.accuracy, stats.totalWords, user, wave])

  // Handle Enter key to play again
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        resetGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetGame]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-8"
         style={{ background: '#0a0a1a' }}>

      <h2 className="text-4xl font-black text-white tracking-tight">GAME OVER</h2>

      {isNewRecord && (
        <div className="text-yellow-400 text-sm tracking-widest animate-pulse">
          NEW HIGH SCORE
        </div>
      )}

      {/* Main Stats */}
      <div className="flex gap-10 text-center">
        <div>
          <div className="text-3xl font-bold text-white">{score.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">score</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-orange-400">{wave}</div>
          <div className="text-xs text-gray-500 mt-1">wave reached</div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-6 mt-4 w-full max-w-md">
        <div className="text-center border border-gray-700 rounded p-4">
          <div className="text-2xl font-bold text-green-400">{stats.accuracy}%</div>
          <div className="text-xs text-gray-500 mt-1">typing accuracy</div>
        </div>
        <div className="text-center border border-gray-700 rounded p-4">
          <div className="text-2xl font-bold text-red-400">{errorRate}%</div>
          <div className="text-xs text-gray-500 mt-1">error rate</div>
        </div>
        <div className="text-center border border-gray-700 rounded p-4">
          <div className="text-2xl font-bold text-yellow-400">{stats.totalWords}</div>
          <div className="text-xs text-gray-500 mt-1">words destroyed</div>
        </div>
        <div className="text-center border border-gray-700 rounded p-4">
          <div className="text-2xl font-bold text-blue-400">{scoreOutOf100}/100</div>
          <div className="text-xs text-gray-500 mt-1">score rating</div>
        </div>
      </div>

      {/* Character Stats */}
      <div className="text-center text-xs text-gray-400 mt-2">
        <div>{stats.totalChars} chars typed • {stats.correctChars} correct</div>
        <div>Max multiplier: {stats.multiplier.toFixed(1)}x</div>
        {user ? (
          <div className="mt-2 text-orange-300">{remoteSaveStatus || 'saving leaderboard score...'}</div>
        ) : (
          <div className="mt-2 text-yellow-300">sign in with Google from menu to join leaderboard</div>
        )}
      </div>

      <div className="flex gap-6 mt-6">
        <button
          onClick={resetGame}
          className="text-orange-400 hover:text-orange-300 text-base tracking-widest transition-colors"
        >
          play again
        </button>
        <button
          onClick={() => setStatus('menu')}
          className="text-gray-500 hover:text-gray-300 text-base tracking-widest transition-colors"
        >
          menu
        </button>
      </div>
    </div>
  )
}
