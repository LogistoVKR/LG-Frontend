<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="flex flex-col min-h-screen transition-all duration-300" :class="isSidebarOpen ? 'ml-64' : 'ml-0'">
      <!-- Header -->
      <Header />

      <!-- Chat Content -->
      <main class="flex-1 flex overflow-hidden">
        <ChatListPanel
          :active-chat-id="chatStore.activeChatId"
          @select="chatStore.selectChat"
        />
        <ChatConversation />
      </main>

      <!-- Footer -->
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { useSidebar } from '@/composables/useSidebar.js';
import { useChatStore } from '@/stores/chat.js';
import Sidebar from '@/components/Sidebar.vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import ChatListPanel from './ChatListPanel.vue';
import ChatConversation from './ChatConversation.vue';

const { isSidebarOpen } = useSidebar();
const chatStore = useChatStore();

onMounted(() => {
  chatStore.setChatPageVisible(true);
  if (chatStore.activeChatId) {
    chatStore.selectChat(chatStore.activeChatId);
  }
});

onBeforeUnmount(() => {
  chatStore.setChatPageVisible(false);
});
</script>
