import { ref, computed, watch, onUnmounted, type Ref } from 'vue'
import { analyzeAudio, fetchAudioBuffer, generatePlaceholderWaveform, generateFallbackWaveform } from '../utils/audio'
import type { PlayerState } from '../types'

const STOP_EVENT = 'vue-wave-player:stop'
let idCounter = 0

export interface UseWavePlayerOptions {
  src: Ref<string> | string
  barCount?: number
  autoplay?: boolean
}

export function useWavePlayer({ src, barCount = 32, autoplay = false }: UseWavePlayerOptions) {
  const id = ++idCounter
  const audioRef = ref<HTMLAudioElement | null>(null)
  const audioCtx = ref<AudioContext | null>(null)
  const state = ref<PlayerState>('loading')
  const currentTime = ref(0)
  const duration = ref(0)
  const playbackRate = ref(1)
  const waveform = ref<number[]>(generatePlaceholderWaveform(barCount))
  const error = ref<Error | null>(null)

  const isPlaying = computed(() => state.value === 'playing')
  const isLoading = computed(() => state.value === 'loading')
  const progress = computed(() => duration.value ? currentTime.value / duration.value : 0)
  const getSrc = () => typeof src === 'string' ? src : src.value

  function initAudio() {
    if (audioRef.value) return
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.crossOrigin = 'anonymous'
    audio.addEventListener('loadedmetadata', () => { duration.value = audio.duration; state.value = 'idle' })
    audio.addEventListener('timeupdate', () => { currentTime.value = audio.currentTime })
    audio.addEventListener('play', () => { state.value = 'playing' })
    audio.addEventListener('pause', () => { if (state.value !== 'idle') state.value = 'paused' })
    audio.addEventListener('ended', () => { state.value = 'idle'; currentTime.value = 0 })
    audio.addEventListener('error', (e) => { state.value = 'error'; error.value = new Error(audio.error?.message || 'Unknown'); console.error(e) })
    audio.addEventListener('waiting', () => { if (state.value === 'idle') state.value = 'loading' })
    audio.addEventListener('canplay', () => { if (state.value === 'loading') state.value = 'idle' })
    audioRef.value = audio
  }

  async function loadSource(url: string) {
    if (!audioRef.value) initAudio()
    const audio = audioRef.value!
    state.value = 'loading'
    waveform.value = generatePlaceholderWaveform(barCount)
    audio.src = url
    audio.load()
    
    try {
      if (!audioCtx.value) audioCtx.value = new AudioContext()
      const buffer = await Promise.race([
        fetchAudioBuffer(url, audioCtx.value),
        new Promise<never>((_, r) => setTimeout(() => r(new Error('Timeout')), 10000))
      ])
      waveform.value = await analyzeAudio(buffer, barCount)
    } catch (e) {
      console.error('Analyze failed:', e)
      waveform.value = generateFallbackWaveform(barCount)
    }
    state.value = 'idle'
  }

  const play = () => {
    if (!audioRef.value) return
    window.dispatchEvent(new CustomEvent(STOP_EVENT, { detail: { id } }))
    audioRef.value.play().catch(console.error)
  }
  const pause = () => audioRef.value?.pause()
  const stop = () => {
    if (audioRef.value) {
      audioRef.value.pause()
      audioRef.value.currentTime = 0
      state.value = 'idle'
    }
  }
  const toggle = () => isPlaying.value ? pause() : play()
  const seek = (time: number) => { if (audioRef.value) audioRef.value.currentTime = Math.max(0, Math.min(time, duration.value)) }
  const seekByProgress = (p: number) => seek(p * duration.value)
  const setRate = (rate: number) => { if (audioRef.value) { audioRef.value.playbackRate = rate; playbackRate.value = rate } }

  const handleStop = (e: Event) => {
    const evt = e as CustomEvent<{ id: number }>
    if (evt.detail.id !== id && audioRef.value) audioRef.value.pause()
  }

  watch(() => getSrc(), (url) => url && loadSource(url), { immediate: true })
  if (typeof window !== 'undefined') window.addEventListener(STOP_EVENT, handleStop)

  onUnmounted(() => {
    if (typeof window !== 'undefined') window.removeEventListener(STOP_EVENT, handleStop)
    if (audioRef.value) { audioRef.value.pause(); audioRef.value.src = ''; audioRef.value = null }
    if (audioCtx.value) { audioCtx.value.close(); audioCtx.value = null }
  })

  if (autoplay) {
    watch(state, (s) => { if (s === 'idle' && audioRef.value && audioRef.value.readyState >= 2) play() }, { once: true })
  }

  return { audioRef, state, currentTime, duration, playbackRate, waveform, error, isPlaying, isLoading, progress, play, pause, stop, toggle, seek, seekByProgress, setRate }
}
