import { useGameStore } from '../store/gameStore'

export function Settings() {
  const { setStatus, toggleSoundEffects, toggleBackgroundMusic, settings } = useGameStore()

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8"
         style={{ background: '#0a0a1a' }}>

      {/* title */}
      <div className="text-center">
        <h2 className="text-5xl font-black text-white tracking-tight">SETTINGS</h2>
      </div>

      {/* settings */}
      <div className="flex flex-col gap-6 items-center">

        {/* sound effects */}
        <div className="flex items-center gap-6">
          <label className="text-gray-300 text-sm tracking-widest min-w-48">
            Sound Effects
          </label>
          <button
            onClick={toggleSoundEffects}
            className={`w-16 h-10 rounded-full flex items-center transition-colors ${
              settings.soundEffects
                ? 'bg-green-500'
                : 'bg-gray-500'
            }`}
          >
            <div className={`w-8 h-8 rounded-full bg-white transition-transform ${
              settings.soundEffects ? 'translate-x-8' : 'translate-x-1'
            }`} />
          </button>
          <span className="text-gray-400 text-sm w-12 text-center">
            {settings.soundEffects ? 'ON' : 'OFF'}
          </span>
        </div>

        {/* background music */}
        <div className="flex items-center gap-6">
          <label className="text-gray-300 text-sm tracking-widest min-w-48">
            Background Music
          </label>
          <button
            onClick={toggleBackgroundMusic}
            className={`w-16 h-10 rounded-full flex items-center transition-colors ${
              settings.backgroundMusic
                ? 'bg-green-500'
                : 'bg-gray-500'
            }`}
          >
            <div className={`w-8 h-8 rounded-full bg-white transition-transform ${
              settings.backgroundMusic ? 'translate-x-8' : 'translate-x-1'
            }`} />
          </button>
          <span className="text-gray-400 text-sm w-12 text-center">
            {settings.backgroundMusic ? 'ON' : 'OFF'}
          </span>
        </div>

      </div>

      {/* back button */}
      <div className="mt-8">
        <button
          onClick={() => setStatus('menu')}
          className="text-orange-400 hover:text-orange-300 text-lg tracking-widest transition-colors"
        >
          back
        </button>
      </div>

    </div>
  )
}
