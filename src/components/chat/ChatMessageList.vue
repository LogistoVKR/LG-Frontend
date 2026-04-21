<template>
  <div ref="containerRef" class="flex-1 overflow-y-auto p-4 space-y-3">
    <div v-if="messages.length === 0" class="flex items-center justify-center h-full text-gray-400 text-sm">
      Нет сообщений
    </div>
    <div
      v-for="(msg, index) in messages"
      :key="msg.id || index"
      class="flex"
      :class="msg.isOwn ? 'justify-end' : 'justify-start'"
    >
      <div class="max-w-[75%]">
        <p
          v-if="!msg.isOwn && msg.senderName"
          class="text-xs text-gray-500 mb-0.5 px-1"
        >
          {{ msg.senderName }}
        </p>
        <div
          class="px-3 py-2 text-sm whitespace-pre-wrap break-words"
          :class="msg.isOwn
            ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm'
            : 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-sm'"
        >
          {{ msg.content }}
        </div>
        <p
          class="text-xs mt-0.5 px-1"
          :class="msg.isOwn ? 'text-right text-gray-400' : 'text-gray-400'"
        >
          {{ formatTime(msg.timestamp) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  messages: {
    type: Array,
    required: true,
  },
});

const containerRef = ref(null);

function scrollToBottom() {
  nextTick(() => {
    if (containerRef.value) {
      containerRef.value.scrollTop = containerRef.value.scrollHeight;
    }
  });
}

watch(() => props.messages.length, scrollToBottom);

function formatTime(timestamp) {
  if (!timestamp) return '';
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}
</script>
