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
// Scroll-driven CSS animation when supported (runs on the compositor: no lag on fast touch scrolls);
// the JS transforms below stay as the fallback
const cssMode = ref(false)
const identityMounted = useState('identity-mounted', () => false)

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

// Only transforms are animated (translate + scale), never width/height/font-size: that keeps
// the morph on the compositor and smooth during fast scrolls on phones.
const barName = computed(() => (vw.value < 480 ? 15 : BAR.name))
// geometry handed to the CSS keyframes (see <style>): hero and bar positions + scroll travel
const morphVars = computed(() => ({
  '--hero-x': `${slot.value.x}px`,
  '--hero-y': `${slot.value.y}px`,
  '--bar-x': `${barAvatar.value.x}px`,
  '--bar-y': `${barAvatar.value.y}px`,
  '--travel': `${Math.max(1, slot.value.y - barAvatar.value.y)}px`,
  '--name-scale': String(barName.value / HERO.name),
  '--pill-left': `${pillLeft.value}px`,
  '--pill-w': `${pillWidth.value}px`,
}))
const avatarStyle = computed(() => {
  if (cssMode.value) return {}
  const t = p.value
  const s = lerp(HERO.avatar, BAR.avatar, t)
  return {
    transform: `translate(${lerp(heroAvatar.value.x, barAvatar.value.x, t)}px, ${lerp(heroAvatar.value.y, barAvatar.value.y, t)}px) scale(${s / HERO.avatar})`,
  }
})
const nameStyle = computed(() => {
  if (cssMode.value) return {}
  const t = p.value
  const s = lerp(HERO.avatar, BAR.avatar, t)
  const x = lerp(heroAvatar.value.x, barAvatar.value.x, t) + s + lerp(HERO.gap, BAR.gap, t)
  const y = lerp(heroAvatar.value.y, barAvatar.value.y, t) + s / 2
  return { transform: `translate(${x}px, ${y}px) translateY(-50%) scale(${lerp(HERO.name, barName.value, t) / HERO.name})` }
})
const subtitleStyle = computed(() => (cssMode.value ? {} : { opacity: Math.max(0, 1 - p.value * 2.5) }))
// The pill fades in behind the avatar and name during the second half of the morph
const pillStyle = computed(() => {
  const base = { left: `${pillLeft.value}px`, width: `${pillWidth.value}px` }
  if (cssMode.value) return base
  const t = Math.max(0, (p.value - 0.45) / 0.55)
  return { ...base, opacity: t, transform: `translateY(${(1 - t) * -8}px)` }
})
const linksStyle = computed(() => ({ opacity: absorbed.value, pointerEvents: (absorbed.value > 0.5 ? 'auto' : 'none') as 'auto' | 'none' }))

const links = { top: 0, height: 1 } // page coords of the hero buttons, measured once
function measure() {
  vw.value = window.innerWidth
  const el = document.getElementById('identity-slot')
  if (el) {
    const r = el.getBoundingClientRect()
    slot.value = { x: r.left, y: r.top + window.scrollY }
  }
  const buttons = document.getElementById('hero-links')
  if (buttons) {
    const r = buttons.getBoundingClientRect()
    links.top = r.top + window.scrollY
    links.height = r.height || 1
  }
}
function onResize() {
  measure()
  update()
}
let raf = 0
function update() {
  raf = 0
  scrollY.value = window.scrollY
  // how far the hero buttons have slid under the bar (no DOM reads here: measured on resize)
  const t = Math.min(1, Math.max(0, (PILL.top + PILL.height - (links.top - scrollY.value)) / links.height))
  absorbed.value = t
  const buttons = document.getElementById('hero-links')
  if (buttons) buttons.style.opacity = String(1 - t)
}
function onScroll() {
  if (!raf) raf = requestAnimationFrame(update)
}
function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  if (location.hash) history.replaceState(null, '', location.pathname + location.search)
}
onMounted(() => {
  cssMode.value = CSS.supports('animation-timeline: scroll()')
  measure()
  update()
  mounted.value = true
  identityMounted.value = true
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
  document.fonts?.ready.then(() => { measure(); update() }) // positions shift once Satoshi is in
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div v-show="mounted" class="morph" :class="{ 'morph--bar': p > 0.9, 'morph--css': cssMode }" :style="morphVars">
    <!-- pill (translucent, blurred) and its links -->
    <div class="pill" :style="pillStyle">
      <span class="links" :style="linksStyle">
        <a :href="profile.github" target="_blank" rel="noopener" class="nav-link">GitHub</a>
        <a :href="profile.linkedin" target="_blank" rel="noopener" class="nav-link">LinkedIn</a>
      </span>
    </div>

    <!-- identity: shared between hero and bar -->
    <a href="/" class="identity" @click.prevent="toTop">
      <img v-shimmer src="/avatar.png" alt="" class="avatar shimmer" :style="avatarStyle">
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
  width: 64px;
  height: 64px;
  border-radius: 22%;
  transform-origin: 0 0;
  will-change: transform;
}
.name {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.1;
  white-space: nowrap;
  transform-origin: 0 50%;
  will-change: transform;
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

/* Scroll-driven version of the morph (Safari 26+, Chrome): the same trajectory as the JS one,
   mapped onto the first --travel px of page scroll and run by the compositor */
.morph--css .avatar {
  animation: morph-avatar linear both;
  animation-timeline: scroll(root block);
  animation-range: 0 var(--travel);
}
.morph--css .name {
  animation: morph-name linear both;
  animation-timeline: scroll(root block);
  animation-range: 0 var(--travel);
}
.morph--css .subtitle {
  animation: morph-subtitle linear both;
  animation-timeline: scroll(root block);
  animation-range: 0 var(--travel);
}
.morph--css .pill {
  animation: morph-pill linear both;
  animation-timeline: scroll(root block);
  animation-range: 0 var(--travel);
}
@keyframes morph-avatar {
  from { transform: translate(var(--hero-x), var(--hero-y)) scale(1); }
  to   { transform: translate(var(--bar-x), var(--bar-y)) scale(0.4375); } /* 28 / 64 */
}
@keyframes morph-name {
  from { transform: translate(calc(var(--hero-x) + 64px + 14px), calc(var(--hero-y) + 32px)) translateY(-50%) scale(1); }
  to   { transform: translate(calc(var(--bar-x) + 28px + 10px), calc(var(--bar-y) + 14px)) translateY(-50%) scale(var(--name-scale)); }
}
@keyframes morph-subtitle {
  from { opacity: 1; }
  40%  { opacity: 0; }
  to   { opacity: 0; }
}
@keyframes morph-pill {
  from { opacity: 0; transform: translateY(-8px); }
  45%  { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
