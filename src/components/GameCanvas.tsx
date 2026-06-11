import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { drawParticles } from '../game/particles'
import { useParticles } from '../hooks/useParticles'

// Static star field
const STARS = Array.from({ length: 150 }, (_, i) => ({
  x: (i * 137.508) % 800,
  y: (i * 97.31) % 600,
  r: i % 9 === 0 ? 1.8 : i % 3 === 0 ? 1.1 : 0.5,
  brightness: 0.25 + (i % 6) * 0.12,
  twinkleSpeed: 0.8 + (i % 5) * 0.4,
  twinkleOffset: (i * 0.7) % (Math.PI * 2),
}))

const NEBULAS = [
  { x: 160, y: 130, rx: 190, ry: 95,  color: 'rgba(55,15,110,0.2)'  },
  { x: 630, y: 290, rx: 150, ry: 120, color: 'rgba(15,55,120,0.17)' },
  { x: 390, y: 490, rx: 210, ry: 75,  color: 'rgba(80,10,75,0.14)'  },
]

interface ShootingStar {
  x: number; y: number; vx: number; vy: number
  len: number; life: number
}
const shootingStars: ShootingStar[] = []
let lastShootTime = 0

function spawnShootingStar(time: number) {
  if (time - lastShootTime < 3.5 + Math.sin(time) * 2) return
  lastShootTime = time
  const angle = (15 + Math.random() * 25) * (Math.PI / 180)
  const speed = 7 + Math.random() * 6
  shootingStars.push({
    x: Math.random() * 550,
    y: Math.random() * 180,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    len: 50 + Math.random() * 70,
    life: 1,
  })
}

const enemyShapes: Record<string, number[]> = {}
function getShape(id: string, n: number): number[] {
  if (!enemyShapes[id]) {
    let h = 0
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
    enemyShapes[id] = Array.from({ length: n }, (_, i) => 0.72 + ((h >> (i % 8)) & 0x7) * 0.04)
  }
  return enemyShapes[id]
}

function drawAsteroid(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  isActive: boolean,
  time: number,
  id: string
) {
  const seed  = id.charCodeAt(id.length - 2) % 3
  const size  = 13 + (id.charCodeAt(id.length - 1) % 4) * 1.5
  const nPts  = 8 + (id.charCodeAt(0) % 3)
  const radii = getShape(id, nPts)

  ctx.save()
  ctx.translate(x, y)

  // ── Flame trail ──
  const fh = 30 + size * 1.1
  const fg = ctx.createLinearGradient(0, -fh, 0, 4)
  fg.addColorStop(0,    'rgba(255,100,20,0)')
  fg.addColorStop(0.45, isActive ? 'rgba(255,200,50,0.5)' : 'rgba(255,130,30,0.35)')
  fg.addColorStop(1,    isActive ? 'rgba(255,240,110,0.9)' : 'rgba(255,175,60,0.7)')
  const fw = size * 0.5
  ctx.beginPath()
  ctx.moveTo(0, 2)
  ctx.bezierCurveTo(-fw, -fh * 0.35, fw * 0.5, -fh * 0.65, 0, -fh)
  ctx.bezierCurveTo(-fw * 0.5, -fh * 0.65, fw, -fh * 0.35, 0, 2)
  ctx.fillStyle = fg
  ctx.fill()

  // ── Halo glow ──
  const glowR = isActive ? size * 1.6 : size * 1.25
  const halo = ctx.createRadialGradient(0, 0, size * 0.3, 0, 0, glowR)
  halo.addColorStop(0, isActive ? 'rgba(255,160,50,0.4)' : 'rgba(200,120,40,0.2)')
  halo.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.beginPath(); ctx.arc(0, 0, glowR, 0, Math.PI * 2)
  ctx.fillStyle = halo; ctx.fill()

  // ── Rock body path ──
  function rockPath() {
    ctx.beginPath()
    for (let i = 0; i < nPts; i++) {
      const a = (i / nPts) * Math.PI * 2 - Math.PI / 2
      const r = size * radii[i]
      i === 0 ? ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r)
              : ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r)
    }
    ctx.closePath()
  }

  // Fill
  const lc = seed === 0 ? '#9a9590' : seed === 1 ? '#9a7855' : '#787070'
  const mc = seed === 0 ? '#555050' : seed === 1 ? '#6a4830' : '#424040'
  const dc = seed === 0 ? '#2a2520' : seed === 1 ? '#2e1a0e' : '#1a1818'
  const rg = ctx.createRadialGradient(-size*0.28, -size*0.32, size*0.05, 0, 0, size)
  rg.addColorStop(0,   isActive ? '#c08050' : lc)
  rg.addColorStop(0.5, isActive ? '#7a4020' : mc)
  rg.addColorStop(1,   dc)
  rockPath(); ctx.fillStyle = rg; ctx.fill()

  // Rim highlight
  ctx.save(); rockPath(); ctx.clip()
  const rim = ctx.createLinearGradient(-size, -size, size*0.3, size*0.3)
  rim.addColorStop(0,   'rgba(255,255,255,0.2)')
  rim.addColorStop(0.5, 'rgba(255,255,255,0)')
  rockPath(); ctx.fillStyle = rim; ctx.fill()
  ctx.restore()

  // Outline
  rockPath()
  ctx.strokeStyle = isActive ? 'rgba(255,185,70,0.9)' : 'rgba(160,140,120,0.45)'
  ctx.lineWidth = 1.2; ctx.stroke()

  // ── Craters ──
  ctx.save(); rockPath(); ctx.clip()
  const craterCount = 2 + (id.charCodeAt(1) % 3)
  const cdefs = [
    { ox: -0.28, oy: 0.12,  r: 0.22 },
    { ox:  0.30, oy: -0.26, r: 0.17 },
    { ox: -0.06, oy: -0.38, r: 0.12 },
    { ox:  0.18, oy: 0.33,  r: 0.14 },
  ]
  for (let c = 0; c < craterCount; c++) {
    const { ox, oy, r } = cdefs[c % cdefs.length]
    const cx = ox * size, cy = oy * size, cr = r * size
    // dark rim
    ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = cr * 0.65; ctx.stroke()
    // light arc
    ctx.beginPath(); ctx.arc(cx - cr*0.15, cy - cr*0.15, cr*0.7, Math.PI, Math.PI*1.5)
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = cr*0.35; ctx.stroke()
    // inner fill
    ctx.beginPath(); ctx.arc(cx, cy, cr * 0.45, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0,0,0,0.32)'; ctx.fill()
  }
  ctx.restore()

  // Active sparks
  if (isActive) {
    for (let s = 0; s < 5; s++) {
      const a = (time * 2.5 + s * (Math.PI * 2 / 5)) % (Math.PI * 2)
      const d = size + 5 + Math.sin(time * 6 + s) * 3
      ctx.beginPath(); ctx.arc(Math.cos(a)*d, Math.sin(a)*d, 1.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,220,80,${0.5 + Math.sin(time*5+s)*0.3})`; ctx.fill()
    }
  }

  ctx.restore()
}

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number>(0)
  useParticles()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = () => {
      const time = performance.now() / 1000
      const { enemies, activeEnemyId, particles, isPaused } = useGameStore.getState()

      // ถ้าเกมหยุดอยู่ ให้หยุดการอัปเดตและวาดภาพเคลื่อนไหว
      if (isPaused) { animRef.current = requestAnimationFrame(render); return; }

      ctx.fillStyle = '#050810'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Nebulas
      NEBULAS.forEach(({ x, y, rx, ry, color }) => {
        const g = ctx.createRadialGradient(x, y*rx/ry, 0, x, y*rx/ry, rx)
        g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.save(); ctx.scale(1, ry/rx)
        ctx.beginPath(); ctx.arc(x, y*rx/ry, rx, 0, Math.PI*2)
        ctx.fillStyle = g; ctx.fill(); ctx.restore()
      })

      // Stars
      STARS.forEach(({ x, y, r, brightness, twinkleSpeed, twinkleOffset }) => {
        const a = Math.max(0.05, brightness + Math.sin(time*twinkleSpeed+twinkleOffset)*0.12)
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2)
        ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fill()
      })

      // Shooting stars
      spawnShootingStar(time)
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i]
        s.x += s.vx; s.y += s.vy; s.life -= 0.022
        if (s.life <= 0) { shootingStars.splice(i, 1); continue }
        const a = s.life * 0.9
        const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx*(s.len/7), s.y - s.vy*(s.len/7))
        g.addColorStop(0,   `rgba(255,255,255,${a})`)
        g.addColorStop(0.4, `rgba(180,210,255,${a*0.5})`)
        g.addColorStop(1,   'rgba(255,255,255,0)')
        ctx.beginPath(); ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x - s.vx*(s.len/7), s.y - s.vy*(s.len/7))
        ctx.strokeStyle = g; ctx.lineWidth = 1.8; ctx.stroke()
        ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, Math.PI*2)
        ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fill()
      }

      // Enemies
      enemies.forEach((enemy) => {
        const isActive = enemy.id === activeEnemyId
        const typed = enemy.typed.length
        const remaining = enemy.word.slice(typed)
        const doneText   = enemy.word.slice(0, typed)

        drawAsteroid(ctx, enemy.x, enemy.y, isActive, time, enemy.id)

        const wordY = enemy.y + 34
        ctx.font = 'bold 13px "Share Tech Mono", monospace'
        ctx.textAlign = 'center'
        const tw = ctx.measureText(enemy.word).width

        ctx.fillStyle = 'rgba(0,0,0,0.65)'
        ctx.beginPath()
        ctx.roundRect(enemy.x - tw/2 - 6, wordY - 13, tw + 12, 18, 4)
        ctx.fill()

        if (doneText) {
          const dw = ctx.measureText(doneText).width
          ctx.textAlign = 'left'
          ctx.fillStyle = '#34d399'
          ctx.fillText(doneText, enemy.x - tw/2, wordY)
          ctx.fillStyle = isActive ? '#fde68a' : '#e2e8f0'
          ctx.fillText(remaining, enemy.x - tw/2 + dw, wordY)
        } else {
          ctx.fillStyle = isActive ? '#fde68a' : '#e2e8f0'
          ctx.textAlign = 'center'
          ctx.fillText(remaining, enemy.x, wordY)
        }
      })

      // Crosshair
      if (activeEnemyId) {
        const t = enemies.find(e => e.id === activeEnemyId)
        if (t) {
          const pulse = 0.4 + Math.sin(time * 6) * 0.2
          ctx.strokeStyle = `rgba(253,230,138,${pulse})`
          ctx.lineWidth = 1; ctx.setLineDash([4, 4])
          ctx.beginPath(); ctx.arc(t.x, t.y, 26, 0, Math.PI*2); ctx.stroke()
          ctx.setLineDash([])
          const b = 8, d = 26
          ;[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx, sy]) => {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(253,230,138,0.9)`; ctx.lineWidth = 1.5
            ctx.moveTo(t.x+sx*d, t.y+sy*(d-b))
            ctx.lineTo(t.x+sx*d, t.y+sy*d)
            ctx.lineTo(t.x+sx*(d-b), t.y+sy*d)
            ctx.stroke()
          })
        }
      }

      drawParticles(ctx, particles)
      animRef.current = requestAnimationFrame(render)
    }

    animRef.current = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="block mx-auto"
      style={{ background: 'transparent' }}
    />
  )
}