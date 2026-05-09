<template>
  <header class="w-full bg-surface border-b border-line relative z-10" style="box-shadow: var(--shadow-1);">
<div class="hidden lg:block">
      <div class="container mx-auto py-4 px-4 grid grid-cols-3 items-center">
<router-link to="/" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <img class="w-6 h-6" src="/logo.svg" alt="Logo" />
          <h1 class="text-xl font-semibold text-ink">Logisto</h1>
        </router-link>

<nav class="flex justify-center space-x-6 text-sm font-medium">
          <router-link
              to="/"
              class="text-ink-2 hover:text-ink transition-colors"
              active-class="text-ink! font-semibold">
            Главная
          </router-link>
          <router-link
              to="/about"
              class="text-ink-2 hover:text-ink transition-colors"
              active-class="text-ink! font-semibold">
            О нас
          </router-link>
          <router-link
              to="/pricing"
              class="text-ink-2 hover:text-ink transition-colors"
              active-class="text-ink! font-semibold">
            Тарифы
          </router-link>
          <router-link
              to="/contact"
              class="text-ink-2 hover:text-ink transition-colors"
              active-class="text-ink! font-semibold">
            Контакты
          </router-link>
        </nav>

<div class="flex justify-end items-center space-x-3 text-sm">
          <div v-if="isLoading" class="text-ink-3">
            Загрузка...
          </div>

          <div v-else-if="!isAuthenticated" class="flex items-center space-x-2">
            <button
                @click="handleLogin"
                class="btn btn-secondary">
              Вход
            </button>
            <button
                @click="handleRegister"
                class="btn btn-primary">
              Регистрация
            </button>
          </div>
        </div>
      </div>
    </div>

<div class="lg:hidden">
      <div class="flex items-center justify-between py-3 px-4">
        <router-link to="/" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <img class="w-5 h-5" src="/logo.svg" alt="Logo" />
          <h1 class="text-base font-semibold text-ink">Logisto</h1>
        </router-link>

        <button
          @click="toggleMenu"
          class="inline-flex items-center justify-center p-2 rounded-[var(--r-2)] border border-line hover:bg-surface-2 transition-colors"
          :aria-expanded="isMenuOpen ? 'true' : 'false'"
          aria-controls="mobile-menu"
          aria-label="Меню">
          <svg v-if="!isMenuOpen" class="w-5 h-5 text-ink-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-5 h-5 text-ink-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

<div
        id="mobile-menu"
        v-show="isMenuOpen"
        class="border-t border-line bg-surface">
        <div class="px-4 py-4 space-y-4">
          <nav class="flex flex-col space-y-1 text-sm font-medium">
            <router-link
              @click="toggleMenu"
              to="/"
              class="text-ink-2 hover:text-ink hover:bg-surface-2 px-3 py-2 rounded-[var(--r-2)] transition-colors">Главная</router-link>
            <router-link
              @click="toggleMenu"
              to="/about"
              class="text-ink-2 hover:text-ink hover:bg-surface-2 px-3 py-2 rounded-[var(--r-2)] transition-colors">О нас</router-link>
            <router-link
              @click="toggleMenu"
              to="/pricing"
              class="text-ink-2 hover:text-ink hover:bg-surface-2 px-3 py-2 rounded-[var(--r-2)] transition-colors">Тарифы</router-link>
            <router-link
              @click="toggleMenu"
              to="/contact"
              class="text-ink-2 hover:text-ink hover:bg-surface-2 px-3 py-2 rounded-[var(--r-2)] transition-colors">Контакты</router-link>
          </nav>

          <div class="pt-3 border-t border-line">
            <div v-if="isLoading" class="text-ink-3 py-2 text-sm">
              Загрузка...
            </div>
            <div v-else-if="!isAuthenticated" class="flex flex-col gap-2">
              <button
                @click="() => { toggleMenu(); handleLogin(); }"
                class="btn btn-secondary w-full">
                Вход
              </button>
              <button
                @click="() => { toggleMenu(); handleRegister(); }"
                class="btn btn-primary w-full">
                Регистрация
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth.js';
import { onMounted, ref } from 'vue';

const { isAuthenticated, isLoading, login, register, updateAuthState } = useAuth();

const isMenuOpen = ref(false);
const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value; };

const handleLogin = async () => {
  try {
    await login();
  } catch (error) {
    console.error('Ошибка входа:', error);
  }
};

const handleRegister = async () => {
  try {
    await register();
  } catch (error) {
    console.error('Ошибка регистрации:', error);
  }
};


onMounted(async () => {
  console.log('🏷️ Header: Component mounted, checking auth state...');
  await updateAuthState();
});
</script>

