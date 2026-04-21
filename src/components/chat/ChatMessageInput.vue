<template>
  <div class="border-t border-gray-200 p-3">
    <form @submit.prevent="handleSend" class="flex items-end gap-2">
      <textarea
        ref="inputRef"
        v-model="text"
        :disabled="disabled"
        rows="1"
        placeholder="Введите сообщение..."
        class="flex-1 resize-none px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-50 max-h-24 overflow-y-auto"
        @keydown="handleKeydown"
        @input="autoResize"
      ></textarea>
      <button
        type="submit"
        :disabled="disabled || !text.trim()"
        class="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['send']);

const text = ref('');
const inputRef = ref(null);

function handleSend() {
  const content = text.value.trim();
  if (!content) return;
  emit('send', content);
  text.value = '';
  nextTick(() => autoResize());
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
}

function autoResize() {
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.style.height = 'auto';
      inputRef.value.style.height = Math.min(inputRef.value.scrollHeight, 96) + 'px';
    }
  });
}
</script>
