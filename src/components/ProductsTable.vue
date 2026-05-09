<template>
  <div>
<div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-4" style="border-color: var(--accent);"></div>
        <p class="body-s text-ink-2">Загрузка товаров...</p>
      </div>
    </div>

<div v-else-if="error" class="bg-danger-soft border border-danger rounded-[var(--r-3)] p-4 mb-4">
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-danger shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="body-s text-danger">{{ error }}</span>
      </div>
    </div>

<div v-else class="bg-surface rounded-[var(--r-3)]" style="box-shadow: var(--shadow-1);">
      <div v-if="products.content && products.content.length > 0">
        <table class="w-full table-fixed">
          <thead>
            <tr class="border-b border-line">
              <th class="px-5 py-3 text-left overline w-1/3">Название</th>
              <th class="px-5 py-3 text-left overline w-1/2">Описание</th>
              <th class="px-5 py-3 text-left overline w-28">Действия</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="product in (products.content || []).filter(p => p && p.id)" :key="product.id">
              <tr class="border-b border-line-2 hover:bg-surface-2 transition-colors">
                <td class="px-5 py-3">
                  <div class="flex items-center min-w-0 gap-2">
                    <button @click="$emit('toggle-expand', product.id)" class="shrink-0 text-ink-3 hover:text-ink transition-colors focus:outline-none">
                      <svg :class="{'rotate-90': expandedProductIds.includes(product.id)}" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div class="relative group min-w-0 flex items-center gap-2">
                      <div class="body-s font-medium text-ink truncate">{{ truncate(product.name) }}</div>
                      <span v-if="product.ozonItem" class="badge badge--ozon shrink-0">Ozon</span>
                      <div v-if="product.name && product.name.length > 35" class="absolute z-50 opacity-0 group-hover:opacity-100 transition-opacity bottom-full left-0 mb-1 px-2 py-1.5 bg-ink/80 text-[var(--ink-on-dark)] text-xs rounded-[var(--r-2)] whitespace-normal w-max max-w-xs pointer-events-none">
                        {{ product.name }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-3">
                  <div class="relative group">
                    <div class="body-s text-ink-2 truncate">{{ truncate(product.description) || '—' }}</div>
                    <div v-if="product.description && product.description.length > 35" class="absolute z-50 opacity-0 group-hover:opacity-100 transition-opacity bottom-full left-0 mb-1 px-2 py-1.5 bg-ink/80 text-[var(--ink-on-dark)] text-xs rounded-[var(--r-2)] whitespace-normal w-max max-w-xs pointer-events-none">
                      {{ product.description }}
                    </div>
                  </div>
                </td>
                <td class="px-5 py-3 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button v-if="canManageItems" @click="$emit('edit', product)" class="text-ink-3 hover:text-accent transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button v-if="canManageItems" @click="$emit('delete', product)" class="text-ink-3 hover:text-danger transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="expandedProductIds.includes(product.id)">
                <td :colspan="3" class="bg-surface-2 px-2 py-0 align-top">
                  <VariantTable
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
<div v-else class="text-center py-12">
        <svg class="w-10 h-10 mx-auto mb-3 text-line-strong" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p class="body-s text-ink-3 mb-4">Товары не найдены</p>
        <button v-if="canManageItems" @click="$emit('create')" class="btn btn-primary">
          Добавить первый товар
        </button>
      </div>
<div v-if="products.totalPages > 1" class="px-5 py-3 flex items-center justify-between border-t border-line">
        <div class="body-s text-ink-3">
          Показано {{ products.numberOfElements }} из {{ products.totalElements }}
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="$emit('change-page', products.number - 1)"
            :disabled="products.first"
            class="btn btn-secondary btn-sm disabled:opacity-40 disabled:cursor-not-allowed">
            Назад
          </button>
          <span class="body-s text-ink-2 px-2">{{ products.number + 1 }} из {{ products.totalPages }}</span>
          <button
            @click="$emit('change-page', products.number + 1)"
            :disabled="products.last"
            class="btn btn-secondary btn-sm disabled:opacity-40 disabled:cursor-not-allowed">
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