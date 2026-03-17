<template>
  <header class="w-full bg-white shadow-lg relative z-10">
    <!-- Desktop Layout -->
    <div class="hidden lg:block">
      <div class="container mx-auto py-4 px-4 grid grid-cols-3 items-center">
        <!-- Логотип -->
        <router-link to="/" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <img class="w-6 h-6" src="/logo.svg" alt="Logo" />
          <h1 class="text-2xl font-bold text-gray-800">Logisto</h1>
        </router-link>

        <!-- Навигация -->
        <nav class="flex justify-center space-x-6 text-base font-medium">
          <router-link
              to="/"
              class="text-gray-700 hover:text-gray-900 transition-colors"
              active-class="text-gray-900 font-semibold">
            Главная
          </router-link>
          <router-link
              to="/about"
              class="text-gray-700 hover:text-gray-900 transition-colors"
              active-class="text-gray-900 font-semibold">
            О нас
          </router-link>
          <router-link
              to="/pricing"
              class="text-gray-700 hover:text-gray-900 transition-colors"
              active-class="text-gray-900 font-semibold">
            Тарифы
          </router-link>
          <router-link
              to="/contact"
              class="text-gray-700 hover:text-gray-900 transition-colors"
              active-class="text-gray-900 font-semibold">
            Контакты
          </router-link>
        </nav>

        <!-- Аутентификация -->
        <div class="flex justify-end items-center space-x-4 text-base">
          <div v-if="isLoading" class="text-gray-500">
            Загрузка...
          </div>
          
          <div v-else-if="!isAuthenticated" class="flex items-center space-x-3">
            <button
                @click="handleLogin"
                class="px-5 py-2 border border-blue-600 text-blue-600 rounded-xl transition-colors duration-200 hover:bg-blue-600 hover:text-white">
              Вход
            </button>
            <button
                @click="handleRegister"
                class="px-5 py-2 bg-blue-600 text-white rounded-xl transition-colors duration-200 hover:bg-blue-700">
              Регистрация
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Layout - только логотип и бургер -->
    <div class="lg:hidden">
      <div class="flex items-center justify-between py-3 px-4">
        <!-- Логотип -->
        <router-link to="/" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <img class="w-5 h-5" src="/logo.svg" alt="Logo" />
          <h1 class="text-lg font-bold text-gray-800">Logisto</h1>
        </router-link>

        <!-- Бургер кнопка -->
        <button
          @click="toggleMenu"
          class="inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          :aria-expanded="isMenuOpen ? 'true' : 'false'"
          aria-controls="mobile-menu"
          aria-label="Меню">
          <svg v-if="!isMenuOpen" class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile dropdown panel -->
      <div
        id="mobile-menu"
        v-show="isMenuOpen"
        class="border-t border-gray-200 bg-white">
        <div class="px-4 py-4 space-y-4">
          <nav class="flex flex-col space-y-3 text-base font-medium">
            <router-link
              @click="toggleMenu"
              to="/"
              class="text-gray-700 hover:text-gray-900 transition-colors py-2">Главная</router-link>
            <router-link
              @click="toggleMenu"
              to="/about"
              class="text-gray-700 hover:text-gray-900 transition-colors py-2">О нас</router-link>
            <router-link
              @click="toggleMenu"
              to="/pricing"
              class="text-gray-700 hover:text-gray-900 transition-colors py-2">Тарифы</router-link>
            <router-link
              @click="toggleMenu"
              to="/contact"
              class="text-gray-700 hover:text-gray-900 transition-colors py-2">Контакты</router-link>
          </nav>

          <div class="pt-3 border-t border-gray-100">
            <div v-if="isLoading" class="text-gray-500 py-2">
              Загрузка...
            </div>
            <div v-else-if="!isAuthenticated" class="flex flex-col gap-3">
              <button
                @click="() => { toggleMenu(); handleLogin(); }"
                class="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-xl transition-colors duration-200 hover:bg-blue-600 hover:text-white">
                Вход
              </button>
              <button
                @click="() => { toggleMenu(); handleRegister(); }"
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-xl transition-colors duration-200 hover:bg-blue-700">
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

// При монтировании компонента проверяем состояние аутентификации
onMounted(async () => {
  console.log('🏷️ Header: Component mounted, checking auth state...');
  await updateAuthState();
});
</script>

 