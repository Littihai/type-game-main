import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'

// Mini shooting stars for wave clear screen
interface Star { x: number; y: number; vx: number; vy: number; life: number; len: number }

export function WaveClear() {
  const { wave, score, nextWave } = useGameStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number>(0)
  const starsRef  = useRef<Star[]>([])
  const lastSpawn = useRef(0)

  useEffect(() => {
    const t = setTimeout(() => nextWave(), 3000)
    return () => clearTimeout(t)
  }, [])

  // Particle canvas for shooting stars
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = () => {
      const time = performance.now() / 1000
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Spawn
      if (time - lastSpawn.current > 0.4 + Math.random() * 0.5) {
        lastSpawn.current = time
        const angle = (15 + Math.random() * 30) * (Math.PI / 180)
        const speed = 6 + Math.random() * 8
        starsRef.current.push({
          x: Math.random() * canvas.width * 0.8,
          y: Math.random() * canvas.height * 0.5,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          len: 40 + Math.random() * 80,
          life: 1,
        })
      }

      starsRef.current = starsRef.current.filter(s => s.life > 0)
      starsRef.current.forEach(s => {
        s.x += s.vx; s.y += s.vy; s.life -= 0.025
        const a = s.life * 0.9
        const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx*(s.len/6), s.y - s.vy*(s.len/6))
        g.addColorStop(0,   `rgba(255,255,255,${a})`)
        g.addColorStop(0.5, `rgba(180,220,255,${a*0.5})`)
        g.addColorStop(1,   'rgba(255,255,255,0)')
        ctx.beginPath(); ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x - s.vx*(s.len/6), s.y - s.vy*(s.len/6))
        ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.beginPath(); ctx.arc(s.x, s.y, 1.8, 0, Math.PI*2)
        ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fill()
      })

      animRef.current = requestAnimationFrame(render)
    }
    animRef.current = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
         style={{ background: 'rgba(5,8,16,0.92)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
        .orb { font-family: 'Orbitron', monospace; }
        .mono { font-family: 'Share Tech Mono', monospace; }

        @keyframes wc-fade-in {
          from { opacity: 0; transform: translateY(18px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes wc-line-expand {
          from { width: 0; }
          to   { width: 160px; }
        }
        @keyframes wc-glow-pulse {
          0%, 100% { text-shadow: 0 0 30px rgba(74,222,128,0.8), 0 0 60px rgba(74,222,128,0.4); }
          50%       { text-shadow: 0 0 50px rgba(74,222,128,1),   0 0 90px rgba(74,222,128,0.6); }
        }
        @keyframes wc-score-in {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes wc-next-blink {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 1; }
        }
        @keyframes ring-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .wc-label   { animation: wc-fade-in 0.5s ease both; }
        .wc-number  { animation: wc-fade-in 0.5s 0.15s ease both, wc-glow-pulse 2s 0.65s ease-in-out infinite; }
        .wc-score   { animation: wc-score-in 0.5s 0.3s ease both; }
        .wc-next    { animation: wc-next-blink 1.2s 0.8s ease-in-out infinite; }
        .wc-line    { animation: wc-line-expand 0.6s 0.1s ease both; }
        .ring-spin  { animation: ring-spin 8s linear infinite; }
      `}</style>

      {/* Shooting star canvas */}
      <canvas ref={canvasRef} width={800} height={600}
              className="absolute inset-0 pointer-events-none" />

      {/* Decorative ring */}
      <div className="absolute w-64 h-64 ring-spin opacity-10"
           style={{ border: '1px dashed rgba(74,222,128,0.6)', borderRadius: '50%' }} />
      <div className="absolute w-48 h-48 opacity-10"
           style={{
             border: '1px dashed rgba(99,179,237,0.5)',
             borderRadius: '50%',
             animation: 'ring-spin 6s linear infinite reverse'
           }} />

      {/* Content */}
      <div className="relative flex flex-col items-center gap-3 px-12 py-10"
           style={{
             background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(10,20,40,0.7))',
             border: '1px solid rgba(74,222,128,0.25)',
             borderRadius: '16px',
             backdropFilter: 'blur(12px)',
           }}>

        {/* Top accent line */}
        <div className="wc-line h-px bg-gradient-to-r from-transparent via-green-400 to-transparent" />

        <div className="wc-label mono text-[11px] tracking-[0.35em] text-green-400 uppercase mt-2">
          ✦ Wave Complete ✦
        </div>

        <div className="wc-number orb text-8xl font-black text-green-300 leading-none">
          {wave}
        </div>

        <div className="wc-line h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />

        <div className="wc-score flex flex-col items-center gap-1 mt-1">
          <span className="mono text-[10px] tracking-[0.25em] text-gray-500 uppercase">Score</span>
          <span className="orb text-2xl font-bold text-blue-200"
                style={{ textShadow: '0 0 20px rgba(99,179,237,0.6)' }}>
            {score.toLocaleString()}
          </span>
        </div>

        <div className="wc-next mono text-[11px] tracking-[0.2em] text-gray-500 uppercase mt-2">
          next wave incoming...
        </div>

        {/* Bottom accent line */}
        <div className="wc-line h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent" />
      </div>
    </div>
  )
}