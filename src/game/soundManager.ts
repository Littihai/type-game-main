// Simplified approach: use native Web Audio API directly
class SoundManager {
  private audioContext: AudioContext | null = null
  private bgmGainNode: GainNode | null = null
  private bgmOscillators: OscillatorNode[] = []
  private bgmPlaying = false
  private soundEffectsEnabled = true
  private backgroundMusicEnabled = true

  private getAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  setSoundEffectsEnabled(enabled: boolean) {
    this.soundEffectsEnabled = enabled
  }

  setBackgroundMusicEnabled(enabled: boolean) {
    this.backgroundMusicEnabled = enabled
    if (!enabled && this.bgmPlaying) {
      this.stopBackgroundMusic()
    }
  }

  playCorrectSound() {
    if (!this.soundEffectsEnabled) return

    try {
      const ctx = this.getAudioContext()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(800, now)
      osc.frequency.setValueAtTime(1000, now + 0.05)
      gain.gain.setValueAtTime(0.1, now)
      gain.gain.setValueAtTime(0, now + 0.1)
      
      osc.start(now)
      osc.stop(now + 0.1)
    } catch (e) {
      console.error('Error playing sound:', e)
    }
  }

  playErrorSound() {
    if (!this.soundEffectsEnabled) return

    try {
      const ctx = this.getAudioContext()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(300, now)
      osc.frequency.setValueAtTime(200, now + 0.1)
      gain.gain.setValueAtTime(0.1, now)
      gain.gain.setValueAtTime(0, now + 0.15)
      
      osc.start(now)
      osc.stop(now + 0.15)
    } catch (e) {
      console.error('Error playing sound:', e)
    }
  }

  playExplosionSound() {
    if (!this.soundEffectsEnabled) return

    try {
      const ctx = this.getAudioContext()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(400, now)
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.3)
      gain.gain.setValueAtTime(0.2, now)
      gain.gain.setValueAtTime(0, now + 0.3)
      
      osc.start(now)
      osc.stop(now + 0.3)
    } catch (e) {
      console.error('Error playing sound:', e)
    }
  }

  playMultiplierSound() {
    if (!this.soundEffectsEnabled) return

    try {
      const ctx = this.getAudioContext()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(1200, now)
      osc.frequency.setValueAtTime(1400, now + 0.1)
      gain.gain.setValueAtTime(0.1, now)
      gain.gain.setValueAtTime(0, now + 0.15)
      
      osc.start(now)
      osc.stop(now + 0.15)
    } catch (e) {
      console.error('Error playing sound:', e)
    }
  }

  // Background music: simple chiptune-style melody loop
  startBackgroundMusic() {
    if (!this.backgroundMusicEnabled || this.bgmPlaying) return

    try {
      const ctx = this.getAudioContext()
      this.bgmPlaying = true

      // Create master gain for BGM
      const masterGain = ctx.createGain()
      masterGain.gain.setValueAtTime(0.05, ctx.currentTime) // Low volume so it's not overpowering
      masterGain.connect(ctx.destination)
      this.bgmGainNode = masterGain

      // Melody notes (in Hz): C, E, G, C (chiptune style)
      const melody = [261.63, 329.63, 392.0, 523.25] // C4, E4, G4, C5
      const noteDuration = 0.3

      const playMelodyLoop = (startTime: number) => {
        if (!this.bgmPlaying) return

        melody.forEach((freq, index) => {
          const noteStart = startTime + index * noteDuration
          const osc = ctx.createOscillator()
          const env = ctx.createGain()

          osc.type = 'square' // Chiptune square wave
          osc.frequency.value = freq
          osc.connect(env)
          env.connect(masterGain)

          // ADSR-like envelope
          env.gain.setValueAtTime(0.3, noteStart)
          env.gain.setValueAtTime(0.2, noteStart + noteDuration * 0.5)
          env.gain.setValueAtTime(0, noteStart + noteDuration)

          osc.start(noteStart)
          osc.stop(noteStart + noteDuration)

          this.bgmOscillators.push(osc)
        })

        // Schedule next loop (4 notes, each 0.3s = 1.2s per loop)
        const loopDuration = noteDuration * melody.length
        setTimeout(() => {
          playMelodyLoop(ctx.currentTime + loopDuration)
        }, loopDuration * 1000)
      }

      playMelodyLoop(ctx.currentTime)
    } catch (e) {
      console.error('Error playing background music:', e)
    }
  }

  stopBackgroundMusic() {
    this.bgmPlaying = false
    if (this.bgmGainNode) {
      this.bgmGainNode.gain.setValueAtTime(this.bgmGainNode.gain.value, this.audioContext!.currentTime)
      this.bgmGainNode.gain.setValueAtTime(0, this.audioContext!.currentTime + 0.2)
    }
    this.bgmOscillators.forEach(osc => {
      try {
        osc.stop()
      } catch (e) {
        // Already stopped
      }
    })
    this.bgmOscillators = []
  }
}

export const soundManager = new SoundManager()
