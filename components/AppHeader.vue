<script setup lang="ts">
import { profile } from '~/content/experiences'

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  if (location.hash) history.replaceState(null, '', location.pathname + location.search)
}
</script>

<template>
  <header class="header">
    <nav class="pill">
      <a href="/" class="logo" @click.prevent="toTop">
        <img src="/avatar.png" alt="" width="28" height="28" class="logo-mark">
        <span>antoine.</span>
      </a>
      <a :href="profile.github" target="_blank" rel="noopener" class="nav-link">GitHub</a>
      <a :href="profile.linkedin" target="_blank" rel="noopener" class="nav-link">LinkedIn</a>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 16px;
  left: 0;
  right: 0;
  z-index: 40;
  display: flex;
  justify-content: center;
  padding: 0 16px;
}
.pill {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 740px;
  max-width: 100%;
  padding: 12px 24px 12px 20px;
  border-radius: 8px;
  border: 1px solid #333;
  background: rgba(0, 0, 0, 0.55);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
  backdrop-filter: saturate(1.4) blur(12px);
  -webkit-backdrop-filter: saturate(1.4) blur(12px);
}
.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-right: auto;
  font-size: 24px;
  font-weight: 700;
  line-height: 24px;
  color: #fafafa;
}
/* squircle: iOS-style continuous corner on the mark */
.logo-mark {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  clip-path: path('M14 0C24.5 0 28 3.5 28 14S24.5 28 14 28 0 24.5 0 14 3.5 0 14 0Z');
}
.nav-link {
  font-size: 16px;
  color: #666;
  transition: color 0.15s;
}
.nav-link:hover {
  color: #fafafa;
}
</style>
