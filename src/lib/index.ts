import VueWavePlayer from './components/VueWavePlayer.vue'
import { useWavePlayer } from './composables/useWavePlayer'
import type { WavePlayerProps, WavePlayerEmits, WavePlayerExpose, WavePlayerSlots, PlayerState } from './types'
import type { App } from 'vue'

// Plugin install function for app.use()
const plugin = {
  install(app: App) {
    app.component('VueWavePlayer', VueWavePlayer)
  }
}

export {
  VueWavePlayer,
  useWavePlayer,
  plugin as default,
}

export type {
  WavePlayerProps,
  WavePlayerEmits,
  WavePlayerExpose,
  WavePlayerSlots,
  PlayerState,
}

