import { useGameStore } from '../store/gameStore'
import { loadStorage } from '../store/storageStore'

export function HUD() {
  const { score, lives, wave, kills, killsToNext, multiplier } = useGameStore()
  const { highScore } = loadStorage()
  const progress = Math.min((kills / killsToNext) * 100, 100)

  return (
    <div className="absolute top-0 left-0 w-full pointer-events-none">
      {/* top bar - grid layout */}
      <div className="grid grid-cols-3 gap-4 px-6 py-4">
        {/* left: Wave */}
        <div className="text-left">
          <div className="text-xs text-gray-400 uppercase tracking-widest">Wave</div>
          <div className="text-2xl font-bold text-white">{wave}</div>
        </div>

        {/* center: Score */}
        <div className="text-center">
          <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Score</div>
          <div className="text-2xl font-bold text-white tabular-nums">{score.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">Best: <span className="text-yellow-400">{highScore.toLocaleString()}</span></div>
        </div>

        {/* right: Lives */}
        <div className="text-right">
          <div className="text-xs text-gray-400 uppercase tracking-widest">Lives</div>
          <div className="flex gap-1 justify-end mt-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={`text-lg ${i < lives ? 'text-red-400' : 'text-gray-700'}`}>♥</span>
            ))}
          </div>
        </div>
      </div>

      {/* multiplier display - floating badge */}
      <div className="absolute top-4 right-6 text-center">
        <div className={`text-xs uppercase tracking-widest font-semibold ${multiplier > 1 ? 'text-yellow-400 animate-pulse' : 'text-gray-500'}`}>
          ✦ Multiplier
        </div>
        <div className={`text-3xl font-black tracking-tight ${multiplier > 1 ? 'text-yellow-400' : 'text-white'}`}>
          {multiplier.toFixed(1)}x
        </div>
      </div>

      {/* wave progress bar */}
      <div className="px-6 mt-2">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>WAVE PROGRESS</span>
          <span className="tabular-nums">{kills} / {killsToNext}</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}