import VueWavePlayer from './components/VueWavePlayer.vue'
import { useWavePlayer } from './composables/useWavePlayer'
import type { WavePlayerProps, WavePlayerEmits, WavePlayerExpose, WavePlayerSlots, PlayerState } from './types'
import type { App } from 'vue'

export { VueWavePlayer, useWavePlayer }
export type { WavePlayerProps, WavePlayerEmits, WavePlayerExpose, WavePlayerSlots, PlayerState }
export default { install: (app: App) => app.component('VueWavePlayer', VueWavePlayer) }
