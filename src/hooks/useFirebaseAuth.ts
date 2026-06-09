import { useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { auth } from '../lib/firebase'

interface FirebaseAuthState {
  user: User | null
  loading: boolean
  error: string | null
  signInWithGoogle: () => Promise<void>
  signOutUser: () => Promise<void>
}

export function useFirebaseAuth(): FirebaseAuthState {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(Boolean(auth))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!auth) return

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
  }, [])

  const signInWithGoogle = async () => {
    if (!auth) {
      setError('Firebase config is missing')
      return
    }

    try {
      setError(null)
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign in failed')
    }
  }

  const signOutUser = async () => {
    if (!auth) return
    await signOut(auth)
  }

  return { user, loading, error, signInWithGoogle, signOutUser }
}
