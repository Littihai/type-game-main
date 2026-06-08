import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { createEnemy, getWaveConfig } from '../game/entities'

export function useGameLoop() {
  const { status } = useGameStore()
  const frameRef = useRef<number>(0)
  const lastSpawnRef = useRef<number>(-Infinity)

  useEffect(() => {
    if (status !== 'playing') return

    const loop = (timestamp: number) => {
      const store = useGameStore.getState()
      const config = getWaveConfig(store.wave)

      // spawn enemy ถ้าไม่เกิน maxEnemies
      if (
        timestamp - lastSpawnRef.current > config.spawnInterval &&
        store.enemies.length < config.maxEnemies
      ) {
        store.addEnemy(createEnemy(store.wave, store.language, store.difficulty))
        lastSpawnRef.current = timestamp
      }

      // เลื่อน enemy ลงมา
      store.enemies.forEach((enemy) => {
        const newY = enemy.y + enemy.speed
        if (newY > 620) {
          store.removeEnemy(enemy.id)
          store.loseLife()
        } else {
          useGameStore.setState((s) => ({
            enemies: s.enemies.map((e) =>
              e.id === enemy.id ? { ...e, y: newY } : e
            ),
          }))
        }
      })

      if (store.lives <= 0) {
        store.setStatus('gameover')
        return
      }

      frameRef.current = requestAnimationFrame(loop)
    }

    frameRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameRef.current)
  }, [status])
}