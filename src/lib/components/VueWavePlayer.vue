<script setup lang="ts">
import { computed, toRef, watch, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useWavePlayer } from '../composables/useWavePlayer'
import { formatDuration } from '../utils/time'
import { interpolateWaveform } from '../utils/audio'
import type { WavePlayerProps } from '../types'

const BAR_COUNT = 50
const ANIM_DURATION = 600

const props = withDefaults(defineProps<WavePlayerProps>(), {
  barCount: BAR_COUNT,
  barWidth: 3,
  barGap: 2,
  primaryColor: '#3390EC',
  backgroundColor: '#FFFFFF',
  autoplay: false,
  showPlaybackRate: false,
  playbackRates: () => [1, 1.5, 2],
})

const emit = defineEmits<{
  play: []; pause: []; ended: []
  timeupdate: [currentTime: number]; durationchange: [duration: number]
  seeking: [time: number]; seeked: [time: number]; ratechange: [rate: number]
  error: [error: Error]; loading: []; loaded: []
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

const { currentTime, duration, playbackRate, waveform, isPlaying, isLoading, progress, play, pause, stop, toggle, seek, seekByProgress, setRate } = useWavePlayer({
  src: toRef(props, 'src'),
  barCount: BAR_COUNT,
  autoplay: props.autoplay,
})

const displayProgress = computed(() => isPlaying.value || currentTime.value > 0 ? progress.value : 0)
const formattedCurrentTime = computed(() => formatDuration(currentTime.value))
const formattedDuration = computed(() => formatDuration(duration.value))
const cssVars = computed(() => ({ '--vvp-primary': props.primaryColor, '--vvp-bg': props.backgroundColor }))

let animProgress = 0, animId: number | null = null, resizeObs: ResizeObserver | null = null, isDragging = false
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

function drawWaveform() {
  const canvas = canvasRef.value, container = containerRef.value
  if (!canvas || !container) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  const dpr = window.devicePixelRatio || 1
  const width = Math.floor(container.getBoundingClientRect().width)
  const height = 24
  if (width <= 0) return
  
  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  canvas.style.removeProperty('width')
  canvas.style.height = `${height}px`
  ctx.imageSmoothingEnabled = false
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, width, height)
  
  const raw = waveform.value
  if (!raw.length) return
  
  const { barWidth, barGap, primaryColor } = props
  const barCount = Math.max(1, Math.floor((width + barGap) / (barWidth + barGap)))
  const data = interpolateWaveform(raw, barCount)
  const radius = Math.round(Math.min(barWidth / 2, 1.5))
  const progressIdx = Math.floor(displayProgress.value * data.length)
  
  data.forEach((v, i) => {
    const x = Math.round(i * (barWidth + barGap))
    const h = Math.max(2, Math.round(v * animProgress * height))
    const y = Math.round((height - h) / 2)
    ctx.fillStyle = primaryColor
    ctx.globalAlpha = i <= progressIdx ? 1 : 0.35
    ctx.beginPath()
    const r = Math.min(radius, barWidth / 2, h / 2)
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + barWidth - r, y)
    ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r)
    ctx.lineTo(x + barWidth, y + h - r)
    ctx.quadraticCurveTo(x + barWidth, y + h, x + barWidth - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
    ctx.fill()
  })
  ctx.globalAlpha = 1
}

function animateWave() {
  if (animId) cancelAnimationFrame(animId)
  const start = performance.now()
  animProgress = 0
  const tick = (now: number) => {
    const p = Math.min((now - start) / ANIM_DURATION, 1)
    animProgress = easeOut(p)
    drawWaveform()
    if (p < 1) animId = requestAnimationFrame(tick)
    else animId = null
  }
  animId = requestAnimationFrame(tick)
}

onMounted(() => {
  if (containerRef.value) {
    resizeObs = new ResizeObserver(() => animProgress === 1 && drawWaveform())
    resizeObs.observe(containerRef.value)
    nextTick(() => {
      waveform.value?.some(v => v > 0) ? animateWave() : (animProgress = 0, drawWaveform())
    })
  }
})

onUnmounted(() => {
  resizeObs?.disconnect()
  animId && cancelAnimationFrame(animId)
})

watch(waveform, (n, o) => {
  const wasEmpty = !o?.length || o.every(v => v === 0)
  const hasData = n?.some(v => v > 0)
  wasEmpty && hasData ? animateWave() : (animProgress = 1, drawWaveform())
}, { flush: 'post' })

watch(displayProgress, () => animProgress === 1 && drawWaveform(), { flush: 'post' })
watch(currentTime, t => emit('timeupdate', t))
watch(duration, d => emit('durationchange', d))
watch(isPlaying, p => { if (p) emit('play'); else emit('pause') })
watch(playbackRate, r => emit('ratechange', r))

function handleClick(e: MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const p = (e.clientX - rect.left) / rect.width
  emit('seeking', p * duration.value)
  seekByProgress(p)
  emit('seeked', currentTime.value)
}

function handleMouseDown(e: MouseEvent) {
  isDragging = true
  const el = e.currentTarget as HTMLElement
  handleClick(e)
  const move = (ev: MouseEvent) => {
    if (!isDragging) return
    const rect = el.getBoundingClientRect()
    seekByProgress(Math.max(0, Math.min(ev.clientX - rect.left, rect.width)) / rect.width)
  }
  const up = () => { isDragging = false; document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up) }
  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
}

function handleTouch(e: TouchEvent) {
  const t = e.touches[0], rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  seekByProgress(Math.max(0, Math.min(t.clientX - rect.left, rect.width)) / rect.width)
}

const handlePlay = () => isPlaying.value ? pause() : play()
const handleRate = () => {
  const rates = props.playbackRates
  setRate(rates[(rates.indexOf(playbackRate.value) + 1) % rates.length])
}

defineExpose({ play, pause, stop, toggle, seek, seekByProgress, setRate, currentTime, duration, isPlaying, playbackRate })
</script>

<template>
  <div class="vvp-container" :style="cssVars">
    <slot name="play-button" :is-playing="isPlaying" :is-loading="isLoading" :toggle="handlePlay">
      <button class="vvp-play-button" :class="{ 'is-playing': isPlaying, 'is-loading': isLoading }" :disabled="isLoading" @click="handlePlay" :aria-label="isPlaying ? 'Pause' : 'Play'">
        <svg v-if="isLoading" class="vvp-spinner" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="31.4 31.4"/></svg>
        <svg v-else-if="isPlaying" class="vvp-icon" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>
        <svg v-else class="vvp-icon vvp-icon-play" viewBox="0 0 24 24"><path d="M8 5.14v13.72c0 .66.75 1.04 1.28.65l9.47-6.86c.43-.31.43-.99 0-1.3L9.28 4.49c-.53-.39-1.28-.01-1.28.65z" fill="currentColor"/></svg>
      </button>
    </slot>
    <div ref="containerRef" class="vvp-waveform-section">
      <div class="vvp-waveform" :class="{ 'is-loading': isLoading }" @mousedown="!isLoading && handleMouseDown($event)" @touchstart.prevent="!isLoading && handleTouch($event)" @touchmove.prevent="!isLoading && handleTouch($event)">
        <canvas ref="canvasRef" class="vvp-canvas"/>
      </div>
      <slot name="time" :current-time="currentTime" :duration="duration" :formatted-current-time="formattedCurrentTime" :formatted-duration="formattedDuration">
        <div class="vvp-time-row"><span class="vvp-time">{{ formattedCurrentTime }}</span><span class="vvp-time vvp-time-total">{{ formattedDuration }}</span></div>
      </slot>
    </div>
    <button v-if="showPlaybackRate && playbackRates.length > 1" class="vvp-rate-btn" @click="handleRate" :aria-label="`Speed: ${playbackRate}x`">{{ playbackRate }}×</button>
  </div>
</template>

<style>
.vvp-container{--vvp-primary:#3390EC;--vvp-primary-light:rgba(51,144,236,.1);--vvp-bg:#FFF;--vvp-button-bg:#F0F0F0;display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--vvp-bg);border-radius:20px;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,sans-serif;overflow:hidden;user-select:none;width:100%;min-width:0;box-sizing:border-box}
@media(max-width:360px){.vvp-container{gap:8px;padding:8px 10px}}
.vvp-play-button{flex-shrink:0;align-self:center;width:42px;height:42px;border-radius:50%;border:2px solid var(--vvp-primary);background:transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background-color .15s;padding:0;color:var(--vvp-primary);-webkit-tap-highlight-color:transparent;outline:none}
.vvp-play-button:hover{background:var(--vvp-primary-light)}
.vvp-play-button:disabled{cursor:default;opacity:.6}
.vvp-icon{width:20px;height:20px;flex-shrink:0}
.vvp-icon-play{transform:translateX(1px)}
.vvp-spinner{width:20px;height:20px;animation:vvp-spin 1s linear infinite}
@keyframes vvp-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.vvp-waveform-section{flex:1;min-width:0;overflow:hidden;display:flex;flex-direction:column;justify-content:center;gap:6px}
.vvp-waveform{display:block;height:24px;width:100%;cursor:pointer;touch-action:none}
.vvp-waveform.is-loading{cursor:default;pointer-events:none}
.vvp-canvas{display:block;width:100%;max-width:100%;height:24px;image-rendering:-webkit-optimize-contrast;image-rendering:crisp-edges;image-rendering:pixelated}
.vvp-time-row{display:flex;justify-content:space-between;align-items:center;padding:0 2px}
.vvp-time{font-size:11px;font-weight:500;color:var(--vvp-primary);line-height:1}
.vvp-time-total{opacity:.5}
.vvp-rate-btn{flex-shrink:0;align-self:center;padding:5px 10px;border-radius:12px;background:var(--vvp-button-bg);border:none;font-size:12px;font-weight:600;color:var(--vvp-primary);cursor:pointer;transition:background-color .15s;font-family:inherit;line-height:1}
.vvp-rate-btn:hover{background:#E5E5E5}
</style>
