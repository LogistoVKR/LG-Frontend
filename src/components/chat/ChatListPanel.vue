<template>
  <div class="w-80 border-r border-line flex flex-col bg-paper">
<div class="px-4 py-3 border-b border-line">
      <h3 class="h3 text-ink">Чаты</h3>
      <p class="body-s text-ink-3 mt-0.5">{{ chats.length }} {{ chatNoun }}</p>
    </div>

<div class="flex-1 overflow-y-auto">
      <div v-if="chats.length === 0" class="p-6 body-s text-center text-ink-3">Нет активных чатов</div>
      <div
        v-for="chat in chats"
        :key="chat.id"
        @click="$emit('select', chat.id)"
        class="flex items-center px-4 py-3 cursor-pointer transition-colors border-b border-line-2"
        :class="chat.id === activeChatId ? 'bg-accent-soft' : 'hover:bg-surface-2'"
      >
        <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0" style="background: var(--surface-3); color: var(--ink-2);">
          {{ getInitial(chat.anonymousName) }}
        </div>

        <div class="ml-3 flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <p class="body-s font-medium text-ink truncate">{{ chat.anonymousName || 'Аноним' }}</p>
            <span v-if="chat.lastMessageTime" class="body-s text-ink-3 shrink-0 ml-2">{{ formatTime(chat.lastMessageTime) }}</span>
          </div>
          <p class="body-s text-ink-3 truncate mt-0.5">{{ chat.lastMessage || 'Новый чат' }}</p>
        </div>

        <span
          v-if="(unreadMap[chat.id] || 0) > 0"
          class="ml-2 text-xs font-semibold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shrink-0"
          style="background: var(--danger); color: #fff;">
          {{ (unreadMap[chat.id] || 0) > 99 ? '99+' : (unreadMap[chat.id] || 0) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useChatStore } from '@/stores/chat.js';

const chatStore = useChatStore();

defineProps({
  activeChatId: {
    type: String,
    default: null,
  },
});

defineEmits(['select']);

const chats = computed(() => chatStore.chats);

const chatNoun = computed(() => {
  const n = chats.value.length;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'чат';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'чата';
  return 'чатов';
});

function getInitial(name) {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}

const unreadMap = computed(() => chatStore.unreadCounts);

function formatTime(timestamp) {
  if (!timestamp) return '';
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  } catch {
    return '';
  }
}
</script>
