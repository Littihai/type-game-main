import type { Enemy } from '../store/gameStore'
import type { Language, Difficulty } from '../store/gameStore'

let counter = 0
let wordData: Record<Language, Record<Difficulty, string[]>> | null = null

// Fallback word pools in case JSON loading fails
const fallbackWordPool: Record<Language, Record<Difficulty, string[]>> = {
  english: {
    easy: ['cat','dog','run','fly','win','hit','sky','gun','ray','sun','fire','wave','dash','jump','bomb'],
    medium: ['laser','pixel','score','speed','enemy','space','blast','power','shield','turret','battle'],
    hard: ['javascript','typescript','spaceship','explosion','destroyer','intercept','projectile']
  },
  thai: {
    easy: ['ไก่','ปลา','นก','แมว','วิ่ง','ชนะ','ตี','บิน','ยิง','อยู่','ให้','ได้','ขึ้น','ลง','ไป'],
    medium: ['ทะเล','ดวงดาว','ยานอวกาศ','โจมตี','ป้องกัน','รวมกัน','ทำลาย','สกัดกั้น','เร่งความเร็ว','ระเบิด','พลัง'],
    hard: ['จาวาสคริปต์','ไทยสคริปต์','ตัวประกอบ','การระเบิด','ผู้ทำลาย','การสกัดกั้น','ความเร่ง','การรวมกัน','กลุ่มดาว']
  }
}

async function loadWordData() {
  if (wordData) return wordData
  try {
    const response = await fetch('/words.json')
    wordData = await response.json()
    return wordData
  } catch (e) {
    console.error('Failed to load words.json, using fallback:', e)
    wordData = fallbackWordPool
    return wordData
  }
}

function getWordPool(wave: number, language: Language, difficulty: Difficulty): string[] {
  const data = wordData || fallbackWordPool
  // Could use wave to pick harder words over time, e.g.:
  const effectiveDifficulty = wave > 5 ? 'hard' : wave > 2 ? 'medium' : difficulty
  const words = data[language]?.[effectiveDifficulty] || []
  return words.length > 0 ? words : fallbackWordPool['english']['easy']
}

export function getWaveConfig(wave: number) {
  return {
    spawnInterval: Math.max(2500 - wave * 200, 600),
    maxEnemies:    Math.min(3 + wave, 12),
    speed:         0.4 + wave * 0.08,
    killsToNext:   8 + wave * 2,
  }
}

export function createEnemy(wave: number, language: Language, difficulty: Difficulty): Enemy {
  const config = getWaveConfig(wave)
  const id = `enemy_${++counter}_${Date.now()}`
  const wordPool = getWordPool(wave, language, difficulty)
  const word = wordPool[Math.floor(Math.random() * wordPool.length)]
  const x = Math.random() * 660 + 70

  return { id, x, y: 0, word, typed: '', speed: config.speed }
}

// Initialize word data on module load
loadWordData().catch(e => console.error('Error loading word data:', e))
