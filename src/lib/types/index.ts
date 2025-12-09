export interface WavePlayerProps {
  /** URL аудио файла */
  src: string
  
  /** Количество столбиков волны */
  barCount?: number
  
  /** Основной цвет (по умолчанию: #3390EC - синий Telegram) */
  primaryColor?: string
  
  /** Цвет фона (по умолчанию: #FFFFFF) */
  backgroundColor?: string
  
  /** Автовоспроизведение при монтировании */
  autoplay?: boolean
  
  /** Показывать кнопку скорости (по умолчанию: false) */
  showPlaybackRate?: boolean
  
  /** Доступные скорости воспроизведения */
  playbackRates?: number[]
}

export interface WavePlayerSlots {
  /** Слот для кастомной кнопки воспроизведения */
  'play-button': {
    isPlaying: boolean
    isLoading: boolean
    toggle: () => void
  }
  /** Слот для кастомного отображения времени */
  'time': {
    currentTime: number
    duration: number
    formattedCurrentTime: string
    formattedDuration: string
  }
}

export interface WavePlayerEmits {
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'ended'): void
  (e: 'timeupdate', currentTime: number): void
  (e: 'durationchange', duration: number): void
  (e: 'seeking', time: number): void
  (e: 'seeked', time: number): void
  (e: 'ratechange', rate: number): void
  (e: 'error', error: Error): void
  (e: 'loading'): void
  (e: 'loaded'): void
}

export interface WavePlayerExpose {
  /** Начать воспроизведение */
  play: () => void
  /** Поставить на паузу */
  pause: () => void
  /** Переключить воспроизведение/паузу */
  toggle: () => void
  /** Перемотать к указанному времени */
  seek: (time: number) => void
  /** Установить скорость воспроизведения */
  setRate: (rate: number) => void
  /** Текущее время воспроизведения */
  currentTime: number
  /** Общая длительность */
  duration: number
  /** Воспроизводится ли сейчас */
  isPlaying: boolean
  /** Текущая скорость воспроизведения */
  playbackRate: number
}

export type PlayerState = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

