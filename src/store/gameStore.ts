import { create } from 'zustand'
import type { Particle } from '../game/particles'

export type GameStatus = 'menu' | 'settings' | 'playing' | 'waveclear' | 'gameover'
export type Language = 'thai' | 'english'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface GameSettings {
  soundEffects: boolean
  backgroundMusic: boolean
}

export interface Enemy {
  id: string
  x: number
  y: number
  word: string
  typed: string
  speed: number
}

export interface GameStats {
  totalChars: number
  correctChars: number
  totalWords: number
  errorCount: number
  accuracy: number
  multiplier: number
}

export interface GameState {
  status: GameStatus
  score: number
  lives: number
  wave: number
  kills: number
  killsToNext: number
  enemies: Enemy[]
  activeEnemyId: string | null
  language: Language
  difficulty: Difficulty
  multiplier: number
  stats: GameStats
  settings: GameSettings
  particles: Particle[]
  isGodMode: boolean // 🦾 เก็บสถานะ เปิด/ปิด โหมดเทพ
  setStatus: (s: GameStatus) => void
  setActiveEnemy: (id: string | null) => void
  setLanguage: (lang: Language) => void
  setDifficulty: (diff: Difficulty) => void
  toggleSoundEffects: () => void
  toggleBackgroundMusic: () => void
  addParticles: (p: Particle[]) => void
  updateParticles: (p: Particle[]) => void
  addEnemy: (e: Enemy) => void
  removeEnemy: (id: string) => void
  updateEnemyTyped: (id: string, typed: string) => void
  addScore: (n: number, multiplier?: number) => void
  addKill: () => void
  loseLife: () => void
  nextWave: () => void
  resetGame: () => void
  recordChar: (correct: boolean) => void
  recordWord: () => void
  increaseMultiplier: () => void
  resetMultiplier: () => void
  clearAllEnemies: () => void
  enableGodModeAutoType: (onToggle: (msg: string) => void) => () => void // 🦾 ฟังก์ชันเริ่มต้นระบบพิมพ์เทพ
}

export const useGameStore = create<GameState>((set, get) => ({
  status: 'menu',
  score: 0,
  lives: 3,
  wave: 1,
  kills: 0,
  killsToNext: 10,
  enemies: [],
  activeEnemyId: null,
  language: 'english',
  difficulty: 'easy',
  multiplier: 1,
  stats: {
    totalChars: 0,
    correctChars: 0,
    totalWords: 0,
    errorCount: 0,
    accuracy: 100,
    multiplier: 1,
  },
  settings: {
    soundEffects: true,
    backgroundMusic: true,
  },
  particles: [],
  isGodMode: false, // เริ่มต้นเกมโหมดเทพจะเป็นปิดเสมอ

  setStatus: (s) => set({ status: s }),
  setActiveEnemy: (id) => set({ activeEnemyId: id }),
  setLanguage: (lang) => set({ language: lang }),
  setDifficulty: (diff) => set({ difficulty: diff }),
  toggleSoundEffects: () => set((state) => ({
    settings: { ...state.settings, soundEffects: !state.settings.soundEffects }
  })),
  toggleBackgroundMusic: () => set((state) => ({
    settings: { ...state.settings, backgroundMusic: !state.settings.backgroundMusic }
  })),
  addParticles: (p) => set((state) => ({ particles: [...state.particles, ...p] })),
  updateParticles: (p) => set({ particles: p }),
  addEnemy: (e) => set((state) => ({ enemies: [...state.enemies, e] })),
  removeEnemy: (id) => set((state) => ({
    enemies: state.enemies.filter((e) => e.id !== id),
    activeEnemyId: state.activeEnemyId === id ? null : state.activeEnemyId,
  })),
  updateEnemyTyped: (id, typed) => set((state) => ({
    enemies: state.enemies.map((e) => e.id === id ? { ...e, typed } : e),
  })),
  addScore: (n, mult) => {
    const multiplier = mult || get().multiplier
    set((state) => ({ score: state.score + n * multiplier }))
  },
  recordChar: (correct) => {
    set((state) => {
      const newCorrect = correct ? state.stats.correctChars + 1 : state.stats.correctChars
      const newTotal = state.stats.totalChars + 1
      const accuracy = Math.round((newCorrect / newTotal) * 100)
      return {
        stats: {
          ...state.stats,
          totalChars: newTotal,
          correctChars: newCorrect,
          accuracy,
          errorCount: correct ? state.stats.errorCount : state.stats.errorCount + 1,
        }
      }
    })
  },
  recordWord: () => {
    set((state) => ({
      stats: {
        ...state.stats,
        totalWords: state.stats.totalWords + 1,
      }
    }))
  },
  increaseMultiplier: () => {
    set((state) => {
      const newMult = Math.min(state.multiplier + 0.1, 5)
      return {
        multiplier: newMult,
        stats: { ...state.stats, multiplier: newMult }
      }
    })
  },
  resetMultiplier: () => {
    set({ multiplier: 1, stats: { ...get().stats, multiplier: 1 } })
  },
  clearAllEnemies: () => {
    set({
      enemies: [],
      activeEnemyId: null,
    })
  },
  addKill: () => {
    const { kills, killsToNext } = get()
    const newKills = kills + 1
    if (newKills >= killsToNext) {
      set({ status: 'waveclear', kills: 0 })
    } else {
      set({ kills: newKills })
    }
  },
  loseLife: () => set((state) => ({ lives: state.lives - 1 })),
  nextWave: () => {
    const { wave } = get()
    const next = wave + 1
    set({
      wave: next,
      kills: 0,
      killsToNext: 8 + next * 2,
      enemies: [],
      activeEnemyId: null,
      status: 'playing',
      multiplier: 1,
    })
  },
  resetGame: () => set({
    score: 0, lives: 3, wave: 1,
    kills: 0, killsToNext: 10,
    enemies: [], activeEnemyId: null, status: 'playing',
    multiplier: 1,
    stats: {
      totalChars: 0,
      correctChars: 0,
      totalWords: 0,
      errorCount: 0,
      accuracy: 100,
      multiplier: 1,
    }
  }),

  // 🔥 ฟังก์ชันควบคุมโหมดเทพดักจับปุ่มพิมพ์และสั่งยิงคำอัตโนมัติ
  enableGodModeAutoType: (onToggle) => {
    // 1. วนลูปเช็คเพื่อพิมพ์ตัวอักษรถัดไปอัตโนมัติ
    const autoTypeInterval = setInterval(() => {
      const { isGodMode, status, enemies, activeEnemyId, recordChar, increaseMultiplier, updateEnemyTyped, recordWord, addScore, addKill, removeEnemy, setActiveEnemy } = get()

      // ถ้าไม่ได้เปิดโหมดเทพ หรือไม่ได้อยู่ในหน้าเล่นเกม หรือไม่มีศัตรูโผล่มา ให้ข้ามลูปนี้ไปก่อน
      if (!isGodMode || status !== 'playing' || enemies.length === 0) return

      // ล็อกเป้าศัตรู: ถ้ามีตัวที่กำลังพิมพ์ค้างไว้ให้เลือกตัวนั้น ถ้าไม่มีให้เอาตัวแรกสุดในแถว
      let targetEnemy = enemies.find(e => e.id === activeEnemyId)
      if (!targetEnemy && enemies.length > 0) {
        targetEnemy = enemies[0]
        setActiveEnemy(targetEnemy.id)
      }

      if (!targetEnemy) return

      const currentTyped = targetEnemy.typed
      const targetWord = targetEnemy.word

      // ถ้าคำยังพิมพ์ไม่ครบ ให้จำลองการพิมพ์ตัวอักษรถัดไปทันทีอย่างแม่นยำ
      if (currentTyped.length < targetWord.length) {
        const nextChar = targetWord[currentTyped.length]
        const newTyped = currentTyped + nextChar

        recordChar(true)
        increaseMultiplier()
        updateEnemyTyped(targetEnemy.id, newTyped)

        // ถ้าพิมพ์ครบคำสมบูรณ์แล้ว ให้ทำลายศัตรูทิ้งและรับรางวัลคะแนน/Kills
        if (newTyped === targetWord) {
          recordWord()
          addScore(targetWord.length * 10)
          addKill()
          removeEnemy(targetEnemy.id)
        }
      }
    }, 100) // ความเร็วการพิมพ์ออโต้: 100ms ต่อ 1 ตัวอักษร (ปรับลดให้เร็วสะใจขึ้นได้ที่นี่)

    // 2. ฟังก์ชันจับคีย์บอร์ดทางลัด Ctrl + Shift + M
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault()
        const currentGodMode = get().isGodMode
        const nextGodMode = !currentGodMode
        
        set({ isGodMode: nextGodMode })
        
        // ส่งข้อความกลับไปหา UI เพื่อแจ้งเตือนหน้าจอเกม
        if (nextGodMode) {
          onToggle("🦾 ระบบเทพทำงาน!")
        } else {
          onToggle("🛑 ปิดระบบเทพ")
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // คืนค่าฟังก์ชัน Cleanup สำหรับถอดถอน Interval และ Event ทิ้งเมื่อออกจากหน้าเกม
    return () => {
      clearInterval(autoTypeInterval)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }
}))