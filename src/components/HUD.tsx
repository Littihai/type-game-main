import { useGameStore } from '../store/gameStore'
import { loadStorage } from '../store/storageStore'

export function HUD() {
  const { score, lives, wave, kills, killsToNext, multiplier, isPaused, togglePause, status } = useGameStore()
  const { highScore } = loadStorage()
  const progress = Math.min((kills / killsToNext) * 100, 100)
  const isGamePlaying = status === 'playing';

  return (
    <div className="absolute top-0 left-0 w-full pointer-events-none select-none">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

        .hud-font { font-family: 'Orbitron', monospace; }
        .hud-mono  { font-family: 'Share Tech Mono', monospace; }

        .hud-panel {
          background: linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(10,15,30,0.85) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(8px);
        }

        .hud-panel-accent {
          background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(15,5,30,0.9) 100%);
          border: 1px solid rgba(168,85,247,0.25);
          backdrop-filter: blur(8px);
        }

        .score-glow { text-shadow: 0 0 20px rgba(99,179,237,0.6), 0 0 40px rgba(99,179,237,0.2); }
        .wave-glow  { text-shadow: 0 0 16px rgba(251,191,36,0.7); }
        .mult-glow  { text-shadow: 0 0 20px rgba(168,85,247,0.9), 0 0 40px rgba(168,85,247,0.4); }
        .mult-idle  { text-shadow: 0 0 8px rgba(255,255,255,0.2); }

        .heart-active { filter: drop-shadow(0 0 6px rgba(248,113,113,0.8)); }

        @keyframes pulse-mult {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.04); }
        }
        .mult-pulse { animation: pulse-mult 1.2s ease-in-out infinite; }

        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        .scan-line {
          animation: scan-line 3s linear infinite;
          background: linear-gradient(transparent, rgba(99,179,237,0.08), transparent);
          height: 25%;
        }

        .progress-bar-glow {
          box-shadow: 0 0 8px rgba(251,146,60,0.6), 0 0 16px rgba(251,146,60,0.3);
        }

        .separator {
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.12), transparent);
        }

        .corner-tl::before, .corner-tr::after {
          content: '';
          position: absolute;
          width: 8px; height: 8px;
          border-color: rgba(99,179,237,0.5);
          border-style: solid;
        }
        .corner-tl::before { top: 0; left: 0; border-width: 1px 0 0 1px; }
        .corner-tr::after  { top: 0; right: 0; border-width: 1px 1px 0 0; }
      `}</style>

      {/* ── Main HUD Bar ── */}
      <div className="relative hud-panel mx-3 mt-3 rounded-lg overflow-hidden">
        {/* scan line effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
          <div className="scan-line w-full" />
        </div>

        <div className="relative flex items-stretch h-16">

          {/* WAVE */}
          <div className="flex flex-col items-center justify-center px-6 min-w-[90px]">
            <span className="hud-mono text-[9px] tracking-[0.2em] text-blue-400/70 uppercase mb-0.5">Wave</span>
            <span className="hud-font text-2xl font-black text-yellow-300 wave-glow leading-none">{wave}</span>
          </div>

          <div className="separator self-stretch my-2" />

          {/* SCORE */}
          <div className="flex flex-col items-center justify-center flex-1 px-4">
            <span className="hud-mono text-[9px] tracking-[0.2em] text-blue-400/70 uppercase mb-0.5">Score</span>
            <span className="hud-font text-2xl font-bold text-blue-200 score-glow leading-none tabular-nums">
              {score.toLocaleString()}
            </span>
            <span className="hud-mono text-[10px] text-gray-500 mt-0.5">
              best <span className="text-yellow-400/80">{highScore.toLocaleString()}</span>
            </span>
          </div>

          <div className="separator self-stretch my-2" />

          {/* MULTIPLIER */}
          <div className={`flex flex-col items-center justify-center px-5 min-w-[100px] ${multiplier > 1 ? 'mult-pulse' : ''}`}>
            <span className="hud-mono text-[9px] tracking-[0.2em] text-purple-400/70 uppercase mb-0.5">Mult</span>
            <span className={`hud-font text-2xl font-black leading-none ${multiplier > 1 ? 'text-purple-300 mult-glow' : 'text-gray-400 mult-idle'}`}>
              {multiplier.toFixed(1)}<span className="text-base">×</span>
            </span>
          </div>

          <div className="separator self-stretch my-2" />

          {/* LIVES */}
          <div className="flex flex-col items-center justify-center px-5 min-w-[90px]">
            <span className="hud-mono text-[9px] tracking-[0.2em] text-blue-400/70 uppercase mb-1.5">Lives</span>
            <div className="flex gap-1.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-base transition-all duration-300 ${
                    i < lives
                      ? 'text-red-400 heart-active'
                      : 'text-gray-700'
                  }`}
                >
                  ♥
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* ── Wave Progress ── */}
        <div className="px-4 pb-3 pt-1">
          <div className="flex justify-between items-center mb-1.5">
            <span className="hud-mono text-[9px] tracking-[0.18em] text-gray-500 uppercase">Wave Progress</span>
            <span className="hud-mono text-[10px] text-gray-400 tabular-nums">{kills} / {killsToNext}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out progress-bar-glow"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #ea580c, #f97316, #fbbf24)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Pause Button */}
      {isGamePlaying && ( // แสดงปุ่มเมื่อเกมกำลังเล่นเท่านั้น
        <button
          onClick={togglePause} // เรียกฟังก์ชัน togglePause เมื่อคลิก
          className="absolute top-4 right-20 z-50 p-2 bg-gray-800/70 hover:bg-gray-700/80 text-white rounded-md transition-colors pointer-events-auto"
          aria-label={isPaused ? 'Resume Game' : 'Pause Game'}
        >
          {isPaused ? '▶️' : '⏸️'}
        </button>
      )}
    </div>
  )
}