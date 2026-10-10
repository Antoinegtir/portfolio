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
      <!-- keeps the phone's place in the two-column layout; the phone itself is fixed below -->
      <div class="phone-spacer" aria-hidden="true" />
    </div>
    <!-- fixed (not sticky) so the macOS / iOS rubber-band bounce moves the page but never the phone -->
    <div class="phone-fixed">
      <div class="phone-row">
        <aside class="phone-col">
          <PhoneMock />
        </aside>
      </div>
    </div>
    <div class="fade-bottom" />
    <AppRail />
    <ImageLightbox />
    <ScrollTop />
  </div>
</template>
