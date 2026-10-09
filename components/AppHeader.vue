<script setup lang="ts">
import { profile } from '~/content/experiences'
</script>

<template>
  <header class="header">
    <nav class="pill">
      <a href="#top" class="logo">antoine.</a>
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
  margin-right: auto;
  font-size: 24px;
  font-weight: 700;
  line-height: 24px;
  color: #fafafa;
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
