import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { drawParticles } from '../game/particles'
import { useParticles } from '../hooks/useParticles'

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { enemies, activeEnemyId, particles } = useGameStore()
  useParticles()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // เคลียร์หน้าจอ
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // วาด starfield background
    ctx.fillStyle = '#0a0a1a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // วาดดาว
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    for (let i = 0; i < 80; i++) {
      const x = ((i * 137) % canvas.width)
      const y = ((i * 97) % canvas.height)
      ctx.fillRect(x, y, 1, 1)
    }

    // วาด enemies
    enemies.forEach((enemy) => {
      const isActive = enemy.id === activeEnemyId
      const typed = enemy.typed.length
      const remaining = enemy.word.slice(typed)
      const doneText = enemy.word.slice(0, typed)

      // วาดยาน (สามเหลี่ยม)
      ctx.save()
      ctx.translate(enemy.x, enemy.y)
      ctx.beginPath()
      ctx.moveTo(0, -14)
      ctx.lineTo(10, 8)
      ctx.lineTo(-10, 8)
      ctx.closePath()
      ctx.fillStyle = isActive ? '#ff6b35' : '#e63946'
      ctx.fill()
      ctx.strokeStyle = isActive ? '#ffd166' : '#ff9999'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.restore()

      // วาดคำใต้ยาน
      const wordX = enemy.x
      const wordY = enemy.y + 26
      ctx.font = 'bold 13px monospace'
      ctx.textAlign = 'center'

      // ส่วนที่พิมพ์แล้ว (สีเขียว)
      if (doneText) {
        const doneWidth = ctx.measureText(doneText).width
        const totalWidth = ctx.measureText(enemy.word).width
        ctx.fillStyle = '#06d6a0'
        ctx.fillText(doneText, wordX - (totalWidth - doneWidth) / 2, wordY)
      }

      // ส่วนที่ยังไม่ได้พิมพ์ (ขาว/เหลือง)
      ctx.fillStyle = isActive ? '#ffd166' : '#ffffff'
      const doneWidth2 = doneText
        ? ctx.measureText(doneText).width : 0
      const totalWidth2 = ctx.measureText(enemy.word).width
      ctx.textAlign = 'left'
      ctx.fillText(
        remaining,
        wordX - totalWidth2 / 2 + doneWidth2,
        wordY
      )
    })

    // วาด crosshair ที่ยาน active
    if (activeEnemyId) {
      const target = enemies.find((e) => e.id === activeEnemyId)
      if (target) {
        ctx.strokeStyle = 'rgba(255, 209, 102, 0.5)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(target.x, target.y, 20, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    // วาด particles (bullet trails)
    drawParticles(ctx, particles)

  }, [enemies, activeEnemyId, particles])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="block mx-auto"
      style={{ background: '#0a0a1a' }}
    />
  )
}