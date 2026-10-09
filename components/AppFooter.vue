<script setup lang="ts">
import { profile } from '~/content/experiences'
</script>

<template>
  <footer class="footer">
    <p>
      Say hi:
      <a :href="`mailto:${profile.email}`" class="mail">{{ profile.email }}</a>
    </p>
    <p class="copy">© 2026 {{ profile.name }}</p>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: 100px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
  color: #666;
}
.mail {
  color: #999;
}
.mail:hover {
  color: #fff;
}
.copy {
  margin-top: 8px;
}
</style>
