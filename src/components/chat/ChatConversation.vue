<template>
  <div class="flex-1 flex flex-col bg-surface">
<div v-if="!activeChatId" class="flex-1 flex items-center justify-center text-ink-3">
      <div class="text-center">
        <svg class="w-14 h-14 mx-auto mb-3 text-line-strong" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p class="body-s">Выберите чат из списка</p>
      </div>
    </div>

<template v-else>
<div class="px-4 py-3 border-b border-line flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0" style="background: var(--surface-3); color: var(--ink-2);">
            {{ getInitial(activeChat?.anonymousName) }}
          </div>
          <div>
            <p class="body-s font-medium text-ink">{{ activeChat?.anonymousName || 'Аноним' }}</p>
            <p v-if="chatStore.activeChatClosed" class="body-s text-danger">Чат завершён</p>
            <p v-else class="body-s text-success">Активен</p>
          </div>
        </div>
        <button
          v-if="!chatStore.activeChatClosed"
          @click="handleCloseChat"
          class="btn btn-secondary btn-sm text-danger border-danger hover:bg-danger-soft">
          Закрыть чат
        </button>
      </div>

<div v-if="chatStore.connectionStatus === 'reconnecting'" class="px-4 py-2 bg-warning-soft border-b border-warning body-s text-warning text-center">
        Переподключение...
      </div>
      <div v-else-if="chatStore.connectionStatus === 'failed'" class="px-4 py-2 bg-danger-soft border-b border-danger body-s text-danger text-center">
        Соединение потеряно.
        <button @click="chatStore.manualReconnect()" class="underline hover:no-underline ml-1">Переподключиться</button>
      </div>

      <ChatMessageList :messages="chatStore.activeChatMessages" />

      <div v-if="chatStore.activeChatClosed" class="px-4 py-3 bg-surface-2 border-t border-line body-s text-center text-ink-3">
        Чат завершён
      </div>

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
