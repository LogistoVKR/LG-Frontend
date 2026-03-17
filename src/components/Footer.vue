<template>
  <footer class="bg-white border-t px-6 py-4 mt-auto">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <img class="w-5 h-5" src="/logo.svg" alt="Logo"/>
        <span class="text-sm text-gray-600">Logisto WMS © 2025</span>
      </div>
      <router-link
        to="/legal"
        class="text-sm text-gray-600 opacity-40 hover:opacity-70 transition-opacity">
        Правовая информация
      </router-link>
    </div>
  </footer>
</template>

<script setup>
// No props or logic needed for footer
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
