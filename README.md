# Vue Wave Player

🎵 Audio player with Canvas waveform visualization in Telegram style for Vue 3

[Changelog](./CHANGELOG.md)

[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-c2410c)](./LICENSE)
[![npm](https://img.shields.io/npm/v/vue-wave-player)](https://www.npmjs.com/package/vue-wave-player)

## Demo

**[View Demo →](https://vue-wave-player.vercel.app)**

## Installation

```bash
npm install vue-wave-player
```

## Quick Start

### Global Registration (recommended)

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import VueWavePlayer from 'vue-wave-player'

const app = createApp(App)
app.use(VueWavePlayer)
app.mount('#app')
```

Now `<VueWavePlayer />` component is available everywhere without import.

### Local Import

```vue
<template>
  <VueWavePlayer src="/audio.mp3" />
</template>

<script setup>
import { VueWavePlayer } from 'vue-wave-player'
</script>
```

> ✅ Styles are included automatically, no separate CSS import needed!

## Waveform Bar Settings

```vue
<!-- Thin bars 1px with 1px gap -->
<VueWavePlayer src="/audio.mp3" :bar-width="1" :bar-gap="1" />

<!-- Wide bars 4px with 4px gap -->
<VueWavePlayer src="/audio.mp3" :bar-width="4" :bar-gap="4" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | — | Audio file URL (required) |
| `barWidth` | `number` | `3` | Waveform bar width in pixels |
| `barGap` | `number` | `2` | Gap between bars in pixels |
| `primaryColor` | `string` | `#3390EC` | Primary color (waveform, buttons) |
| `backgroundColor` | `string` | `#FFFFFF` | Player background color |
| `showPlaybackRate` | `boolean` | `false` | Show speed button |
| `playbackRates` | `number[]` | `[1, 1.5, 2]` | Available playback speeds |
| `autoplay` | `boolean` | `false` | Autoplay on load |

## Slots

| Slot | Data | Description |
|------|------|-------------|
| `#play-button` | `{ isPlaying, isLoading, toggle }` | Custom play button |
| `#time` | `{ currentTime, duration, formattedCurrentTime, formattedDuration }` | Custom time display |

```vue
<!-- Custom play button -->
<VueWavePlayer src="/audio.mp3">
  <template #play-button="{ isPlaying, toggle }">
    <button @click="toggle">{{ isPlaying ? 'Pause' : 'Play' }}</button>
  </template>
</VueWavePlayer>

<!-- Custom time display -->
<VueWavePlayer src="/audio.mp3">
  <template #time="{ formattedCurrentTime, formattedDuration }">
    <div>{{ formattedCurrentTime }} of {{ formattedDuration }}</div>
  </template>
</VueWavePlayer>
```

## Events

| Event | Data | Description |
|-------|------|-------------|
| `@play` | — | Playback started |
| `@pause` | — | Paused |
| `@ended` | — | Playback ended |
| `@timeupdate` | `number` | Current time update (seconds) |
| `@durationchange` | `number` | Duration determined (seconds) |
| `@seeking` | `number` | Seeking started |
| `@seeked` | `number` | Seeking ended |
| `@ratechange` | `number` | Playback speed changed |
| `@error` | `Error` | Load/playback error |

```vue
<VueWavePlayer
  src="/audio.mp3"
  @play="onPlay"
  @pause="onPause"
  @ended="onEnded"
  @timeupdate="onTimeUpdate"
/>
```

## Methods

| Method / Property | Type | Description |
|-------------------|------|-------------|
| `play()` | function | Start playback |
| `pause()` | function | Pause |
| `stop()` | function | Stop playback and reset to start |
| `seek(time)` | function | Seek to specified time |
| `setRate(rate)` | function | Set playback speed |
| `currentTime` | number | Current playback time |
| `duration` | number | Total duration |
| `isPlaying` | boolean | Is currently playing |

```vue
<template>
  <VueWavePlayer ref="player" src="/audio.mp3" />
  <button @click="player.play()">Play</button>
  <button @click="player.pause()">Pause</button>
  <button @click="player.stop()">Stop</button>
</template>

<script setup>
const player = ref()

player.play()        // start playback
player.pause()       // pause
player.stop()        // stop and reset to start
player.seek(10)      // seek to 10 sec
player.setRate(1.5)  // speed 1.5x
player.currentTime   // current time
player.duration      // duration
player.isPlaying     // is playing
</script>
```

## Examples

### Custom Colors

```vue
<VueWavePlayer
  src="/audio.mp3"
  primary-color="#E91E63"
  background-color="#FCE4EC"
/>
```

### Playback Speed

```vue
<VueWavePlayer
  src="/audio.mp3"
  show-playback-rate
  :playback-rates="[1, 1.5, 2]"
/>
```

## License

MIT © 2025 [Spot](https://wespot.ru)
