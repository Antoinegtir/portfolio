<script setup lang="ts">
import type { LightboxState } from '~/composables/useLightbox'

const { state, close } = useLightbox()

const img = ref<HTMLImageElement | null>(null)
const visible = ref(false) // backdrop + image mounted
const expanded = ref(false) // image at its final (centered) box
const swapping = ref(false) // brief fade while stepping to a sibling image
const current = ref<LightboxState | null>(null)
const box = ref({ x: 0, y: 0, w: 0, h: 0 })

const DURATION = 320

const group = computed(() => current.value?.group ?? (current.value ? [current.value.src] : []))
const index = computed(() => (current.value ? group.value.indexOf(current.value.src) : -1))
const count = computed(() => group.value.length)
const hasNav = computed(() => count.value > 1)

const MOBILE = 640
const isMobile = () => window.innerWidth <= MOBILE

// Desktop carousel, in the spirit of Flutter's carousel_slider with enlargeCenterPage: every
// visible screenshot sits on one track and is placed by its offset from the current index.
// Stepping only changes the offsets, so the next item slides to the centre while growing and the
// current one slides out while shrinking, all with one fast-out-slow-in curve.
const desktop = ref(true)
const SIDE_SCALE = 0.78
const SIDE_GAP = 40
const carousel = computed(() => desktop.value && hasNav.value && count.value > 2)
const slots = computed(() => {
  if (!carousel.value) return []
  const out: { src: string, off: number }[] = []
  const seen = new Set<string>()
  // nearest first so a short group never shows the same image twice
  for (const off of [0, -1, 1, -2, 2]) {
    const src = group.value[(index.value + off + count.value * 3) % count.value]
    if (seen.has(src)) continue
    seen.add(src)
    out.push({ src, off })
  }
  // Keep a stable DOM order (the group order): if Vue had to move an <img> between siblings,
  // the browser would drop its transition and the slide would jump. Stacking comes from z-index.
  return out.sort((a, b) => group.value.indexOf(a.src) - group.value.indexOf(b.src))
})
function slotStyle(off: number) {
  const b = box.value
  const shift = off === 0 ? 0 : Math.sign(off) * (b.w / 2 + SIDE_GAP + (b.w * SIDE_SCALE) / 2)
  const far = Math.abs(off) > 1
  return {
    left: `${b.x}px`,
    top: `${b.y}px`,
    width: `${b.w}px`,
    height: `${b.h}px`,
    transform: `translateX(${far ? shift * 2 : shift}px) scale(${off === 0 ? 1 : SIDE_SCALE})`,
    opacity: off === 0 ? 1 : far ? 0 : 0.35,
    filter: off === 0 ? 'none' : 'saturate(0.7)',
    zIndex: 2 - Math.abs(off),
    pointerEvents: (far ? 'none' : 'auto') as 'none' | 'auto',
  }
}
function onSlot(off: number) {
  if (off !== 0) step(off > 0 ? 1 : -1)
}

function targetBox(natW: number, natH: number) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  // phones: 64px band on top for the close button, 96px at the bottom for the control bar
  const top = isMobile() ? 64 : 40
  const bottom = isMobile() ? (hasNav.value ? 96 : 32) : (hasNav.value ? 72 : 40)
  const maxW = isMobile() ? vw - 32 : vw * 0.9
  const maxH = vh - top - bottom
  const scale = Math.min(maxW / natW, maxH / natH, 1)
  const w = natW * scale
  const h = natH * scale
  return { x: (vw - w) / 2, y: top + (maxH - h) / 2, w, h }
}

async function waitDecoded(el: HTMLImageElement) {
  // decode() can hang for lazily loaded thumbnails that never started loading, hence the timeout
  await Promise.race([el.decode().catch(() => {}), new Promise(r => setTimeout(r, 400))])
}

async function show(s: LightboxState) {
  desktop.value = !isMobile()
  current.value = s
  box.value = s.from
  visible.value = true
  expanded.value = false
  await nextTick()
  const el = img.value!
  await waitDecoded(el)
  if (current.value !== s) return // closed in the meantime
  const natW = el.naturalWidth || s.from.w
  const natH = el.naturalHeight || s.from.h
  setTimeout(() => {
    if (current.value !== s) return
    box.value = targetBox(natW, natH)
    expanded.value = true
  }, 20)
}

// Thumbnail to fly to/from for a given image, only when it is really displayed on the page
// (the extra screenshots are collapsed behind "N more screenshots", badge proofs behind their
// dropdown). A hidden thumbnail has no box, and the image fades out in place instead.
function visibleThumbBox(src: string) {
  const thumb = document.querySelector<HTMLImageElement>(`img.shot[src="${src}"]`)
  if (!thumb || !thumb.offsetParent) return null
  const r = thumb.getBoundingClientRect()
  if (r.width === 0 || r.height === 0) return null
  return { x: r.left, y: r.top, w: r.width, h: r.height }
}

const fading = ref(false) // closing without a visible thumbnail: fade out in place

function hide() {
  if (!current.value) return
  expanded.value = false
  const to = visibleThumbBox(current.value.src)
  if (to) {
    box.value = to
  }
  else {
    fading.value = true
  }
  setTimeout(() => {
    visible.value = false
    current.value = null
    fading.value = false
  }, DURATION)
}

async function step(delta: number) {
  const s = current.value
  if (!s || !hasNav.value || swapping.value) return
  const next = group.value[(index.value + delta + count.value) % count.value]
  if (carousel.value) {
    s.src = next
    return
  }
  swapping.value = true
  await new Promise(r => setTimeout(r, 120))
  s.src = next
  await nextTick()
  const el = img.value!
  await waitDecoded(el)
  if (current.value !== s) return
  box.value = targetBox(el.naturalWidth || box.value.w, el.naturalHeight || box.value.h)
  swapping.value = false
}

watch(state, (s) => {
  if (s) show(s)
  else hide()
})

let touch: { x: number, y: number } | null = null
let swiped = false
function onTouchStart(e: TouchEvent) {
  const t = e.touches[0]
  touch = { x: t.clientX, y: t.clientY }
  swiped = false
}
function onTouchEnd(e: TouchEvent) {
  if (!touch) return
  const t = e.changedTouches[0]
  const dx = t.clientX - touch.x
  const dy = t.clientY - touch.y
  touch = null
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
    swiped = true
    step(dx < 0 ? 1 : -1)
  }
  else if (dy > 80 && dy > Math.abs(dx)) {
    swiped = true
    close()
  }
}
function onBackdrop() {
  if (swiped) { swiped = false; return }
  close()
}

function onKey(e: KeyboardEvent) {
  if (!current.value) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="lightbox"
      :class="{ 'lightbox--open': expanded }"
      @click="onBackdrop"
      @touchstart.passive="onTouchStart"
      @touchend="onTouchEnd"
    >
      <div v-if="carousel && expanded" class="track">
        <img
          v-for="sl in slots"
          :key="sl.src"
          :src="sl.src"
          :alt="sl.off === 0 ? current?.alt : ''"
          class="slot"
          :class="{ 'slot--side': sl.off !== 0 }"
          :style="slotStyle(sl.off)"
          @click.stop="onSlot(sl.off)"
        >
      </div>
      <img
        ref="img"
        :src="current?.src"
        :alt="current?.alt"
        class="lightbox-img"
        :class="{ 'lightbox-img--swapping': swapping, 'lightbox-img--hidden': carousel && expanded, 'lightbox-img--fading': fading }"
        :style="{ left: box.x + 'px', top: box.y + 'px', width: box.w + 'px', height: box.h + 'px' }"
      >
      <button v-if="expanded" type="button" class="close" aria-label="Close" @click.stop="close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
      <!-- desktop: arrows on the sides + counter at the bottom; phones: one floating bar below the image -->
      <div v-if="hasNav && expanded" class="controls" @click.stop>
        <button type="button" class="nav nav--prev" aria-label="Previous screenshot" @click="step(-1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <div class="counter">
          <span class="dots" aria-hidden="true"><i v-for="n in count" :key="n" :class="{ on: n - 1 === index }" /></span>
          <span class="count">{{ index + 1 }} / {{ count }}</span>
        </div>
        <button type="button" class="nav nav--next" aria-label="Next screenshot" @click="step(1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0);
  transition: background 320ms ease;
  cursor: zoom-out;
}
.lightbox--open {
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
.lightbox-img--hidden {
  visibility: hidden; /* the track draws the current image while the carousel is open */
}
.track {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.slot {
  position: absolute;
  object-fit: cover;
  border-radius: 12px;
  border: 1.5px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
  transform-origin: center;
  /* Flutter's Curves.fastOutSlowIn */
  transition:
    transform 520ms cubic-bezier(0.4, 0, 0.2, 1),
    opacity 520ms cubic-bezier(0.4, 0, 0.2, 1),
    filter 520ms ease;
  will-change: transform, opacity;
}
.slot--side {
  cursor: pointer;
  box-shadow: none;
}
.slot--side:hover {
  opacity: 0.6 !important;
  filter: none !important;
}
.close {
  position: absolute;
  top: max(14px, env(safe-area-inset-top));
  right: 14px;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(30, 30, 30, 0.7);
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: fade-in 200ms ease both;
}
.close svg {
  width: 18px;
  height: 18px;
}
.controls {
  display: contents; /* desktop: children are positioned on the overlay */
}
@keyframes fade-in {
  from { opacity: 0; }
}
.lightbox-img {
  position: absolute;
  object-fit: cover;
  border-radius: 8px;
  border: 1.5px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
  transition:
    left 320ms cubic-bezier(0.2, 0.8, 0.2, 1),
    top 320ms cubic-bezier(0.2, 0.8, 0.2, 1),
    width 320ms cubic-bezier(0.2, 0.8, 0.2, 1),
    height 320ms cubic-bezier(0.2, 0.8, 0.2, 1),
    border-radius 320ms ease,
    opacity 120ms ease;
  will-change: left, top, width, height;
}
.lightbox--open .lightbox-img {
  border-radius: 14px;
}
.lightbox-img--fading {
  opacity: 0;
  transform: scale(0.96);
  transition: opacity 220ms ease, transform 220ms ease;
}
.lightbox-img--swapping {
  opacity: 0.35;
}
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(20, 20, 20, 0.7);
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: background 150ms ease, transform 150ms ease;
}
.nav:hover {
  background: rgba(50, 50, 50, 0.85);
}
.nav:active {
  transform: translateY(-50%) scale(0.95);
}
.nav svg {
  width: 22px;
  height: 22px;
}
.nav--prev {
  left: 24px;
}
.nav--next {
  right: 24px;
}
.counter {
  position: absolute;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(20, 20, 20, 0.7);
  color: #ddd;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
}
.dots {
  display: none;
}
/* Phones: the arrows no longer cover the screenshot. One glass bar under the image holds
   prev / page dots / next; swipe left-right also steps, swipe down closes. */
@media (max-width: 640px) {
  .controls {
    position: absolute;
    left: 50%;
    bottom: max(20px, env(safe-area-inset-bottom));
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(28, 28, 28, 0.72);
    backdrop-filter: blur(16px) saturate(1.4);
    -webkit-backdrop-filter: blur(16px) saturate(1.4);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
    animation: fade-in 200ms ease both;
  }
  .nav {
    position: static;
    transform: none;
    width: 44px;
    height: 44px;
    border: 0;
    background: rgba(255, 255, 255, 0.08);
  }
  .nav:active {
    transform: scale(0.94);
  }
  .nav svg {
    width: 20px;
    height: 20px;
  }
  .counter {
    position: static;
    transform: none;
    padding: 0 8px;
    background: none;
  }
  .count {
    display: none;
  }
  .dots {
    display: flex;
    gap: 6px;
  }
  .dots i {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.3);
    transition: width 200ms ease, background 200ms ease;
  }
  .dots i.on {
    width: 18px;
    background: #fff;
  }
}
@media (prefers-reduced-motion: reduce) {
  .lightbox,
  .lightbox-img,
  .slot {
    transition: none;
  }
}
</style>
