<template>
  <!-- App-icon grid template: used for the Portfolio tile and as the placeholder while an icon loads -->
  <svg viewBox="0 0 100 100" aria-hidden="true" class="blueprint">
    <g fill="none" stroke="#7d7d7d" stroke-width="0.9">
      <path d="M22 0v100M50 0v100M78 0v100M0 22h100M0 50h100M0 78h100" />
      <path d="M0 0l100 100M100 0L0 100" />
      <circle cx="50" cy="50" r="44" />
      <circle cx="50" cy="50" r="27" />
      <circle cx="50" cy="50" r="17" />
    </g>
  </svg>
</template>

<style scoped>
.blueprint {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #ffffff 0%, #ececec 100%);
}
</style>
