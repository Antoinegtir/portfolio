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

function targetBox(natW: number, natH: number) {
  const maxW = window.innerWidth * 0.9
  const maxH = window.innerHeight * 0.9
  const scale = Math.min(maxW / natW, maxH / natH, 1)
  const w = natW * scale
  const h = natH * scale
  return { x: (window.innerWidth - w) / 2, y: (window.innerHeight - h) / 2, w, h }
}

async function waitDecoded(el: HTMLImageElement) {
  // decode() can hang for lazily loaded thumbnails that never started loading, hence the timeout
  await Promise.race([el.decode().catch(() => {}), new Promise(r => setTimeout(r, 400))])
}

async function show(s: LightboxState) {
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

function hide() {
  if (!current.value) return
  expanded.value = false
  box.value = current.value.from
  setTimeout(() => {
    visible.value = false
    current.value = null
  }, DURATION)
}

async function step(delta: number) {
  const s = current.value
  if (!s || !hasNav.value || swapping.value) return
  const next = group.value[(index.value + delta + count.value) % count.value]
  swapping.value = true
  await new Promise(r => setTimeout(r, 120))
  s.src = next
  // Fly back to the matching thumbnail on close, when it is in the page
  const thumb = document.querySelector<HTMLImageElement>(`img.shot[src="${next}"]`)
  if (thumb) {
    const r = thumb.getBoundingClientRect()
    s.from = { x: r.left, y: r.top, w: r.width, h: r.height }
  }
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
    <div v-if="visible" class="lightbox" :class="{ 'lightbox--open': expanded }" @click="close">
      <img
        ref="img"
        :src="current?.src"
        :alt="current?.alt"
        class="lightbox-img"
        :class="{ 'lightbox-img--swapping': swapping }"
        :style="{ left: box.x + 'px', top: box.y + 'px', width: box.w + 'px', height: box.h + 'px' }"
      >
      <template v-if="hasNav && expanded">
        <button type="button" class="nav nav--prev" aria-label="Previous screenshot" @click.stop="step(-1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <button type="button" class="nav nav--next" aria-label="Next screenshot" @click.stop="step(1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </button>
        <div class="counter">{{ index + 1 }} / {{ count }}</div>
      </template>
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
}
.lightbox-img {
  position: absolute;
  object-fit: cover;
  border-radius: 8px;
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
  border-radius: 12px;
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
@media (max-width: 640px) {
  .nav--prev { left: 10px; }
  .nav--next { right: 10px; }
}
@media (prefers-reduced-motion: reduce) {
  .lightbox,
  .lightbox-img {
    transition: none;
  }
}
</style>
