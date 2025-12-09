<script setup lang="ts">
import { computed, toRef, ref, onMounted, onUnmounted, watch } from 'vue'
import { useWavePlayer } from '../composables/useWavePlayer'
import { formatDuration } from '../utils/time'
import { interpolateWaveform } from '../utils/audio'
import type { WavePlayerProps } from '../types'

const BAR_WIDTH = 3
const BAR_GAP = 2

const props = withDefaults(defineProps<WavePlayerProps>(), {
  barCount: 32,
  primaryColor: '#3390EC',
  backgroundColor: '#FFFFFF',
  autoplay: false,
  showPlaybackRate: false,
  playbackRates: () => [1, 1.5, 2],
})

const emit = defineEmits<{
  play: []
  pause: []
  ended: []
  timeupdate: [currentTime: number]
  durationchange: [duration: number]
  seeking: [time: number]
  seeked: [time: number]
  ratechange: [rate: number]
  error: [error: Error]
  loading: []
  loaded: []
}>()

// Dynamic bar count based on container width
const waveformRef = ref<HTMLElement | null>(null)
const dynamicBarCount = ref(props.barCount)

const {
  currentTime,
  duration,
  playbackRate,
  waveform: rawWaveform,
  isPlaying,
  isLoading,
  progress,
  play,
  pause,
  toggle,
  seek,
  seekByProgress,
  setRate,
} = useWavePlayer({
  src: toRef(props, 'src'),
  barCount: props.barCount,
  autoplay: props.autoplay,
})

// Interpolate waveform to match dynamic bar count
const waveform = computed(() => {
  if (rawWaveform.value.length === dynamicBarCount.value) {
    return rawWaveform.value
  }
  return interpolateWaveform(rawWaveform.value, dynamicBarCount.value)
})

// Calculate bar count from container width
function calculateBarCount(width: number) {
  const count = Math.floor(width / (BAR_WIDTH + BAR_GAP))
  return Math.max(10, Math.min(count, 100)) // min 10, max 100 bars
}

// ResizeObserver for dynamic bar count
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (waveformRef.value) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width
        dynamicBarCount.value = calculateBarCount(width)
      }
    })
    resizeObserver.observe(waveformRef.value)
    
    // Initial calculation
    dynamicBarCount.value = calculateBarCount(waveformRef.value.offsetWidth)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

// Computed
const formattedCurrentTime = computed(() => formatDuration(currentTime.value))
const formattedDuration = computed(() => formatDuration(duration.value))

// Progress only when playing or actively seeking
const displayProgress = computed(() => {
  if (isPlaying.value || currentTime.value > 0) {
    return progress.value
  }
  return 0
})

// CSS variables
const cssVars = computed(() => ({
  '--vvp-primary': props.primaryColor,
  '--vvp-bg': props.backgroundColor,
}))

// Waveform click handler
function handleWaveformClick(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = event.clientX - rect.left
  const progressValue = x / rect.width
  
  emit('seeking', progressValue * duration.value)
  seekByProgress(progressValue)
  emit('seeked', currentTime.value)
}

// Waveform drag handler
let isDragging = false

function handleWaveformMouseDown(event: MouseEvent) {
  isDragging = true
  handleWaveformClick(event)
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    const target = document.querySelector('.vvp-waveform') as HTMLElement
    if (!target) return
    const rect = target.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const progressValue = x / rect.width
    seekByProgress(progressValue)
  }
  
  const handleMouseUp = () => {
    isDragging = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// Touch handlers for mobile
function handleTouchStart(event: TouchEvent) {
  const touch = event.touches[0]
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = touch.clientX - rect.left
  const progressValue = x / rect.width
  seekByProgress(progressValue)
}

function handleTouchMove(event: TouchEvent) {
  const touch = event.touches[0]
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width))
  const progressValue = x / rect.width
  seekByProgress(progressValue)
}

// Watch for state changes and emit events
watch(currentTime, (time) => {
  emit('timeupdate', time)
})

watch(duration, (dur) => {
  emit('durationchange', dur)
})

watch(isPlaying, (playing) => {
  if (playing) {
    emit('play')
  } else {
    emit('pause')
  }
})

watch(playbackRate, (rate) => {
  emit('ratechange', rate)
})

// Play button handler
function handlePlayClick() {
  if (isPlaying.value) {
    pause()
  } else {
    play()
  }
}

// Playback rate handler
function handleRateClick() {
  const rates = props.playbackRates
  const currentIndex = rates.indexOf(playbackRate.value)
  const nextIndex = (currentIndex + 1) % rates.length
  const newRate = rates[nextIndex]
  setRate(newRate)
}

// Expose methods and state
defineExpose({
  play,
  pause,
  toggle,
  seek,
  seekByProgress,
  setRate,
  currentTime,
  duration,
  isPlaying,
  playbackRate,
})
</script>

<template>
  <div class="vvp-container" :style="cssVars">
    <!-- Play/Pause Button Slot -->
    <slot name="play-button" :is-playing="isPlaying" :is-loading="isLoading" :toggle="handlePlayClick">
      <button
        class="vvp-play-button"
        :class="{ 'is-playing': isPlaying, 'is-loading': isLoading }"
        :disabled="isLoading"
        @click="handlePlayClick"
        :aria-label="isPlaying ? 'Pause' : 'Play'"
      >
        <svg v-if="isLoading" class="vvp-spinner" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="31.4 31.4" />
        </svg>
        <svg v-else-if="isPlaying" class="vvp-icon" viewBox="0 0 24 24">
          <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
          <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
        </svg>
        <svg v-else class="vvp-icon" viewBox="0 0 24 24">
          <path d="M9 5v14l11-7-11-7z" fill="currentColor" />
        </svg>
      </button>
    </slot>

    <!-- Waveform Section -->
    <div class="vvp-waveform-section">
      <div
        ref="waveformRef"
        class="vvp-waveform"
        :class="{ 'is-loading': isLoading }"
        @mousedown="!isLoading && handleWaveformMouseDown($event)"
        @touchstart.prevent="!isLoading && handleTouchStart($event)"
        @touchmove.prevent="!isLoading && handleTouchMove($event)"
      >
        <div
          v-for="(bar, index) in waveform"
          :key="index"
          class="vvp-bar"
          :class="{ 'is-played': index / waveform.length <= displayProgress }"
          :style="{ height: `${bar * 100}%` }"
        />
      </div>
      
      <!-- Time Slot -->
      <slot 
        name="time" 
        :current-time="currentTime" 
        :duration="duration"
        :formatted-current-time="formattedCurrentTime"
        :formatted-duration="formattedDuration"
      >
        <div class="vvp-time-row">
          <span class="vvp-time">{{ formattedCurrentTime }}</span>
          <span class="vvp-time vvp-time-total">{{ formattedDuration }}</span>
        </div>
      </slot>
    </div>

    <!-- Playback Rate Button -->
    <button
      v-if="showPlaybackRate && playbackRates.length > 1"
      class="vvp-rate-btn"
      @click="handleRateClick"
      :aria-label="`Playback speed: ${playbackRate}x`"
    >
      {{ playbackRate }}×
    </button>

  </div>
</template>

<style>
.vvp-container {
  --vvp-primary: #3390EC;
  --vvp-primary-light: rgba(51, 144, 236, 0.1);
  --vvp-bg: #FFFFFF;
  --vvp-button-bg: #F0F0F0;
  
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: var(--vvp-bg);
  border-radius: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
  user-select: none;
  width: 100%;
  min-width: 200px;
  box-sizing: border-box;
}

/* Play Button */
.vvp-play-button {
  flex-shrink: 0;
  align-self: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid var(--vvp-primary);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.15s ease;
  padding: 0;
  color: var(--vvp-primary);
  -webkit-tap-highlight-color: transparent;
  outline: none;
}

.vvp-play-button:hover {
  background: var(--vvp-primary-light);
}

.vvp-play-button:focus {
  outline: none;
}

.vvp-play-button:disabled {
  cursor: default;
  opacity: 0.6;
}

.vvp-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.vvp-spinner {
  width: 20px;
  height: 20px;
  animation: vvp-spin 1s linear infinite;
}

@keyframes vvp-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Waveform Section */
.vvp-waveform-section {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}

.vvp-waveform {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 24px;
  cursor: pointer;
  touch-action: none;
}

.vvp-waveform.is-loading {
  cursor: default;
  pointer-events: none;
}

.vvp-bar {
  width: 3px;
  flex-shrink: 0;
  background: var(--vvp-primary);
  border-radius: 1.5px;
  opacity: 0.35;
  transition: height 0.6s ease-out;
}

.vvp-bar.is-played {
  opacity: 1;
}

/* Time Display */
.vvp-time-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2px;
}

.vvp-time {
  font-size: 11px;
  font-weight: 500;
  color: var(--vvp-primary);
  line-height: 1;
}

.vvp-time-total {
  opacity: 0.5;
}

/* Playback Rate Button */
.vvp-rate-btn {
  flex-shrink: 0;
  align-self: center;
  padding: 5px 10px;
  border-radius: 12px;
  background: var(--vvp-button-bg);
  border: none;
  font-size: 12px;
  font-weight: 600;
  color: var(--vvp-primary);
  cursor: pointer;
  transition: background-color 0.15s ease;
  font-family: inherit;
  line-height: 1;
}

.vvp-rate-btn:hover {
  background: #E5E5E5;
}
</style>

