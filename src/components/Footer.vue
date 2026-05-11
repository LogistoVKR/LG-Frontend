<template>
  <footer class="bg-surface border-t border-line px-6 py-4 mt-auto">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <img class="w-5 h-5" src="/logo.svg" alt="Logo"/>
        <span class="text-sm text-ink-3">Logisto WMS © 2026</span>
      </div>
      <router-link
        to="/legal"
        class="text-sm text-ink-3 opacity-60 hover:opacity-100 transition-opacity">
        Правовая информация
      </router-link>
    </div>
  </footer>
</template>

<script setup>

</script>

<style scoped>
@media (max-width: 600px) {
  .container {
    grid-template-columns: 1fr !important;
    padding-left: 2vw;
    padding-right: 2vw;
    row-gap: 8px;
  }
  h2 {
    font-size: 0.9rem;
  }
  .w-5, .h-5 {
    width: 18px !important;
    height: 18px !important;
  }
}
</style>
