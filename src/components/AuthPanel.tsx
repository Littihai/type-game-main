import type { User } from 'firebase/auth'
import { hasFirebaseConfig } from '../lib/firebase'

interface AuthPanelProps {
  user: User | null
  loading: boolean
  error: string | null
  onSignIn: () => void
  onSignOut: () => void
}

export function AuthPanel({ user, loading, error, onSignIn, onSignOut }: AuthPanelProps) {
  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2 text-right">
      {user ? (
        <div className="flex items-center gap-3 rounded border border-white/10 bg-black/30 px-3 py-2 backdrop-blur">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt=""
              className="h-8 w-8 rounded-full border border-white/20"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="min-w-0">
            <div className="max-w-32 truncate text-sm font-bold text-white">{user.displayName || 'Player'}</div>
            <button
              onClick={onSignOut}
              className="text-xs tracking-wide text-gray-500 transition-colors hover:text-gray-300"
            >
              sign out
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={onSignIn}
          disabled={loading || !hasFirebaseConfig}
          className="rounded border border-white/10 bg-white px-4 py-2 text-sm font-bold tracking-wide text-slate-950 transition-colors hover:bg-orange-200 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-300"
        >
          Google Login
        </button>
      )}

      {!hasFirebaseConfig && (
        <div className="max-w-56 text-xs text-yellow-300">add Firebase env vars to enable login</div>
      )}
      {error && <div className="max-w-56 text-xs text-red-300">{error}</div>}
    </div>
  )
}
