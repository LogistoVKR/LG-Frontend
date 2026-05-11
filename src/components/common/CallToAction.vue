<template>
  <section class="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
<div class="rounded-2xl p-8 sm:p-12 text-center" style="background: var(--accent); color: var(--accent-on);">
        <h3 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
          {{ title }}
        </h3>
        <p class="text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90">
          {{ description }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="handlePrimaryAction"
            class="inline-flex items-center justify-center px-6 py-3 bg-surface text-accent rounded-lg hover:bg-surface-2 transition-colors font-medium"
          >
            {{ primaryButtonText }}
          </button>
          <button
            @click="handleSecondaryAction"
            class="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors"
            style="background: rgba(255,255,255,0.12); color: var(--accent-on); border: 1px solid rgba(255,255,255,0.25);"
            onmouseenter="this.style.background='rgba(255,255,255,0.2)'"
            onmouseleave="this.style.background='rgba(255,255,255,0.12)'"
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
    default: 'pricing',
    validator: (value) => ['pricing', 'register'].includes(value)
  }
});


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


const handleSecondaryAction = () => {
  router.push('/contact');
};
</script>
