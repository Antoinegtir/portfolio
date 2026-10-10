<script setup lang="ts">
import { profile } from '~/content/experiences'

/*
 * Scroll-driven header. At the top of the page there is no bar: the avatar and the name live
 * in the hero (HeroIntro renders an #identity-slot that gives us their resting place). As the
 * page scrolls they shrink and slide into the pill, which fades in behind them. The bar links
 * appear once the hero's GitHub / LinkedIn / Email buttons have slid under the bar.
 */
const PILL = { top: 16, height: 50, maxWidth: 740, padX: 20 }
const HERO = { avatar: 64, name: 24, gap: 14 }
const BAR = { avatar: 28, name: 18, gap: 10 }

const vw = ref(1024)
const scrollY = ref(0)
const slot = ref({ x: 16, y: 120 }) // page coords of the hero identity slot
const absorbed = ref(0) // 0..1 as the hero buttons pass under the bar
const mounted = ref(false)

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const pillWidth = computed(() => Math.min(PILL.maxWidth, vw.value - 32))
const pillLeft = computed(() => (vw.value - pillWidth.value) / 2)

// Where the avatar sits in the hero right now (the slot scrolls with the page) vs. in the bar
const heroAvatar = computed(() => ({ x: slot.value.x, y: slot.value.y - scrollY.value }))
const barAvatar = computed(() => ({ x: pillLeft.value + PILL.padX, y: PILL.top + (PILL.height - BAR.avatar) / 2 }))
// Morph progress = how far the hero identity has travelled towards its place in the bar.
// Deriving it from the distance (no easing, no smoothing) keeps the motion monotonic: the
// avatar never overshoots the bar and comes back down.
const p = computed(() => {
  const travel = slot.value.y - barAvatar.value.y
  return travel > 0 ? Math.min(1, Math.max(0, scrollY.value / travel)) : 1
})

const avatarStyle = computed(() => {
  const t = p.value
  const s = lerp(HERO.avatar, BAR.avatar, t)
  return {
    transform: `translate(${lerp(heroAvatar.value.x, barAvatar.value.x, t)}px, ${lerp(heroAvatar.value.y, barAvatar.value.y, t)}px)`,
    width: `${s}px`,
    height: `${s}px`,
  }
})
const nameStyle = computed(() => {
  const t = p.value
  const s = lerp(HERO.avatar, BAR.avatar, t)
  const x = lerp(heroAvatar.value.x, barAvatar.value.x, t) + s + lerp(HERO.gap, BAR.gap, t)
  const y = lerp(heroAvatar.value.y, barAvatar.value.y, t) + s / 2
  const barName = vw.value < 480 ? 15 : BAR.name // keep clear of the links on narrow screens
  return { transform: `translate(${x}px, ${y}px) translateY(-50%)`, fontSize: `${lerp(HERO.name, barName, t)}px` }
})
const subtitleStyle = computed(() => ({ opacity: Math.max(0, 1 - p.value * 2.5) }))
// The pill fades in behind the avatar and name during the second half of the morph
const pillStyle = computed(() => {
  const t = Math.max(0, (p.value - 0.45) / 0.55)
  return { opacity: t, transform: `translateY(${(1 - t) * -8}px)`, left: `${pillLeft.value}px`, width: `${pillWidth.value}px` }
})
const linksStyle = computed(() => ({ opacity: absorbed.value, pointerEvents: absorbed.value > 0.5 ? 'auto' : 'none' }))

function measure() {
  vw.value = window.innerWidth
  const el = document.getElementById('identity-slot')
  if (el) {
    const r = el.getBoundingClientRect()
    slot.value = { x: r.left, y: r.top + window.scrollY }
  }
}
function onScroll() {
  scrollY.value = window.scrollY
  const buttons = document.getElementById('hero-links')
  if (buttons) {
    const r = buttons.getBoundingClientRect()
    const t = Math.min(1, Math.max(0, (PILL.top + PILL.height - r.top) / r.height))
    absorbed.value = t
    buttons.style.opacity = String(1 - t)
  }
}
function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  if (location.hash) history.replaceState(null, '', location.pathname + location.search)
}
onMounted(() => {
  measure()
  onScroll()
  mounted.value = true
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', measure)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', measure)
})
</script>

<template>
  <div v-show="mounted" class="morph" :class="{ 'morph--bar': p > 0.9 }">
    <!-- pill (translucent, blurred) and its links -->
    <div class="pill" :style="pillStyle">
      <span class="links" :style="linksStyle">
        <a :href="profile.github" target="_blank" rel="noopener" class="nav-link">GitHub</a>
        <a :href="profile.linkedin" target="_blank" rel="noopener" class="nav-link">LinkedIn</a>
      </span>
    </div>

    <!-- identity: shared between hero and bar -->
    <a href="/" class="identity" @click.prevent="toTop">
      <img src="/avatar.png" alt="" class="avatar" :style="avatarStyle">
      <span class="name" :style="nameStyle">
        {{ profile.name }}
        <small class="subtitle" :style="subtitleStyle">{{ profile.tagline }} · Paris / Dublin</small>
      </span>
    </a>
  </div>
</template>

<style scoped>
.morph {
  position: fixed;
  inset: 0 0 auto 0;
  height: 0;
  z-index: 40;
  pointer-events: none;
}
.pill {
  position: absolute;
  top: 16px;
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 24px;
  border-radius: 8px;
  border: 1px solid #333;
  background: rgba(0, 0, 0, 0.55);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
  backdrop-filter: saturate(1.4) blur(12px);
  -webkit-backdrop-filter: saturate(1.4) blur(12px);
  pointer-events: none;
}
.morph--bar .pill {
  pointer-events: auto;
}
.links {
  display: flex;
  gap: 20px;
  transition: opacity 150ms linear;
}
.nav-link {
  font-size: 16px;
  color: #666;
  transition: color 0.15s;
}
.nav-link:hover {
  color: #fafafa;
}
@media (max-width: 479px) {
  .pill { padding: 0 16px; }
  .links { gap: 14px; }
  .nav-link { font-size: 14px; }
}
.identity {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: auto;
  color: #fafafa;
}
.avatar {
  position: absolute;
  top: 0;
  left: 0;
  max-width: none; /* the Tailwind preflight's max-width:100% would collapse it inside the sizeless anchor */
  border-radius: 22%;
  will-change: transform, width, height;
}
.name {
  position: absolute;
  top: 0;
  left: 0;
  font-weight: 700;
  line-height: 1.1;
  white-space: nowrap;
  will-change: transform, font-size;
}
.subtitle {
  position: absolute; /* out of flow so the name itself stays vertically centred in the bar */
  top: 100%;
  left: 0;
  margin-top: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #888;
}
</style>
