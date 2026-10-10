<script setup lang="ts">
import { profile } from '~/content/experiences'

/*
 * Error screen styled like the home: the app-icon blueprint used as a placeholder on the phone,
 * with the status code on it, the hero typography and the pill buttons. Used by error.vue
 * (client-side errors) and by the prerendered /404 page served by the static host.
 */
const props = withDefaults(defineProps<{ statusCode?: number, statusMessage?: string }>(), { statusCode: 404 })
const emit = defineEmits<{ home: [e: MouseEvent] }>()
const notFound = computed(() => props.statusCode === 404)
const title = computed(() => (notFound.value ? 'Page not found' : 'Something went wrong'))
</script>

<template>
  <div class="err">
    <div class="tile" aria-hidden="true">
      <IconBlueprint />
      <span class="code">{{ statusCode }}</span>
    </div>
    <p class="label">{{ notFound ? 'App not installed' : 'App crashed' }}</p>
    <h1 class="title">{{ title }}</h1>
    <p class="bio">
      <template v-if="notFound">This page doesn't exist on my portfolio, or it moved.</template>
      <template v-else>{{ statusMessage || 'An unexpected error happened.' }}</template>
    </p>
    <div class="buttons">
      <a href="/" class="btn btn--primary" @click="emit('home', $event)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        Back to the portfolio
      </a>
      <a :href="profile.github" target="_blank" rel="noopener" class="btn">GitHub</a>
      <a :href="`mailto:${profile.email}`" class="btn">Email</a>
    </div>
  </div>
</template>

<style scoped>
.err {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 24px;
  background: #000;
  color: #eaeaea;
}
.tile {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 22%;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}
.tile :deep(.blueprint) {
  display: block;
  width: 100%;
  height: 100%;
}
.code {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0a0a0a;
}
.label {
  margin-top: 14px;
  font-size: 13px;
  color: #777;
}
.title {
  margin-top: 28px;
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
  letter-spacing: -0.25px;
}
.bio {
  max-width: 420px;
  margin-top: 12px;
  font-size: 17px;
  line-height: 1.45;
  color: #999;
}
.buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 28px;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: #eaeaea;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transition: background 150ms ease, border-color 150ms ease, transform 150ms ease;
}
.btn svg {
  width: 16px;
  height: 16px;
}
.btn:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}
.btn--primary {
  background: #eaeaea;
  border-color: #eaeaea;
  color: #0a0a0a;
}
.btn--primary:hover {
  background: #fff;
  border-color: #fff;
}
</style>
