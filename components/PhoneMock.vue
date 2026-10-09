<script setup lang="ts">
import { experiences, profile } from '~/content/experiences'

const dock = [
  { label: 'Mail', kind: 'mail', href: `mailto:${profile.email}` },
  { label: 'GitHub', kind: 'github', href: profile.github },
  { label: 'LinkedIn', kind: 'linkedin', href: profile.linkedin },
] as const

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="phone" aria-hidden="true">
    <div class="screen">
      <div class="island" />
      <div class="status">
        <span class="time">9:41</span>
        <span class="status-icons">
          <span class="signal"><i /><i /><i /><i /></span>
          <span class="battery"><i /></span>
        </span>
      </div>

      <div class="grid">
        <button v-for="e in experiences" :key="e.id" type="button" class="app" @click="goTo(e.id)">
          <span class="app-icon" :style="{ backgroundImage: `url(${e.icon})` }" />
          <span class="app-label">{{ e.name }}</span>
        </button>
      </div>

      <div class="dots"><i class="on" /><i /></div>

      <div class="dock">
        <a v-for="d in dock" :key="d.label" :href="d.href" target="_blank" rel="noopener" class="dock-app" :title="d.label">
          <span class="app-icon" :class="`dock-${d.kind}`">
            <svg v-if="d.kind === 'github'" viewBox="0 0 16 16" fill="#fff">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <svg v-else-if="d.kind === 'linkedin'" class="linkedin" viewBox="3 3 17.7 17.7" fill="#fff">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
            </svg>
          </span>
        </a>
      </div>

      <div class="home-bar" />
    </div>
    <img src="/iphone-frame.png" alt="" class="frame" width="812" height="1600">
  </div>
</template>

<style scoped>
/*
 * Everything inside the phone is sized in cqw (1% of the phone width) so the
 * mock scales as one unit. The screen rectangle matches the transparent area of
 * device.png: x 170-1829, y 170-3769 on a 2000x3940 image.
 */
.phone {
  position: relative;
  width: min(364px, (100vh - 48px) * 0.5076);
  aspect-ratio: 2000 / 3940;
  container-type: inline-size;
  filter: drop-shadow(0 20px 56px rgba(0, 0, 0, 0.55));
}
.frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
  user-select: none;
}
.screen {
  position: absolute;
  left: 8.5cqw;
  top: 8.5cqw;
  width: 83cqw;
  height: 180cqw;
  border-radius: 7cqw;
  overflow: hidden;
  z-index: 1;
  background:
    radial-gradient(60cqw 60cqw at 20% 15%, rgba(120, 90, 255, 0.55), transparent 70%),
    radial-gradient(70cqw 70cqw at 90% 40%, rgba(40, 110, 255, 0.45), transparent 70%),
    radial-gradient(60cqw 60cqw at 30% 95%, rgba(255, 70, 160, 0.35), transparent 70%),
    linear-gradient(180deg, #0a0a14 0%, #05050a 100%);
}
.island {
  position: absolute;
  top: 2.6cqw;
  left: 50%;
  transform: translateX(-50%);
  width: 25cqw;
  height: 7cqw;
  border-radius: 4cqw;
  background: #000;
}
.status {
  position: absolute;
  top: 3.2cqw;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 9cqw 0 10cqw;
  font-size: 3.6cqw;
  font-weight: 700;
  line-height: 6cqw;
  color: #fff;
}
.status-icons {
  display: flex;
  align-items: center;
  gap: 1.4cqw;
}
.signal {
  display: flex;
  align-items: flex-end;
  gap: 0.5cqw;
  height: 2.8cqw;
}
.signal i {
  display: block;
  width: 0.9cqw;
  background: #fff;
  border-radius: 0.2cqw;
}
.signal i:nth-child(1) { height: 35%; }
.signal i:nth-child(2) { height: 55%; }
.signal i:nth-child(3) { height: 75%; }
.signal i:nth-child(4) { height: 100%; }
.battery {
  position: relative;
  width: 6cqw;
  height: 2.9cqw;
  border: 0.35cqw solid rgba(255, 255, 255, 0.5);
  border-radius: 0.9cqw;
  padding: 0.3cqw;
}
.battery i {
  display: block;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 0.4cqw;
}
.grid {
  position: absolute;
  top: 18cqw;
  left: 3.5cqw;
  width: 76cqw;
  display: grid;
  grid-template-columns: repeat(4, 19cqw);
  grid-auto-rows: 23cqw;
}
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1cqw;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
}
.app:active .app-icon {
  filter: brightness(0.7);
}
.app-icon {
  display: grid;
  place-items: center;
  width: 14cqw;
  height: 14cqw;
  border-radius: 3.5cqw;
  background-size: cover;
  background-position: center;
  box-shadow: 0 0.6cqw 1.6cqw rgba(0, 0, 0, 0.35);
  overflow: hidden;
}
.app-label {
  max-width: 19cqw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 2.5cqw;
  line-height: 1.2;
  color: #fff;
  text-shadow: 0 0.2cqw 0.6cqw rgba(0, 0, 0, 0.5);
}
.dots {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 30cqw;
  display: flex;
  justify-content: center;
  gap: 1.6cqw;
}
.dots i {
  width: 1.4cqw;
  height: 1.4cqw;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
}
.dots i.on {
  background: #fff;
}
.dock {
  position: absolute;
  left: 3.5cqw;
  right: 3.5cqw;
  bottom: 5cqw;
  height: 21.5cqw;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-radius: 7cqw;
  background: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.dock-app {
  display: block;
}
.dock-app .app-icon svg {
  width: 62%;
  height: 62%;
}
.dock-mail {
  background-image: url('/icons/mail.png');
}
.dock-github {
  background: #111;
  border: 0.3cqw solid rgba(255, 255, 255, 0.12);
}
.dock-linkedin {
  background: #0a66c2;
}
.dock-linkedin svg.linkedin {
  width: 64%;
  height: 64%;
}
.home-bar {
  position: absolute;
  left: 50%;
  bottom: 1.6cqw;
  transform: translateX(-50%);
  width: 28cqw;
  height: 1.1cqw;
  border-radius: 1cqw;
  background: rgba(255, 255, 255, 0.9);
}
</style>
