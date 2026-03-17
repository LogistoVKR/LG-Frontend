<template>
  <section class="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Call to Action -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 sm:p-12 text-center text-white">
        <h3 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
          {{ title }}
        </h3>
        <p class="text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90">
          {{ description }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            @click="handlePrimaryAction"
            class="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            {{ primaryButtonText }}
          </button>
          <button 
            @click="handleSecondaryAction"
            class="inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white border border-blue-400 rounded-lg hover:bg-blue-400 transition-colors font-medium"
          >
            {{ secondaryButtonText }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';
import keycloakService from '@/services/keycloak.js';

const router = useRouter();

// Пропсы для кастомизации контента
const props = defineProps({
  title: {
    type: String,
    default: 'Готовы начать?'
  },
  description: {
    type: String,
    default: 'Присоединяйтесь к сотням компаний, которые уже используют Logisto для управления своими складами'
  },
  primaryButtonText: {
    type: String,
    default: 'Посмотреть тарифы'
  },
  secondaryButtonText: {
    type: String,
    default: 'Связаться с нами'
  },
  primaryAction: {
    type: String,
    default: 'pricing', // 'pricing' или 'register'
    validator: (value) => ['pricing', 'register'].includes(value)
  }
});

// Обработчик основной кнопки
const handlePrimaryAction = async () => {
  if (props.primaryAction === 'register') {
    try {
      await keycloakService.register('/dashboard');
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
    }
  } else {
    router.push('/pricing');
  }
};

// Обработчик вторичной кнопки (связаться с нами)
const handleSecondaryAction = () => {
  router.push('/contact');
};
</script>
