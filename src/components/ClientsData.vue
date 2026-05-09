<template>
  <div>
<div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-4" style="border-color: var(--accent);"></div>
        <p class="body-s text-ink-2">Загрузка клиентов...</p>
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
      <div v-if="clients.content && clients.content.length > 0" class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-line">
              <th class="px-5 py-3 text-left overline">ФИО</th>
              <th class="px-5 py-3 text-left overline">Дата рождения</th>
              <th class="px-5 py-3 text-left overline">Email</th>
              <th class="px-5 py-3 text-left overline">Телефон</th>
              <th class="px-5 py-3 text-left overline">Скидка</th>
              <th class="px-5 py-3 text-left overline">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in clients.content" :key="client.id" class="border-b border-line-2 hover:bg-surface-2 transition-colors">
              <td class="px-5 py-3 whitespace-nowrap body-s font-medium text-ink">
                {{ [client.firstName, client.middleName, client.lastName].filter(Boolean).join(' ') }}
              </td>
              <td class="px-5 py-3 whitespace-nowrap body-s text-ink-2 mono">{{ formatBirthday(client.dateOfBirth) }}</td>
              <td class="px-5 py-3 whitespace-nowrap body-s text-ink-2">{{ client.email || '—' }}</td>
              <td class="px-5 py-3 whitespace-nowrap body-s text-ink-2 mono">{{ client.phoneNumber || '—' }}</td>
              <td class="px-5 py-3 whitespace-nowrap body-s text-ink mono">
                {{ client.personalDiscount != null ? client.personalDiscount + '%' : '—' }}
              </td>
              <td class="px-5 py-3 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <button v-if="canEditClients" @click="$emit('edit', client)" class="text-ink-3 hover:text-accent transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button v-if="canManageClients" @click="$emit('delete', client)" class="text-ink-3 hover:text-danger transition-colors">
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="body-s text-ink-3 mb-4">Клиенты не найдены</p>
        <button v-if="canManageClients" @click="$emit('create')" class="btn btn-primary">
          Добавить первого клиента
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  clients: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  },
  error: {
    type: String,
    default: null
  },
  canManageClients: {
    type: Boolean,
    required: true
  },
  canEditClients: {
    type: Boolean,
    default: false
  }
});

defineEmits(['edit', 'delete', 'create']);

function formatBirthday(dateStr) {
  if (!dateStr) return 'Не указано';

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return dateStr;
}
</script>