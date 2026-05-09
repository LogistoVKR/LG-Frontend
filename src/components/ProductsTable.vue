<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Загрузка товаров...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-red-800">{{ error }}</span>
      </div>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-lg shadow-sm">
      <div v-if="products.content && products.content.length > 0">
        <table class="w-full divide-y divide-gray-200 table-fixed">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Название</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">Описание</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Действия</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-for="product in (products.content || []).filter(p => p && p.id)" :key="product.id">
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center min-w-0">
                    <button @click="$emit('toggle-expand', product.id)" class="mr-2 flex-shrink-0 focus:outline-none">
                      <svg :class="{'transform rotate-90': expandedProductIds.includes(product.id)}" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div class="relative group min-w-0 flex items-center gap-2">
                      <div class="text-sm font-medium text-gray-900 truncate">{{ truncate(product.name) }}</div>
                      <svg v-if="product.ozonItem" class="flex-shrink-0 w-9 h-4" viewBox="0 0 36 16" fill="none" xmlns="http://www.w3.org/2000/svg" title="Ozon">
                        <rect width="36" height="16" rx="4" fill="#005BFF"/>
                        <text x="18" y="11.5" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="700" fill="white" letter-spacing="0.5">OZON</text>
                      </svg>
                      <div v-if="product.name && product.name.length > 35" class="absolute z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-0 mb-1 px-2 py-1.5 bg-gray-800/75 text-white text-xs rounded-lg shadow-lg whitespace-normal w-max max-w-xs pointer-events-none">
                        {{ product.name }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="relative group">
                    <div class="text-sm text-gray-900 truncate">{{ truncate(product.description) || '—' }}</div>
                    <div v-if="product.description && product.description.length > 35" class="absolute z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-0 mb-1 px-2 py-1.5 bg-gray-800/75 text-white text-xs rounded-lg shadow-lg whitespace-normal w-max max-w-xs pointer-events-none">
                      {{ product.description }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      v-if="canManageItems"
                      @click="$emit('edit', product)"
                      class="text-blue-600 hover:text-blue-900 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      v-if="canManageItems"
                      @click="$emit('delete', product)"
                      class="text-red-600 hover:text-red-900 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="expandedProductIds.includes(product.id)">
                <td :colspan="3" class="bg-gray-50 px-2 py-0 align-top">
                  <VariantTable
                    v-if="expandedProductIds.includes(product.id)"
                    :item-id="product.id"
                    :currencies="currencies"
                    :can-manage-variants="canManageItems"
                  />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p class="text-gray-500 mb-4">Товары не найдены</p>
        <button
          v-if="canManageItems"
          @click="$emit('create')"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Добавить первый товар
        </button>
      </div>
      <!-- Pagination -->
      <div v-if="products.totalPages > 1" class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Показано {{ products.numberOfElements }} из {{ products.totalElements }}
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="$emit('change-page', products.number - 1)"
            :disabled="products.first"
            class="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
            Назад
          </button>
          <span class="px-3 py-1 text-sm">
            {{ products.number + 1 }} из {{ products.totalPages }}
          </span>
          <button
            @click="$emit('change-page', products.number + 1)"
            :disabled="products.last"
            class="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
            Вперед
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import VariantTable from '@/components/VariantTable.vue';

function truncate(text, len = 35) {
  if (!text) return '';
  return text.length > len ? text.slice(0, len) + '...' : text;
}

defineProps({
  products: { type: Object, required: true },
  loading: Boolean,
  error: String,
  canManageItems: Boolean,
  expandedProductIds: { type: Array, required: true },
  currencies: { type: Array, required: true }
});

defineEmits(['edit', 'delete', 'create', 'change-page', 'toggle-expand']);
</script> 