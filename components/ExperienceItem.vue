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
</script>

<template>
  <article class="fade-in">
    <div :id="experience.id" class="heading">
      <img :src="experience.icon" :alt="`${experience.name} icon`" width="32" height="32" class="icon" loading="lazy">
      <h2 class="name">{{ experience.name }}</h2>
    </div>
    <p class="period">{{ experience.role }} {{ experience.period }}</p>
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
        @click="open(src, $event.currentTarget as HTMLElement, `${experience.name} screenshot`)"
      >
    </div>
    <button v-if="hiddenCount" type="button" class="see-more" @click="expanded = !expanded">
      <span>{{ expanded ? 'See less' : `See more (${hiddenCount})` }}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" :class="{ up: expanded }">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
    <div v-for="b in experience.badges ?? []" :key="b.title" class="badge">
      <img src="/trophy.png" alt="Trophy" width="32" height="32" class="badge-emoji">
      <div class="badge-text">
        <span class="badge-title">{{ b.title }}</span>
        <span class="badge-subtitle">{{ b.subtitle }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.heading {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 100px;
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
  margin-top: 16px;
  font-size: 17.6px;
  font-weight: 500;
  color: #595c7c;
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
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
  margin-top: 16px;
}
.shot {
  display: block;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #111;
  background: #333;
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
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: 16px;
  margin-bottom: 8px;
  padding: 12px 20px 12px 10px;
  border-radius: 8px;
  border: 1px solid rgba(84, 86, 117, 0.66);
  background: rgba(84, 86, 117, 0.4);
}
.badge + .badge {
  margin-top: 0;
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
.fade-in {
  animation: fade 0.6s ease both;
}
@keyframes fade {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .fade-in { animation: none; }
}
</style>
