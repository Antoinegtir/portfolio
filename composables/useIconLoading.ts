import { experiences } from '~/content/experiences'

/**
 * loaded: the image is available (shown dimmed under the indicator until the animation ends)
 * ready: the install animation is over, the icon is shown normally
 * size: diameter of the indicator (0..1 of its final size); progress: pie fill (0..1)
 */
export type IconState = { loaded: boolean; ready: boolean; progress: number; size: number; reveal: number }

/*
 * iOS-style download state for app icons: until an icon image has loaded, the tile shows
 * the blueprint placeholder with a filling pie. The pie eases towards 85% while waiting and
 * completes when the image is ready; the real icon then fades in. The demo entry replays a
 * simulated 3s download on request.
 */
// iOS install choreography: a dot appears (0-250ms), grows into a hollow ring (250-700ms),
// then the ring fills clockwise from the top until the image is ready
const DOT_END = 250
const RING_END = 700
const FINISH_MS = 450 // time to sweep the pie from its current fill to 100% once the image is ready
const REVEAL_MS = 380 // the full circle then grows and punches through the veil, revealing the icon

function track(state: IconState, src: string, minDelay = 0) {
  state.loaded = false
  state.ready = false
  state.progress = 0
  state.size = 0
  state.reveal = 0
  let done = false
  let revealStart = 0
  let finishStart = 0
  let finishFrom = 0
  const start = performance.now()
  const img = new Image()
  img.onload = () => { done = true; state.loaded = true }
  img.onerror = () => { done = true }
  img.src = src
  // Already cached: the real icon shows right away (dimmed) while the choreography completes
  if (img.complete && img.naturalWidth > 0) {
    done = true
    state.loaded = true
  }
  function step() {
    const elapsed = performance.now() - start
    if (elapsed < DOT_END) {
      state.size = 0.22 * (elapsed / DOT_END)
      state.progress = 1 // solid dot
    } else if (elapsed < RING_END) {
      const t = (elapsed - DOT_END) / (RING_END - DOT_END)
      state.size = 0.22 + 0.78 * (1 - Math.pow(1 - t, 3))
      state.progress = 0 // hollow ring
    } else if (done && elapsed >= minDelay && elapsed >= RING_END + 250) {
      // image ready: sweep the pie smoothly to 100% instead of jumping, then reveal
      state.size = 1
      if (finishStart === 0) {
        finishStart = elapsed
        finishFrom = state.progress
      }
      const t = Math.min(1, (elapsed - finishStart) / FINISH_MS)
      state.progress = finishFrom + (1 - finishFrom) * (1 - Math.pow(1 - t, 3))
      if (t >= 1) {
        if (revealStart === 0) revealStart = elapsed
        const r = Math.min(1, (elapsed - revealStart) / REVEAL_MS)
        state.reveal = 1 - Math.pow(1 - r, 2)
        if (r >= 1) {
          state.ready = true
          return
        }
      }
    } else {
      state.size = 1
      state.progress = Math.min(0.85, state.progress + (0.85 - state.progress) * 0.03)
    }
    requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
export function useIconLoading() {
  const icons = reactive<Record<string, IconState>>({})
  const demo = reactive<IconState>({ loaded: false, ready: false, progress: 0, size: 0, reveal: 0 })

  function replayDemo() {
    track(demo, `/logo.png?demo=${Date.now()}`, 3000)
  }
  onMounted(() => {
    for (const e of experiences) {
      icons[e.id] = { loaded: false, ready: false, progress: 0, size: 0, reveal: 0 }
      track(icons[e.id], e.icon)
    }
    replayDemo()
  })

  return { icons, demo, replayDemo }
}

/** Install animation for a single icon (e.g. the section heading). */
export function useSingleIconLoading(src: string) {
  const state = reactive<IconState>({ loaded: false, ready: false, progress: 0, size: 0, reveal: 0 })
  onMounted(() => track(state, src))
  return state
}
