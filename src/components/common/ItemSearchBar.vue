<template>
  <div class="mb-6 sm:mb-8">
    <!-- Search Input -->
    <div class="max-w-xl mx-auto">
      <p class="text-sm text-gray-500 mb-2">Поиск товаров по описанию</p>
      <form @submit.prevent="performSearch" class="flex gap-2">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Например: красная куртка зимняя..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base pr-10"
            maxlength="200"
          />
          <button
            v-if="searchQuery.length > 0"
            type="button"
            @click="clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <button
          type="submit"
          :disabled="!canSearch"
          class="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm sm:text-base font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span class="hidden sm:inline">Найти</span>
        </button>
      </form>
    </div>

    <!-- Loading -->
    <div v-if="searchLoading" class="flex items-center justify-center py-6">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-500 text-sm">Ищем похожие товары...</span>
    </div>

    <!-- Error -->
    <div v-else-if="searchError" class="max-w-xl mx-auto mt-4">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p class="text-red-700 text-sm">{{ searchError }}</p>
        <button @click="performSearch" class="mt-2 text-sm text-red-600 hover:text-red-800 underline">
          Попробовать снова
        </button>
      </div>
    </div>

    <!-- Results -->
    <div v-else-if="hasSearched && searchResults" class="mt-4">
      <!-- No results -->
      <div v-if="searchResults.totalResults === 0" class="max-w-xl mx-auto text-center py-6">
        <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p class="text-gray-500 font-medium">Подобных товаров нет нигде</p>
        <p class="text-sm text-gray-400 mt-1">Попробуйте изменить запрос</p>
      </div>

      <!-- Results list -->
      <div v-else class="max-w-2xl mx-auto space-y-3 text-left">
        <p class="text-sm text-gray-500 text-center mb-3">
          Найдено {{ searchResults.totalResults }} {{ resultNoun }}
        </p>

        <div
          v-for="result in searchResults.results"
          :key="result.itemId"
          class="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
        >
          <!-- Item header -->
          <div class="flex items-start justify-between mb-2">
            <div>
              <h4 class="text-base sm:text-lg font-semibold text-gray-900">{{ result.name }}</h4>
              <p v-if="result.description" class="text-sm text-gray-500 mt-0.5">{{ result.description }}</p>
            </div>
            <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex-shrink-0 ml-3">
              {{ Math.round(result.score * 100) }}%
            </span>
          </div>

          <!-- No variants — not in stock -->
          <div v-if="!result.variants || result.variants.length === 0" class="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-orange-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p class="text-sm text-orange-700 font-medium">Товар не в наличии</p>
            </div>
          </div>

          <!-- Variants with stock -->
          <div v-else class="mt-3 space-y-2">
            <div
              v-for="variant in result.variants"
              :key="variant.id"
              class="bg-gray-50 rounded-lg p-3 border border-gray-200"
            >
              <!-- Variant info -->
              <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mb-2">
                <span class="text-gray-600">
                  <span class="font-medium text-gray-700">SKU:</span> {{ variant.sku }}
                </span>
                <span v-if="variant.barcode" class="text-gray-600">
                  <span class="font-medium text-gray-700">Штрихкод:</span> {{ variant.barcode }}
                </span>
                <span class="font-semibold text-green-700">
                  {{ formatPrice(variant.price, variant.currency) }}
                </span>
              </div>

              <!-- Storage locations -->
              <div class="space-y-1.5">
                <div
                  v-for="loc in variant.storageLocations"
                  :key="loc.pointOfStorage.id"
                  class="flex items-center justify-between text-xs sm:text-sm bg-white rounded-md px-3 py-2 border border-gray-100"
                >
                  <div class="flex items-center gap-2">
                    <span
                      class="inline-block px-1.5 py-0.5 rounded text-xs font-medium"
                      :class="loc.pointOfStorage.type === 'WAREHOUSE'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'"
                    >
                      {{ formatStorageType(loc.pointOfStorage.type) }}
                    </span>
                    <span class="text-gray-700 font-medium">{{ loc.pointOfStorage.name }}</span>
                  </div>
                  <div class="text-right">
                    <span class="font-semibold text-gray-900">{{ loc.quantity - loc.reserved }}</span>
                    <span class="text-gray-500"> доступно</span>
                    <span v-if="loc.reserved > 0" class="text-orange-600 ml-1">({{ loc.reserved }} резерв)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import searchService from '@/services/searchService.js';

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
</script>
