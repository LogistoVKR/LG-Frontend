<template>
  <div class="flex-1 flex flex-col bg-white">
    <!-- No chat selected -->
    <div v-if="!activeChatId" class="flex-1 flex items-center justify-center text-gray-400">
      <div class="text-center">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p class="text-sm">Выберите чат из списка</p>
      </div>
    </div>

    <!-- Chat conversation -->
    <template v-else>
      <!-- Chat header -->
      <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center">
          <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-medium">
            {{ getInitial(activeChat?.anonymousName) }}
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">{{ activeChat?.anonymousName || 'Аноним' }}</p>
            <p v-if="chatStore.activeChatClosed" class="text-xs text-red-500">Чат завершён</p>
            <p v-else class="text-xs text-green-500">Активен</p>
          </div>
        </div>
        <button
          v-if="!chatStore.activeChatClosed"
          @click="handleCloseChat"
          class="text-sm text-red-500 hover:text-red-700 transition-colors px-3 py-1 rounded-lg hover:bg-red-50"
        >
          Закрыть чат
        </button>
      </div>

      <!-- Connection status banner -->
      <div v-if="chatStore.connectionStatus === 'reconnecting'" class="px-4 py-2 bg-yellow-50 border-b border-yellow-200 text-sm text-yellow-700 text-center">
        Переподключение...
      </div>
      <div v-else-if="chatStore.connectionStatus === 'failed'" class="px-4 py-2 bg-red-50 border-b border-red-200 text-sm text-red-700 text-center">
        Соединение потеряно.
        <button @click="chatStore.manualReconnect()" class="underline hover:no-underline ml-1">Переподключиться</button>
      </div>

      <!-- Messages -->
      <ChatMessageList :messages="chatStore.activeChatMessages" />

      <!-- Closed banner -->
      <div v-if="chatStore.activeChatClosed" class="px-4 py-3 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-500">
        Чат завершён
      </div>

      <!-- Input -->
      <ChatMessageInput
        v-else
        :disabled="chatStore.connectionStatus !== 'connected'"
        @send="handleSend"
      />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useChatStore } from '@/stores/chat.js';
import ChatMessageList from './ChatMessageList.vue';
import ChatMessageInput from './ChatMessageInput.vue';

const chatStore = useChatStore();

const activeChatId = computed(() => chatStore.activeChatId);

const activeChat = computed(() => {
  return chatStore.chats.find(c => c.id === activeChatId.value) || null;
});

function getInitial(name) {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}

function handleSend(content) {
  chatStore.sendEmployeeMessage(content);
}

function handleCloseChat() {
  if (activeChatId.value) {
    chatStore.closeChatSession(activeChatId.value);
  }
}
</script>
