<script setup lang="ts">
import type { LightboxState } from '~/composables/useLightbox'

const { state, close } = useLightbox()

const img = ref<HTMLImageElement | null>(null)
const visible = ref(false) // backdrop + image mounted
const expanded = ref(false) // image at its final (centered) box
const current = ref<LightboxState | null>(null)
const box = ref({ x: 0, y: 0, w: 0, h: 0 })

const DURATION = 320

function targetBox(natW: number, natH: number) {
  const maxW = window.innerWidth * 0.9
  const maxH = window.innerHeight * 0.9
  const scale = Math.min(maxW / natW, maxH / natH, 1)
  const w = natW * scale
  const h = natH * scale
  return { x: (window.innerWidth - w) / 2, y: (window.innerHeight - h) / 2, w, h }
}

async function show(s: LightboxState) {
  current.value = s
  box.value = s.from
  visible.value = true
  expanded.value = false
  await nextTick()
  // Wait (briefly) for the natural size, then fly to the centered box on the next frame.
  // decode() can hang for lazily loaded thumbnails that never started loading, hence the timeout.
  const el = img.value!
  await Promise.race([el.decode().catch(() => {}), new Promise(r => setTimeout(r, 400))])
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

watch(state, (s) => {
  if (s) show(s)
  else hide()
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
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
        :style="{ left: box.x + 'px', top: box.y + 'px', width: box.w + 'px', height: box.h + 'px' }"
      >
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
    border-radius 320ms ease;
  will-change: left, top, width, height;
}
.lightbox--open .lightbox-img {
  border-radius: 12px;
}
@media (prefers-reduced-motion: reduce) {
  .lightbox,
  .lightbox-img {
    transition: none;
  }
}
</style>
