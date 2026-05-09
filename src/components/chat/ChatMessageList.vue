<template>
  <div ref="containerRef" class="flex-1 overflow-y-auto p-4 space-y-3">
    <div v-if="messages.length === 0" class="flex items-center justify-center h-full body-s text-ink-3">
      Нет сообщений
    </div>
    <div
      v-for="(msg, index) in messages"
      :key="msg.id || index"
      class="flex"
      :class="msg.isOwn ? 'justify-end' : 'justify-start'"
    >
      <div class="max-w-[75%]">
        <p v-if="!msg.isOwn && msg.senderName" class="body-s text-ink-3 mb-0.5 px-1">
          {{ msg.senderName }}
        </p>
        <div
          class="px-3 py-2 body-s whitespace-pre-wrap break-words"
          :class="msg.isOwn
            ? 'rounded-2xl rounded-br-sm text-[var(--accent-on)]'
            : 'bg-surface-2 text-ink rounded-2xl rounded-bl-sm'"
          :style="msg.isOwn ? 'background: var(--accent);' : ''"
        >
          {{ msg.content }}
        </div>
        <p class="body-s mt-0.5 px-1 text-ink-3" :class="msg.isOwn ? 'text-right' : ''">
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
