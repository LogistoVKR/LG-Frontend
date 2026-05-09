<template>
  <div>
<div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-4" style="border-color: var(--accent);"></div>
        <p class="body-s text-ink-2">Загрузка складов...</p>
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

<div v-else class="bg-surface rounded-[var(--r-3)] overflow-hidden" style="box-shadow: var(--shadow-1);">
      <div v-if="warehouses.content && warehouses.content.length > 0" class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-line">
              <th class="px-5 py-3 text-left overline">Название</th>
              <th class="px-5 py-3 text-left overline">Расположение</th>
              <th class="px-5 py-3 text-left overline">Тип</th>
              <th class="px-5 py-3 text-left overline">Описание</th>
              <th class="px-5 py-3 text-left overline">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="warehouse in warehouses.content" :key="warehouse.id" class="border-b border-line-2 hover:bg-surface-2 transition-colors">
              <td class="px-5 py-3 whitespace-nowrap">
                <div class="body-s font-medium text-ink">{{ warehouse.name }}</div>
              </td>
              <td class="px-5 py-3 whitespace-nowrap">
                <div class="body-s text-ink-2">{{ warehouse.location || '—' }}</div>
              </td>
              <td class="px-5 py-3 whitespace-nowrap">
                <span class="badge" :class="warehouse.type === 'WAREHOUSE' ? 'badge--transfer' : 'badge--purchase'">
                  {{ warehouse.type === 'WAREHOUSE' ? 'Склад' : 'Точка продаж' }}
                </span>
              </td>
              <td class="px-5 py-3 whitespace-nowrap">
                <div class="body-s text-ink-2">
                  <template v-if="warehouse.description && warehouse.description.length > 10">
                    {{ warehouse.description.slice(0, 7) + '...' }}
                  </template>
                  <template v-else>
                    {{ warehouse.description || '—' }}
                  </template>
                </div>
              </td>
              <td class="px-5 py-3 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <button v-if="canManageWarehouses" @click="$emit('edit', warehouse)" class="text-ink-3 hover:text-accent transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button v-if="canManageWarehouses" @click="$emit('delete', warehouse)" class="text-ink-3 hover:text-danger transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
<div v-else class="text-center py-12">
        <svg class="w-10 h-10 mx-auto mb-3 text-line-strong" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h6v6H3V3zM15 3h6v6h-6V3zM3 15h6v6H3v-6zM15 15h6v6h-6v-6z" />
        </svg>
        <p class="body-s text-ink-3 mb-4">Склады не найдены</p>
        <button v-if="canManageWarehouses" @click="$emit('create')" class="btn btn-primary gap-2 mx-auto">
          Добавить первый склад
        </button>
      </div>
<div v-if="warehouses.totalPages > 1" class="px-5 py-3 flex items-center justify-between border-t border-line">
        <div class="body-s text-ink-3">
          Показано {{ warehouses.numberOfElements }} из {{ warehouses.totalElements }}
        </div>
        <div class="flex items-center gap-2">
          <button @click="$emit('change-page', warehouses.number - 1)" :disabled="warehouses.first" class="btn btn-secondary btn-sm disabled:opacity-40 disabled:cursor-not-allowed">Назад</button>
          <span class="body-s text-ink-2 px-2">{{ warehouses.number + 1 }} из {{ warehouses.totalPages }}</span>
          <button @click="$emit('change-page', warehouses.number + 1)" :disabled="warehouses.last" class="btn btn-secondary btn-sm disabled:opacity-40 disabled:cursor-not-allowed">Вперед</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  warehouses: { type: Object, required: true },
  loading: Boolean,
  error: String,
  canManageWarehouses: Boolean
});

defineEmits(['edit', 'delete', 'create', 'change-page']);
</script>