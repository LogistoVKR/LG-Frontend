<template>
  <!-- Floating bubble button (when chat exists but widget is minimized) -->
  <button
    v-if="!chatStore.anonymousChatOpen && chatStore.anonymousOrgId"
    @click="chatStore.anonymousChatOpen = true"
    class="fixed bottom-4 right-4 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  </button>

  <!-- Chat panel -->
  <div
    v-if="chatStore.anonymousChatOpen"
    class="fixed bottom-4 right-4 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden
           w-[380px] h-[500px]
           max-sm:w-[calc(100%-2rem)] max-sm:h-[70vh] max-sm:bottom-0 max-sm:right-0 max-sm:left-0 max-sm:mx-auto max-sm:rounded-t-2xl max-sm:rounded-b-none"
  >
    <!-- Header -->
    <div class="px-4 py-3 bg-blue-600 text-white flex items-center justify-between flex-shrink-0">
      <div>
        <p class="font-medium text-sm">{{ chatStore.anonymousOrgName }}</p>
        <p v-if="chatStore.connectionStatus === 'connected'" class="text-xs text-blue-200">Онлайн</p>
        <p v-else-if="chatStore.connectionStatus === 'connecting'" class="text-xs text-blue-200">Подключение...</p>
        <p v-else-if="chatStore.connectionStatus === 'reconnecting'" class="text-xs text-yellow-200">Переподключение...</p>
        <p v-else-if="chatStore.connectionStatus === 'failed'" class="text-xs text-red-200">Нет соединения</p>
      </div>
      <div class="flex items-center gap-1">
        <button
          @click="chatStore.anonymousChatOpen = false"
          class="p-1.5 hover:bg-blue-500 rounded-lg transition-colors"
          title="Свернуть"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button
          @click="handleClose"
          class="p-1.5 hover:bg-blue-500 rounded-lg transition-colors"
          title="Закрыть чат"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Name prompt (before WS connection) -->
    <div v-if="showNamePrompt" class="flex-1 flex items-center justify-center p-6">
      <div class="w-full max-w-xs text-center">
        <svg class="w-12 h-12 mx-auto mb-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p class="text-sm text-gray-600 mb-4">Представьтесь, чтобы начать чат</p>
        <form @submit.prevent="handleStartChat">
          <input
            v-model="nameInput"
            type="text"
            placeholder="Ваше имя"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
            maxlength="50"
          />
          <button
            type="submit"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Начать чат
          </button>
        </form>
      </div>
    </div>

    <!-- Chat closed state -->
    <template v-else-if="chatStore.anonymousChatClosed">
      <div class="flex-1 flex flex-col">
        <ChatMessageList :messages="chatStore.anonymousMessages" />
        <div class="px-4 py-3 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-500">
          Чат завершён
        </div>
      </div>
    </template>

    <!-- Active chat -->
    <template v-else>
      <!-- Connection failed banner -->
      <div v-if="chatStore.connectionStatus === 'failed'" class="px-4 py-2 bg-red-50 border-b border-red-200 text-xs text-red-700 text-center flex-shrink-0">
        Соединение потеряно.
        <button @click="chatStore.manualReconnect()" class="underline hover:no-underline ml-1">Переподключиться</button>
      </div>

      <ChatMessageList :messages="chatStore.anonymousMessages" />

      <ChatMessageInput
        :disabled="chatStore.connectionStatus !== 'connected'"
        @send="handleSend"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useChatStore } from '@/stores/chat.js';
import ChatMessageList from './ChatMessageList.vue';
import ChatMessageInput from './ChatMessageInput.vue';

const chatStore = useChatStore();

const nameInput = ref(chatStore.anonymousUserName || '');

const showNamePrompt = computed(() => {
  return chatStore.connectionStatus === 'disconnected' && !chatStore.anonymousChatSessionId;
});

function handleStartChat() {
  const name = nameInput.value.trim();
  chatStore.connectAnonymousChat(name || null);
}

function handleSend(content) {
  chatStore.sendAnonymousMessage(content);
}

function handleClose() {
  if (chatStore.connectionStatus === 'connected' && chatStore.anonymousChatSessionId) {
    chatStore.closeAnonymousChat();
  }
  chatStore.disconnectAnonymous();
}
</script>
