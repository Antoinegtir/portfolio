<script setup lang="ts">
// Prerendered 404 for static hosting: Apache's ErrorDocument points at /404/index.html, so visitors
// get the real page from the server, before any JavaScript runs.
import { profile } from '~/content/experiences'
useSeoMeta({ title: `Page not found – ${profile.name}`, robots: 'noindex' })
</script>

<template>
  <ErrorScreen :status-code="404" />
</template>
