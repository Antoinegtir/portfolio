import { experiences } from '~/content/experiences'

/** size: diameter of the indicator (0..1 of its final size); progress: pie fill (0..1) */
export type IconState = { ready: boolean; progress: number; size: number }

/*
 * iOS-style download state for app icons: until an icon image has loaded, the tile shows
 * the blueprint placeholder with a filling pie. The pie eases towards 85% while waiting and
 * completes when the image is ready; the real icon then fades in. The demo entry replays a
 * simulated 3s download on request.
 */
export function useIconLoading() {
  const icons = reactive<Record<string, IconState>>({})
  const demo = reactive<IconState>({ ready: false, progress: 0, size: 0 })

  // iOS install choreography: a dot appears (0-250ms), grows into a hollow ring (250-700ms),
  // then the ring fills clockwise from the top until the image is ready
  const DOT_END = 250
  const RING_END = 700

  function track(state: IconState, src: string, minDelay = 0) {
    state.ready = false
    state.progress = 0
    state.size = 0
    let done = false
    const start = performance.now()
    const img = new Image()
    img.onload = img.onerror = () => { done = true }
    img.src = src
    // Already cached (or inline): show the real icon right away, no install choreography
    if (!minDelay && img.complete && img.naturalWidth > 0) {
      state.size = 1
      state.progress = 1
      state.ready = true
      return
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
      } else if (done && elapsed >= minDelay) {
        state.size = 1
        state.progress = 1
        setTimeout(() => { state.ready = true }, 220)
        return
      } else {
        state.size = 1
        state.progress = Math.min(0.85, state.progress + (0.85 - state.progress) * 0.03)
      }
      requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
  function replayDemo() {
    track(demo, `/logo.png?demo=${Date.now()}`, 3000)
  }
  onMounted(() => {
    for (const e of experiences) {
      icons[e.id] = { ready: false, progress: 0, size: 0 }
      track(icons[e.id], e.icon)
    }
    replayDemo()
  })

  return { icons, demo, replayDemo }
}
