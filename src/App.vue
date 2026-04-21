<script setup>
import Header from "@/components/Header.vue";
import HomeHeader from "@/components/HomeHeader.vue";
import Footer from "@/components/Footer.vue";
import YandexMetrika from "@/components/common/YandexMetrika.vue";
import AnonymousChatWidget from "@/components/chat/AnonymousChatWidget.vue";
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth.js';

const route = useRoute();
const { isLoading } = useAuth();

const isDashboard = computed(() => {
  return route.path.startsWith('/dashboard');
});

const isHomePage = computed(() => {
  return ['/', '/about', '/pricing', '/contact', '/legal'].includes(route.path);
});

</script>

<template>
  <div class="flex flex-col min-h-screen">
    <YandexMetrika />
    
    <HomeHeader v-if="isHomePage" />
    <Header v-else-if="!isDashboard" />
    <main class="flex-1" :class="{ 'flex items-center justify-center px-4': !isDashboard }">
      <!-- Показываем спиннер только для dashboard страниц пока загружается auth -->
      <div v-if="isLoading && isDashboard" class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Загрузка...</p>
      </div>
      <!-- Для всех остальных случаев показываем контент -->
      <router-view v-if="!isLoading || !isDashboard" />
    </main>
    <Footer v-if="!isDashboard" />

    <!-- Anonymous chat widget (landing pages only) -->
    <AnonymousChatWidget v-if="!isDashboard" />
  </div>
</template>

