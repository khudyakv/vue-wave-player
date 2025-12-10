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

// Копирование кода
const copiedCode = ref<string | null>(null)

async function copyCode(code: string) {
  try {
    await navigator.clipboard.writeText(code)
    copiedCode.value = code
    setTimeout(() => {
      copiedCode.value = null
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const installCode = `npm install vue-wave-player`

const globalRegisterCode = `// main.js
import { createApp } from 'vue'
import App from './App.vue'
import VueWavePlayer from 'vue-wave-player'

const app = createApp(App)
app.use(VueWavePlayer)
app.mount('#app')`

const basicCode = `<template>
  <VueWavePlayer src="/audio.mp3" />
</template>

<script setup>
import { VueWavePlayer } from 'vue-wave-player'
<\/script>`

const barSizeCode = `<!-- Тонкие колонки 1px с отступом 1px -->
<VueWavePlayer
  src="/audio.mp3"
  :bar-width="1"
  :bar-gap="1"
/>

<!-- Широкие колонки 4px с отступом 4px -->
<VueWavePlayer
  src="/audio.mp3"
  :bar-width="4"
  :bar-gap="4"
/>`

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
      <div class="header-title">
        <h1>Vue Wave Player</h1>
        <div class="header-links">
          <a href="https://github.com/khudyakv/vue-wave-player" target="_blank" class="header-link" title="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
          <a href="https://www.npmjs.com/package/vue-wave-player" target="_blank" class="header-link" title="npm">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"/></svg>
          </a>
        </div>
      </div>
      <p class="subtitle">Аудио плеер с Canvas визуализацией волны в стиле Telegram для Vue 3. Плавная анимация, автостоп других плееров, кастомизация размеров.</p>
      <div class="badges">
        <span class="badge">Vue 3</span>
        <span class="badge">TypeScript</span>
        <span class="badge">MIT</span>
        <a href="https://wespot.ru" target="_blank" class="badge badge-link">разработано Spot</a>
      </div>
    </header>

    <!-- Demo Section -->
    <section id="demo" class="section">
      <h2><a href="#demo"><span class="hash">#</span> Демо</a></h2>
      
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
                  <span :style="{ transform: isPlaying ? 'none' : 'translate(2px, 1px)' }">
                    {{ isPlaying ? '⏹' : '▶' }}
                  </span>
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

        <div class="demo-item">
          <span class="demo-label">Тонкие колонки (1px × 1px)</span>
          <div class="demo-card">
            <VueWavePlayer
              :src="audioUrl"
              :bar-width="1"
              :bar-gap="1"
            />
          </div>
        </div>

        <div class="demo-item">
          <span class="demo-label">Квадратные (4px × 4px)</span>
          <div class="demo-card">
            <VueWavePlayer
              :src="audioUrl"
              :bar-width="4"
              :bar-gap="4"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Installation -->
    <section id="install" class="section">
      <h2><a href="#install"><span class="hash">#</span> Установка</a></h2>
      <div class="code-wrapper">
        <pre class="code-block"><code>{{ installCode }}</code></pre>
        <button class="copy-btn" :class="{ copied: copiedCode === installCode }" @click="copyCode(installCode)">
          <svg v-if="copiedCode === installCode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
      </div>
    </section>

    <!-- Quick Start -->
    <section id="quickstart" class="section">
      <h2><a href="#quickstart"><span class="hash">#</span> Быстрый старт</a></h2>
      
      <h3 id="global" class="section-subtitle"><a href="#global"><span class="hash">#</span> Глобальная регистрация (рекомендуется)</a></h3>
      <div class="code-wrapper">
        <pre class="code-block"><code>{{ globalRegisterCode }}</code></pre>
        <button class="copy-btn" :class="{ copied: copiedCode === globalRegisterCode }" @click="copyCode(globalRegisterCode)">
          <svg v-if="copiedCode === globalRegisterCode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
      </div>
      <p class="note">Теперь компонент <code>&lt;VueWavePlayer /&gt;</code> доступен везде без импорта.</p>
      
      <h3 id="local" class="section-subtitle"><a href="#local"><span class="hash">#</span> Локальный импорт</a></h3>
      <div class="code-wrapper">
        <pre class="code-block"><code>{{ basicCode }}</code></pre>
        <button class="copy-btn" :class="{ copied: copiedCode === basicCode }" @click="copyCode(basicCode)">
          <svg v-if="copiedCode === basicCode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
      </div>
      <p class="note">✅ Стили подключаются автоматически, отдельный импорт CSS не нужен!</p>
    </section>
    
    <!-- Bar Size Examples -->
    <section id="barsize" class="section">
      <h2><a href="#barsize"><span class="hash">#</span> Настройка ширины волны</a></h2>
      <div class="code-wrapper">
        <pre class="code-block"><code>{{ barSizeCode }}</code></pre>
        <button class="copy-btn" :class="{ copied: copiedCode === barSizeCode }" @click="copyCode(barSizeCode)">
          <svg v-if="copiedCode === barSizeCode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
      </div>
    </section>

    <!-- Props -->
    <section id="props" class="section">
      <h2><a href="#props"><span class="hash">#</span> Параметры (Props)</a></h2>
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
              <td><code>barWidth</code></td>
              <td>number</td>
              <td>3</td>
              <td>Ширина колонки волны в пикселях</td>
            </tr>
            <tr>
              <td><code>barGap</code></td>
              <td>number</td>
              <td>2</td>
              <td>Отступ между колонками в пикселях</td>
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
    <section id="slots" class="section">
      <h2><a href="#slots"><span class="hash">#</span> Слоты (Slots)</a></h2>
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
      <div class="code-wrapper">
        <pre class="code-block"><code>{{ slotsCode }}</code></pre>
        <button class="copy-btn" :class="{ copied: copiedCode === slotsCode }" @click="copyCode(slotsCode)">
          <svg v-if="copiedCode === slotsCode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
      </div>
    </section>

    <!-- Events -->
    <section id="events" class="section">
      <h2><a href="#events"><span class="hash">#</span> События (Events)</a></h2>
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
      <div class="code-wrapper">
        <pre class="code-block"><code>{{ eventsCode }}</code></pre>
        <button class="copy-btn" :class="{ copied: copiedCode === eventsCode }" @click="copyCode(eventsCode)">
          <svg v-if="copiedCode === eventsCode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
      </div>
    </section>

    <!-- Methods -->
    <section id="methods" class="section">
      <h2><a href="#methods"><span class="hash">#</span> Методы (Methods)</a></h2>
      
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
      
      <div class="code-wrapper">
        <pre class="code-block"><code>{{ refCode }}</code></pre>
        <button class="copy-btn" :class="{ copied: copiedCode === refCode }" @click="copyCode(refCode)">
          <svg v-if="copiedCode === refCode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
      </div>
      
      <!-- Interactive Demo -->
      <h3 id="interactive" class="section-subtitle"><a href="#interactive"><span class="hash">#</span> Интерактивный пример</a></h3>
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
    <section id="examples" class="section">
      <h2><a href="#examples"><span class="hash">#</span> Примеры</a></h2>
      
      <h3 id="colors" class="section-subtitle"><a href="#colors"><span class="hash">#</span> Кастомные цвета</a></h3>
      <div class="code-wrapper">
        <pre class="code-block"><code>{{ colorsCode }}</code></pre>
        <button class="copy-btn" :class="{ copied: copiedCode === colorsCode }" @click="copyCode(colorsCode)">
          <svg v-if="copiedCode === colorsCode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
      </div>

      <h3 id="speed" class="section-subtitle"><a href="#speed"><span class="hash">#</span> Скорость воспроизведения</a></h3>
      <div class="code-wrapper">
        <pre class="code-block"><code>{{ speedCode }}</code></pre>
        <button class="copy-btn" :class="{ copied: copiedCode === speedCode }" @click="copyCode(speedCode)">
          <svg v-if="copiedCode === speedCode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
      </div>
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
  /* Telegram Dark Theme */
  --bg: #17212B;
  --surface: #232E3C;
  --surface-2: #2B3A4D;
  --border: #3D4D5F;
  --text: #FFFFFF;
  --text-2: #D8DEE4;
  --text-3: #8B9BA8;
  --accent: #3390EC;
  --accent-soft: rgba(51, 144, 236, 0.15);
  --accent-hover: #4EA4F6;
  --green: #4CAF50;
  --mono: 'SF Mono', 'Menlo', 'Monaco', monospace;
  --sans: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
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

@media (max-width: 540px) {
  .demo-app {
    padding: 40px 16px;
  }
}

/* Header */
.header {
  margin-bottom: 80px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-links {
  display: flex;
  gap: 12px;
}

.header-link {
  color: var(--text-3);
  text-decoration: none;
  transition: color 0.15s;
}

.header-link:hover {
  color: var(--text-2);
}

.header-link svg {
  width: 22px;
  height: 22px;
}

.header h1 {
  font-size: 2.25rem;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--text);
}

@media (max-width: 540px) {
  .header h1 {
    font-size: 1.75rem;
  }
  
  .header {
    margin-bottom: 48px;
  }
  
  .subtitle {
    font-size: 1rem;
  }
}

.subtitle {
  font-size: 1.1rem;
  color: var(--text-2);
  margin-bottom: 24px;
  max-width: 480px;
}

.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.badge {
  padding: 6px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  font-size: 13px;
  color: var(--text-2);
  font-family: var(--mono);
}

.badge-link {
  text-decoration: none;
  transition: all 0.15s;
}

.badge-link:hover {
  color: var(--accent-hover);
  border-color: var(--accent);
  background: var(--accent-soft);
}

/* Sections */
.section {
  margin-bottom: 64px;
}

.section {
  scroll-margin-top: 24px;
}

.section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--text);
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.section h2 a {
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section h2 a:hover {
  color: var(--accent);
}

.section h2 .hash {
  color: var(--text-3);
  font-weight: 400;
  opacity: 0;
  transition: opacity 0.15s;
}

.section h2 a:hover .hash {
  opacity: 1;
}

.section h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 24px 0 12px;
  color: var(--text-1);
}


.note {
  font-size: 13px;
  color: var(--text-2);
  margin: 12px 0 24px;
  padding: 12px 16px;
  background: var(--surface);
  border-radius: 8px;
  border-left: 3px solid var(--accent);
}

.note code {
  background: var(--bg);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: var(--mono);
  font-size: 12px;
}

.section h3 {
  font-size: 1rem;
  font-weight: 500;
  margin: 32px 0 16px;
  color: var(--text);
}

.section-subtitle {
  margin-top: 32px;
  scroll-margin-top: 24px;
}

.section-subtitle a {
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
}

.section-subtitle a:hover {
  color: var(--accent);
}

.section-subtitle .hash {
  color: var(--text-3);
  font-weight: 400;
  opacity: 0;
  transition: opacity 0.15s;
}

.section-subtitle a:hover .hash {
  opacity: 1;
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
  overflow: hidden;
}

.demo-card > * {
  width: 100%;
  min-width: 0;
}

.demo-card.dark {
  background: var(--surface);
}

@media (max-width: 540px) {
  .demo-card {
    padding: 12px;
    min-height: 76px;
  }
}

/* Code Block */
.code-wrapper {
  position: relative;
}

.code-block {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 20px 24px;
  padding-right: 56px;
  overflow-x: auto;
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-2);
  border-radius: 12px;
}

.code-block code {
  white-space: pre;
}

.copy-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  padding: 0;
}

.copy-btn svg {
  width: 16px;
  height: 16px;
}

.copy-btn:hover {
  background: var(--border);
  color: var(--text);
}

.copy-btn.copied {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
}

@media (max-width: 540px) {
  .code-block {
    padding: 16px;
    padding-right: 48px;
    font-size: 12px;
  }
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
  color: var(--accent-hover);
}

@media (max-width: 540px) {
  .footer {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
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
