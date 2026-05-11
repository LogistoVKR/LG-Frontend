<template>
  <header class="bg-surface border-b border-line px-6 py-3" style="box-shadow: var(--shadow-1);">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <OrganizationSelector />
      </div>

<div class="flex items-center space-x-4">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold" style="background: var(--accent); color: var(--accent-on);">
            {{ username.charAt(0).toUpperCase() }}
          </div>
          <div class="hidden md:block">
            <div class="text-sm font-medium text-ink">{{ username }}</div>
            <div class="text-xs text-ink-3">{{ userEmail }}</div>
          </div>
        </div>

        <div class="relative">
          <button
            @click="toggleProfileMenu"
            class="p-2 text-ink-3 hover:text-ink-2 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

<div v-if="showProfileMenu" class="absolute right-0 mt-2 w-48 bg-surface rounded-[var(--r-3)] py-1 z-50 border border-line" style="box-shadow: var(--shadow-2);">
            <button
              @click="goToMyPlan"
              class="block w-full text-left px-4 py-2 text-sm text-accent hover:bg-accent-soft transition-colors">
              Мой тариф
            </button>
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger-soft transition-colors">
              Выйти
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth.js';
import { useSidebar } from '@/composables/useSidebar.js';
import OrganizationSelector from '@/components/OrganizationSelector.vue';

const router = useRouter();
const { username, userEmail, logout } = useAuth();
const { isSidebarOpen } = useSidebar();

const showProfileMenu = ref(false);

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
};

const handleLogout = async () => {
  try {

    console.log('🔄 Header: Redirecting to home before logout');
    await router.push('/');


    await logout();
    console.log('✅ Header: Logout completed');
  } catch (error) {
    console.error('Ошибка выхода:', error);

    router.push('/');
  }
  showProfileMenu.value = false;
};

const goToMyPlan = () => {
  router.push('/my-plan');
  showProfileMenu.value = false;
};

document.addEventListener('click', (e) => {
  if (!e.target.closest('.relative')) {
    showProfileMenu.value = false;
  }
});
</script>

<style scoped>
@media (max-width: 800px) {
  .container {
    grid-template-columns: 1fr !important;
    padding-left: 2vw;
    padding-right: 2vw;
    row-gap: 10px;
  }
  nav {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .flex.justify-end {
    justify-content: center !important;
    margin-top: 8px;
  }
  h1 {
    font-size: 1.2rem;
  }
  .w-6, .h-6 {
    width: 24px !important;
    height: 24px !important;
  }
}
@media (max-width: 500px) {
  .container {
    padding-left: 1vw;
    padding-right: 1vw;
  }
  nav {
    font-size: 0.97rem;
  }
  .px-5 {
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
  .py-2 {
    padding-top: 6px !important;
    padding-bottom: 6px !important;
  }
}
</style>
