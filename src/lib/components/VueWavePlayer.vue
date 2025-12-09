<script setup lang="ts">
import { computed, toRef, watch, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useWavePlayer } from '../composables/useWavePlayer'
import { formatDuration } from '../utils/time'
import { interpolateWaveform } from '../utils/audio'
import type { WavePlayerProps } from '../types'

const BASE_BAR_COUNT = 50  // базовое количество для анализа

const props = withDefaults(defineProps<WavePlayerProps>(), {
  barCount: BASE_BAR_COUNT,
  barWidth: 3,
  barGap: 2,
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

// Canvas ref
const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasContainerRef = ref<HTMLElement | null>(null)

const {
  currentTime,
  duration,
  playbackRate,
  waveform,
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
  barCount: BASE_BAR_COUNT,
  autoplay: props.autoplay,
})

// Progress only when playing or actively seeking
const displayProgress = computed(() => {
  if (isPlaying.value || currentTime.value > 0) {
    return progress.value
  }
  return 0
})

// Анимация появления волны
let waveAnimationProgress = 0
let waveAnimationId: number | null = null
const WAVE_ANIMATION_DURATION = 600 // 0.6s

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function animateWaveIn() {
  if (waveAnimationId) {
    cancelAnimationFrame(waveAnimationId)
  }
  
  const startTime = performance.now()
  waveAnimationProgress = 0
  
  function animate(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / WAVE_ANIMATION_DURATION, 1)
    waveAnimationProgress = easeOutCubic(progress)
    
    drawWaveform()
    
    if (progress < 1) {
      waveAnimationId = requestAnimationFrame(animate)
    } else {
      waveAnimationId = null
    }
  }
  
  waveAnimationId = requestAnimationFrame(animate)
}

// Рисование волны на Canvas
function drawWaveform() {
  const canvas = canvasRef.value
  const container = canvasContainerRef.value
  if (!canvas || !container) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // Сбрасываем размеры canvas чтобы он не влиял на размер контейнера
  canvas.style.width = '0'
  canvas.style.height = '0'
  
  const dpr = window.devicePixelRatio || 1
  const rect = container.getBoundingClientRect()
  const width = Math.floor(rect.width)
  const height = 24
  
  if (width <= 0) return
  
  // Установка размеров canvas с учётом DPR
  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  
  // Отключаем сглаживание для чётких границ
  ctx.imageSmoothingEnabled = false
  
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  
  // Очистка
  ctx.clearRect(0, 0, width, height)
  
  const rawData = waveform.value
  if (rawData.length === 0) return
  
  const barWidth = props.barWidth
  const barGap = props.barGap
  
  // Рассчитываем количество колонок на основе ширины
  const barCount = Math.max(1, Math.floor((width + barGap) / (barWidth + barGap)))
  
  // Интерполируем данные волны под нужное количество колонок
  const data = interpolateWaveform(rawData, barCount)
  
  const radius = Math.round(Math.min(barWidth / 2, 1.5))
  const progressIndex = Math.floor(displayProgress.value * data.length)
  
  data.forEach((value, index) => {
    // Округляем координаты до целых пикселей для чёткости
    const x = Math.round(index * (barWidth + barGap))
    // Применяем анимацию к высоте
    const animatedValue = value * waveAnimationProgress
    const barHeight = Math.max(2, Math.round(animatedValue * height))
    const y = Math.round((height - barHeight) / 2)
    
    // Цвет: яркий для проигранных, полупрозрачный для остальных
    const isPlayed = index <= progressIndex
    ctx.fillStyle = props.primaryColor
    ctx.globalAlpha = isPlayed ? 1 : 0.35
    
    // Рисуем скруглённый прямоугольник
    drawRoundedRect(ctx, x, y, barWidth, barHeight, radius)
    ctx.fill()
  })
  
  ctx.globalAlpha = 1
}

// Рисование скруглённого прямоугольника
function drawRoundedRect(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  radius: number
) {
  radius = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

// ResizeObserver для перерисовки при изменении размера
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (canvasContainerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      // При ресайзе просто перерисовываем без анимации
      if (waveAnimationProgress === 1) {
        drawWaveform()
      }
    })
    resizeObserver.observe(canvasContainerRef.value)
    
    // Начальная отрисовка
    nextTick(() => {
      if (waveform.value && waveform.value.length > 0 && waveform.value.some(v => v > 0)) {
        animateWaveIn()
      } else {
        waveAnimationProgress = 0
        drawWaveform()
      }
    })
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (waveAnimationId) {
    cancelAnimationFrame(waveAnimationId)
    waveAnimationId = null
  }
})

// Запуск анимации при загрузке новых данных волны
watch(waveform, (newWaveform, oldWaveform) => {
  // Запускаем анимацию только если волна изменилась с пустой на заполненную
  const wasEmpty = !oldWaveform || oldWaveform.length === 0 || oldWaveform.every(v => v === 0)
  const hasData = newWaveform && newWaveform.length > 0 && newWaveform.some(v => v > 0)
  
  if (wasEmpty && hasData) {
    animateWaveIn()
  } else {
    waveAnimationProgress = 1
    drawWaveform()
  }
}, { flush: 'post' })

// Перерисовка при изменении прогресса воспроизведения
watch(() => displayProgress.value, () => {
  if (waveAnimationProgress === 1) {
    drawWaveform()
  }
}, { flush: 'post' })

// Computed
const formattedCurrentTime = computed(() => formatDuration(currentTime.value))
const formattedDuration = computed(() => formatDuration(duration.value))

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
  const waveformElement = event.currentTarget as HTMLElement
  handleWaveformClick(event)
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    const rect = waveformElement.getBoundingClientRect()
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
        <svg v-else class="vvp-icon vvp-icon-play" viewBox="0 0 24 24">
          <path d="M8 5.14v13.72c0 .66.75 1.04 1.28.65l9.47-6.86c.43-.31.43-.99 0-1.3L9.28 4.49c-.53-.39-1.28-.01-1.28.65z" fill="currentColor" />
        </svg>
      </button>
    </slot>

    <!-- Waveform Section -->
    <div ref="canvasContainerRef" class="vvp-waveform-section">
      <div
        class="vvp-waveform"
        :class="{ 'is-loading': isLoading }"
        @mousedown="!isLoading && handleWaveformMouseDown($event)"
        @touchstart.prevent="!isLoading && handleTouchStart($event)"
        @touchmove.prevent="!isLoading && handleTouchMove($event)"
      >
        <canvas ref="canvasRef" class="vvp-canvas" />
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
  overflow: hidden;
  user-select: none;
  width: 100%;
  min-width: 100px;
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

.vvp-icon-play {
  transform: translateX(1px);
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
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}

.vvp-waveform {
  display: block;
  height: 24px;
  width: 100%;
  cursor: pointer;
  touch-action: none;
}

.vvp-waveform.is-loading {
  cursor: default;
  pointer-events: none;
}

.vvp-canvas {
  display: block;
  width: 100%;
  height: 24px;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  image-rendering: pixelated;
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

