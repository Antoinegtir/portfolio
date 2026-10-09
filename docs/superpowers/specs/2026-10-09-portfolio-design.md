# Portfolio — Design

Clone of the structure and style of https://junho.io/, adapted for Antoine Gonthier (Mobile Engineer). Source of content: `~/Downloads/US_CV.pdf`.

## Stack
- Nuxt 3 (static generation via `nuxi generate`), Vue 3, TypeScript
- Tailwind CSS
- Fonts: Satoshi (Fontshare), fallback Inter
- Deploy target: Vercel or Netlify (static output)

## Scope
Single page, English only. No blog, no phone number published. Contact = email + GitHub + LinkedIn.

## Layout
- **Header**: floating pill, centered, `antoine.` logo left, GitHub / LinkedIn links right.
- **Intro**: "Hi, I'm Antoine Gonthier." + short paragraph (mobile engineer, 21, Paris–Dublin, 5+ years in mobile, SwiftUI/Java, Node.js, Firebase, product-design sense) + buttons GitHub, LinkedIn, Email.
- **Experience timeline**: one section per entry: app icon, title, period, bullets.
- **Footer**: minimal, links repeated.
- Dark theme (black background, light-gray text), content column ~640px, responsive, fade-in on scroll.

## Content (`content/experiences.ts`)
| Entry | Role | Period | Bullets |
|---|---|---|---|
| Calico | Mobile engineer (**role to confirm**) | Mar 2026 – today | Shipped 3 apps for an American studio; icon to provide (placeholder until then) |
| Wellnotes | Solo founder | Feb 2025 – today | Student app, 600+ ratings at 4.6★, 80K+ users; averaged top 100 on the App Store France, $30K ARR |
| Dreamoji | Founding engineer | Sept 2024 – June 2025 | Shipped an app generating Genmoji-style AI emojis before iOS 18 released; 300k+ iOS users |
| Vibes Widget | Founding engineer | Aug 2023 – today | Founding member of a social network popular in Japan, 3M+ users worldwide, top charts in 30+ countries; built and shipped the Android app; built and maintained the iOS versions |
| Kams | Solo founder | Dec 2021 – today | Launched my first social network at 16; it didn't take off |

App icons are extracted from the CV PDF into `public/icons/`.

## Components
- `AppHeader.vue` — floating nav pill
- `HeroIntro.vue` — title, bio, link buttons
- `ExperienceItem.vue` — icon, title, period, bullet list (props from data file)
- `AppFooter.vue`
- `pages/index.vue` — composes the above, maps over `experiences`

Each component takes plain props; content lives only in `content/`.

## SEO / meta
Title, description, OpenGraph and Twitter card tags via `useSeoMeta`; favicon from Wellnotes or a simple monogram.

## Testing
Manual: `nuxi generate` builds without errors, page checked at desktop and 375px width, no console errors.

## Out of scope
Blog, i18n, CMS, analytics, contact form.
