export interface Particle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

let particleCounter = 0

export function createParticles(x: number, y: number, count: number = 8, color: string = '#ff4444'): Particle[] {
  const particles: Particle[] = []
  const angleStep = (Math.PI * 2) / count

  for (let i = 0; i < count; i++) {
    const angle = angleStep * i
    const speed = 2 + Math.random() * 2
    const id = `particle-${particleCounter++}`

    particles.push({
      id,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 1,
      color,
      size: 3 + Math.random() * 2,
    })
  }

  return particles
}

export function updateParticles(particles: Particle[], deltaTime: number = 0.016): Particle[] {
  return particles
    .map((p) => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      vy: p.vy + 0.1, // gravity
      life: p.life - deltaTime * 0.6,
      size: p.size * (p.life / p.maxLife), // shrink as it dies
    }))
    .filter((p) => p.life > 0)
}

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  particles.forEach((p) => {
    ctx.save()
    ctx.globalAlpha = p.life
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  })
}
