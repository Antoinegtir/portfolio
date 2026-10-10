/*
 * v-shimmer: an image carrying the `shimmer` class shows a sliding placeholder until it has loaded.
 * The class is removed as soon as the image is available (also for cached images).
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('shimmer', {
    mounted(el: HTMLImageElement) {
      const done = () => el.classList.remove('shimmer')
      if (el.complete && el.naturalWidth > 0) return done()
      el.addEventListener('load', done, { once: true })
      el.addEventListener('error', done, { once: true })
    },
  })
})
