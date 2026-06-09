import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db } from '../lib/firebase'
import type { Difficulty, Language } from '../store/gameStore'

export interface LeaderboardEntry {
  uid: string
  displayName: string
  photoURL: string | null
  score: number
  wave: number
  accuracy: number
  words: number
  language: Language
  difficulty: Difficulty
}

export interface ScorePayload {
  score: number
  wave: number
  accuracy: number
  words: number
  language: Language
  difficulty: Difficulty
}

const leaderboardCollection = 'leaderboard'

export async function saveBestScore(user: User, payload: ScorePayload): Promise<boolean> {
  if (!db || payload.score <= 0) return false

  const playerRef = doc(db, leaderboardCollection, user.uid)
  const snapshot = await getDoc(playerRef)
  const previousScore = snapshot.exists() ? Number(snapshot.data().score ?? 0) : 0

  if (payload.score <= previousScore) return false

  await setDoc(
    playerRef,
    {
      uid: user.uid,
      displayName: user.displayName || 'Anonymous Pilot',
      photoURL: user.photoURL || null,
      score: Math.round(payload.score),
      wave: Math.round(payload.wave),
      accuracy: Math.round(payload.accuracy),
      words: Math.round(payload.words),
      language: payload.language,
      difficulty: payload.difficulty,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )

  return true
}

export async function loadTopLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!db) return []

  const leaderboardQuery = query(
    collection(db, leaderboardCollection),
    orderBy('score', 'desc'),
    limit(10),
  )
  const snapshot = await getDocs(leaderboardQuery)

  return snapshot.docs.map((entry) => {
    const data = entry.data()
    return {
      uid: entry.id,
      displayName: String(data.displayName || 'Anonymous Pilot'),
      photoURL: typeof data.photoURL === 'string' ? data.photoURL : null,
      score: Number(data.score ?? 0),
      wave: Number(data.wave ?? 1),
      accuracy: Number(data.accuracy ?? 0),
      words: Number(data.words ?? 0),
      language: data.language === 'thai' ? 'thai' : 'english',
      difficulty: ['easy', 'medium', 'hard'].includes(data.difficulty) ? data.difficulty : 'easy',
    }
  })
}
