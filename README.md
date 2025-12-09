# Vue Wave Player

🎵 Аудио плеер с визуализацией волны в стиле Telegram для Vue 3

[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-c2410c)](./LICENSE)

## Демо

**[Смотреть демо →](https://vue-wave-player.vercel.app)**

## Возможности

- 🎨 **Дизайн как в Telegram** — плеер для воспроизведения голосовых сообщений
- 📊 **Автоматическая генерация из аудио файла** 
- 🎯 **Промотка кликом/драгом**
- ⏱️ **Отображение времени**
- 🔄 **Скорость воспроизведения** — 1x, 1.5x, 2x
- 🎨 **Кастомизация** — цвета через props
- 🔌 **Слоты** — кастомная кнопка play и формат времени
- 📱 **Мобильная поддержка (touch)**

## Установка

```bash
npm install vue-wave-player
```

## Быстрый старт

### Вариант 1: Глобальная регистрация (рекомендуется)

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import VueWavePlayer from 'vue-wave-player'
import 'vue-wave-player/dist/style.css'

const app = createApp(App)
app.use(VueWavePlayer)
app.mount('#app')
```

Теперь компонент доступен везде:

```vue
<template>
  <VueWavePlayer src="/audio.mp3" />
</template>
```

### Вариант 2: Локальный импорт

```vue
<template>
  <VueWavePlayer src="/audio.mp3" />
</template>

<script setup>
import { VueWavePlayer } from 'vue-wave-player'
import 'vue-wave-player/dist/style.css'
</script>
```

## Примеры

### Кастомные цвета

```vue
<VueWavePlayer
  src="/audio.mp3"
  primary-color="#E91E63"
  background-color="#FCE4EC"
/>
```

### Тёмная тема

```vue
<VueWavePlayer
  src="/audio.mp3"
  primary-color="#8774E1"
  background-color="#212121"
/>
```

### С кнопкой скорости

```vue
<VueWavePlayer
  src="/audio.mp3"
  show-playback-rate
  :playback-rates="[1, 1.5, 2]"
/>
```

### Кастомная кнопка воспроизведения (slot)

```vue
<VueWavePlayer src="/audio.mp3">
  <template #play-button="{ isPlaying, toggle }">
    <button @click="toggle">
      {{ isPlaying ? 'Пауза' : 'Играть' }}
    </button>
  </template>
</VueWavePlayer>
```

### Кастомное отображение времени (slot)

```vue
<VueWavePlayer src="/audio.mp3">
  <template #time="{ currentTime, formattedCurrentTime, formattedDuration }">
    <div>{{ formattedCurrentTime }} из {{ formattedDuration }}</div>
  </template>
</VueWavePlayer>
```

### Программное управление (ref)

```vue
<template>
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
</script>
```

## Параметры (Props)

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `src` | `string` | — | URL аудио файла (обязательный) |
| `primaryColor` | `string` | `#3390EC` | Основной цвет (волна, кнопки) |
| `backgroundColor` | `string` | `#FFFFFF` | Цвет фона плеера |
| `showPlaybackRate` | `boolean` | `false` | Показывать кнопку скорости |
| `playbackRates` | `number[]` | `[1, 1.5, 2]` | Доступные скорости воспроизведения |
| `autoplay` | `boolean` | `false` | Автовоспроизведение при загрузке |

## Слоты (Slots)

| Слот | Данные | Описание |
|------|--------|----------|
| `#play-button` | `{ isPlaying, isLoading, toggle }` | Кастомная кнопка воспроизведения |
| `#time` | `{ currentTime, duration, formattedCurrentTime, formattedDuration }` | Кастомное отображение времени |

## События (Events)

| Событие | Данные | Описание |
|---------|--------|----------|
| `@play` | — | Воспроизведение началось |
| `@pause` | — | Пауза |
| `@ended` | — | Воспроизведение завершено |
| `@timeupdate` | `number` | Обновление текущего времени |
| `@durationchange` | `number` | Изменение длительности |
| `@ratechange` | `number` | Изменение скорости |
| `@error` | `Error` | Ошибка воспроизведения |

## Методы (ref)

```typescript
const player = ref()

player.play()           // Начать воспроизведение
player.pause()          // Пауза
player.toggle()         // Переключить play/pause
player.seek(5)          // Перемотать к 5 секунде
player.seekByProgress(0.5) // Перемотать к 50%
player.setRate(1.5)     // Установить скорость 1.5x

// Состояние (реактивные ref)
player.currentTime      // Текущее время (секунды)
player.duration         // Длительность (секунды)
player.isPlaying        // Воспроизводится ли
player.playbackRate     // Текущая скорость
```

## Запуск проекта

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка библиотеки
npm run build:lib

# Проверка типов
npm run type-check
```

## Лицензия

MIT © 2025 [Spot](https://wespot.ru)
