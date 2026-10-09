<script setup lang="ts">
import { experiences, profile } from '~/content/experiences'

const title = `Hello, I'm ${profile.name}.`
useSeoMeta({
  title,
  description: profile.bio,
  ogTitle: title,
  ogDescription: profile.bio,
  twitterCard: 'summary',
})</script>

<template>
  <div>
    <div class="fade-top" />
    <AppHeader />
    <div class="shell">
      <main class="content">
        <HeroIntro />
        <ExperienceItem v-for="e in experiences" :key="e.id" :experience="e" />
        <AppFooter />
      </main>
      <aside class="phone-col">
        <PhoneMock />
      </aside>
    </div>
    <div class="fade-bottom" />
    <ImageLightbox />
    <ScrollTop />
  </div>
</template>
