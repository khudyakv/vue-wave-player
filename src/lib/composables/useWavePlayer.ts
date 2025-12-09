import { ref, computed, watch, onUnmounted, type Ref } from 'vue'
import { analyzeAudio, fetchAudioBuffer, generatePlaceholderWaveform, generateFallbackWaveform } from '../utils/audio'
import type { PlayerState } from '../types'

// Глобальное событие для остановки всех плееров кроме текущего
const STOP_ALL_EVENT = 'vue-wave-player:stop-all'

// Уникальный ID для каждого плеера
let playerIdCounter = 0

export interface UseWavePlayerOptions {
  src: Ref<string> | string
  barCount?: number
  autoplay?: boolean
}

export function useWavePlayer(options: UseWavePlayerOptions) {
  const {
    src,
    barCount = 32,
    autoplay = false,
  } = options

  // Уникальный ID этого плеера
  const playerId = ++playerIdCounter

  // Refs
  const audioRef = ref<HTMLAudioElement | null>(null)
  const audioContext = ref<AudioContext | null>(null)
  
  // State
  const state = ref<PlayerState>('loading')
  const currentTime = ref(0)
  const duration = ref(0)
  const playbackRate = ref(1)
  const waveform = ref<number[]>(generatePlaceholderWaveform(barCount))
  const error = ref<Error | null>(null)

  // Computed
  const isPlaying = computed(() => state.value === 'playing')
  const isLoading = computed(() => state.value === 'loading')
  const progress = computed(() => {
    if (duration.value === 0) return 0
    return currentTime.value / duration.value
  })

  // Get reactive src value
  const getSrc = () => typeof src === 'string' ? src : src.value

  // Initialize audio element
  function initAudio() {
    if (audioRef.value) return

    const audio = new Audio()
    audio.preload = 'metadata'
    audio.crossOrigin = 'anonymous'
    
    audio.addEventListener('loadedmetadata', () => {
      duration.value = audio.duration
      state.value = 'idle'
    })

    audio.addEventListener('timeupdate', () => {
      currentTime.value = audio.currentTime
    })

    audio.addEventListener('play', () => {
      state.value = 'playing'
    })

    audio.addEventListener('pause', () => {
      if (state.value !== 'idle') {
        state.value = 'paused'
      }
    })

    audio.addEventListener('ended', () => {
      state.value = 'idle'
      currentTime.value = 0
    })

    audio.addEventListener('error', (e) => {
      state.value = 'error'
      error.value = new Error(`Audio error: ${audio.error?.message || 'Unknown error'}`)
      console.error('Audio error:', e)
    })

    // Only show loading for initial buffering, not for seeking
    audio.addEventListener('waiting', () => {
      // Don't change to loading if we're already playing or paused (seeking)
      if (state.value === 'idle') {
        state.value = 'loading'
      }
    })

    audio.addEventListener('canplay', () => {
      if (state.value === 'loading') {
        state.value = 'idle'
      }
    })

    audioRef.value = audio
  }

  // Load audio source and analyze waveform
  async function loadSource(url: string) {
    if (!audioRef.value) {
      initAudio()
    }

    const audio = audioRef.value!
    
    // Reset to loading state with zero bars
    state.value = 'loading'
    waveform.value = generatePlaceholderWaveform(barCount)
    
    // Set source
    audio.src = url
    audio.load()

    // Analyze audio to generate waveform with timeout
    const analyzeWithTimeout = async () => {
      const timeout = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 10000)
      )
      
      try {
        if (!audioContext.value) {
          audioContext.value = new AudioContext()
        }

        const bufferPromise = fetchAudioBuffer(url, audioContext.value)
        const buffer = await Promise.race([bufferPromise, timeout])
        waveform.value = await analyzeAudio(buffer, barCount)
      } catch (err) {
        console.error('Failed to analyze audio:', err)
        // Generate fallback waveform on error
        waveform.value = generateFallbackWaveform(barCount)
      }
      state.value = 'idle'
    }

    analyzeWithTimeout()
  }

  // Playback controls
  function play() {
    if (!audioRef.value) return
    // Останавливаем все другие плееры перед воспроизведением
    window.dispatchEvent(new CustomEvent(STOP_ALL_EVENT, { detail: { playerId } }))
    audioRef.value.play().catch(console.error)
  }

  // Обработчик события остановки от других плееров
  function handleStopAll(event: Event) {
    const customEvent = event as CustomEvent<{ playerId: number }>
    if (customEvent.detail.playerId !== playerId && audioRef.value) {
      audioRef.value.pause()
    }
  }

  function pause() {
    if (!audioRef.value) return
    audioRef.value.pause()
  }

  function toggle() {
    if (isPlaying.value) {
      pause()
    } else {
      play()
    }
  }

  function seek(time: number) {
    if (!audioRef.value) return
    audioRef.value.currentTime = Math.max(0, Math.min(time, duration.value))
  }

  function seekByProgress(progressValue: number) {
    seek(progressValue * duration.value)
  }

  function setRate(rate: number) {
    if (!audioRef.value) return
    audioRef.value.playbackRate = rate
    playbackRate.value = rate
  }

  // Watch for source changes
  watch(
    () => getSrc(),
    (newSrc) => {
      if (newSrc) {
        loadSource(newSrc)
      }
    },
    { immediate: true }
  )

  // Подписка на событие остановки при монтировании
  if (typeof window !== 'undefined') {
    window.addEventListener(STOP_ALL_EVENT, handleStopAll)
  }

  // Cleanup
  onUnmounted(() => {
    // Отписка от события
    if (typeof window !== 'undefined') {
      window.removeEventListener(STOP_ALL_EVENT, handleStopAll)
    }
    
    if (audioRef.value) {
      audioRef.value.pause()
      audioRef.value.src = ''
      audioRef.value = null
    }
    if (audioContext.value) {
      audioContext.value.close()
      audioContext.value = null
    }
  })

  // Autoplay
  if (autoplay) {
    watch(state, (newState) => {
      if (newState === 'idle' && audioRef.value && audioRef.value.readyState >= 2) {
        play()
      }
    }, { once: true })
  }

  return {
    // Refs
    audioRef,
    
    // State
    state,
    currentTime,
    duration,
    playbackRate,
    waveform,
    error,
    
    // Computed
    isPlaying,
    isLoading,
    progress,
    
    // Methods
    play,
    pause,
    toggle,
    seek,
    seekByProgress,
    setRate,
  }
}

