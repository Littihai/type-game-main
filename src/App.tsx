// import { useEffect, useState } from 'react'
import { useEffect, useState } from 'react' // <--- เพิ่ม useState เข้ามา
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
import { Analytics } from "@vercel/analytics/react"
function Game() {
  useKeyboard()
  useGameLoop()
  
  const { status, settings, enableGodModeAutoType } = useGameStore()
  
  // 🔔 [เพิ่มตรงนี้]: State สำหรับเก็บข้อความแจ้งเตือนโหมดเทพ
  const [notification, setNotification] = useState<string | null>(null)

  // 🔥 [เพิ่มตรงนี้]: เปิดระบบโหมดเทพ และส่ง Callback สำหรับแสดงแจ้งเตือน
  useEffect(() => {
    const onToggleGodMode = (message: string) => {
      setNotification(message)
      // ให้ข้อความแจ้งเตือนหายไปเองหลังจากผ่านไป 2 วินาที
      setTimeout(() => setNotification(null), 2000)
    }

    const cleanup = enableGodModeAutoType(onToggleGodMode)
    return () => cleanup() 
  }, [enableGodModeAutoType])

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

      {/* 🚨 [เพิ่มตรงนี้]: UI กล่องแจ้งเตือนระบบเทพ (จะแสดงตรงกลางด้านบนของจอเกม) */}
      {notification && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 
                        bg-yellow-500 text-slate-950 px-6 py-2 rounded-full font-bold shadow-lg 
                        border-2 border-white animate-bounce text-center min-w-[200px]"
             style={{ boxShadow: '0 0 20px rgba(234, 179, 8, 0.6)' }}>
          {notification}
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center"
         style={{ background: '#05050f' }}>
      <Game />
      <Analytics />
    </div>
  )
}