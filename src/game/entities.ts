import type { Enemy } from '../store/gameStore'
import type { Language, Difficulty } from '../store/gameStore'

let counter = 0
let wordData: Record<Language, Record<Difficulty, string[]>> | null = null

// Fallback word pools in case JSON loading fails
const fallbackWordPool: Record<Language, Record<Difficulty, string[]>> = {
  english: {
    easy: [
      'cat','dog','run','fly','win','hit','sky','gun','ray','sun',
      'fire','wave','dash','jump','bomb','tree','bird','fish','star','moon',
      'rock','sand','wind','rain','ship','tank','base','wall','door','road',
      'fast','slow','cold','warm','blue','red','green','gold','iron','wood',
      'king','hero','mage','wolf','bear','frog','duck','lion','deer','frog',
      'coin','gem','map','key','ring','rope','boat','lamp','cake','milk'
    ],
    medium: [
      'laser','pixel','score','speed','enemy','space','blast','power','shield','turret',
      'battle','rocket','planet','galaxy','engine','weapon','target','damage','repair','energy',
      'hunter','wizard','dragon','castle','mission','combat','victory','defense','capture','rescue',
      'network','system','server','client','window','button','signal','packet','screen','memory',
      'monitor','project','upgrade','storage','scanner','control','station','factory','machine','vehicle'
    ],
    hard: [
      'javascript','typescript','spaceship','explosion','destroyer','intercept','projectile',
      'application','development','programming','architecture','configuration','optimization',
      'communication','transmission','integration','authentication','authorization','synchronization',
      'multiplayer','cybersecurity','infrastructure','microservice','implementation','deployment',
      'virtualization','acceleration','navigation','reconstruction','identification','transportation',
      'compatibility','performance','engineering','intelligence','observation','classification'
    ]
  },

  thai: {
    easy: [
      'ไก่','ปลา','นก','แมว','วิ่ง','ชนะ','ตี','บิน','ยิง','อยู่',
      'ให้','ได้','ขึ้น','ลง','ไป','มา','กิน','นอน','เล่น','รัก',
      'บ้าน','รถ','ไฟ','น้ำ','ลม','ดิน','ฟ้า','ดาว','เดือน','ฝน',
      'ต้นไม้','ดอกไม้','เด็ก','เพื่อน','พ่อ','แม่','พี่','น้อง','ครู','หมอ',
      'แดง','เขียว','น้ำเงิน','เหลือง','ขาว','ดำ','ทอง','เงิน','กลม','ยาว',
      'สุข','ทุกข์','ดี','ง่าย','เร็ว','ช้า','สูง','ต่ำ','ร้อน','เย็น'
    ],
    medium: [
      'ทะเล','ดวงดาว','ยานอวกาศ','โจมตี','ป้องกัน','รวมกัน','ทำลาย','สกัดกั้น',
      'เร่งความเร็ว','ระเบิด','พลัง','นักรบ','ผู้พิทักษ์','นักล่า','ปราสาท','ภารกิจ',
      'ชัยชนะ','อาณาจักร','อุปกรณ์','เครื่องยนต์','พลังงาน','เป้าหมาย','ศัตรู','กองทัพ',
      'คอมพิวเตอร์','เครือข่าย','โปรแกรม','ระบบงาน','ฐานข้อมูล','เซิร์ฟเวอร์','หน้าจอ',
      'หน่วยความจำ','โครงการ','เครื่องจักร','สถานีอวกาศ','ยานรบ','เครื่องมือ','การควบคุม'
    ],
    hard: [
      'จาวาสคริปต์','ไทยสคริปต์','ตัวประกอบ','การระเบิด','ผู้ทำลาย','การสกัดกั้น',
      'ความเร่ง','การรวมกัน','กลุ่มดาว','การพัฒนา','การออกแบบ','สถาปัตยกรรม',
      'การเชื่อมต่อ','การประมวลผล','ปัญญาประดิษฐ์','โครงสร้างพื้นฐาน','การตรวจสอบ',
      'การปรับแต่ง','การวิเคราะห์','การสื่อสาร','การรับรองตัวตน','ความปลอดภัยไซเบอร์',
      'การจำแนกประเภท','การบูรณาการ','การติดตั้งระบบ','การจำลองเสมือน','ประสิทธิภาพสูง',
      'วิศวกรรมซอฟต์แวร์','การเพิ่มประสิทธิภาพ','ระบบอัตโนมัติ','การขนส่งอัจฉริยะ' 
    ]
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
