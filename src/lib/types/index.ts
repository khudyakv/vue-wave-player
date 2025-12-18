export interface WavePlayerProps {
  src: string
  barCount?: number
  barWidth?: number
  barGap?: number
  primaryColor?: string
  backgroundColor?: string
  autoplay?: boolean
  showPlaybackRate?: boolean
  playbackRates?: number[]
}

export interface WavePlayerSlots {
  'play-button': { isPlaying: boolean; isLoading: boolean; toggle: () => void }
  'time': { currentTime: number; duration: number; formattedCurrentTime: string; formattedDuration: string }
}

export interface WavePlayerEmits {
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'ended'): void
  (e: 'timeupdate', currentTime: number): void
  (e: 'durationchange', duration: number): void
  (e: 'seeking', time: number): void
  (e: 'seeked', time: number): void
  (e: 'ratechange', rate: number): void
  (e: 'error', error: Error): void
  (e: 'loading'): void
  (e: 'loaded'): void
}

export interface WavePlayerExpose {
  play: () => void
  pause: () => void
  stop: () => void
  toggle: () => void
  seek: (time: number) => void
  setRate: (rate: number) => void
  currentTime: number
  duration: number
  isPlaying: boolean
  playbackRate: number
}

export type PlayerState = 'idle' | 'loading' | 'playing' | 'paused' | 'error'
