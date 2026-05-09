<template>
<button
    v-if="!chatStore.anonymousChatOpen && chatStore.anonymousOrgId"
    @click="chatStore.anonymousChatOpen = true"
    class="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-colors"
    style="background: var(--accent); color: var(--accent-on); box-shadow: var(--shadow-3);"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  </button>

<div
    v-if="chatStore.anonymousChatOpen"
    class="fixed bottom-4 right-4 z-50 bg-surface rounded-[var(--r-4)] border border-line flex flex-col overflow-hidden
           w-[380px] h-[500px]
           max-sm:w-[calc(100%-2rem)] max-sm:h-[70vh] max-sm:bottom-0 max-sm:right-0 max-sm:left-0 max-sm:mx-auto max-sm:rounded-t-[var(--r-4)] max-sm:rounded-b-none"
    style="box-shadow: var(--shadow-3);"
  >
<div class="px-4 py-3 flex items-center justify-between shrink-0" style="background: var(--accent); color: var(--accent-on);">
      <div>
        <p class="body-s font-medium">{{ chatStore.anonymousOrgName }}</p>
        <p v-if="chatStore.connectionStatus === 'connected'" class="body-s opacity-70">Онлайн</p>
        <p v-else-if="chatStore.connectionStatus === 'connecting'" class="body-s opacity-70">Подключение...</p>
        <p v-else-if="chatStore.connectionStatus === 'reconnecting'" class="body-s opacity-60">Переподключение...</p>
        <p v-else-if="chatStore.connectionStatus === 'failed'" class="body-s opacity-60">Нет соединения</p>
      </div>
      <div class="flex items-center gap-1">
        <button @click="chatStore.anonymousChatOpen = false" class="p-1.5 rounded-[var(--r-2)] hover:bg-white/10 transition-colors" title="Свернуть">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button @click="handleClose" class="p-1.5 rounded-[var(--r-2)] hover:bg-white/10 transition-colors" title="Закрыть чат">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

<div v-if="showNamePrompt" class="flex-1 flex items-center justify-center p-6">
      <div class="w-full max-w-xs text-center">
        <svg class="w-10 h-10 mx-auto mb-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p class="body-s text-ink-2 mb-4">Представьтесь, чтобы начать чат</p>
        <form @submit.prevent="handleStartChat">
          <input v-model="nameInput" type="text" placeholder="Ваше имя" class="field mb-3" maxlength="50" />
          <button type="submit" class="btn btn-primary w-full">Начать чат</button>
        </form>
      </div>
    </div>

<template v-else-if="chatStore.anonymousChatClosed">
      <div class="flex-1 flex flex-col">
        <ChatMessageList :messages="chatStore.anonymousMessages" />
        <div class="px-4 py-3 bg-surface-2 border-t border-line body-s text-center text-ink-3">Чат завершён</div>
      </div>
    </template>

<template v-else>
      <div v-if="chatStore.connectionStatus === 'failed'" class="px-4 py-2 bg-danger-soft border-b border-danger body-s text-danger text-center shrink-0">
        Соединение потеряно.
        <button @click="chatStore.manualReconnect()" class="underline hover:no-underline ml-1">Переподключиться</button>
      </div>
      <ChatMessageList :messages="chatStore.anonymousMessages" />
      <ChatMessageInput :disabled="chatStore.connectionStatus !== 'connected'" @send="handleSend" />
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
