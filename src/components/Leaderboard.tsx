import { useEffect, useState } from 'react'
import { hasFirebaseConfig } from '../lib/firebase'
import { loadTopLeaderboard, type LeaderboardEntry } from '../services/leaderboardService'

interface LeaderboardProps {
  enabled: boolean
}

export function Leaderboard({ enabled }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const loading = hasFirebaseConfig && enabled && !loaded && !error

  useEffect(() => {
    if (!hasFirebaseConfig || !enabled) return

    loadTopLeaderboard()
      .then(setEntries)
      .catch((err) => setError(err instanceof Error ? err.message : 'Leaderboard unavailable'))
      .finally(() => setLoaded(true))
  }, [enabled])

  return (
    <div className="absolute bottom-4 left-4 z-10 w-72 rounded border border-white/10 bg-black/35 p-3 text-left backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs font-bold tracking-[0.25em] text-orange-300">TOP 10</div>
        {loading && <div className="text-xs text-gray-500">loading</div>}
      </div>

      <div className="flex flex-col gap-1">
        {entries.map((entry, index) => (
          <div key={entry.uid} className="grid grid-cols-[1.5rem_1fr_auto] items-center gap-2 text-xs">
            <div className="text-gray-500">{index + 1}</div>
            <div className="truncate text-gray-200">{entry.displayName}</div>
            <div className="font-bold tabular-nums text-yellow-300">{entry.score.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {!loading && entries.length === 0 && (
        <div className="text-xs text-gray-500">
          {enabled ? 'no scores yet' : 'login to view leaderboard'}
        </div>
      )}
      {error && <div className="mt-2 text-xs text-red-300">{error}</div>}
    </div>
  )
}
