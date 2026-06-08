import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { updateParticles as updateParticlesLogic } from '../game/particles'

export function useParticles() {
  const { particles, updateParticles, status } = useGameStore()

  useEffect(() => {
    if (status !== 'playing') return

    const frameRef = { current: 0 }

    const loop = () => {
      frameRef.current = requestAnimationFrame(() => {
        const updated = updateParticlesLogic(particles)
        updateParticles(updated)
        loop()
      })
    }

    loop()

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [status, particles, updateParticles])
}
