class AudioManager {
  private isEnabled = false
  private volume = 0.3

  constructor() {
    if (typeof window !== "undefined") {
      this.isEnabled = localStorage.getItem("audio-enabled") === "true"
      this.volume = Number.parseFloat(localStorage.getItem("audio-volume") || "0.3")
    }
  }

  initBackgroundMusic() {
    // Placeholder for audio initialization
    console.log("Audio manager initialized")
  }

  loadSoundEffect(name: string, src: string[]) {
    // Placeholder for sound effect loading
    console.log(`Loading sound effect: ${name}`)
  }

  playBackgroundMusic() {
    if (!this.isEnabled) return
    console.log("Playing background music")
  }

  stopBackgroundMusic() {
    console.log("Stopping background music")
  }

  playSoundEffect(name: string) {
    if (!this.isEnabled) return
    console.log(`Playing sound effect: ${name}`)
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled
    if (typeof window !== "undefined") {
      localStorage.setItem("audio-enabled", enabled.toString())
    }

    if (enabled) {
      this.playBackgroundMusic()
    } else {
      this.stopBackgroundMusic()
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
    if (typeof window !== "undefined") {
      localStorage.setItem("audio-volume", this.volume.toString())
    }
  }

  getEnabled() {
    return this.isEnabled
  }

  getVolume() {
    return this.volume
  }
}

export const audioManager = new AudioManager()
