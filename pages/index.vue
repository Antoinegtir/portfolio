<script setup lang="ts">
import { experiences, profile } from '~/content/experiences'

const { siteUrl } = useRuntimeConfig().public
const url = `${siteUrl}/`
const ogImage = `${siteUrl}/og.jpg`

// Search snippet: name + role + what the page is about, under 60 / 160 characters
const title = `${profile.name} – Mobile Engineer (iOS & Android)`
const description = `${profile.name}: mobile engineer, 5+ years building iOS & Android apps used by millions (Wellnotes, AtClub, Vibes Widget, Dreamoji) and open-source projects.`
const keywords = [
  'Antoine Gonthier', 'mobile engineer', 'iOS developer', 'Android developer', 'Flutter developer',
  'Swift', 'Kotlin', 'Firebase', 'Paris', 'Dublin', 'portfolio', ...experiences.map(e => e.name),
].join(', ')

useSeoMeta({
  title,
  description,
  keywords,
  author: profile.name,
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  ogType: 'profile',
  ogSiteName: profile.name,
  ogTitle: title,
  ogDescription: description,
  ogUrl: url,
  ogImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: `${profile.name}, ${profile.tagline}`,
  ogLocale: 'en_US',
  profileFirstName: 'Antoine',
  profileLastName: 'Gonthier',
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: ogImage,
  twitterImageAlt: `${profile.name}, ${profile.tagline}`,
})

// Structured data (schema.org): who this is, what the page is, and the apps as software works.
// Gives Google rich results and answer engines (GEO) a machine-readable summary of the page.
const person = {
  '@type': 'Person',
  '@id': `${url}#person`,
  name: profile.name,
  givenName: 'Antoine',
  familyName: 'Gonthier',
  jobTitle: profile.tagline,
  description: description,
  url,
  image: `${siteUrl}/avatar.png`,
  email: `mailto:${profile.email}`,
  nationality: { '@type': 'Country', name: 'France' },
  homeLocation: [
    { '@type': 'City', name: 'Paris' },
    { '@type': 'City', name: 'Dublin' },
  ],
  knowsAbout: ['iOS', 'Android', 'Flutter', 'Dart', 'Swift', 'SwiftUI', 'Kotlin', 'Firebase', 'Google Cloud', 'React Native', 'Vue.js', 'Node.js', 'Mobile app development', 'Product design'],
  sameAs: [profile.github, profile.linkedin],
}
const apps = experiences.map((e, i) => ({
  '@type': 'ListItem',
  position: i + 1,
  item: {
    '@type': 'SoftwareApplication',
    '@id': `${url}#${e.id}`,
    name: e.name,
    url: `${url}#${e.id}`,
    image: `${siteUrl}${e.icon}`,
    applicationCategory: 'MobileApplication',
    operatingSystem: 'iOS, Android',
    description: e.bullets.join(' '),
    ...(e.links?.length ? { sameAs: e.links.map(l => l.href) } : {}),
    author: { '@id': `${url}#person` },
  },
}))
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    person,
    {
      '@type': 'WebSite',
      '@id': `${url}#website`,
      url,
      name: `${profile.name} – Portfolio`,
      inLanguage: 'en',
      publisher: { '@id': `${url}#person` },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${url}#page`,
      url,
      name: title,
      description,
      isPartOf: { '@id': `${url}#website` },
      about: { '@id': `${url}#person` },
      mainEntity: { '@id': `${url}#person` },
      primaryImageOfPage: { '@type': 'ImageObject', url: ogImage, width: 1200, height: 630 },
      inLanguage: 'en',
    },
    {
      '@type': 'ItemList',
      '@id': `${url}#apps`,
      name: `Apps by ${profile.name}`,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: apps.length,
      itemListElement: apps,
    },
  ],
}

useHead({
  link: [{ rel: 'canonical', href: url }],
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd) }],
})
</script>

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
