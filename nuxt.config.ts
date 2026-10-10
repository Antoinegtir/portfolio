// Public URL of the deployed site: canonical, Open Graph, sitemap and JSON-LD need absolute URLs.
// Override with NUXT_PUBLIC_SITE_URL at build time (e.g. a custom domain).
const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}
const siteUrl = (env.NUXT_PUBLIC_SITE_URL || 'https://antoinegtr.com').replace(/\/$/, '')

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: { siteUrl },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#000000' },
        { name: 'color-scheme', content: 'dark' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'icon', type: 'image/png', sizes: '64x64', href: '/favicon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' },
        { rel: 'preload', as: 'image', href: '/avatar.webp' }, // first thing painted in the hero / top bar
        { rel: 'preconnect', href: 'https://api.fontshare.com' },
        { rel: 'preconnect', href: 'https://cdn.fontshare.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap',
        },
      ],
    },
  },
})
