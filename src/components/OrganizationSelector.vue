<template>
  <div class="relative">
    <!-- Organization Dropdown Button -->
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
      <span class="text-sm font-medium text-gray-900">
        {{ organizationsStore.selectedOrganization?.name || 'Выберите организацию' }}
      </span>
      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <div v-if="isDropdownOpen" class="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
      <div class="p-2">
        <!-- Loading State -->
        <div v-if="organizationsStore.loading" class="flex items-center justify-center py-4">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span class="ml-2 text-sm text-gray-600">Загрузка...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="organizationsStore.error" class="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
          {{ organizationsStore.error }}
        </div>

        <!-- Organizations List -->
        <div v-else-if="organizationsStore.hasOrganizations" class="space-y-1">
          <div
            v-for="organization in organizationsStore.organizations"
            :key="organization.id"
            @click="handleSelectOrganization(organization)"
            class="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg cursor-pointer transition-colors"
            :class="{ 'bg-blue-50 text-blue-600': organizationsStore.selectedOrganization?.id === organization.id }">
            <div class="flex-1">
              <div class="font-medium">{{ organization.name }}</div>
              <div v-if="organization.description" class="text-xs text-gray-500 truncate">
                {{ organization.description }}
              </div>
            </div>
            <svg v-if="organizationsStore.selectedOrganization?.id === organization.id" class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-3 text-sm text-gray-500 text-center">
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

// Watch for organization changes and restore from storage
watch(() => organizationsStore.organizations, () => {
  organizationsStore.getSelectedOrganizationFromStorage();
}, { immediate: true });

onMounted(() => {
  organizationsStore.loadOrganizations();
  document.addEventListener('click', handleClickOutside);
});

// Cleanup
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script> 