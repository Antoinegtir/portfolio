<script setup lang="ts">
import { experiences, profile } from '~/content/experiences'

const dock = [
  { label: 'Mail', kind: 'mail', href: `mailto:${profile.email}` },
  { label: 'GitHub', kind: 'github', href: profile.github },
  { label: 'LinkedIn', kind: 'linkedin', href: profile.linkedin },
] as const

// Active app = the last section whose title row has crossed 70% of the viewport height, so the
// wallpaper starts shifting as soon as the next app comes into view. Clicking an icon pins it right away.
const ACTIVE_LINE = 0.7
// 'portfolio' = above the first section (the hero): neutral wallpaper, no app highlighted
const activeId = ref('portfolio')
const PORTFOLIO_PALETTE = ['#3b3b3b', '#5a5a5a', '#1c1c1c']
const palette = computed(() => experiences.find(e => e.id === activeId.value)?.palette ?? PORTFOLIO_PALETTE)

// Blob positions orbit the screen as the page scrolls (one third of a turn apart), so the
// wallpaper drifts with the reader instead of only cross-fading colours. The displayed angle
// eases towards the scroll-driven target every frame, which keeps the motion continuous even
// when the page jumps several sections at once.
const targetProgress = ref(0)
const shownProgress = ref(0)
const blobPositions = computed(() =>
  [0, 1, 2].map((i) => {
    const a = shownProgress.value + (i * 2 * Math.PI) / 3
    // rounded so server and client render the same string (floating point differs across engines)
    return { x: Math.round((41.5 + 40 * Math.cos(a)) * 100) / 100, y: Math.round((90 + 78 * Math.sin(a)) * 100) / 100 }
  }),
)
let raf = 0
const TAU = 2 * Math.PI
function animate() {
  // Shortest angular path: a big jump between sections never spins more than half a turn
  const raw = targetProgress.value - shownProgress.value
  const diff = ((raw + Math.PI) % TAU + TAU) % TAU - Math.PI
  if (Math.abs(diff) > 0.0005) {
    shownProgress.value += diff * 0.045
    raf = requestAnimationFrame(animate)
  } else {
    shownProgress.value = targetProgress.value
    raf = 0
  }
}
function kick() {
  if (!raf) raf = requestAnimationFrame(animate)
}

// While a click-triggered smooth scroll is running, the clicked app stays active so the
// wallpaper makes a single colour transition instead of one per section passed over
let pinnedUntil = 0
function pin(ms: number) {
  pinnedUntil = performance.now() + ms
}

function updateActive() {
  targetProgress.value = window.scrollY / 2200
  kick()
  if (performance.now() < pinnedUntil) return
  const line = window.innerHeight * ACTIVE_LINE
  let current = 'portfolio'
  for (const e of experiences) {
    const el = document.getElementById(e.id)
    if (!el) continue
    const r = el.getBoundingClientRect()
    const padding = parseFloat(getComputedStyle(el).paddingTop) || 0
    const rowCenter = r.top + padding + (r.height - padding) / 2
    if (rowCenter <= line + 8) current = e.id
  }
  activeId.value = current
}
function unpin() {
  pinnedUntil = 0
}
onMounted(() => {
  updateActive()
  shownProgress.value = targetProgress.value
  window.addEventListener('scroll', updateActive, { passive: true })
  window.addEventListener('scrollend', unpin)
})
onUnmounted(() => {
  window.removeEventListener('scroll', updateActive)
  window.removeEventListener('scrollend', unpin)
  if (raf) cancelAnimationFrame(raf)
})

function toTop() {
  activeId.value = 'portfolio'
  pin(2500)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const { icons, demo, replayDemo } = useIconLoading()

function goTo(id: string) {
  activeId.value = id
  pin(2500) // released earlier by scrollend where supported
  const el = document.getElementById(id)
  if (!el) return
  // Align the section title row (icon + name) with the phone's status bar line, like a hand-off between the two columns
  const clock = document.querySelector('.phone .time')?.getBoundingClientRect()
  const targetCenter = clock ? clock.top + clock.height / 2 : 110
  const padding = parseFloat(getComputedStyle(el).paddingTop) || 0
  const rowHeight = el.getBoundingClientRect().height - padding
  // Layout position (offsetTop chain) rather than getBoundingClientRect: sections that are not
  // revealed yet carry a translateY transform that would skew the measurement
  let y = 0
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) y += node.offsetTop
  window.scrollTo({ top: y + padding + rowHeight / 2 - targetCenter, behavior: 'smooth' })
}

// Status bar: real clock (no AM/PM, like iOS); the signal/wifi/battery glyphs are a static image
const time = ref('9:41')
let clock: ReturnType<typeof setInterval> | undefined

function tick() {
  // iOS shows "9:41" in 12-hour locales but "09:41" in 24-hour ones
  const hour12 = new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions().hour12 ?? false
  const parts = new Intl.DateTimeFormat(undefined, { hour: hour12 ? 'numeric' : '2-digit', minute: '2-digit', hour12 }).formatToParts(new Date())
  time.value = parts.filter(p => p.type !== 'dayPeriod' && p.type !== 'literal' || p.value === ':').map(p => p.value).join('')
}

onMounted(() => {
  tick()
  clock = setInterval(tick, 15_000)
})
onUnmounted(() => clearInterval(clock))
</script>

<template>
  <div class="phone" aria-hidden="true">
    <div class="screen">
      <div class="wallpaper" aria-hidden="true">
        <i v-for="(pos, i) in blobPositions" :key="i" class="blob" :style="{ backgroundColor: palette[i], transform: `translate(${pos.x}cqw, ${pos.y}cqw)` }" />
      </div>
      <div class="island" />
      <div class="status">
        <span class="time">{{ time }}</span>
        <img src="/statusbar.png" alt="" class="status-icons" width="161" height="31">
      </div>

      <div class="grid">
        <button v-for="e in experiences" :key="e.id" type="button" class="app" :class="{ 'app--active': e.id === activeId }" @click="goTo(e.id)">
          <span class="app-icon" :style="icons[e.id]?.loaded ? { backgroundImage: `url(${e.icon})` } : undefined">
            <IconBlueprint v-if="!icons[e.id]?.loaded" />
            <span v-if="!icons[e.id]?.loaded" class="icon-shimmer" />
            <template v-if="!icons[e.id]?.ready">
              <span class="veil" :class="{ pre: icons[e.id]?.pre }" :style="{ '--p': icons[e.id]?.progress ?? 0, '--s': icons[e.id]?.size ?? 0, '--v': icons[e.id]?.reveal ?? 0 }" />
              <span class="pie" :class="{ pre: icons[e.id]?.pre }" :style="{ '--p': icons[e.id]?.progress ?? 0, '--s': icons[e.id]?.size ?? 0, '--v': icons[e.id]?.reveal ?? 0 }" />
            </template>
          </span>
          <span class="app-label">{{ icons[e.id]?.ready ? (e.shortName ?? e.name) : 'Installing…' }}</span>
        </button>
        <!-- demo tile: replays a simulated 3s download on every click -->
        <button v-if="SHOW_DEMO" type="button" class="app" title="Replay the loading animation" @click="replayDemo">
          <span class="app-icon" :style="demo.loaded ? { backgroundImage: 'url(/logo.png)' } : undefined">
            <IconBlueprint v-if="!demo.loaded" />
            <span v-if="!demo.loaded" class="icon-shimmer" />
            <template v-if="!demo.ready">
              <span class="veil" :style="{ '--p': demo.progress, '--s': demo.size, '--v': demo.reveal }" />
              <span class="pie" :style="{ '--p': demo.progress, '--s': demo.size, '--v': demo.reveal }" />
            </template>
          </span>
          <span class="app-label">{{ demo.ready ? 'Demo' : 'Installing…' }}</span>
        </button>
      </div>

      <div class="dots"><i class="on" /><i /></div>

      <div class="dock">
        <a v-for="d in dock" :key="d.label" :href="d.href" target="_blank" rel="noopener" class="dock-app" :title="d.label">
          <span class="app-icon" :class="`dock-${d.kind}`">
            <svg v-if="d.kind === 'github'" viewBox="0 0 16 16" fill="#fff">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <svg v-else-if="d.kind === 'linkedin'" class="linkedin" viewBox="3 3 17.7 17.7" fill="#fff">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
            </svg>
          </span>
        </a>
      </div>

      <div class="home-bar" />
    </div>
    <img src="/iphone-frame.png" alt="" class="frame" width="812" height="1600">
  </div>
</template>

<style scoped>
/*
 * Everything inside the phone is sized in cqw (1% of the phone width) so the
 * mock scales as one unit. The screen rectangle matches the transparent area of
 * device.png: x 170-1829, y 170-3769 on a 2000x3940 image.
 */
.phone {
  position: relative;
  width: min(430px, (100vh - 100px) * 0.5076);
  aspect-ratio: 2000 / 3940;
  container-type: inline-size;
  filter: drop-shadow(0 20px 56px rgba(0, 0, 0, 0.55));
}
.frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
  user-select: none;
}
.screen {
  position: absolute;
  left: 8.5cqw;
  top: 8.5cqw;
  width: 83cqw;
  height: 180cqw;
  border-radius: 7cqw;
  overflow: hidden;
  z-index: 1;
  background: linear-gradient(180deg, #0a0a14 0%, #05050a 100%);
}
/* Wallpaper: three blurred colour blobs; background-color animates, so the palette cross-fades smoothly */
.wallpaper {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
}
.blob {
  position: absolute;
  left: -35cqw; /* translate() places the blob centre, see blobPositions */
  top: -35cqw;
  display: block;
  width: 70cqw;
  height: 70cqw;
  border-radius: 50%;
  filter: blur(22cqw);
  opacity: 0.5;
  transition: background-color 1400ms ease;
  will-change: background-color, transform;
}
.blob:nth-child(2) { width: 80cqw; height: 80cqw; left: -40cqw; top: -40cqw; opacity: 0.45; }
.blob:nth-child(3) { opacity: 0.4; }
.app--active .app-label {
  color: #fff;
}
/* loading state: dimmed blueprint + iOS-style pie, then the real icon fades in */
/* dark veil over the base (blueprint or the real icon) while installing; the ring/pie stays pure white */
.veil {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.58);
  /* the circle is cut out of the veil (47% of the corner distance), then grows past the corners */
  --hole: calc(47% * var(--s, 0) + var(--v, 0) * 58%);
  -webkit-mask-image: radial-gradient(circle, transparent var(--hole), #000 calc(var(--hole) + 0.5px));
  mask-image: radial-gradient(circle, transparent var(--hole), #000 calc(var(--hole) + 0.5px));
}
/* dot -> ring -> pie: the element scales with --s, the thick white border is the ring, the conic fill the pie */
.pie {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 66%;
  height: 66%;
  border-radius: 50%;
  /* the ring is see-through: the icon shows undimmed through it, like through the loaded share */
  border: 0.85cqw solid transparent;
  background: conic-gradient(transparent calc(var(--p, 0) * 360deg), rgba(0, 0, 0, 0.58) 0);
  background-clip: padding-box;
  transform: scale(var(--s));
}
.app-icon {
  transition: filter 300ms ease;
}
@media (prefers-reduced-motion: reduce) {
  .blob { transition: none; }
}
.island {
  position: absolute;
  top: 2.6cqw;
  left: 50%;
  transform: translateX(-50%);
  width: 25cqw;
  height: 7cqw;
  border-radius: 4cqw;
  background: #000;
}
.status {
  position: absolute;
  top: 3.2cqw;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 7.5cqw 0 10.5cqw;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Inter, sans-serif;
  font-size: 3.6cqw;
  font-weight: 600;
  line-height: 6cqw;
  color: #fff;
}
.status-icons {
  display: block;
  height: 3.4cqw;
  width: auto;
}
.grid {
  position: absolute;
  top: 18cqw;
  left: 3.5cqw;
  width: 76cqw;
  display: grid;
  grid-template-columns: repeat(4, 19cqw);
  grid-auto-rows: 23cqw;
}
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1cqw;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
}
.app:active .app-icon {
  filter: brightness(0.7);
}
.app-icon {
  display: grid;
  place-items: center;
  width: 14cqw;
  height: 14cqw;
  border-radius: 3.5cqw;
  background-size: cover;
  background-position: center;
  box-shadow: 0 0.6cqw 1.6cqw rgba(0, 0, 0, 0.35);
  overflow: hidden;
  position: relative;
  isolation: isolate;
}
/*
 * iOS 26 "liquid glass" edge, after the CSS recreations of Apple's material
 * (thin rim bright at the top, fading down the sides, muted again at the bottom,
 * plus a specular lip and a soft sheen from above).
 */
.app-icon::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 0.18cqw;
  pointer-events: none;
  z-index: 2;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.18) 20%,
    rgba(255, 255, 255, 0) 38%,
    rgba(255, 255, 255, 0) 82%,
    rgba(255, 255, 255, 0.22) 100%
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
.app-icon::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(120% 55% at 30% 0%, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0) 60%);
  box-shadow:
    inset 0 0.3cqw 0.3cqw rgba(255, 255, 255, 0.45),
    inset 0 -0.5cqw 0.8cqw rgba(0, 0, 0, 0.16);
}
.app-label {
  max-width: 19cqw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Inter, sans-serif;
  font-size: 2.7cqw;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.2;
  color: #fff;
  text-shadow: 0 0.2cqw 0.6cqw rgba(0, 0, 0, 0.5);
}
.dots {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 30cqw;
  display: flex;
  justify-content: center;
  gap: 1.6cqw;
}
.dots i {
  width: 1.4cqw;
  height: 1.4cqw;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
}
.dots i.on {
  background: #fff;
}
.dock {
  position: absolute;
  left: 3.5cqw;
  right: 3.5cqw;
  bottom: 5cqw;
  height: 21.5cqw;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-radius: 7cqw;
  background: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.dock-app {
  display: block;
}
.dock-app .app-icon svg {
  width: 62%;
  height: 62%;
}
.dock-mail {
  background-image: url('/icons/mail.png');
}
.dock-github {
  background: #111;
}
.dock-linkedin {
  background: linear-gradient(160deg, #3b82de 0%, #2468c9 55%, #1a58b4 100%);
}
.dock-linkedin svg.linkedin {
  width: 64%;
  height: 64%;
  fill: rgba(255, 255, 255, 0.95);
  /* soft glass relief on the glyph */
  filter: drop-shadow(0 0.25cqw 0.35cqw rgba(0, 0, 0, 0.22)) drop-shadow(0 -0.1cqw 0.15cqw rgba(255, 255, 255, 0.35));
}
.home-bar {
  position: absolute;
  left: 50%;
  bottom: 1.6cqw;
  transform: translateX(-50%);
  width: 28cqw;
  height: 1.1cqw;
  border-radius: 1cqw;
  background: rgba(255, 255, 255, 0.9);
}
</style>
