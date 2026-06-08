import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { soundManager } from '../game/soundManager'
import { createParticles } from '../game/particles'

export function useKeyboard() {
  const { 
    enemies, activeEnemyId, setActiveEnemy, updateEnemyTyped, removeEnemy, 
    addScore, addKill, status, recordChar, recordWord, increaseMultiplier, 
    resetMultiplier, clearAllEnemies, multiplier
  } = useGameStore()
  const clearCountRef = useRef(0)

  useEffect(() => {
    if (status !== 'playing') return

    const handleKey = (e: KeyboardEvent) => {
      // Handle ENTER for clearing all enemies (max 3 times)
      if (e.key === 'Enter') {
        if (clearCountRef.current < 3) {
          clearAllEnemies()
          clearCountRef.current += 1
          soundManager.playExplosionSound()
        }
        return
      }

      const char = e.key.length === 1 ? e.key.toLowerCase() : null
      if (!char) return

      if (!activeEnemyId) {
        const match = enemies.find((en) => en.word[0].toLowerCase() === char)
        if (match) {
          setActiveEnemy(match.id)
          updateEnemyTyped(match.id, char)
          recordChar(true)
          increaseMultiplier()
          soundManager.playCorrectSound()
        } else {
          recordChar(false)
          resetMultiplier()
          soundManager.playErrorSound()
        }
        return
      }

      const active = enemies.find((en) => en.id === activeEnemyId)
      if (!active) { 
        setActiveEnemy(null)
        return
      }

      const next = active.typed + char
      const expected = active.word.slice(0, next.length).toLowerCase()

      if (next === expected) {
        recordChar(true)
        increaseMultiplier()
        soundManager.playCorrectSound()
        
        // Create bullet trail particles
        const particles = createParticles(active.x, active.y, 6, '#ffff00')
        useGameStore.getState().addParticles(particles)
        
        if (next.length === active.word.length) {
          removeEnemy(active.id)
          recordWord()
          addScore(active.word.length * 10, multiplier)
          addKill()
          soundManager.playExplosionSound()
          
          // Create explosion particles
          const explosionParticles = createParticles(active.x, active.y, 12, '#ff6b35')
          useGameStore.getState().addParticles(explosionParticles)
        } else {
          updateEnemyTyped(active.id, next)
        }
      } else {
        recordChar(false)
        resetMultiplier()
        soundManager.playErrorSound()
        updateEnemyTyped(active.id, '')
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [status, enemies, activeEnemyId, multiplier])
}