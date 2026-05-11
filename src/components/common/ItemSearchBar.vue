<template>
  <div class="mb-6 sm:mb-8">
<div class="max-w-xl mx-auto">
      <p class="text-sm text-ink-3 mb-2">Поиск товаров по описанию</p>
      <form @submit.prevent="performSearch" class="flex gap-2">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Например: красная куртка зимняя..."
            class="w-full px-4 py-3 border border-line rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-sm sm:text-base pr-10"
            maxlength="200"
          />
          <button
            v-if="searchQuery.length > 0"
            type="button"
            @click="clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink-2 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <button
          type="submit"
          :disabled="!canSearch"
          class="px-5 py-3 bg-accent text-white rounded-lg hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm sm:text-base font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span class="hidden sm:inline">Найти</span>
        </button>
      </form>
    </div>

<div v-if="searchLoading" class="flex items-center justify-center py-6">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2" style="border-color: var(--accent);"></div>
      <span class="ml-3 text-ink-3 text-sm">Ищем похожие товары...</span>
    </div>

<div v-else-if="searchError" class="max-w-xl mx-auto mt-4">
      <div class="bg-danger-soft border border-danger rounded-[var(--r-2)] p-4 text-center">
        <p class="body-s text-danger">{{ searchError }}</p>
        <button @click="performSearch" class="mt-2 body-s text-danger hover:opacity-80 underline">
          Попробовать снова
        </button>
      </div>
    </div>

<div v-else-if="hasSearched && searchResults" class="mt-4">
<div v-if="searchResults.totalResults === 0" class="max-w-xl mx-auto text-center py-6">
        <svg class="w-12 h-12 mx-auto mb-3 text-line-strong" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p class="text-ink-3 font-medium">Подобных товаров нет нигде</p>
        <p class="text-sm text-ink-3 mt-1">Попробуйте изменить запрос</p>
      </div>

<div v-else class="max-w-2xl mx-auto space-y-3 text-left">
        <p class="text-sm text-ink-3 text-center mb-3">
          Найдено {{ searchResults.totalResults }} {{ resultNoun }}
        </p>

        <div
          v-for="result in searchResults.results"
          :key="result.itemId"
          class="bg-surface rounded-xl p-4 sm:p-5 shadow-md border border-line hover:shadow-lg transition-shadow"
        >
<div class="flex items-start justify-between mb-2">
            <div>
              <h4 class="text-base sm:text-lg font-semibold text-ink">{{ result.name }}</h4>
              <p v-if="result.description" class="text-sm text-ink-3 mt-0.5">{{ result.description }}</p>
            </div>
            <span class="px-2 py-1 bg-accent-soft text-accent rounded-full text-xs font-medium flex-shrink-0 ml-3">
              {{ Math.round(result.score * 100) }}%
            </span>
          </div>

<div v-if="!result.variants || result.variants.length === 0" class="mt-3 p-3 bg-warning-soft rounded-[var(--r-2)] border border-warning">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-warning mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p class="body-s text-warning font-medium">Товар не в наличии</p>
            </div>
          </div>

<div v-else class="mt-3 space-y-2">
            <div
              v-for="variant in result.variants"
              :key="variant.id"
              class="bg-paper rounded-lg p-3 border border-line"
            >
<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mb-2">
                <span class="text-ink-2">
                  <span class="font-medium text-ink-2">SKU:</span> {{ variant.sku }}
                </span>
                <span v-if="variant.barcode" class="text-ink-2">
                  <span class="font-medium text-ink-2">Штрихкод:</span> {{ variant.barcode }}
                </span>
                <span class="font-semibold text-success">
                  {{ formatPrice(variant.price, variant.currency) }}
                </span>
              </div>

<div class="space-y-1.5">
                <div
                  v-for="loc in variant.storageLocations"
                  :key="loc.pointOfStorage.id"
                  class="flex items-center justify-between text-xs sm:text-sm bg-surface rounded-md px-3 py-2 border border-line"
                >
                  <div class="flex items-center gap-2">
                    <span
                      class="inline-block px-1.5 py-0.5 rounded text-xs font-medium"
                      :class="loc.pointOfStorage.type === 'WAREHOUSE'
                        ? 'bg-accent-soft text-accent'
                        : 'bg-success-soft text-success'"
                    >
                      {{ formatStorageType(loc.pointOfStorage.type) }}
                    </span>
                    <span class="text-ink-2 font-medium">{{ loc.pointOfStorage.name }}</span>
                  </div>
                  <div class="text-right">
                    <span class="font-semibold text-ink">{{ loc.quantity - loc.reserved }}</span>
                    <span class="text-ink-3"> доступно</span>
                    <span v-if="loc.reserved > 0" class="text-warning ml-1">({{ loc.reserved }} резерв)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

<button
            v-if="result.organizationId"
            @click="startChat(result.organizationId, result.organizationName)"
            class="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-sm font-medium"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Написать в организацию
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import searchService from '@/services/searchService.js';
import { useChatStore } from '@/stores/chat.js';

const chatStore = useChatStore();

const searchQuery = ref('');
const searchResults = ref(null);
const searchLoading = ref(false);
const searchError = ref(null);
const hasSearched = ref(false);

const canSearch = computed(() => searchQuery.value.trim().length >= 2 && !searchLoading.value);

const resultNoun = computed(() => {
  const n = searchResults.value?.totalResults || 0;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'товар';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'товара';
  return 'товаров';
});

async function performSearch() {
  const query = searchQuery.value.trim();
  if (query.length < 2) return;

  searchLoading.value = true;
  searchError.value = null;
  hasSearched.value = true;

  try {
    searchResults.value = await searchService.searchItems(query, 5);
  } catch (err) {
    searchError.value = 'Ошибка при поиске. Попробуйте позже.';
    searchResults.value = null;
    console.error('Search error:', err);
  } finally {
    searchLoading.value = false;
  }
}

function clearSearch() {
  searchQuery.value = '';
  searchResults.value = null;
  searchError.value = null;
  hasSearched.value = false;
}

function formatPrice(price, currency) {
  if (currency === 'KZT') {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price) + ' \u20B8';
  }
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price) + ' ' + currency;
}

function formatStorageType(type) {
  return type === 'WAREHOUSE' ? 'Склад' : 'Точка продаж';
}

function startChat(organizationId, organizationName) {
  chatStore.openAnonymousChat(organizationId, organizationName || 'Организация');
}
</script>
