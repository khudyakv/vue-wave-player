/**
 * Анализ аудио буфера и генерация данных волны
 */
export async function analyzeAudio(
  audioBuffer: AudioBuffer,
  barCount: number
): Promise<number[]> {
  const rawData = audioBuffer.getChannelData(0)
  const samplesPerBar = Math.floor(rawData.length / barCount)
  const waveform: number[] = []

  for (let i = 0; i < barCount; i++) {
    const start = i * samplesPerBar
    const end = Math.min(start + samplesPerBar, rawData.length)
    let sum = 0

    for (let j = start; j < end; j++) {
      sum += Math.abs(rawData[j])
    }

    waveform.push(sum / (end - start))
  }

  return normalizeWaveform(waveform)
}

/**
 * Нормализация значений волны в диапазон 0-1
 */
export function normalizeWaveform(waveform: number[]): number[] {
  const max = Math.max(...waveform)
  if (max === 0) return waveform.map(() => 0.1)
  
  return waveform.map((value) => {
    const normalized = value / max
    return Math.max(0.1, normalized)
  })
}

/**
 * Загрузка и декодирование аудио по URL
 */
export async function fetchAudioBuffer(
  url: string,
  audioContext: AudioContext
): Promise<AudioBuffer> {
  const response = await fetch(url, { mode: 'cors' })
  if (!response.ok) {
    throw new Error(`Ошибка загрузки аудио: ${response.status}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  return await audioContext.decodeAudioData(arrayBuffer)
}

/**
 * Генерация пустой волны для состояния загрузки
 */
export function generatePlaceholderWaveform(barCount: number): number[] {
  return Array.from({ length: barCount }, () => 0)
}

/**
 * Генерация запасной волны (при ошибке анализа)
 */
export function generateFallbackWaveform(barCount: number): number[] {
  return Array.from({ length: barCount }, (_, i) => {
    const x = i / barCount
    const wave = Math.sin(x * Math.PI * 4) * 0.3 + 0.5
    const noise = Math.random() * 0.2
    return Math.min(1, Math.max(0.1, wave + noise))
  })
}

/**
 * Интерполяция данных волны под нужное количество столбиков
 */
export function interpolateWaveform(
  data: number[],
  targetCount: number
): number[] {
  if (data.length === targetCount) return data
  
  const result: number[] = []
  const ratio = data.length / targetCount

  for (let i = 0; i < targetCount; i++) {
    const pos = i * ratio
    const low = Math.floor(pos)
    const high = Math.min(Math.ceil(pos), data.length - 1)
    const weight = pos - low
    
    result.push(data[low] * (1 - weight) + data[high] * weight)
  }

  return normalizeWaveform(result)
}

