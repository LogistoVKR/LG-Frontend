<template>
  <div class="mb-6">
<button
      @click="togglePanel"
      class="w-full flex items-center justify-between px-5 py-3.5 bg-surface border border-line hover:bg-surface-2 text-ink font-medium transition-colors"
      :class="isExpanded ? 'rounded-t-[var(--r-3)] rounded-b-none' : 'rounded-[var(--r-3)]'"
      style="box-shadow: var(--shadow-1);"
    >
      <div class="flex items-center gap-3">
        <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span class="body-s font-medium">AI Аналитика</span>
      </div>
      <div class="flex items-center gap-3">
        <span v-if="aiData && !aiLoading" class="body-s text-ink-3">
          Данные загружены
        </span>
        <button
          v-if="aiData && !aiLoading && isExpanded"
          @click.stop="refreshData"
          class="body-s text-accent hover:text-[var(--accent-hover)] transition-colors underline"
        >
          Обновить
        </button>
        <svg
          class="w-4 h-4 text-ink-3 transition-transform duration-300"
          :class="{ 'rotate-180': isExpanded }"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>

<div
      ref="contentRef"
      class="overflow-hidden transition-all duration-300 ease-in-out"
      :style="{ maxHeight: isExpanded ? contentHeight : '0px' }"
    >
      <div ref="innerRef" class="bg-surface rounded-b-[var(--r-3)] border border-t-0 border-line p-5" style="box-shadow: var(--shadow-1);">

<div v-if="aiLoading" class="space-y-4">
          <div class="space-y-3">
            <div class="shimmer h-5 w-32 rounded-[var(--r-1)]"></div>
            <div class="shimmer h-4 w-full rounded-[var(--r-1)]"></div>
            <div class="shimmer h-4 w-5/6 rounded-[var(--r-1)]"></div>
            <div class="shimmer h-4 w-4/6 rounded-[var(--r-1)]"></div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            <div class="bg-surface-2 rounded-[var(--r-2)] p-4 space-y-3">
              <div class="shimmer h-5 w-40 rounded-[var(--r-1)]"></div>
              <div class="shimmer h-4 w-full rounded-[var(--r-1)]"></div>
              <div class="shimmer h-4 w-3/4 rounded-[var(--r-1)]"></div>
              <div class="shimmer h-16 w-full rounded-[var(--r-1)] mt-2"></div>
            </div>
            <div class="bg-surface-2 rounded-[var(--r-2)] p-4 space-y-3">
              <div class="shimmer h-5 w-40 rounded-[var(--r-1)]"></div>
              <div class="shimmer h-4 w-full rounded-[var(--r-1)]"></div>
              <div class="shimmer h-4 w-3/4 rounded-[var(--r-1)]"></div>
              <div class="shimmer h-16 w-full rounded-[var(--r-1)] mt-2"></div>
            </div>
          </div>
          <div class="bg-surface-2 rounded-[var(--r-2)] p-4 space-y-3 mt-4">
            <div class="shimmer h-5 w-44 rounded-[var(--r-1)]"></div>
            <div class="shimmer h-4 w-full rounded-[var(--r-1)]"></div>
            <div class="shimmer h-4 w-5/6 rounded-[var(--r-1)]"></div>
            <div class="shimmer h-4 w-full rounded-[var(--r-1)]"></div>
          </div>
          <p class="body-s text-ink-3 text-center mt-4">
            AI анализирует данные, это может занять некоторое время...
          </p>
        </div>

<div v-else-if="aiError" class="text-center py-8">
          <div v-if="aiError.status === 503" class="space-y-3">
            <div class="w-12 h-12 bg-warning-soft rounded-full flex items-center justify-center mx-auto">
              <svg class="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p class="body-s text-ink font-medium">AI-сервис временно недоступен</p>
            <p class="body-s text-ink-3">Попробуйте повторить запрос позже</p>
            <button @click="fetchAiAnalytics" class="btn btn-primary mt-2">Повторить</button>
          </div>
          <div v-else-if="aiError.status === 404" class="space-y-3">
            <div class="w-12 h-12 bg-surface-3 rounded-full flex items-center justify-center mx-auto">
              <svg class="w-6 h-6 text-ink-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="body-s text-ink font-medium">Нет доступа к организации</p>
            <p class="body-s text-ink-3">Проверьте права доступа</p>
          </div>
          <div v-else class="space-y-3">
            <div class="w-12 h-12 bg-danger-soft rounded-full flex items-center justify-center mx-auto">
              <svg class="w-6 h-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="body-s text-ink font-medium">Ошибка при загрузке аналитики</p>
            <p class="body-s text-ink-3">{{ aiError.message }}</p>
            <button @click="fetchAiAnalytics" class="btn btn-primary mt-2">Повторить</button>
          </div>
        </div>

<div v-else-if="aiData" class="space-y-4">
<div class="bg-surface-2 rounded-[var(--r-2)] p-4">
            <h5 class="body-s font-semibold text-ink mb-2">Сводка</h5>
            <p class="body-s text-ink-2 leading-relaxed whitespace-pre-line">{{ aiData.summary }}</p>
          </div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
<div class="bg-danger-soft rounded-[var(--r-2)] p-4">
              <h5 class="body-s font-semibold text-danger mb-3">
                Прогноз дефицита
                <span v-if="aiData.deficitPredictions?.length" class="font-normal text-danger opacity-70">
                  ({{ aiData.deficitPredictions.length }})
                </span>
              </h5>
              <div v-if="!aiData.deficitPredictions?.length" class="body-s text-danger opacity-70">
                Дефицит не прогнозируется
              </div>
              <div v-else class="space-y-3 max-h-64 overflow-y-auto">
                <div
                  v-for="(item, idx) in aiData.deficitPredictions"
                  :key="idx"
                  class="bg-surface rounded-[var(--r-2)] p-3 border border-danger"
                >
                  <div class="flex items-center justify-between mb-1">
                    <span class="body-s font-semibold text-ink mono">{{ item.itemVariantSku }}</span>
                    <span class="badge badge--writeoff">Дефицит: {{ item.predictedDeficit }}</span>
                  </div>
                  <div class="body-s text-ink-2 mb-1">
                    {{ item.pointOfStorageName }} &middot; Остаток: {{ item.currentQuantity }}
                  </div>
                  <p class="body-s text-ink-3 leading-relaxed">{{ item.reasoning }}</p>
                </div>
              </div>
            </div>

<div class="bg-warning-soft rounded-[var(--r-2)] p-4">
              <h5 class="body-s font-semibold text-warning mb-3">
                Прогноз излишков
                <span v-if="aiData.surplusPredictions?.length" class="font-normal text-warning opacity-70">
                  ({{ aiData.surplusPredictions.length }})
                </span>
              </h5>
              <div v-if="!aiData.surplusPredictions?.length" class="body-s text-warning opacity-70">
                Излишки не прогнозируются
              </div>
              <div v-else class="space-y-3 max-h-64 overflow-y-auto">
                <div
                  v-for="(item, idx) in aiData.surplusPredictions"
                  :key="idx"
                  class="bg-surface rounded-[var(--r-2)] p-3 border border-warning"
                >
                  <div class="flex items-center justify-between mb-1">
                    <span class="body-s font-semibold text-ink mono">{{ item.itemVariantSku }}</span>
                    <span class="badge badge--reserve">Излишек: {{ item.estimatedSurplus }}</span>
                  </div>
                  <div class="body-s text-ink-2 mb-1">
                    {{ item.pointOfStorageName }} &middot; Остаток: {{ item.currentQuantity }}
                  </div>
                  <p class="body-s text-ink-3 leading-relaxed">{{ item.reasoning }}</p>
                </div>
              </div>
            </div>
          </div>

<div class="bg-accent-soft rounded-[var(--r-2)] p-4">
            <h5 class="body-s font-semibold text-accent mb-3">
              Рекомендации
              <span v-if="aiData.recommendations?.length" class="font-normal text-accent opacity-70">
                ({{ aiData.recommendations.length }})
              </span>
            </h5>
            <div v-if="!aiData.recommendations?.length" class="body-s text-accent opacity-70">
              Рекомендаций нет
            </div>
            <div v-else class="space-y-3 max-h-64 overflow-y-auto">
              <div
                v-for="(rec, idx) in aiData.recommendations"
                :key="idx"
                class="bg-surface rounded-[var(--r-2)] p-3 border border-line"
              >
                <div class="flex items-center gap-2 mb-1">
                  <span class="badge" :class="actionBadgeClass(rec.action)">
                    {{ actionLabel(rec.action) }}
                  </span>
                  <span class="body-s font-semibold text-ink mono">{{ rec.itemVariantSku }}</span>
                </div>
                <div class="body-s text-ink-2 mb-1">
                  <span v-if="rec.fromLocation">{{ rec.fromLocation }}</span>
                  <span v-if="rec.fromLocation && rec.toLocation"> &rarr; </span>
                  <span v-if="rec.toLocation">{{ rec.toLocation }}</span>
                  <span v-if="rec.suggestedQuantity"> &middot; {{ rec.suggestedQuantity }} шт.</span>
                </div>
                <p class="body-s text-ink-3 leading-relaxed">{{ rec.reasoning }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue';
import warehouseService from '@/services/warehouseService.js';

function toUTCLocalDateTime(dateStr) {
  const d = new Date(dateStr);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

const props = defineProps({
  organizationId: { type: String, required: true },
  filters: { type: Object, default: () => ({}) }
});

const isExpanded = ref(false);
const aiLoading = ref(false);
const aiData = ref(null);
const aiError = ref(null);
const lastFetchParams = ref('');

const contentRef = ref(null);
const innerRef = ref(null);
const contentHeight = ref('0px');

let abortController = null;
let timeoutId = null;

function getCurrentParams() {
  return JSON.stringify({
    organizationId: props.organizationId,
    from: props.filters?.from || '',
    to: props.filters?.to || '',
    itemVariantId: props.filters?.itemVariantId || ''
  });
}

function shouldRefetch() {
  if (!aiData.value && !aiError.value) return true;
  return getCurrentParams() !== lastFetchParams.value;
}

async function togglePanel() {
  isExpanded.value = !isExpanded.value;
  if (isExpanded.value) {
    if (shouldRefetch()) {
      fetchAiAnalytics();
    }
    await nextTick();
    updateContentHeight();
  }
}

function refreshData() {
  lastFetchParams.value = '';
  fetchAiAnalytics();
}

async function fetchAiAnalytics() {
  if (abortController) abortController.abort();
  if (timeoutId) clearTimeout(timeoutId);

  abortController = new AbortController();
  const signal = abortController.signal;

  timeoutId = setTimeout(() => abortController.abort(), 90000);

  aiLoading.value = true;
  aiError.value = null;

  await nextTick();
  updateContentHeight();

  try {
    const activeFilters = {};
    if (props.filters?.from) {
      activeFilters.from = toUTCLocalDateTime(props.filters.from);
    }
    if (props.filters?.to) {
      activeFilters.to = toUTCLocalDateTime(props.filters.to);
    }
    if (props.filters?.itemVariantId) {
      activeFilters.itemVariantId = props.filters.itemVariantId;
    }

    aiData.value = await warehouseService.getAiAnalytics(
      props.organizationId,
      activeFilters,
      signal
    );
    lastFetchParams.value = getCurrentParams();
  } catch (e) {
    if (e.name === 'AbortError') return;
    aiError.value = { message: e.message, status: e.status || null };
    aiData.value = null;
  } finally {
    aiLoading.value = false;
    clearTimeout(timeoutId);
    timeoutId = null;
    abortController = null;
    await nextTick();
    updateContentHeight();
  }
}

function updateContentHeight() {
  if (innerRef.value) {
    contentHeight.value = innerRef.value.scrollHeight + 'px';
  }
}

function actionLabel(action) {
  const labels = {
    TRANSFER: 'Перемещение',
    PURCHASE: 'Закупка',
    WRITE_OFF: 'Списание'
  };
  return labels[action] || action;
}

function actionBadgeClass(action) {
  const classes = {
    TRANSFER: 'badge--transfer',
    PURCHASE: 'badge--purchase',
    WRITE_OFF: 'badge--writeoff'
  };
  return classes[action] || 'badge--neutral';
}

watch(() => props.organizationId, () => {
  if (abortController) abortController.abort();
  aiData.value = null;
  aiError.value = null;
  lastFetchParams.value = '';
  isExpanded.value = false;
});

onBeforeUnmount(() => {
  if (abortController) abortController.abort();
  if (timeoutId) clearTimeout(timeoutId);
});
</script>

<style scoped>
.shimmer {
  background: linear-gradient(90deg, var(--surface-2) 25%, var(--surface-3) 50%, var(--surface-2) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
