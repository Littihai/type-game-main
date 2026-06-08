// import { useEffect, useState } from 'react'
import { useEffect } from 'react'
import { useGameStore } from './store/gameStore'
import { useKeyboard } from './hooks/useKeyboard'
import { useGameLoop } from './hooks/useGameLoop'
import { soundManager } from './game/soundManager'
import { GameCanvas } from './components/GameCanvas'
import { HUD } from './components/HUD'
import { Menu } from './components/Menu'
import { GameOver } from './components/GameOver'
import { WaveClear } from './components/WaveClear'
import { Settings } from './components/Settings'

function Game() {
  useKeyboard()
  useGameLoop()
  const { status, settings } = useGameStore()

  // Background music control
  useEffect(() => {
    if (status === 'playing') {
      soundManager.startBackgroundMusic()
    } else {
      soundManager.stopBackgroundMusic()
    }
  }, [status])

  // Settings control
  useEffect(() => {
    soundManager.setSoundEffectsEnabled(settings.soundEffects)
    soundManager.setBackgroundMusicEnabled(settings.backgroundMusic)
  }, [settings])

  return (
    <div className="relative w-[800px] h-[600px] mx-auto overflow-hidden"
         style={{ background: '#0a0a1a' }}>
      <GameCanvas />
      {status === 'playing'   && <HUD />}
      {status === 'waveclear' && <WaveClear />}
      {status === 'menu'      && <div className="absolute inset-0"><Menu /></div>}
      {status === 'settings'  && <div className="absolute inset-0"><Settings /></div>}
      {status === 'gameover'  && <div className="absolute inset-0"><GameOver /></div>}
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center"
         style={{ background: '#05050f' }}>
      <Game />
    </div>
  )
}