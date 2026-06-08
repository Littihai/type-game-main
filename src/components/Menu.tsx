import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { loadStorage } from '../store/storageStore'

export function Menu() {
  const { setStatus, setLanguage, setDifficulty } = useGameStore()
  const { highScore, totalGames, bestWave } = loadStorage()
  const [selectedLang, setSelectedLang] = useState<'thai' | 'english'>('english')
  const [selectedDiff, setSelectedDiff] = useState<'easy' | 'medium' | 'hard'>('easy')

  const handleStart = () => {
    setLanguage(selectedLang)
    setDifficulty(selectedDiff)
    setStatus('playing')
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6"
         style={{ background: '#0a0a1a' }}>

      {/* title */}
      <div className="text-center">
        <div className="text-xs tracking-[0.4em] text-gray-400 mb-2">PHOBOSLAB CLONE</div>
        <h1 className="text-7xl font-black text-white tracking-tight">ZTYPE</h1>
      </div>

      {/* stats */}
      {totalGames > 0 && (
        <div className="flex gap-8 text-center">
          <div>
            <div className="text-yellow-400 text-xl font-bold">{highScore.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">best score</div>
          </div>
          <div>
            <div className="text-orange-400 text-xl font-bold">{bestWave}</div>
            <div className="text-xs text-gray-500 mt-1">best wave</div>
          </div>
          <div>
            <div className="text-gray-300 text-xl font-bold">{totalGames}</div>
            <div className="text-xs text-gray-500 mt-1">games played</div>
          </div>
        </div>
      )}

      {/* language selection */}
      <div className="flex flex-col gap-2 items-center">
        <div className="text-sm text-gray-400 tracking-wide">select language</div>
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedLang('english')}
            className={`px-6 py-2 text-sm tracking-widest transition-colors ${
              selectedLang === 'english'
                ? 'text-white bg-orange-500 rounded'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            english
          </button>
          <button
            onClick={() => setSelectedLang('thai')}
            className={`px-6 py-2 text-sm tracking-widest transition-colors ${
              selectedLang === 'thai'
                ? 'text-white bg-orange-500 rounded'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            ไทย
          </button>
        </div>
      </div>

      {/* difficulty selection */}
      <div className="flex flex-col gap-2 items-center">
        <div className="text-sm text-gray-400 tracking-wide">select difficulty</div>
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedDiff('easy')}
            className={`px-6 py-2 text-sm tracking-widest transition-colors ${
              selectedDiff === 'easy'
                ? 'text-white bg-blue-500 rounded'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            easy
          </button>
          <button
            onClick={() => setSelectedDiff('medium')}
            className={`px-6 py-2 text-sm tracking-widest transition-colors ${
              selectedDiff === 'medium'
                ? 'text-white bg-blue-500 rounded'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            medium
          </button>
          <button
            onClick={() => setSelectedDiff('hard')}
            className={`px-6 py-2 text-sm tracking-widest transition-colors ${
              selectedDiff === 'hard'
                ? 'text-white bg-blue-500 rounded'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            hard
          </button>
        </div>
      </div>

      {/* buttons */}
      <div className="flex flex-col gap-3 items-center">
        <button
          onClick={handleStart}
          className="text-orange-400 hover:text-orange-300 text-lg tracking-widest transition-colors mt-4"
        >
          new game
        </button>
        <button
          onClick={() => setStatus('settings')}
          className="text-blue-400 hover:text-blue-300 text-sm tracking-widest transition-colors"
        >
          settings
        </button>
      </div>

      <div className="text-xs text-gray-600 mt-2">type words to shoot enemies</div>
    </div>
  )
}