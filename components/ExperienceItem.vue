<script setup lang="ts">
import type { Experience } from '~/content/experiences'
const props = defineProps<{ experience: Experience }>()
const { open } = useLightbox()

// Show the first row of thumbnails by default, the rest behind "See more"
const PREVIEW = 3
const expanded = ref(false)
const images = computed(() => props.experience.images ?? [])
const visibleImages = computed(() => (expanded.value ? images.value : images.value.slice(0, PREVIEW)))
const hiddenCount = computed(() => Math.max(0, images.value.length - PREVIEW))

// Which trophy badge is unfolded to show its proof screenshots (one at a time)
const openBadge = ref<number | null>(null)

// Reveal the section once it scrolls into view
const root = ref<HTMLElement | null>(null)
const shown = ref(false)
onMounted(() => {
  if (!('IntersectionObserver' in window) || !root.value) { shown.value = true; return }
  const io = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) { shown.value = true; io.disconnect() }
  }, { rootMargin: '0px 0px -10% 0px' })
  io.observe(root.value)
})
</script>

<template>
  <article ref="root" class="reveal" :class="{ 'reveal--in': shown }">
    <div :id="experience.id" class="heading">
      <img :src="experience.icon" :alt="`${experience.name} icon`" width="32" height="32" class="icon" loading="lazy">
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
    <div v-if="images.length" class="shots">
      <img
        v-for="src in visibleImages"
        :key="src"
        :src="src"
        :alt="`${experience.name} screenshot`"
        class="shot"
        loading="lazy"
        @click="open(src, $event.currentTarget as HTMLElement, `${experience.name} screenshot`, images)"
      >
    </div>
    <button v-if="hiddenCount" type="button" class="see-more" @click="expanded = !expanded">
      <span>{{ expanded ? 'See less' : `See more (${hiddenCount})` }}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" :class="{ up: expanded }">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
    <div v-for="(b, i) in experience.badges ?? []" :key="b.title + b.subtitle" class="badge" :class="{ 'badge--open': openBadge === i }">
      <component
        :is="b.images?.length ? 'button' : 'div'"
        :type="b.images?.length ? 'button' : undefined"
        class="badge-head"
        :aria-expanded="b.images?.length ? openBadge === i : undefined"
        @click="b.images?.length && (openBadge = openBadge === i ? null : i)"
      >
        <img src="/trophy.png" alt="Trophy" width="32" height="32" class="badge-emoji">
        <div class="badge-text">
          <span class="badge-title">{{ b.title }}</span>
          <span class="badge-subtitle">{{ b.subtitle }}</span>
        </div>
        <svg v-if="b.images?.length" class="badge-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </component>
      <div v-if="b.images?.length && openBadge === i" class="shots badge-shots">
        <img
          v-for="src in b.images"
          :key="src"
          :src="src"
          :alt="`${b.title} ${b.subtitle}`"
          class="shot"
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
  top: 46px;
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
  padding-top: 100px;
  scroll-margin-top: 0;
}
.icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
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
  background: #111;
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
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #333;
  background: rgba(255, 255, 255, 0.04);
  color: #999;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease;
}
.see-more:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}
.see-more svg {
  width: 16px;
  height: 16px;
  transition: transform 200ms ease;
}
.see-more svg.up {
  transform: rotate(180deg);
}
.badge {
  margin-top: 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  border: 1px solid rgba(84, 86, 117, 0.66);
  background: rgba(84, 86, 117, 0.4);
  overflow: hidden;
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
button.badge-head {
  cursor: pointer;
  transition: background 150ms ease;
}
button.badge-head:hover {
  background: rgba(255, 255, 255, 0.05);
}
.badge-chevron {
  width: 18px;
  height: 18px;
  margin-left: auto;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.7);
  transition: transform 200ms ease;
}
.badge--open .badge-chevron {
  transform: rotate(180deg);
}
.badge-shots {
  margin-top: 0;
  padding: 0 10px 12px;
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
