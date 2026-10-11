<script setup lang="ts">
import { profile } from '~/content/experiences'
</script>

<template>
  <footer class="footer">
    <p class="say">Say hi</p>
    <a :href="`mailto:${profile.email}`" class="mail">{{ profile.email }}</a>
    <div class="row">
      <span class="copy">© 2026 {{ profile.name }}</span>
      <span class="social">
        <a :href="profile.github" target="_blank" rel="noopener">GitHub</a>
        <a :href="profile.linkedin" target="_blank" rel="noopener">LinkedIn</a>
        <a href="#legal" class="legal-link" @click.prevent="($refs.legal as HTMLDetailsElement).open = !($refs.legal as HTMLDetailsElement).open">Legal</a>
      </span>
    </div>

    <!-- Mentions légales (French LCEN, art. 6-III): publisher, host and third-party services.
         A native <details> so it works before hydration and with the keyboard. -->
    <details id="legal" ref="legal" class="legal">
      <summary class="legal-summary">Legal notice</summary>
      <div class="legal-body">
        <h3>Publisher</h3>
        <p>
          This personal, non-commercial website is published by {{ profile.name }}, a private individual.
          Contact: <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>.
        </p>
        <h3>Hosting</h3>
        <p>
          OVH SAS, 2 rue Kellermann, 59100 Roubaix, France.
          Phone: +33 (0)9 72 10 10 07. <a href="https://www.ovhcloud.com" target="_blank" rel="noopener">ovhcloud.com</a>
        </p>
        <h3>Personal data &amp; cookies</h3>
        <p>
          This site sets no cookies and runs no analytics or tracking. The only data processed is what
          you choose to send by email. The Satoshi typeface is loaded from Fontshare (Indian Type Foundry),
          which receives your IP address as part of serving the font files.
        </p>
        <h3>Content</h3>
        <p>
          App names, icons and screenshots belong to their respective owners and are shown to document
          my work on them. Code of this site:
          <a href="https://github.com/Antoinegtir/portfolio" target="_blank" rel="noopener">github.com/Antoinegtir/portfolio</a>.
        </p>
      </div>
    </details>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
  color: #666;
}
.say {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #555;
}
.mail {
  display: inline-block;
  margin-top: 8px;
  font-size: 18px;
  color: #eaeaea;
  text-decoration: underline;
  text-decoration-color: rgba(255, 255, 255, 0.25);
  text-underline-offset: 4px;
  transition: text-decoration-color 150ms ease;
}
.mail:hover {
  text-decoration-color: #fff;
}
.row {
  display: flex;
  flex-wrap: wrap; /* the links drop to their own line on narrow screens instead of breaking the name */
  justify-content: space-between;
  align-items: center;
  gap: 10px 16px;
  margin-top: 28px;
}
.copy {
  white-space: nowrap;
}
.social {
  display: flex;
  gap: 16px;
}
@media (max-width: 380px) {
  .social {
    gap: 12px;
  }
}
.social a:hover {
  color: #fff;
}
.legal {
  margin-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 12px;
  font-size: 13px;
  line-height: 1.55;
  color: #666;
}
.legal-summary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  list-style: none;
  color: #555;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  user-select: none;
}
.legal-summary::-webkit-details-marker {
  display: none;
}
.legal-summary::after {
  content: '';
  width: 6px;
  height: 6px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: translateY(-2px) rotate(45deg);
  transition: transform 200ms ease;
}
.legal[open] .legal-summary::after {
  transform: translateY(1px) rotate(225deg);
}
.legal-summary:hover {
  color: #999;
}
.legal-body {
  padding: 8px 0 4px;
}
.legal-body h3 {
  margin-top: 14px;
  font-size: 13px;
  font-weight: 700;
  color: #999;
}
.legal-body h3:first-child {
  margin-top: 0;
}
.legal-body p {
  margin-top: 4px;
}
.legal-body a {
  color: #4f9cff;
  text-decoration: underline;
  text-decoration-color: rgba(79, 156, 255, 0.35);
  text-underline-offset: 3px;
}
.legal-body a:hover {
  text-decoration-color: #4f9cff;
}
</style>
