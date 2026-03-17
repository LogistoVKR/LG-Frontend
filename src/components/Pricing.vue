<template>
  <section class="py-8 sm:py-12 lg:py-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 lg:mb-12 text-center">Тарифы</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
        <!-- Базовый -->
        <div class="border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 bg-white flex flex-col min-h-full">
          <div class="mb-4 sm:mb-6">
            <h2 class="text-lg sm:text-xl font-semibold">Базовый</h2>
            <p class="text-gray-600 text-sm sm:text-base mt-1 sm:mt-2">Старт для малого бизнеса</p>
            <p class="mt-2 sm:mt-3 text-lg sm:text-xl font-bold text-green-600">Бесплатно</p>
          </div>

          <ul class="text-left space-y-2 sm:space-y-3 flex-1">

            <li class="flex items-start">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span class="text-sm sm:text-base">100 товаров</span>
            </li>
            <li class="flex items-start">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span class="text-sm sm:text-base">1 сотрудник</span>
            </li>
            <li class="flex items-start">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span class="text-sm sm:text-base">10 000 продаж</span>
            </li>
            
            <!-- Разделитель для дополнительных функций -->
            <li class="my-2 sm:my-3">
              <hr class="border-gray-300 opacity-50">
            </li>
            
            <li class="flex items-start">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span class="text-sm sm:text-base">Управление клиентами</span>
            </li>
            <li class="flex items-start">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span class="text-sm sm:text-base">Аналитика</span>
            </li>
          </ul>

          <button @click="handleStartFree" class="mt-4 sm:mt-6 w-full px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium">
            Начать
          </button>
        </div>

        <!-- Расширенный -->
        <div class="border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 bg-white flex flex-col min-h-full">
          <div class="mb-4 sm:mb-6">
            <h2 class="text-lg sm:text-xl font-semibold">Расширенный</h2>
            <p class="text-gray-600 text-sm sm:text-base mt-1 sm:mt-2">Для растущих команд</p>
            <p class="mt-2 sm:mt-3 text-lg sm:text-xl font-bold text-blue-700 whitespace-nowrap">9 999 ₸ в месяц</p>
          </div>

          <ul class="text-left space-y-2 flex-1">

            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-600 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span>1 000 товаров</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-600 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span>10 сотрудников</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-600 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span>100 000 продаж</span>
            </li>
            
            <!-- Разделитель для дополнительных функций -->
            <li class="my-2">
              <hr class="border-gray-300 opacity-50">
            </li>
            
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-600 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span>Управление клиентами</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-600 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span>Аналитика</span>
            </li>
          </ul>

          <button @click="handleSubscribe" class="mt-4 inline-block text-center px-4 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-black transition">
            Подписаться
          </button>
        </div>

        <!-- CRM -->
        <div class="border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 bg-white flex flex-col min-h-full">
          <div class="mb-4 sm:mb-6">
            <h2 class="text-lg font-semibold">CRM</h2>
            <p class="text-gray-600 text-sm sm:text-base mt-1 sm:mt-2">Для профессионалов</p>
            <p class="mt-2 sm:mt-3 text-lg sm:text-xl font-bold text-blue-700 whitespace-nowrap">25 999 ₸ в месяц</p>
          </div>

          <ul class="text-left space-y-2 flex-1">

            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-600 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span>10 000 товаров</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-600 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span>100 сотрудников</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-600 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span>Бесконечные перемещения</span>
            </li>
            
            <!-- Разделитель для дополнительных функций -->
            <li class="my-2">
              <hr class="border-gray-300 opacity-50">
            </li>
            
            <li class="flex items-start">
              <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span class="text-blue-600 font-medium">Все функции расширенного тарифа</span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-gray-400 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 11V7a4 4 0 10-8 0v4m0 0h16v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8z"/></svg>
              <span class="text-gray-600">Мобильное приложение <span class="text-xs text-gray-400 align-middle">в разработке</span></span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-gray-400 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 11V7a4 4 0 10-8 0v4m0 0h16v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8z"/></svg>
              <span class="text-gray-600">CRM <span class="text-xs text-gray-400 align-middle">в разработке</span></span>
            </li>
          </ul>

          <button @click="handleSubscribe" class="mt-4 inline-block text-center px-4 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-black transition">
            Подписаться
          </button>
        </div>

        <!-- Умный -->
        <div class="border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 bg-white flex flex-col min-h-full">
          <div class="mb-4 sm:mb-6">
            <h2 class="text-lg font-semibold">Умный</h2>
            <p class="text-gray-600 text-sm sm:text-base mt-1 sm:mt-2">Максимум возможностей</p>
            <p class="mt-2 sm:mt-3 text-lg sm:text-xl font-bold text-blue-700 whitespace-nowrap">45 999 ₸ в месяц</p>
          </div>

          <ul class="text-left space-y-2 flex-1">

            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-600 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span>100 000 товаров</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-600 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span>1 000 сотрудников</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-600 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span>Бесконечные перемещения</span>
            </li>
            
            <!-- Разделитель для дополнительных функций -->
            <li class="my-2">
              <hr class="border-gray-300 opacity-50">
            </li>
            
            <li class="flex items-start">
              <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span class="text-blue-600 font-medium">Все функции CRM тарифа</span>
            </li>
            <li class="flex items-start">
              <svg class="w-6 h-6 text-gray-400 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 11V7a4 4 0 10-8 0v4m0 0h16v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8z"/></svg>
              <span class="text-gray-600">AI <span class="text-xs text-gray-400 align-middle">в разработке</span></span>
            </li>
          </ul>

          <button @click="handleSubscribe" class="mt-4 inline-block text-center px-4 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-black transition">
            Подписаться
          </button>
        </div>
      </div>
      
      <div class="text-center mt-6 sm:mt-8">
        <p class="text-xs sm:text-sm text-gray-500">
          * Тариф покупается на организацию
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth.js';
import { useRouter } from 'vue-router';

const { isAuthenticated, register } = useAuth();
const router = useRouter();

async function goOrRegister(targetPath) {
  if (isAuthenticated.value) {
    await router.push(targetPath);
  } else {
    await register(targetPath);
  }
}

async function handleStartFree() {
  await goOrRegister('/dashboard');
}

async function handleSubscribe() {
  await goOrRegister('/my-plan');
}

// Yandex Metrika теперь подключается глобально через общий компонент
</script>

<style scoped>
/* Обеспечиваем одинаковую ширину карточек */
.grid {
  display: grid;
  align-items: stretch;
}

.grid > div {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

/* Перенос текста для длинных строк */
.grid span {
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}

/* Адаптивные медиа-запросы удалены, так как теперь используются Tailwind утилиты */
</style>