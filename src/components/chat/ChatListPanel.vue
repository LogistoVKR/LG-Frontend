<template>
  <div class="w-80 border-r border-gray-200 flex flex-col bg-white">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">Чаты</h3>
      <p class="text-xs text-gray-500 mt-0.5">
        {{ chats.length }} {{ chatNoun }}
      </p>
    </div>

    <!-- Chat list -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="chats.length === 0" class="p-6 text-center text-gray-400 text-sm">
        Нет активных чатов
      </div>
      <div
        v-for="chat in chats"
        :key="chat.id"
        @click="$emit('select', chat.id)"
        class="flex items-center px-4 py-3 cursor-pointer transition-colors border-b border-gray-50"
        :class="chat.id === activeChatId ? 'bg-blue-50' : 'hover:bg-gray-50'"
      >
        <!-- Avatar -->
        <div class="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
          {{ getInitial(chat.anonymousName) }}
        </div>

        <!-- Info -->
        <div class="ml-3 flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ chat.anonymousName || 'Аноним' }}
            </p>
            <span v-if="chat.lastMessageTime" class="text-xs text-gray-400 flex-shrink-0 ml-2">
              {{ formatTime(chat.lastMessageTime) }}
            </span>
          </div>
          <p class="text-xs text-gray-500 truncate mt-0.5">
            {{ chat.lastMessage || 'Новый чат' }}
          </p>
        </div>

        <!-- Unread badge -->
        <span
          v-if="(unreadMap[chat.id] || 0) > 0"
          class="ml-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 flex-shrink-0"
        >
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
