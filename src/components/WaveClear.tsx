import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

export function WaveClear() {
  const { wave, score, nextWave } = useGameStore()

  // ไปต่ออัตโนมัติหลัง 2.5 วินาที
  useEffect(() => {
    const t = setTimeout(() => nextWave(), 2500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6"
         style={{ background: 'rgba(0,0,0,0.85)' }}>
      <div className="text-xs tracking-[0.4em] text-green-400">WAVE COMPLETE</div>
      <div className="text-6xl font-black text-white">{wave}</div>
      <div className="text-gray-400 text-sm">score: <span className="text-white font-bold">{score.toLocaleString()}</span></div>
      <div className="text-xs text-gray-600 animate-pulse">next wave incoming...</div>
    </div>
  )
}