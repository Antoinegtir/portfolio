<script setup lang="ts">
import { experiences } from '~/content/experiences'

/*
 * Vertical app rail for layouts where the phone column does not fit (< 1024px): the app
 * icons stacked on the right edge, the active one highlighted as the page scrolls, each
 * one scrolling its section into place below the top bar.
 */
const TOP_OFFSET = 96 // where a section title lands below the bar
const ACTIVE_LINE = 0.7

const activeId = ref(experiences[0].id)
const { icons, demo, replayDemo } = useIconLoading()
const activeIndex = computed(() => Math.max(0, experiences.findIndex(e => e.id === activeId.value)))

// While a click-triggered smooth scroll runs, the clicked app stays active so the highlight
// glides straight to it instead of stepping through every section on the way
let pinnedUntil = 0
function unpin() {
  pinnedUntil = 0
}

function updateActive() {
  if (performance.now() < pinnedUntil) return
  const line = window.innerHeight * ACTIVE_LINE
  let current = experiences[0].id
  for (const e of experiences) {
    const el = document.getElementById(e.id)
    if (!el) continue
    const r = el.getBoundingClientRect()
    const padding = parseFloat(getComputedStyle(el).paddingTop) || 0
    if (r.top + padding + (r.height - padding) / 2 <= line + 8) current = e.id
  }
  activeId.value = current
}
function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function goTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  activeId.value = id
  pinnedUntil = performance.now() + 2500 // released earlier by scrollend where supported
  const padding = parseFloat(getComputedStyle(el).paddingTop) || 0
  let y = 0
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) y += node.offsetTop
  window.scrollTo({ top: y + padding - TOP_OFFSET, behavior: 'smooth' })
}
onMounted(() => {
  updateActive()
  window.addEventListener('scroll', updateActive, { passive: true })
  window.addEventListener('scrollend', unpin)
})
onUnmounted(() => {
  window.removeEventListener('scroll', updateActive)
  window.removeEventListener('scrollend', unpin)
})
</script>

<template>
  <nav class="rail" aria-label="Apps">
    <span class="rail-indicator" :style="{ transform: `translateY(${activeIndex * 42}px)` }" aria-hidden="true" />
    <button
      v-for="e in experiences"
      :key="e.id"
      type="button"
      class="rail-app"
      :class="{ 'rail-app--active': e.id === activeId }"
      :title="e.name"
      :aria-label="e.name"
      @click="goTo(e.id)"
    >
      <span class="rail-icon" :class="{ 'rail-icon--loading': !icons[e.id]?.ready }">
        <img v-if="icons[e.id]?.ready" :src="e.icon" alt="" width="36" height="36">
        <template v-else>
          <IconBlueprint />
          <span class="pie" :style="{ '--p': icons[e.id]?.progress ?? 0, '--s': icons[e.id]?.size ?? 0 }" />
        </template>
      </span>
    </button>
    <button type="button" class="rail-app" title="Portfolio" aria-label="Portfolio" @click="toTop">
      <span class="rail-icon"><IconBlueprint /></span>
    </button>
    <button type="button" class="rail-app" title="Demo: replay the loading animation" aria-label="Demo" @click="replayDemo">
      <span class="rail-icon" :class="{ 'rail-icon--loading': !demo.ready }">
        <img v-if="demo.ready" src="/logo.png" alt="" width="36" height="36">
        <template v-else>
          <IconBlueprint />
          <span class="pie" :style="{ '--p': demo.progress, '--s': demo.size }" />
        </template>
      </span>
    </button>
  </nav>
</template>

<style scoped>
.rail {
  position: fixed;
  right: 10px;
  /* svh = small viewport height: unchanged when the mobile browser chrome collapses, so the
     rail does not slide when the page's top bar appears */
  top: 50%;
  top: 50svh;
  transform: translateY(-50%);
  z-index: 35;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  border-radius: 999px;
  border: 1px solid #333;
  background: rgba(0, 0, 0, 0.55);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
  backdrop-filter: saturate(1.4) blur(12px);
  -webkit-backdrop-filter: saturate(1.4) blur(12px);
}
@media (min-width: 1024px) {
  .rail {
    display: none; /* the phone mock takes over */
  }
}
.rail-app {
  position: relative;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  background: none;
  border-radius: 10px;
  cursor: pointer;
  opacity: 0.55;
  transform: scale(0.92);
  transition: opacity 200ms ease, transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.rail-icon {
  position: relative;
  display: block;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  overflow: hidden;
  transition: filter 300ms ease;
}
.rail-icon img {
  display: block;
  width: 36px;
  height: 36px;
}
.rail-icon--loading :deep(.blueprint) {
  filter: brightness(0.42) saturate(0.4);
}
.pie {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2.2px solid #fff;
  background: conic-gradient(#fff calc(var(--p) * 360deg), transparent 0);
  background-clip: padding-box;
  transform: scale(var(--s));
}
.rail-app:hover {
  opacity: 0.85;
}
.rail-app--active {
  opacity: 1;
  transform: scale(1.08);
}
/* single indicator that glides between icons (36px icon + 6px gap = 42px per row) */
.rail-indicator {
  position: absolute;
  left: 1px;
  top: 19px; /* padding 8 + (36 - 14) / 2 */
  width: 3px;
  height: 14px;
  border-radius: 2px;
  background: #fff;
  transition: transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
@media (prefers-reduced-motion: reduce) {
  .rail-app,
  .rail-indicator {
    transition: none;
  }
}
</style>
