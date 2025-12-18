# Changelog

All notable changes to this project are documented in this file.

## [1.0.8] — 2025-12-11

### Added

- ⏹️ **`stop()` method** — added method to stop playback and reset current time to 0
- 📖 **Documentation update** — updated README with `stop()` method description

## [1.0.7] — 2025-01-10

### Changed

- 🌐 **English documentation** — all documentation translated to English
- 💾 **Language persistence** — selected language saved to localStorage
- 📝 **Code optimization** — removed comments, optimized functions, reduced bundle size
- 📦 **Bundle size reduced** — from 15.98 kB to 14.87 kB (ESM), from 12.68 kB to 12.13 kB (UMD)
- 🔀 **Git workflow** — added develop branch for development, main branch protected

## [1.0.3-1.0.6] — 2025-12-10

### Improved

- 📱 **Mobile responsiveness** — player now displays correctly on 320px screens
- 🎨 **Telegram-style demo page** — updated design with dark theme
- 📋 **Copy code buttons** — added SVG icons for copying examples
- 🔗 **Anchor links** — all documentation sections are now clickable with hashtags
- 📦 **Reduced package size** — removed unnecessary files from npm (example.mp3)

### Fixed

- 🐛 Fixed canvas width on mobile devices
- 🐛 Fixed adaptive badge wrapping

## [1.0.2] — 2025-12-09

### Added

- 🖼️ **Canvas waveform rendering** — crisp display on any screen (including Retina)
- ✨ **Smooth appearance animation** — waveform animates from 0 to full height over 0.6s
- 🔇 **Auto-stop other players** — playing one player automatically pauses others
- 📏 **`barWidth` and `barGap` props** — customize bar width and spacing in pixels
- 📊 **Dynamic bar count** — calculated automatically based on container width

### Improved

- 🎯 Improved bar rendering clarity (coordinates rounded to whole pixels)
- ⚡ Optimized redraw performance on resize

## [1.0.1] — 2025-12-09

### Added

- 🔌 Support for `app.use(VueWavePlayer)` for global registration
- 📖 Updated documentation with usage examples

### Fixed

- 📝 Added style import instructions to README

## [1.0.0] — 2025-12-09

### Added

- 🎨 `VueWavePlayer` component with Telegram-style design
- 📊 Automatic waveform generation from audio file (Web Audio API)
- 🎯 Click and drag seeking
- ⏱️ Current time and duration display
- 🔄 Playback speed button (1x, 1.5x, 2x)
- 🎨 Color customization via `primaryColor` and `backgroundColor`
- 🔌 `#play-button` slot for custom play button
- 🔌 `#time` slot for custom time display
- 📱 Touch event support for mobile devices
- 🧩 `useWavePlayer` composable for custom implementations
- 📡 Events: `play`, `pause`, `ended`, `timeupdate`, `durationchange`, `ratechange`, `error`
- 🔧 Ref methods: `play()`, `pause()`, `toggle()`, `seek()`, `setRate()`
- 📦 TypeScript types
