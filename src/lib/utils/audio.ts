export function normalizeWaveform(waveform: number[]): number[] {
  const max = Math.max(...waveform)
  return max === 0 
    ? waveform.map(() => 0.1) 
    : waveform.map(v => Math.max(0.1, v / max))
}

export async function analyzeAudio(audioBuffer: AudioBuffer, barCount: number): Promise<number[]> {
  const data = audioBuffer.getChannelData(0)
  const step = Math.floor(data.length / barCount)
  const waveform: number[] = []
  for (let i = 0; i < barCount; i++) {
    const start = i * step
    const end = Math.min(start + step, data.length)
    let sum = 0
    for (let j = start; j < end; j++) sum += Math.abs(data[j])
    waveform.push(sum / (end - start))
  }
  return normalizeWaveform(waveform)
}

export async function fetchAudioBuffer(url: string, ctx: AudioContext): Promise<AudioBuffer> {
  const res = await fetch(url, { mode: 'cors' })
  if (!res.ok) throw new Error(`Failed to load audio: ${res.status}`)
  return ctx.decodeAudioData(await res.arrayBuffer())
}

export const generatePlaceholderWaveform = (count: number) => Array(count).fill(0)

export function generateFallbackWaveform(count: number): number[] {
  return Array.from({ length: count }, (_, i) => {
    const x = i / count
    return Math.min(1, Math.max(0.1, Math.sin(x * Math.PI * 4) * 0.3 + 0.5 + Math.random() * 0.2))
  })
}

export function interpolateWaveform(data: number[], targetCount: number): number[] {
  if (data.length === targetCount) return data
  const ratio = data.length / targetCount
  const result: number[] = []
  for (let i = 0; i < targetCount; i++) {
    const pos = i * ratio
    const low = Math.floor(pos)
    const high = Math.min(Math.ceil(pos), data.length - 1)
    result.push(data[low] * (1 - (pos - low)) + data[high] * (pos - low))
  }
  return normalizeWaveform(result)
}
