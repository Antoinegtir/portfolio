import { experiences } from '~/content/experiences'

/**
 * loaded: the image is available (shown dimmed under the indicator until the animation ends)
 * ready: the install animation is over, the icon is shown normally
 * size: diameter of the indicator (0..1 of its final size); progress: pie fill (0..1)
 */
/** Demo tile (replays the install animation on click): hidden until needed again */
export const SHOW_DEMO = false

export type IconState = { loaded: boolean; ready: boolean; progress: number; size: number; reveal: number; pre: boolean }

/*
 * iOS-style download state for app icons: until an icon image has loaded, the tile shows
 * the blueprint placeholder with a filling pie. The pie creeps to 50% over 5s while waiting and
 * completes when the image is ready; the real icon then fades in. The demo entry replays a
 * simulated 3s download on request.
 */
// iOS install choreography: a dot appears (0-250ms), grows into a hollow ring (250-700ms),
// then the ring fills clockwise from the top until the image is ready
const DOT_END = 250
const RING_END = 700
const FINISH_MS = 450 // time to sweep the pie from its current fill to 100% once the image is ready
const HALF_AT = 8000 // while the image is still fetching, the pie reaches 50% at this point (then creeps on to 70%)
const REVEAL_MS = 380 // the full circle then grows and punches through the veil, revealing the icon

function track(state: IconState, src: string, minDelay = 0) {
  // Before hydration the server-rendered tiles run the same choreography as a pure CSS animation
  // (see .pre in main.css); here we pick it up where it is, timing it from the first paint
  const resume = state.pre
  const firstPaint = performance.getEntriesByType('paint').find(e => e.name === 'first-contentful-paint')?.startTime ?? 0
  const start = resume ? Math.min(performance.now(), firstPaint) : performance.now()
  state.loaded = false
  state.ready = false
  state.reveal = 0
  if (!resume) {
    state.progress = 0
    state.size = 0
  }
  let done = false
  let revealStart = 0
  let finishStart = 0
  let finishFrom = 0
  const img = new Image()
  // Swap the placeholder for the real icon only once it is decoded, so the tile never goes blank
  // for a frame while the browser rasterises the image (visible on slower phones)
  const show = () => img.decode().catch(() => {}).then(() => { done = true; state.loaded = true })
  img.onload = show
  img.onerror = () => { done = true }
  img.src = src
  // Already cached: the real icon shows right away (dimmed) while the choreography completes
  if (img.complete && img.naturalWidth > 0) show()
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
      // still fetching: fill the first half slowly so the site start reads as a download in progress
      state.size = 1
      state.progress = Math.min(0.7, (elapsed - RING_END) / (HALF_AT - RING_END) * 0.5)
    }
    requestAnimationFrame(step)
  }
  // first frame computed synchronously so the hand-off from the CSS animation shows no flash
  step()
  state.pre = false
}
export function useIconLoading() {
  // Rendered on the server with the CSS pre-hydration animation (pre: true)
  const icons = reactive<Record<string, IconState>>(
    Object.fromEntries(experiences.map(e => [e.id, { loaded: false, ready: false, progress: 0, size: 0, reveal: 0, pre: true }])),
  )
  const demo = reactive<IconState>({ loaded: false, ready: false, progress: 0, size: 0, reveal: 0, pre: false })

  function replayDemo() {
    track(demo, `/logo.webp?demo=${Date.now()}`, 3000)
  }
  onMounted(() => {
    for (const e of experiences) track(icons[e.id], e.icon)
    if (SHOW_DEMO) replayDemo()
  })

  return { icons, demo, replayDemo }
}

/** Install animation for a single icon (e.g. the section heading). */
export function useSingleIconLoading(src: string) {
  const state = reactive<IconState>({ loaded: false, ready: false, progress: 0, size: 0, reveal: 0, pre: true })
  onMounted(() => track(state, src))
  return state
}
