<script setup lang="ts">
import type { NuxtError } from '#app'
import { profile } from '~/content/experiences'

const props = defineProps<{ error: NuxtError }>()
const title = computed(() => (props.error.statusCode === 404 ? 'Page not found' : 'Something went wrong'))
useSeoMeta({ title: `${title.value} – ${profile.name}`, robots: 'noindex' })

function home(e: MouseEvent) {
  e.preventDefault()
  clearError({ redirect: '/' })
}
</script>

<template>
  <ErrorScreen :status-code="error.statusCode" :status-message="error.statusMessage" @home="home" />
</template>
