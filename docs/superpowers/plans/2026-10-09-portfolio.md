# Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page dark portfolio for Antoine Gonthier, cloned in structure/style from junho.io, with Nuxt 3.

**Architecture:** Statically generated Nuxt 3 app. Content lives in one typed data file; four small presentational components render it on `pages/index.vue`. Tailwind handles styling.

**Tech Stack:** Nuxt 3, Vue 3, TypeScript, Tailwind CSS (`@nuxtjs/tailwindcss`), Satoshi font (Fontshare), Vitest for data tests.

## Global Constraints

- English only, single page, no blog, no phone number anywhere.
- Contact = email `antoinegonthier11@icloud.com`, GitHub `https://github.com/antoinegtr`, LinkedIn `https://www.linkedin.com/in/antoinegtr`.
- Dark theme: black background, light-gray text, content column max 640px, responsive down to 375px.
- Experience order (newest first): Calico, Wellnotes, Dreamoji, Vibes Widget, Kams.
- Project root: `/Users/antoinegonthier/Documents/portfolio` (not a git repo: skip commit steps unless the user runs `git init`).

---

## File Structure

- `nuxt.config.ts` — modules, fonts, SEO head
- `app.vue` — page shell
- `assets/css/main.css` — Tailwind layers, base styles
- `content/experiences.ts` — typed data (`Experience`, `experiences`, `profile`)
- `components/AppHeader.vue`, `HeroIntro.vue`, `ExperienceItem.vue`, `AppFooter.vue`
- `pages/index.vue` — composition
- `public/icons/*.png` — app icons extracted from the CV
- `tests/experiences.test.ts` — data sanity tests

---

### Task 1: Scaffold Nuxt + Tailwind + dark shell

**Files:**
- Create: project via `nuxi`, `nuxt.config.ts`, `app.vue`, `assets/css/main.css`

**Interfaces:**
- Produces: running dev server, Tailwind classes available, Satoshi loaded.

- [ ] **Step 1: Scaffold in a temp dir and move in (directory already has `docs/`)**

```bash
cd /Users/antoinegonthier/Documents
npx nuxi@latest init portfolio-tmp --packageManager npm --gitInit false --no-install
cp -R portfolio-tmp/. portfolio/ && rm -rf portfolio-tmp
cd portfolio && npm install
npm install -D @nuxtjs/tailwindcss vitest
```
Expected: `package.json` and `nuxt.config.ts` exist in `portfolio/`; `docs/` untouched.

- [ ] **Step 2: Write `nuxt.config.ts`**

```ts
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'preconnect', href: 'https://api.fontshare.com' },
        {
          rel: 'stylesheet',
          href: 'https://api.fontshare.com/v2/css?f[]=satoshi@500,700&display=swap',
        },
      ],
    },
  },
})
```

- [ ] **Step 3: Write `assets/css/main.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html { background: #000; color-scheme: dark; }
body {
  @apply bg-black text-neutral-300 antialiased;
  font-family: 'Satoshi', Inter, system-ui, sans-serif;
}
```

- [ ] **Step 4: Write `app.vue`**

```vue
<template>
  <NuxtPage />
</template>
```

Create `pages/index.vue` with `<template><main class="mx-auto max-w-[640px] px-5 pt-28">Hello</main></template>`.

- [ ] **Step 5: Verify**

Run: `npm run dev` then open http://localhost:3000.
Expected: black page with "Hello", no console errors. Stop the server.

---

### Task 2: Content data + tests

**Files:**
- Create: `content/experiences.ts`, `tests/experiences.test.ts`

**Interfaces:**
- Produces:
  - `type Experience = { name: string; role: string; period: string; icon: string; bullets: string[] }`
  - `const experiences: Experience[]`
  - `const profile: { name: string; tagline: string; bio: string; github: string; linkedin: string; email: string }`

- [ ] **Step 1: Write the failing test `tests/experiences.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { experiences, profile } from '../content/experiences'

describe('content', () => {
  it('lists the five experiences, newest first', () => {
    expect(experiences.map(e => e.name)).toEqual([
      'Calico', 'Wellnotes', 'Dreamoji', 'Vibes Widget', 'Kams',
    ])
  })
  it('every entry has role, period, icon and bullets', () => {
    for (const e of experiences) {
      expect(e.role).toBeTruthy()
      expect(e.period).toBeTruthy()
      expect(e.icon).toMatch(/^\/icons\/.+\.png$/)
      expect(e.bullets.length).toBeGreaterThan(0)
    }
  })
  it('never exposes a phone number', () => {
    expect(JSON.stringify({ experiences, profile })).not.toMatch(/\+?\d[\d .]{8,}\d/)
  })
})
```

- [ ] **Step 2: Run to confirm failure**

Run: `npx vitest run`
Expected: FAIL (cannot resolve `../content/experiences`).

- [ ] **Step 3: Write `content/experiences.ts`**

```ts
export type Experience = {
  name: string
  role: string
  period: string
  icon: string
  bullets: string[]
}

export const profile = {
  name: 'Antoine Gonthier',
  tagline: 'Mobile Engineer',
  bio: "I'm a 21-year-old mobile engineer split between Paris and Dublin, with 5+ years of experience building consumer apps. I work with SwiftUI & Java, Node.js and Firebase, and I care a lot about product design.",
  github: 'https://github.com/antoinegtr',
  linkedin: 'https://www.linkedin.com/in/antoinegtr',
  email: 'antoinegonthier11@icloud.com',
}

export const experiences: Experience[] = [
  {
    name: 'Calico',
    role: 'Mobile Engineer',
    period: '2026.03 - Present',
    icon: '/icons/calico.png',
    bullets: ['Shipped 3 apps for an American studio.'],
  },
  {
    name: 'Wellnotes',
    role: 'Solo Founder',
    period: '2025.02 - Present',
    icon: '/icons/wellnotes.png',
    bullets: [
      'Student app with 80K+ users and 600+ ratings at 4.6 stars.',
      'Ranked on average in the top 100 of the App Store in France.',
      '$30K ARR.',
    ],
  },
  {
    name: 'Dreamoji',
    role: 'Founding Engineer',
    period: '2024.09 - 2025.06',
    icon: '/icons/dreamoji.png',
    bullets: [
      'Shipped an app generating Genmoji-style AI emojis before iOS 18 launched.',
      '300K+ users on iOS.',
    ],
  },
  {
    name: 'Vibes Widget',
    role: 'Founding Engineer',
    period: '2023.08 - Present',
    icon: '/icons/vibes.png',
    bullets: [
      'Founding member of a social network popular in Japan: 3,000,000+ users worldwide, top of the App Store charts in 30+ countries.',
      'Built and deployed the entire Android app.',
      'Built and maintain the iOS versions.',
    ],
  },
  {
    name: 'Kams',
    role: 'Solo Founder',
    period: '2021.12 - Present',
    icon: '/icons/kams.png',
    bullets: ['Launched my first social network at 16. It did not take off, but I learned a lot.'],
  },
]
```

- [ ] **Step 4: Run to confirm pass**

Run: `npx vitest run`
Expected: 3 passed. (The icon test passes on path strings only; files come in Task 3.)

---

### Task 3: Extract app icons from the CV

**Files:**
- Create: `public/icons/{wellnotes,dreamoji,vibes,kams,calico}.png`

**Interfaces:**
- Produces: five PNGs at the paths used in `content/experiences.ts`.

- [ ] **Step 1: Render the CV page to an image**

```bash
mkdir -p public/icons /private/tmp/claude-501/-Users-antoinegonthier-Documents-portfolio/5a397f66-a61b-498d-8bd2-ebbe30f392ef/scratchpad/cv
S=/private/tmp/claude-501/-Users-antoinegonthier-Documents-portfolio/5a397f66-a61b-498d-8bd2-ebbe30f392ef/scratchpad/cv
pdftoppm -r 300 -png /Users/antoinegonthier/Downloads/US_CV.pdf $S/cv
ls $S
```
Expected: `cv-1.png`. If `pdftoppm` is missing: `brew install poppler`.

- [ ] **Step 2: Crop icons**

The page renders at 827x1170 at 100 dpi, so at 300 dpi multiply coordinates by 3. Icon boxes (100-dpi px, x/y/size): Wellnotes 43/465/112, Dreamoji 43/596/112, Vibes 43/729/112, Kams 46/924/108.

```bash
S=/private/tmp/claude-501/-Users-antoinegonthier-Documents-portfolio/5a397f66-a61b-498d-8bd2-ebbe30f392ef/scratchpad/cv
crop(){ sips --cropOffset $(( $3*3 )) $(( $2*3 )) --cropToHeightWidth $(( $4*3 )) $(( $4*3 )) $S/cv-1.png --out public/icons/$1.png; }
crop wellnotes 43 465 112
crop dreamoji 43 596 112
crop vibes 43 729 112
crop kams 46 924 108
```
Arguments are `name x y size`; `sips --cropOffset` takes `y x`, handled in the function.

- [ ] **Step 3: Calico placeholder**

```bash
sips -s format png --cropToHeightWidth 336 336 public/icons/wellnotes.png --out public/icons/calico.png
```
(Temporary copy; the user provides the real Calico icon.)

- [ ] **Step 4: Verify visually**

Open each file in `public/icons/` with the Read tool.
Expected: clean square icons, no CV background bleeding. Adjust offsets by a few pixels and re-run `crop` if an edge is off.

---

### Task 4: Components and page

**Files:**
- Create: `components/AppHeader.vue`, `components/HeroIntro.vue`, `components/ExperienceItem.vue`, `components/AppFooter.vue`
- Modify: `pages/index.vue`

**Interfaces:**
- Consumes: `profile`, `experiences`, `Experience` from `~/content/experiences`.
- Produces: `<ExperienceItem :experience="e" />`.

- [ ] **Step 1: `components/AppHeader.vue`**

```vue
<script setup lang="ts">
import { profile } from '~/content/experiences'
</script>

<template>
  <header class="fixed inset-x-0 top-4 z-10 px-4">
    <nav class="mx-auto flex max-w-[640px] items-center justify-between rounded-xl border border-white/10 bg-black/60 px-5 py-3 backdrop-blur">
      <a href="#top" class="text-lg font-bold text-white">antoine.</a>
      <div class="flex gap-5 text-sm text-neutral-400">
        <a :href="profile.github" target="_blank" rel="noopener" class="hover:text-white">GitHub</a>
        <a :href="profile.linkedin" target="_blank" rel="noopener" class="hover:text-white">LinkedIn</a>
      </div>
    </nav>
  </header>
</template>
```

- [ ] **Step 2: `components/HeroIntro.vue`**

```vue
<script setup lang="ts">
import { profile } from '~/content/experiences'
const links = [
  { label: 'GitHub', href: profile.github },
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'Email', href: `mailto:${profile.email}` },
]
</script>

<template>
  <section id="top" class="pb-24">
    <h1 class="text-3xl font-bold text-white">Hi, I'm {{ profile.name }}.</h1>
    <p class="mt-4 max-w-md text-neutral-400">{{ profile.bio }}</p>
    <div class="mt-6 flex flex-wrap gap-2">
      <a
        v-for="l in links" :key="l.label" :href="l.href" target="_blank" rel="noopener"
        class="rounded border border-white/20 bg-white px-2 py-1 text-xs font-bold uppercase text-black hover:bg-neutral-300"
      >{{ l.label }}</a>
    </div>
  </section>
</template>
```

- [ ] **Step 3: `components/ExperienceItem.vue`**

```vue
<script setup lang="ts">
import type { Experience } from '~/content/experiences'
defineProps<{ experience: Experience }>()
</script>

<template>
  <article class="fade-in pb-20">
    <div class="flex items-center gap-4">
      <img :src="experience.icon" :alt="`${experience.name} icon`" width="48" height="48" class="h-12 w-12 rounded-xl" loading="lazy">
      <div>
        <h2 class="text-xl font-bold text-white">{{ experience.name }}</h2>
        <p class="text-sm text-indigo-300">{{ experience.role }} · {{ experience.period }}</p>
      </div>
    </div>
    <ul class="mt-4 list-disc space-y-1 pl-5 text-neutral-400">
      <li v-for="b in experience.bullets" :key="b">{{ b }}</li>
    </ul>
  </article>
</template>

<style scoped>
.fade-in { animation: fade 0.6s ease both; }
@keyframes fade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .fade-in { animation: none; } }
</style>
```

- [ ] **Step 4: `components/AppFooter.vue`**

```vue
<script setup lang="ts">
import { profile } from '~/content/experiences'
</script>

<template>
  <footer class="border-t border-white/10 py-10 text-sm text-neutral-500">
    <p>
      Say hi:
      <a :href="`mailto:${profile.email}`" class="text-neutral-300 hover:text-white">{{ profile.email }}</a>
    </p>
    <p class="mt-2">© 2026 {{ profile.name }}</p>
  </footer>
</template>
```

- [ ] **Step 5: `pages/index.vue`**

```vue
<script setup lang="ts">
import { experiences, profile } from '~/content/experiences'

const title = `${profile.name} — ${profile.tagline}`
useSeoMeta({
  title,
  description: profile.bio,
  ogTitle: title,
  ogDescription: profile.bio,
  twitterCard: 'summary',
})
</script>

<template>
  <div>
    <AppHeader />
    <main class="mx-auto max-w-[640px] px-5 pt-32">
      <HeroIntro />
      <ExperienceItem v-for="e in experiences" :key="e.name" :experience="e" />
      <AppFooter />
    </main>
  </div>
</template>
```

- [ ] **Step 6: Verify in the browser**

Run: `npm run dev`, open http://localhost:3000, then resize to 375px width.
Expected: header pill, hero, 5 entries with icons newest first, footer; no horizontal scroll at 375px; no console errors.

---

### Task 5: Production build check

**Files:** none new.

- [ ] **Step 1: Run tests**

Run: `npx vitest run`
Expected: 3 passed.

- [ ] **Step 2: Static build**

Run: `npx nuxi generate`
Expected: completes without errors, `.output/public/index.html` exists and contains `Antoine Gonthier` and `og:title`.

```bash
grep -c "Antoine Gonthier" .output/public/index.html
grep -c 'property="og:title"' .output/public/index.html
```
Expected: both counts ≥ 1.

- [ ] **Step 3: Phone number check**

```bash
grep -rE "\+?33 ?6|24 00 14" .output/public content components pages || echo "no phone found"
```
Expected: `no phone found`.
