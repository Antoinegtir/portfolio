<script setup lang="ts">
import type { Experience } from '~/content/experiences'
defineProps<{ experience: Experience }>()
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
    <div v-if="experience.images?.length" class="shots">
      <img v-for="src in experience.images" :key="src" :src="src" alt="" class="shot" loading="lazy">
    </div>
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
