<template>
  <div class="mb-6">
    <!-- Toggle Button -->
    <button
      @click="togglePanel"
      class="w-full flex items-center justify-between px-6 py-4 bg-gray-700 text-white font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-all duration-200"
      :class="{ 'rounded-b-none': isExpanded }"
    >
      <div class="flex items-center space-x-3">
        <span class="text-lg">AI Аналитика</span>
      </div>
      <div class="flex items-center space-x-3">
        <span v-if="aiData && !aiLoading" class="text-sm text-gray-300">
          Данные загружены
        </span>
        <button
          v-if="aiData && !aiLoading && isExpanded"
          @click.stop="refreshData"
          class="text-sm text-gray-300 hover:text-white transition-colors underline"
        >
          Обновить
        </button>
        <svg
          class="w-5 h-5 transition-transform duration-300"
          :class="{ 'rotate-180': isExpanded }"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>

    <!-- Collapsible Content -->
    <div
      ref="contentRef"
      class="overflow-hidden transition-all duration-300 ease-in-out"
      :style="{ maxHeight: isExpanded ? contentHeight : '0px' }"
    >
      <div ref="innerRef" class="bg-white rounded-b-lg shadow-sm border border-t-0 border-gray-200 p-6">

        <!-- Loading: Skeleton Shimmer -->
        <div v-if="aiLoading" class="space-y-4">
          <!-- Summary skeleton -->
          <div class="space-y-3">
            <div class="shimmer h-5 w-32 rounded"></div>
            <div class="shimmer h-4 w-full rounded"></div>
            <div class="shimmer h-4 w-5/6 rounded"></div>
            <div class="shimmer h-4 w-4/6 rounded"></div>
          </div>

          <!-- Two-column skeleton -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            <div class="bg-gray-50 rounded-lg p-4 space-y-3">
              <div class="shimmer h-5 w-40 rounded"></div>
              <div class="shimmer h-4 w-full rounded"></div>
              <div class="shimmer h-4 w-3/4 rounded"></div>
              <div class="shimmer h-16 w-full rounded mt-2"></div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 space-y-3">
              <div class="shimmer h-5 w-40 rounded"></div>
              <div class="shimmer h-4 w-full rounded"></div>
              <div class="shimmer h-4 w-3/4 rounded"></div>
              <div class="shimmer h-16 w-full rounded mt-2"></div>
            </div>
          </div>

          <!-- Recommendations skeleton -->
          <div class="bg-gray-50 rounded-lg p-4 space-y-3 mt-4">
            <div class="shimmer h-5 w-44 rounded"></div>
            <div class="shimmer h-4 w-full rounded"></div>
            <div class="shimmer h-4 w-5/6 rounded"></div>
            <div class="shimmer h-4 w-full rounded"></div>
          </div>

          <p class="text-sm text-gray-500 text-center mt-4">
            AI анализирует данные, это может занять некоторое время...
          </p>
        </div>

        <!-- Error State -->
        <div v-else-if="aiError" class="text-center py-8">
          <div v-if="aiError.status === 503" class="space-y-3">
            <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p class="text-gray-700 font-medium">AI-сервис временно недоступен</p>
            <p class="text-sm text-gray-500">Попробуйте повторить запрос позже</p>
            <button @click="fetchAiAnalytics" class="mt-2 px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors">
              Повторить
            </button>
          </div>
          <div v-else-if="aiError.status === 404" class="space-y-3">
            <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-gray-700 font-medium">Нет доступа к организации</p>
            <p class="text-sm text-gray-500">Проверьте права доступа</p>
          </div>
          <div v-else class="space-y-3">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-gray-700 font-medium">Ошибка при загрузке аналитики</p>
            <p class="text-sm text-gray-500">{{ aiError.message }}</p>
            <button @click="fetchAiAnalytics" class="mt-2 px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors">
              Повторить
            </button>
          </div>
        </div>

        <!-- Data State -->
        <div v-else-if="aiData" class="space-y-4">
          <!-- Summary -->
          <div class="bg-gray-50 rounded-lg p-5">
            <h5 class="text-md font-semibold text-gray-900 mb-2">Сводка</h5>
            <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{{ aiData.summary }}</p>
          </div>

          <!-- Deficit + Surplus in two columns -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Deficit Predictions -->
            <div class="bg-red-50 rounded-lg p-5">
              <h5 class="text-md font-semibold text-red-800 mb-3">
                Прогноз дефицита
                <span v-if="aiData.deficitPredictions?.length" class="text-sm font-normal text-red-600">
                  ({{ aiData.deficitPredictions.length }})
                </span>
              </h5>
              <div v-if="!aiData.deficitPredictions?.length" class="text-sm text-red-600">
                Дефицит не прогнозируется
              </div>
              <div v-else class="space-y-3 max-h-64 overflow-y-auto">
                <div
                  v-for="(item, idx) in aiData.deficitPredictions"
                  :key="idx"
                  class="bg-white rounded-lg p-3 border border-red-100"
                >
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm font-semibold text-gray-900">{{ item.itemVariantSku }}</span>
                    <span class="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                      Дефицит: {{ item.predictedDeficit }}
                    </span>
                  </div>
                  <div class="text-xs text-gray-600 mb-1">
                    {{ item.pointOfStorageName }} &middot; Остаток: {{ item.currentQuantity }}
                  </div>
                  <p class="text-xs text-gray-500 leading-relaxed">{{ item.reasoning }}</p>
                </div>
              </div>
            </div>

            <!-- Surplus Predictions -->
            <div class="bg-amber-50 rounded-lg p-5">
              <h5 class="text-md font-semibold text-amber-800 mb-3">
                Прогноз излишков
                <span v-if="aiData.surplusPredictions?.length" class="text-sm font-normal text-amber-600">
                  ({{ aiData.surplusPredictions.length }})
                </span>
              </h5>
              <div v-if="!aiData.surplusPredictions?.length" class="text-sm text-amber-600">
                Излишки не прогнозируются
              </div>
              <div v-else class="space-y-3 max-h-64 overflow-y-auto">
                <div
                  v-for="(item, idx) in aiData.surplusPredictions"
                  :key="idx"
                  class="bg-white rounded-lg p-3 border border-amber-100"
                >
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm font-semibold text-gray-900">{{ item.itemVariantSku }}</span>
                    <span class="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      Излишек: {{ item.estimatedSurplus }}
                    </span>
                  </div>
                  <div class="text-xs text-gray-600 mb-1">
                    {{ item.pointOfStorageName }} &middot; Остаток: {{ item.currentQuantity }}
                  </div>
                  <p class="text-xs text-gray-500 leading-relaxed">{{ item.reasoning }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Recommendations -->
          <div class="bg-blue-50 rounded-lg p-5">
            <h5 class="text-md font-semibold text-blue-800 mb-3">
              Рекомендации
              <span v-if="aiData.recommendations?.length" class="text-sm font-normal text-blue-600">
                ({{ aiData.recommendations.length }})
              </span>
            </h5>
            <div v-if="!aiData.recommendations?.length" class="text-sm text-blue-600">
              Рекомендаций нет
            </div>
            <div v-else class="space-y-3 max-h-64 overflow-y-auto">
              <div
                v-for="(rec, idx) in aiData.recommendations"
                :key="idx"
                class="bg-white rounded-lg p-3 border border-blue-100"
              >
                <div class="flex items-center space-x-2 mb-1">
                  <span class="text-xs font-medium px-2 py-0.5 rounded-full" :class="actionBadgeClass(rec.action)">
                    {{ actionLabel(rec.action) }}
                  </span>
                  <span class="text-sm font-semibold text-gray-900">{{ rec.itemVariantSku }}</span>
                </div>
                <div class="text-xs text-gray-600 mb-1">
                  <span v-if="rec.fromLocation">{{ rec.fromLocation }}</span>
                  <span v-if="rec.fromLocation && rec.toLocation"> &rarr; </span>
                  <span v-if="rec.toLocation">{{ rec.toLocation }}</span>
                  <span v-if="rec.suggestedQuantity"> &middot; {{ rec.suggestedQuantity }} шт.</span>
                </div>
                <p class="text-xs text-gray-500 leading-relaxed">{{ rec.reasoning }}</p>
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

  // 90-second timeout
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
    TRANSFER: 'bg-purple-100 text-purple-700',
    PURCHASE: 'bg-green-100 text-green-700',
    WRITE_OFF: 'bg-red-100 text-red-700'
  };
  return classes[action] || 'bg-gray-100 text-gray-700';
}

// Reset on organization change
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
  background: linear-gradient(90deg, #e5e7eb 25%, #d1d5db 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
