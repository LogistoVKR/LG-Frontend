<template>
  <div class="relative">
<button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-3 py-2 bg-surface border border-line rounded-[var(--r-2)] hover:bg-surface-2 hover:border-line-strong transition-colors focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft">
      <svg class="w-4 h-4 text-ink-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
      <span class="text-sm font-medium text-ink">
        {{ organizationsStore.selectedOrganization?.name || 'Выберите организацию' }}
      </span>
      <svg class="w-3.5 h-3.5 text-ink-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

<div v-if="isDropdownOpen" class="absolute top-full left-0 mt-1 w-64 bg-surface border border-line rounded-[var(--r-3)] z-50" style="box-shadow: var(--shadow-2);">
      <div class="p-1.5">
<div v-if="organizationsStore.loading" class="flex items-center justify-center py-4 gap-2">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2" style="border-color: var(--accent);"></div>
          <span class="body-s text-ink-2">Загрузка...</span>
        </div>

<div v-else-if="organizationsStore.error" class="p-3 body-s text-danger bg-danger-soft rounded-[var(--r-2)]">
          {{ organizationsStore.error }}
        </div>

<div v-else-if="organizationsStore.hasOrganizations" class="space-y-0.5">
          <div
            v-for="organization in organizationsStore.organizations"
            :key="organization.id"
            @click="handleSelectOrganization(organization)"
            class="flex items-center px-3 py-2 body-s text-ink-2 hover:bg-surface-2 hover:text-ink rounded-[var(--r-2)] cursor-pointer transition-colors"
            :class="{ 'bg-accent-soft! text-accent! font-medium': organizationsStore.selectedOrganization?.id === organization.id }">
            <div class="flex-1 min-w-0">
              <div class="font-medium truncate">{{ organization.name }}</div>
              <div v-if="organization.description" class="text-xs text-ink-3 truncate">
                {{ organization.description }}
              </div>
            </div>
            <svg v-if="organizationsStore.selectedOrganization?.id === organization.id" class="w-4 h-4 text-accent shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

<div v-else class="p-3 body-s text-ink-3 text-center">
          Нет доступных организаций
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { useOrganizationsStore } from '@/stores/organizations.js';

const organizationsStore = useOrganizationsStore();

const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const handleSelectOrganization = (organization) => {
  organizationsStore.selectOrganization(organization);
  isDropdownOpen.value = false;
};

const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    isDropdownOpen.value = false;
  }
};


watch(() => organizationsStore.organizations, () => {
  organizationsStore.getSelectedOrganizationFromStorage();
}, { immediate: true });

onMounted(() => {
  organizationsStore.loadOrganizations();
  document.addEventListener('click', handleClickOutside);
});


onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>