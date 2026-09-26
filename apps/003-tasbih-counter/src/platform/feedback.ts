// 탭 피드백: 진동(네이티브는 Capacitor Haptics, 웹은 navigator.vibrate) + 선택적 클릭음.
import { Capacitor } from '@capacitor/core'
import type { TapEvent } from '../core/state'

const native = Capacitor.isNativePlatform()

async function vibrate(ms: number): Promise<void> {
  try {
    if (native) {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics')
      if (ms <= 30) await Haptics.impact({ style: ImpactStyle.Light })
      else await Haptics.vibrate({ duration: ms })
    } else {
      navigator.vibrate?.(ms)
    }
  } catch {
    // 진동 미지원 기기 — 무시
  }
}

let ctx: AudioContext | null = null
function click(freq: number, duration: number): void {
  try {
    ctx ??= new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch {
    // 오디오 미지원 — 무시
  }
}

const PATTERN: Record<TapEvent, { ms: number; freq: number; dur: number }> = {
  tick: { ms: 20, freq: 1200, dur: 0.03 },
  goal: { ms: 250, freq: 880, dur: 0.25 },
  step: { ms: 250, freq: 880, dur: 0.25 },
  complete: { ms: 500, freq: 660, dur: 0.5 },
}

export function feedback(event: TapEvent, opts: { vibrate: boolean; sound: boolean }): void {
  const p = PATTERN[event]
  if (opts.vibrate) void vibrate(p.ms)
  if (opts.sound) click(p.freq, p.dur)
}
