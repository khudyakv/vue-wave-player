<script setup lang="ts">
import { ref } from 'vue'
import { VueWavePlayer } from './lib'

const audioUrl = '/example.mp3'

// Ref для управления плеером
const playerRef = ref()
const currentTime = ref(0)
const duration = ref(0)
const isPlaying = ref(false)
const playbackRate = ref(1)

function onTimeUpdate(time: number) {
  currentTime.value = time
}

function onDurationChange(dur: number) {
  duration.value = dur
}

function onPlay() {
  isPlaying.value = true
}

function onPause() {
  isPlaying.value = false
}

function onEnded() {
  isPlaying.value = false
}

function onRateChange(rate: number) {
  playbackRate.value = rate
}

function formatTimeHMS(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 1000)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`
}

const installCode = `npm install vue-wave-player`

const basicCode = `<template>
  <VueWavePlayer src="/audio.mp3" />
</template>

<script setup>
import { VueWavePlayer } from 'vue-wave-player'
<\/script>`

const colorsCode = `<VueWavePlayer
  src="/audio.mp3"
  primary-color="#E91E63"
  background-color="#FCE4EC"
/>`

const speedCode = `<VueWavePlayer
  src="/audio.mp3"
  show-playback-rate
  :playback-rates="[1, 1.5, 2]"
/>`

const slotsCode = `<!-- Кастомная кнопка воспроизведения -->
<VueWavePlayer src="/audio.mp3">
  <template #play-button="{ isPlaying, toggle }">
    <button @click="toggle">
      {{ isPlaying ? 'Пауза' : 'Играть' }}
    </button>
  </template>
</VueWavePlayer>

<!-- Кастомное отображение времени -->
<VueWavePlayer src="/audio.mp3">
  <template #time="{ formattedCurrentTime, formattedDuration }">
    <div>{{ formattedCurrentTime }} из {{ formattedDuration }}</div>
  </template>
</VueWavePlayer>`

const eventsCode = `<VueWavePlayer
  src="/audio.mp3"
  @play="onPlay"
  @pause="onPause"
  @ended="onEnded"
  @timeupdate="onTimeUpdate"
/>`

const refCode = `<template>
  <VueWavePlayer ref="player" src="/audio.mp3" />
  <button @click="player.play()">Play</button>
  <button @click="player.pause()">Pause</button>
</template>

<script setup>
const player = ref()

player.play()        // начать воспроизведение
player.pause()       // пауза
player.seek(10)      // перемотать на 10 сек
player.setRate(1.5)  // скорость 1.5x
player.currentTime   // текущее время
player.duration      // длительность
player.isPlaying     // воспроизводится ли
<\/script>`
</script>

<template>
  <div class="demo-app">
    <!-- Header -->
    <header class="header">
      <h1>Vue Wave Player</h1>
      <p class="subtitle">Аудио плеер с визуализацией волны в стиле Telegram для Vue 3</p>
      <div class="badges">
        <span class="badge">Vue 3</span>
        <span class="badge">TypeScript</span>
        <span class="badge">MIT</span>
      </div>
    </header>

    <!-- Demo Section -->
    <section class="section">
      <h2>Демо</h2>
      
      <div class="demo-grid">
        <div class="demo-item">
          <span class="demo-label">Базовый</span>
          <div class="demo-card">
            <VueWavePlayer :src="audioUrl" />
          </div>
        </div>

        <div class="demo-item">
          <span class="demo-label">Кастомные цвета</span>
          <div class="demo-card">
            <VueWavePlayer
              :src="audioUrl"
              primary-color="#E91E63"
              background-color="#FCE4EC"
            />
          </div>
        </div>

        <div class="demo-item">
          <span class="demo-label">Тёмная тема</span>
          <div class="demo-card dark">
            <VueWavePlayer
              :src="audioUrl"
              primary-color="#8774E1"
              background-color="#212121"
            />
          </div>
        </div>

        <div class="demo-item">
          <span class="demo-label">Со скоростью</span>
          <div class="demo-card">
            <VueWavePlayer
              :src="audioUrl"
              show-playback-rate
            />
          </div>
        </div>

        <div class="demo-item">
          <span class="demo-label">Кастомная кнопка (slot)</span>
          <div class="demo-card">
            <VueWavePlayer :src="audioUrl">
              <template #play-button="{ isPlaying, toggle }">
                <button class="custom-play-btn" @click="toggle">
                  {{ isPlaying ? '⏹' : '▶' }}
                </button>
              </template>
            </VueWavePlayer>
          </div>
        </div>

        <div class="demo-item">
          <span class="demo-label">Кастомное время (slot)</span>
          <div class="demo-card">
            <VueWavePlayer :src="audioUrl">
              <template #time="{ currentTime }">
                <div class="custom-time">
                  <span class="custom-time-current">{{ formatTimeHMS(currentTime) }}</span>
                </div>
              </template>
            </VueWavePlayer>
          </div>
        </div>
      </div>
    </section>

    <!-- Installation -->
    <section class="section">
      <h2>Установка</h2>
      <pre class="code-block"><code>{{ installCode }}</code></pre>
    </section>

    <!-- Quick Start -->
    <section class="section">
      <h2>Быстрый старт</h2>
      <pre class="code-block"><code>{{ basicCode }}</code></pre>
    </section>

    <!-- Props -->
    <section class="section">
      <h2>Параметры (Props)</h2>
      <div class="table-wrapper">
        <table class="props-table">
          <thead>
            <tr>
              <th>Параметр</th>
              <th>Тип</th>
              <th>По умолчанию</th>
              <th>Описание</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>src</code></td>
              <td>string</td>
              <td>—</td>
              <td>URL аудио файла (обязательный)</td>
            </tr>
            <tr>
              <td><code>primaryColor</code></td>
              <td>string</td>
              <td>#3390EC</td>
              <td>Основной цвет (волна, кнопки)</td>
            </tr>
            <tr>
              <td><code>backgroundColor</code></td>
              <td>string</td>
              <td>#FFFFFF</td>
              <td>Цвет фона плеера</td>
            </tr>
            <tr>
              <td><code>showPlaybackRate</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Показывать кнопку скорости</td>
            </tr>
            <tr>
              <td><code>playbackRates</code></td>
              <td>number[]</td>
              <td>[1, 1.5, 2]</td>
              <td>Доступные скорости воспроизведения</td>
            </tr>
            <tr>
              <td><code>autoplay</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Автовоспроизведение при загрузке</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Slots -->
    <section class="section">
      <h2>Слоты (Slots)</h2>
      <div class="table-wrapper">
        <table class="props-table">
          <thead>
            <tr>
              <th>Слот</th>
              <th>Данные</th>
              <th>Описание</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>#play-button</code></td>
              <td>{ isPlaying, isLoading, toggle }</td>
              <td>Кастомная кнопка воспроизведения</td>
            </tr>
            <tr>
              <td><code>#time</code></td>
              <td>{ currentTime, duration, formattedCurrentTime, formattedDuration }</td>
              <td>Кастомное отображение времени</td>
            </tr>
          </tbody>
        </table>
      </div>
      <pre class="code-block"><code>{{ slotsCode }}</code></pre>
    </section>

    <!-- Events -->
    <section class="section">
      <h2>События (Events)</h2>
      <div class="table-wrapper">
        <table class="props-table">
          <thead>
            <tr>
              <th>Событие</th>
              <th>Данные</th>
              <th>Описание</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>@play</code></td>
              <td>—</td>
              <td>Воспроизведение началось</td>
            </tr>
            <tr>
              <td><code>@pause</code></td>
              <td>—</td>
              <td>Воспроизведение на паузе</td>
            </tr>
            <tr>
              <td><code>@ended</code></td>
              <td>—</td>
              <td>Воспроизведение завершено</td>
            </tr>
            <tr>
              <td><code>@timeupdate</code></td>
              <td>number</td>
              <td>Обновление текущего времени (секунды)</td>
            </tr>
            <tr>
              <td><code>@durationchange</code></td>
              <td>number</td>
              <td>Длительность определена (секунды)</td>
            </tr>
            <tr>
              <td><code>@seeking</code></td>
              <td>number</td>
              <td>Начало перемотки</td>
            </tr>
            <tr>
              <td><code>@seeked</code></td>
              <td>number</td>
              <td>Перемотка завершена</td>
            </tr>
            <tr>
              <td><code>@ratechange</code></td>
              <td>number</td>
              <td>Изменение скорости воспроизведения</td>
            </tr>
            <tr>
              <td><code>@error</code></td>
              <td>Error</td>
              <td>Ошибка загрузки/воспроизведения</td>
            </tr>
          </tbody>
        </table>
      </div>
      <pre class="code-block"><code>{{ eventsCode }}</code></pre>
    </section>

    <!-- Methods -->
    <section class="section">
      <h2>Методы (Ref)</h2>
      
      <div class="table-wrapper">
        <table class="props-table">
          <thead>
            <tr>
              <th>Метод / Свойство</th>
              <th>Тип</th>
              <th>Описание</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>play()</code></td>
              <td>function</td>
              <td>Начать воспроизведение</td>
            </tr>
            <tr>
              <td><code>pause()</code></td>
              <td>function</td>
              <td>Поставить на паузу</td>
            </tr>
            <tr>
              <td><code>seek(time)</code></td>
              <td>function</td>
              <td>Перемотать к указанному времени</td>
            </tr>
            <tr>
              <td><code>setRate(rate)</code></td>
              <td>function</td>
              <td>Установить скорость воспроизведения</td>
            </tr>
            <tr>
              <td><code>currentTime</code></td>
              <td>number</td>
              <td>Текущее время воспроизведения</td>
            </tr>
            <tr>
              <td><code>duration</code></td>
              <td>number</td>
              <td>Общая длительность</td>
            </tr>
            <tr>
              <td><code>isPlaying</code></td>
              <td>boolean</td>
              <td>Воспроизводится ли сейчас</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <pre class="code-block"><code>{{ refCode }}</code></pre>
      
      <!-- Interactive Demo -->
      <h3>Интерактивный пример</h3>
      <div class="methods-demo">
        <div class="demo-player">
          <VueWavePlayer 
            ref="playerRef"
            :src="audioUrl"
            @timeupdate="onTimeUpdate"
            @durationchange="onDurationChange"
            @play="onPlay"
            @pause="onPause"
            @ended="onEnded"
            @ratechange="onRateChange"
          />
        </div>
        
        <div class="methods-panel">
          <div class="panel-section">
            <span class="panel-label">Воспроизведение</span>
            <div class="panel-buttons">
              <button class="method-btn play" @click="playerRef?.play()">
                <span class="btn-icon">▶</span>
                play()
              </button>
              <button class="method-btn pause" @click="playerRef?.pause()">
                <span class="btn-icon">⏸</span>
                pause()
              </button>
            </div>
          </div>
          
          <div class="panel-section">
            <span class="panel-label">Перемотка</span>
            <div class="panel-buttons">
              <button class="method-btn" @click="playerRef?.seek(0)">seek(0)</button>
              <button class="method-btn" @click="playerRef?.seek(5)">seek(5)</button>
            </div>
          </div>
          
          <div class="panel-section">
            <span class="panel-label">Скорость</span>
            <div class="panel-buttons">
              <button class="method-btn" @click="playerRef?.setRate(1)">x1</button>
              <button class="method-btn" @click="playerRef?.setRate(1.5)">x1.5</button>
              <button class="method-btn" @click="playerRef?.setRate(2)">x2</button>
            </div>
          </div>
          
          <div class="panel-section state">
            <div class="state-row">
              <span class="state-label">isPlaying</span>
              <span class="state-value" :class="{ active: isPlaying }">{{ isPlaying }}</span>
            </div>
            <div class="state-row">
              <span class="state-label">currentTime</span>
              <span class="state-value">{{ currentTime.toFixed(1) }}s</span>
            </div>
            <div class="state-row">
              <span class="state-label">duration</span>
              <span class="state-value">{{ duration.toFixed(1) }}s</span>
            </div>
            <div class="state-row">
              <span class="state-label">playbackRate</span>
              <span class="state-value">{{ playbackRate }}x</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Examples -->
    <section class="section">
      <h2>Примеры</h2>
      
      <h3>Кастомные цвета</h3>
      <pre class="code-block"><code>{{ colorsCode }}</code></pre>

      <h3>Скорость воспроизведения</h3>
      <pre class="code-block"><code>{{ speedCode }}</code></pre>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p class="footer-left">MIT License © 2025</p>
      <a href="https://wespot.ru" target="_blank" class="footer-right">Разработано в Spot</a>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root {
  --bg: #0a0a0a;
  --surface: #141414;
  --surface-2: #1c1c1c;
  --border: #262626;
  --text: #fafafa;
  --text-2: #a1a1a1;
  --text-3: #525252;
  --accent: #c2410c;
  --accent-soft: rgba(194, 65, 12, 0.12);
  --green: #16a34a;
  --mono: 'IBM Plex Mono', 'Menlo', monospace;
  --sans: 'IBM Plex Sans', system-ui, sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--sans);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  line-height: 1.7;
  font-size: 15px;
  -webkit-font-smoothing: antialiased;
}

.demo-app {
  max-width: 720px;
  margin: 0 auto;
  padding: 80px 24px;
}

/* Header */
.header {
  margin-bottom: 80px;
}

.header h1 {
  font-size: 2.25rem;
  font-weight: 600;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
  color: var(--text);
}

.subtitle {
  font-size: 1.1rem;
  color: var(--text-2);
  margin-bottom: 24px;
  max-width: 480px;
}

.badges {
  display: flex;
  gap: 10px;
}

.badge {
  padding: 6px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  font-size: 13px;
  color: var(--text-2);
  font-family: var(--mono);
}

/* Sections */
.section {
  margin-bottom: 64px;
}

.section h2 {
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 24px;
  color: var(--text-3);
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.section h3 {
  font-size: 1rem;
  font-weight: 500;
  margin: 32px 0 16px;
  color: var(--text);
}

/* Demo Grid */
.demo-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 540px) {
  .demo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.demo-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-label {
  font-size: 12px;
  color: var(--text-3);
  font-family: var(--mono);
}

.demo-card {
  background: #E7E8EA;
  padding: 16px;
  min-height: 88px;
  display: flex;
  align-items: center;
  border-radius: 16px;
}

.demo-card > * {
  width: 100%;
}

.demo-card.dark {
  background: var(--surface);
}

/* Code Block */
.code-block {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 20px 24px;
  overflow-x: auto;
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-2);
}

.code-block code {
  white-space: pre;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
  margin-bottom: 20px;
  border: 1px solid var(--border);
}

.props-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.props-table th,
.props-table td {
  padding: 14px 18px;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.props-table th {
  background: var(--surface);
  font-weight: 500;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-3);
}

.props-table td {
  color: var(--text-2);
}

.props-table tr:last-child td {
  border-bottom: none;
}

.props-table code {
  background: var(--surface-2);
  padding: 3px 8px;
  font-family: var(--mono);
  font-size: 13px;
  color: var(--accent);
}

/* Footer */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 32px;
  margin-top: 32px;
  border-top: 1px solid var(--border);
  font-size: 13px;
  color: var(--text-3);
}

.footer-right {
  color: var(--text-3);
  text-decoration: none;
  transition: color 0.15s;
}

.footer-right:hover {
  color: var(--accent);
}

/* Dark theme for player */
.demo-card.dark :deep(.vvp-time-total) {
  color: var(--text-3);
}

/* Custom play button */
.custom-play-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #3390EC;
  color: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s;
}

.custom-play-btn:hover {
  opacity: 0.85;
}

/* Custom time */
.custom-time {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--sans);
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  padding: 0 2px;
}

.custom-time-current {
  color: #3390EC;
  font-variant-numeric: tabular-nums;
}

.custom-time-separator {
  color: #3390EC;
  opacity: 0.5;
}

.custom-time-duration {
  color: #3390EC;
  opacity: 0.5;
  font-variant-numeric: tabular-nums;
}

/* Methods Demo */
.methods-demo {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  margin-top: 20px;
}

.demo-player {
  padding: 20px;
  background: #E7E8EA;
  border-radius: 16px 16px 0 0;
}

.methods-panel {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.panel-section.state {
  padding-top: 20px;
  border-top: 1px solid var(--border);
  gap: 8px;
}

.panel-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-3);
  font-weight: 500;
}

.panel-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.method-btn {
  padding: 10px 16px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--mono);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.method-btn:hover {
  background: var(--border);
}

.method-btn.play {
  background: rgba(22, 163, 74, 0.15);
  border-color: rgba(22, 163, 74, 0.3);
  color: var(--green);
}

.method-btn.play:hover {
  background: rgba(22, 163, 74, 0.25);
}

.method-btn.pause {
  background: var(--accent-soft);
  border-color: rgba(194, 65, 12, 0.3);
  color: var(--accent);
}

.method-btn.pause:hover {
  background: rgba(194, 65, 12, 0.2);
}

.btn-icon {
  font-size: 12px;
}

.state-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.state-label {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text-3);
}

.state-value {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text-2);
  background: var(--surface-2);
  padding: 6px 12px;
  min-width: 80px;
  text-align: right;
}

.state-value.active {
  color: var(--green);
  background: rgba(22, 163, 74, 0.1);
}
</style>
