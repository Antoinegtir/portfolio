<script setup lang="ts">
import { profile } from '~/content/experiences'
// true once AppHeader has mounted and draws the avatar + name itself
const identityMounted = useState('identity-mounted', () => false)
const links = [
  { label: 'GitHub', href: profile.github, icon: 'github' },
  { label: 'LinkedIn', href: profile.linkedin, icon: 'linkedin' },
  { label: 'Email', href: `mailto:${profile.email}`, icon: 'mail' },
] as const
// skillicons.dev ids (react stands in for React Native, which has no dedicated icon)
const stack = ['flutter', 'dart', 'firebase', 'gcp', 'swift', 'kotlin', 'react', 'vue', 'mongodb', 'redis', 'postgres', 'nodejs', 'js']
</script>

<template>
  <section id="top">
    <!-- resting place of the avatar + name; the AppHeader overlay draws them here and morphs them into the bar on scroll -->
    <div id="identity-slot" class="identity-slot" aria-hidden="true">
      <!-- server-rendered stand-in shown until the header takes over: shimmering avatar + name -->
      <div v-show="!identityMounted" class="identity-static">
        <span class="identity-pill" />
        <span class="identity-avatar shimmer" />
        <span class="identity-name">{{ profile.name }}<small>{{ profile.tagline }} <span class="flag" role="img" aria-label="France">🇫🇷</span></small></span>
      </div>
    </div>
    <h1 class="title">Hi, I'm {{ profile.name.split(' ')[0] }}</h1>
    <p class="bio">{{ profile.bio }}</p>
    <div id="hero-links" class="buttons">
      <a v-for="l in links" :key="l.label" :href="l.href" target="_blank" rel="noopener" class="btn">
        <svg v-if="l.icon === 'github'" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        <svg v-else-if="l.icon === 'linkedin'" viewBox="3 3 17.7 17.7" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="M3.5 7l8.5 6 8.5-6" />
        </svg>
        <span>{{ l.label }}</span>
      </a>
    </div>
    <p class="stack-label">Stack</p>
    <ul class="stack" aria-label="Tech stack: Flutter, Dart, Firebase, Google Cloud, Swift, Kotlin, React Native, Vue.js, MongoDB, Redis, PostgreSQL, Node.js, JavaScript">
      <li v-for="id in stack" :key="id">
        <img v-shimmer :src="`https://skillicons.dev/icons?i=${id}&theme=dark`" :alt="id" class="stack-icon shimmer" width="48" height="48" loading="lazy">
      </li>
    </ul>
  </section>
</template>

<style scoped>
#top {
  scroll-margin-top: 120px; /* keeps the hero clear of the header when the URL carries #top */
}
.identity-slot {
  height: 64px;
  margin-bottom: 28px;
}
.identity-static {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #fafafa;
}
.identity-pill {
  display: none;
}
.identity-avatar {
  flex: none;
  width: 64px;
  height: 64px;
  border-radius: 22%;
}
.identity-name {
  position: relative;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.1;
  white-space: nowrap;
}
.identity-name small {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #888;
}
/* Before hydration, browsers with scroll-driven animations get the same hero -> top bar morph as
   AppHeader (fixed elements, trajectory mapped onto the first --travel px of scroll). The
   geometry mirrors AppHeader's constants: content column left, hero y 96px, bar y 27px. */
@supports (animation-timeline: scroll()) {
  .identity-static {
    --hero-x: max(16px, calc((100vw - 480px) / 2));
    --hero-y: 96px;
    --pill-left: max(16px, calc((100vw - 740px) / 2));
    --bar-x: calc(var(--pill-left) + 20px);
    --bar-y: 27px;
    --travel: 69px;
    --name-scale: 0.75;
    position: fixed;
    inset: 0 0 auto 0;
    height: 0;
    z-index: 40;
    display: block;
    pointer-events: none;
  }
  @media (max-width: 479px) {
    .identity-static { --name-scale: 0.625; }
  }
  @media (min-width: 1024px) {
    .identity-static { --hero-x: calc((100vw - 942px) / 2); }
  }
  .identity-pill {
    display: block;
    position: absolute;
    top: 16px;
    left: var(--pill-left);
    width: min(740px, calc(100vw - 32px));
    height: 50px;
    border-radius: 8px;
    border: 1px solid #333;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: saturate(1.4) blur(12px);
    -webkit-backdrop-filter: saturate(1.4) blur(12px);
    animation: static-pill linear both;
    animation-timeline: scroll(root block);
    animation-range: 0 var(--travel);
  }
  .identity-avatar {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0 0;
    animation: static-avatar linear both;
    animation-timeline: scroll(root block);
    animation-range: 0 var(--travel);
  }
  .identity-name {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0 50%;
    animation: static-name linear both;
    animation-timeline: scroll(root block);
    animation-range: 0 var(--travel);
  }
  .identity-name small {
    animation: static-subtitle linear both;
    animation-timeline: scroll(root block);
    animation-range: 0 var(--travel);
  }
}
@keyframes static-avatar {
  from { transform: translate(var(--hero-x), var(--hero-y)) scale(1); }
  to   { transform: translate(var(--bar-x), var(--bar-y)) scale(0.4375); }
}
@keyframes static-name {
  from { transform: translate(calc(var(--hero-x) + 78px), calc(var(--hero-y) + 32px)) translateY(-50%) scale(1); }
  to   { transform: translate(calc(var(--bar-x) + 38px), calc(var(--bar-y) + 14px)) translateY(-50%) scale(var(--name-scale)); }
}
@keyframes static-subtitle {
  from { opacity: 1; }
  40%  { opacity: 0; }
  to   { opacity: 0; }
}
@keyframes static-pill {
  from { opacity: 0; transform: translateY(-8px); }
  45%  { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
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
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: #eaeaea;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transition: background 150ms ease, border-color 150ms ease, transform 150ms ease, color 150ms ease;
}
.btn svg {
  width: 16px;
  height: 16px;
  opacity: 0.85;
}
.btn:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
  transform: translateY(-1px);
}
.btn:active {
  transform: translateY(0);
  background: rgba(255, 255, 255, 0.1);
}
@media (prefers-reduced-motion: reduce) {
  .btn,
  .btn:hover {
    transform: none;
  }
}
.stack-label {
  margin-top: 32px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #555;
}
.stack {
  display: grid;
  grid-template-columns: repeat(7, 48px);
  gap: 6px;
  margin-top: 10px;
}
.stack-icon {
  display: block;
  width: 48px;
  height: 48px;
  border-radius: 10px;
}
</style>
