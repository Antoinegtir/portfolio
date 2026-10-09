<script setup lang="ts">
import { profile } from '~/content/experiences'
const links = [
  { label: 'GITHUB', href: profile.github },
  { label: 'LINKEDIN', href: profile.linkedin },
  { label: 'EMAIL', href: `mailto:${profile.email}` },
]
// skillicons.dev ids (react stands in for React Native, which has no dedicated icon)
const stack = ['flutter', 'dart', 'firebase', 'gcp', 'swift', 'kotlin', 'react', 'vue', 'mongodb', 'redis', 'postgres', 'nodejs', 'js']
</script>

<template>
  <section id="top">
    <h1 class="title">Hi, I'm {{ profile.name }}</h1>
    <p class="bio">{{ profile.bio }}</p>
    <div class="buttons">
      <a v-for="l in links" :key="l.label" :href="l.href" target="_blank" rel="noopener" class="btn">{{ l.label }}</a>
    </div>
    <img
      class="stack"
      :src="`https://skillicons.dev/icons?i=${stack.join(',')}&theme=dark&perline=7`"
      alt="Tech stack: Flutter, Dart, Firebase, Google Cloud, Swift, Kotlin, React Native, Vue.js, MongoDB, Redis, PostgreSQL, Node.js, JavaScript"
      loading="lazy"
    >
  </section>
</template>

<style scoped>
.title {
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
  letter-spacing: -0.25px;
  color: #eaeaea;
}
.bio {
  margin-top: 24px;
  font-size: 18px;
  line-height: 1.45;
  color: #999;
}
.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
}
.btn {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: #e3e6ff;
  color: #000;
  font-size: 14px;
  font-weight: 500;
  line-height: 19px;
  transition: background 0.15s;
}
.btn:hover {
  background: #fff;
}
.stack {
  display: block;
  margin-top: 24px;
  max-width: 100%;
  height: auto;
}
</style>
