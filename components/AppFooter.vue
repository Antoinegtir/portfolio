<script setup lang="ts">
import { profile } from '~/content/experiences'
</script>

<template>
  <footer class="footer">
    <p class="say">Say hi</p>
    <a :href="`mailto:${profile.email}`" class="mail">{{ profile.email }}</a>
    <div class="row">
      <span class="copy">© 2026 {{ profile.name }}</span>
      <span class="social">
        <a :href="profile.github" target="_blank" rel="noopener">GitHub</a>
        <a :href="profile.linkedin" target="_blank" rel="noopener">LinkedIn</a>
      </span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
  color: #666;
}
.say {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #555;
}
.mail {
  display: inline-block;
  margin-top: 8px;
  font-size: 18px;
  color: #eaeaea;
  text-decoration: underline;
  text-decoration-color: rgba(255, 255, 255, 0.25);
  text-underline-offset: 4px;
  transition: text-decoration-color 150ms ease;
}
.mail:hover {
  text-decoration-color: #fff;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 28px;
}
.social {
  display: flex;
  gap: 16px;
}
.social a:hover {
  color: #fff;
}
</style>
