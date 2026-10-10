<script setup lang="ts">
import type { Experience } from '~/content/experiences'
const props = defineProps<{ experience: Experience }>()
const { open } = useLightbox()
const icon = useSingleIconLoading(props.experience.icon)

// Show the first row of thumbnails by default, the rest behind "See more"
const PREVIEW = 3
const images = computed(() => props.experience.images ?? [])
const hiddenCount = computed(() => Math.max(0, images.value.length - PREVIEW))
const hiddenPreview = computed(() => images.value.slice(PREVIEW, PREVIEW + 3)) // stacked thumbs in the button

// Badge titles like "APP STORE · GOOGLE PLAY" are shown as store logos + names
const STORES = [
  { match: 'APP STORE', logo: '/stores/app-store.svg' },
  { match: 'GOOGLE PLAY', logo: '/stores/google-play.svg' },
  { match: 'THREADS', logo: '/icons/threads.png' },
]
function titleParts(title: string) {
  return title.split('·').map((t) => {
    const text = t.trim()
    return { text, logo: STORES.find(s => text.includes(s.match))?.logo }
  })
}

// Trophy dropdowns are CSS-driven checkboxes (they work before hydration). Once mounted, opening
// one closes the others in the same section; nothing ever writes the boxes on mount.
function onBadgeToggle(e: Event) {
  const box = e.target as HTMLInputElement
  if (!box.checked) return
  root.value?.querySelectorAll<HTMLInputElement>('.badge-toggle').forEach((other) => {
    if (other !== box) other.checked = false
  })
}

// Reveal the section once it scrolls into view. Server-rendered as visible so the page is
// complete before hydration (icon install animation, shimmering screenshots, text); only the
// sections still below the fold when JS starts switch to the scroll reveal.
const root = ref<HTMLElement | null>(null)
const shown = ref(true)
onMounted(() => {
  if (!('IntersectionObserver' in window) || !root.value) return
  if (root.value.getBoundingClientRect().top < window.innerHeight) return
  shown.value = false
  const io = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) { shown.value = true; io.disconnect() }
  }, { rootMargin: '0px 0px -10% 0px' })
  io.observe(root.value)
})
</script>

<template>
  <article ref="root" class="reveal" :class="{ 'reveal--in': shown }">
    <div :id="experience.id" class="heading">
      <span class="icon">
        <IconBlueprint v-if="!icon.ready" />
        <span v-if="!icon.loaded" class="icon-shimmer" />
        <img v-if="icon.loaded" :src="experience.icon" :alt="`${experience.name} icon`" width="32" height="32" class="real">
        <template v-if="!icon.ready">
          <span class="veil" :class="{ pre: icon.pre }" :style="{ '--p': icon.progress, '--s': icon.size, '--v': icon.reveal }" />
          <span class="pie" :class="{ pre: icon.pre }" :style="{ '--p': icon.progress, '--s': icon.size, '--v': icon.reveal }" />
        </template>
      </span>
      <h2 class="name">{{ experience.name }}</h2>
    </div>
    <p class="period"><span class="role">{{ experience.role }}</span><span class="dot">·</span>{{ experience.period }}</p>
    <p v-if="experience.users" class="stat">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="9" cy="8" r="3.5" /><path d="M2.5 19a6.5 6.5 0 0 1 13 0" /><circle cx="17" cy="9" r="2.5" /><path d="M15.5 14.5a5 5 0 0 1 6 4.5" />
      </svg>
      <span class="stat-value">{{ experience.users }}</span> users<span v-if="experience.usersSource" class="stat-source">source: {{ experience.usersSource }}</span>
    </p>
    <ul class="bullets">
      <li v-for="b in experience.bullets" :key="b">{{ b }}</li>
    </ul>
    <p v-if="experience.links?.length" class="links">
      <a v-for="l in experience.links" :key="l.href" :href="l.href" target="_blank" rel="noopener">{{ l.label }}</a>
    </p>
    <!-- The hidden checkbox + label toggle the extra screenshots in pure CSS (they are all
         server-rendered), so it works before hydration. No v-model on purpose: binding it would
         reset the box to Vue's initial value on mount and undo a click made before hydration. -->
    <input
      v-if="hiddenCount"
      :id="`more-${experience.id}`"
      type="checkbox"
      class="more-toggle"
    >
    <div v-if="images.length" class="shots">
      <img
        v-for="(src, k) in images"
        :key="src"
        :src="src"
        :alt="`${experience.name} screenshot`"
        v-shimmer
        class="shot shimmer"
        :class="{ 'shot--extra': k >= PREVIEW }"
        loading="lazy"
        @click="open(src, $event.currentTarget as HTMLElement, `${experience.name} screenshot`, images)"
      >
    </div>
    <label v-if="hiddenCount" :for="`more-${experience.id}`" class="see-more">
      <span class="when-closed">
        <span class="see-more-thumbs" aria-hidden="true">
          <img v-for="src in hiddenPreview" :key="src" :src="src" alt="" loading="lazy">
        </span>
        {{ hiddenCount }} more screenshot{{ hiddenCount > 1 ? 's' : '' }}
      </span>
      <span class="when-open">Show less</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </label>
    <div v-for="(b, i) in experience.badges ?? []" :key="b.title + b.subtitle" class="badge">
      <input
        v-if="b.images?.length"
        :id="`badge-${experience.id}-${i}`"
        type="checkbox"
        class="badge-toggle"
        @change="onBadgeToggle"
      >
      <component
        :is="b.images?.length ? 'label' : 'div'"
        :for="b.images?.length ? `badge-${experience.id}-${i}` : undefined"
        class="badge-head"
      >
        <img src="/trophy.png" alt="Trophy" width="32" height="32" class="badge-emoji">
        <div class="badge-text">
          <span class="badge-title">
            <template v-for="(part, k) in titleParts(b.title)" :key="k">
              <span v-if="k" class="badge-sep" aria-hidden="true">·</span>
              <span class="badge-store">
                <img v-if="part.logo" :src="part.logo" alt="" class="store-logo" width="14" height="14">
                {{ part.text }}
              </span>
            </template>
          </span>
          <span class="badge-subtitle">{{ b.subtitle }}</span>
        </div>
        <svg v-if="b.images?.length" class="badge-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </component>
      <div v-if="b.images?.length" class="shots badge-shots">
        <img
          v-for="src in b.images"
          :key="src"
          :src="src"
          :alt="`${b.title} ${b.subtitle}`"
          v-shimmer
          class="shot shimmer"
          loading="lazy"
          @click="open(src, $event.currentTarget as HTMLElement, `${b.title} ${b.subtitle}`, b.images)"
        >
      </div>
    </div>
  </article>
</template>

<style scoped>
.reveal {
  position: relative;
  padding-bottom: 8px;
}
/* wavy separator between experiences: a repeating 24px sine stroke, fading out to the right */
.reveal + .reveal::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 12px; /* close to the end of the previous app, more room below before the next heading */
  height: 8px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='8' viewBox='0 0 20 8'%3E%3Cpath d='M0 4C3 1 7 1 10 4S17 7 20 4' fill='none' stroke='white' stroke-width='1.2'/%3E%3C/svg%3E");
  background-repeat: repeat-x;
  background-size: 20px 8px;
  opacity: 0.16;
}
.heading {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 65px; /* 12px wave offset + 8px wave + ~45px */
  scroll-margin-top: 0;
}
.icon {
  position: relative;
  display: block;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  overflow: hidden;
}
.icon img {
  display: block;
  width: 32px;
  height: 32px;
}
.icon .real {
  position: absolute;
  inset: 0;
}
.veil {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.58);
  /* the circle is cut out of the veil (47% of the corner distance), then grows past the corners */
  --hole: calc(47% * var(--s, 0) + var(--v, 0) * 58%);
  -webkit-mask-image: radial-gradient(circle, transparent var(--hole), #000 calc(var(--hole) + 0.5px));
  mask-image: radial-gradient(circle, transparent var(--hole), #000 calc(var(--hole) + 0.5px));
}
.pie {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 21px;
  height: 21px;
  border-radius: 50%;
  /* the ring is see-through: the icon shows undimmed through it, like through the loaded share */
  border: 2px solid transparent;
  background: conic-gradient(transparent calc(var(--p, 0) * 360deg), rgba(0, 0, 0, 0.58) 0);
  background-clip: padding-box;
  transform: scale(var(--s));
}
.name {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  color: #fff;
}
.period {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  font-size: 16px;
  font-weight: 500;
  color: #7c7fa6;
  letter-spacing: 0.01em;
}
.period .role {
  color: #a6a8c8;
}
.period .dot {
  color: #4a4c66;
}
.stat {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 5px 10px 5px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  font-size: 13px;
  color: #bbb;
}
.stat svg {
  width: 15px;
  height: 15px;
  color: #8b8fb8;
}
.stat-value {
  font-weight: 700;
  color: #fff;
}
.stat-source {
  margin-left: 6px;
  padding-left: 8px;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 11px;
  color: #777;
}
.bullets {
  margin-top: 16px;
  padding-left: 32px;
  list-style: disc;
}
.bullets li {
  margin-bottom: 11px;
  font-size: 17.6px;
  font-weight: 300;
  line-height: 1.5;
  color: #fff;
}
.links {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 4px;
  font-size: 15px;
}
.links a {
  color: #4f9cff;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.links a:hover {
  color: #fff;
}
/* Portrait phone screenshots: a row of thumbnails rather than full-width images */
.shots {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* always one row of three, whatever the width */
  gap: 8px;
  margin-top: 16px;
}
@media (max-width: 480px) {
  .shots {
    gap: 6px;
  }
}
.shot {
  display: block;
  width: 100%;
  aspect-ratio: 9 / 19.5;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background-color: #111; /* not the shorthand: it would wipe the shimmer's background-image */
  cursor: zoom-in;
  transition: transform 220ms ease, filter 220ms ease, box-shadow 220ms ease;
}
.shot:hover {
  transform: translateY(-2px) scale(1.03);
  filter: brightness(1.12);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}
@media (prefers-reduced-motion: reduce) {
  .shot {
    transition: none;
  }
  .shot:hover {
    transform: none;
  }
}
.see-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: fit-content; /* as narrow as its content, centred under the grid */
  min-height: 44px;
  margin: 10px auto 0;
  padding: 6px 16px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: #bbb;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
}
.see-more:hover {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
}
.see-more svg {
  width: 16px;
  height: 16px;
  opacity: 0.7;
  transition: transform 200ms ease;
}
.more-toggle {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}
.shot--extra {
  display: none;
}
.more-toggle:checked ~ .shots .shot--extra {
  display: block;
}
.when-closed {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.when-open {
  display: none;
}
.more-toggle:checked ~ .see-more .when-closed {
  display: none;
}
.more-toggle:checked ~ .see-more .when-open {
  display: inline;
}
.more-toggle:checked ~ .see-more svg {
  transform: rotate(180deg);
}
.more-toggle:focus-visible ~ .see-more {
  outline: 2px solid #4f9cff;
  outline-offset: 2px;
}
/* the hidden screenshots, stacked like a fanned deck */
.see-more-thumbs {
  display: flex;
}
.see-more-thumbs img {
  width: 18px;
  height: 30px;
  object-fit: cover;
  object-position: top;
  border-radius: 4px;
  border: 1.5px solid #0b0b0b;
  background: #222;
  transition: transform 200ms ease;
}
.see-more-thumbs img + img {
  margin-left: -7px;
}
.see-more-thumbs img:nth-child(1) { transform: rotate(-8deg); }
.see-more-thumbs img:nth-child(3) { transform: rotate(8deg); }
.see-more:hover .see-more-thumbs img:nth-child(1) { transform: rotate(-12deg) translateX(-2px); }
.see-more:hover .see-more-thumbs img:nth-child(3) { transform: rotate(12deg) translateX(2px); }
.badge {
  position: relative;
  margin-top: 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  border: 1px solid rgba(84, 86, 117, 0.66);
  background: rgba(84, 86, 117, 0.4);
  overflow: hidden;
  transition: background 150ms ease, border-color 150ms ease;
}
/* hovering the head lights up the whole card evenly (no two-tone band when it is open) */
.badge:has(label.badge-head:hover) {
  border-color: rgba(120, 122, 160, 0.8);
  background: rgba(84, 86, 117, 0.5);
}
.badge + .badge {
  margin-top: 0;
}
.badge-head {
  display: flex;
  align-items: center;
  gap: 2px;
  width: 100%;
  padding: 12px 14px 12px 10px;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
}
label.badge-head {
  cursor: pointer;
}
.badge-chevron {
  width: 18px;
  height: 18px;
  margin-left: auto;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.7);
  transition: transform 200ms ease;
}
.badge-toggle {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}
.badge-shots {
  display: none;
}
.badge-toggle:checked ~ .badge-shots {
  display: grid;
}
.badge-toggle:focus-visible ~ .badge-head {
  outline: 2px solid #4f9cff;
  outline-offset: -2px;
}
.badge-toggle:checked ~ .badge-head .badge-chevron {
  transform: rotate(180deg);
}
.badge-shots {
  margin-top: 0;
  padding: 0 10px 12px;
}
.badge-store {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.store-logo {
  width: 14px;
  height: 14px;
  flex: none;
}
.badge-sep {
  opacity: 0.6;
}
.badge-emoji {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}
.badge-text {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 10px;
  margin-left: 8px;
}
.badge-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 32px;
  background: #5a5c7c;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  color: #fff;
}
.badge-subtitle {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
}
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 600ms ease, transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.reveal--in {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
