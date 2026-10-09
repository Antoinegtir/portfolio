<script setup lang="ts">
const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 400
}
function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <button type="button" class="scroll-top" :class="{ 'scroll-top--visible': visible }" aria-label="Scroll to top" @click="toTop">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </svg>
  </button>
</template>

<style scoped>
.scroll-top {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 35;
  margin-left: -22px; /* half the width: centered horizontally */
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 1px solid #333;
  background: rgba(0, 0, 0, 0.55);
  color: #fafafa;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
  backdrop-filter: saturate(1.4) blur(12px);
  -webkit-backdrop-filter: saturate(1.4) blur(12px);
  cursor: pointer;
  opacity: 0;
  transform: translateY(12px);
  pointer-events: none;
  /* the horizontal centering uses margin-left so the enter/leave transform stays a simple translateY */
  transition: opacity 220ms ease, transform 220ms ease, background 150ms ease;
}
.scroll-top--visible {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}
.scroll-top:hover {
  background: rgba(30, 30, 30, 0.8);
}
.scroll-top svg {
  width: 20px;
  height: 20px;
}
@media (prefers-reduced-motion: reduce) {
  .scroll-top {
    transition: opacity 150ms ease;
    transform: none;
  }
}
</style>
