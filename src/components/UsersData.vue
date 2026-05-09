<template>
  <div>
<div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-4" style="border-color: var(--accent);"></div>
        <p class="body-s text-ink-2">Загрузка пользователей...</p>
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
      <div v-if="users.content && users.content.length > 0" class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-line">
              <th class="px-5 py-3 text-left overline">Пользователь</th>
              <th class="px-5 py-3 text-left overline">Email</th>
              <th class="px-5 py-3 text-left overline">Роль</th>
              <th class="px-5 py-3 text-left overline">Дата регистрации</th>
              <th class="px-5 py-3 text-left overline">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users.content" :key="user.id" class="border-b border-line-2 hover:bg-surface-2 transition-colors">
              <td class="px-5 py-3 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0" style="background: var(--accent); color: var(--accent-on);">
                    {{ getUserInitials(user) }}
                  </div>
                  <div>
                    <div class="body-s font-medium text-ink">{{ getUserFullName(user) }}</div>
                    <div class="body-s text-ink-3">{{ user.username }}</div>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3 whitespace-nowrap body-s text-ink-2">{{ user.email }}</td>
              <td class="px-5 py-3 whitespace-nowrap">
                <span class="badge" :class="getRoleBadgeClass(user.role)">
                  {{ getRoleDisplayName(user.role) }}
                </span>
              </td>
              <td class="px-5 py-3 whitespace-nowrap body-s text-ink-2 mono">{{ formatDate(user.created) }}</td>
              <td class="px-5 py-3 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <button @click="$emit('edit', user)" class="text-ink-3 hover:text-accent transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="$emit('remove', user)" class="text-ink-3 hover:text-danger transition-colors">
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <p class="body-s text-ink-3 mb-4">Сотрудники не найдены</p>
        <button @click="$emit('create')" :disabled="!canManageUsers" class="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
          Добавить первого пользователя
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  users: {
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
  canManageUsers: {
    type: Boolean,
    required: true
  }
});

defineEmits(['edit', 'remove', 'create']);


const getUserInitials = (user) => {
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || user.username.charAt(0).toUpperCase();
};

const getUserFullName = (user) => {
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  return firstName && lastName ? `${firstName} ${lastName}` : user.username;
};

const getRoleDisplayName = (role) => {
  const roleNames = {
    'OWNER': 'Владелец',
    'ADMIN': 'Администратор',
    'WAREHOUSE_MANAGER': 'Менеджер склада',
    'MEMBER': 'Участник'
  };
  return roleNames[role] || role;
};

const getRoleBadgeClass = (role) => {
  const classes = {
    'OWNER': 'badge--purchase',
    'ADMIN': 'badge--writeoff',
    'WAREHOUSE_MANAGER': 'badge--transfer',
    'MEMBER': 'badge--neutral'
  };
  return classes[role] || 'badge--neutral';
};

const formatDate = (dateString) => {
  if (!dateString) return 'Не указано';

  try {
    const utcDate = new Date(dateString);

    if (isNaN(utcDate.getTime())) {
      console.warn('Некорректная дата:', dateString);
      return 'Не указано';
    }

    const localDate = new Date(utcDate.getTime() + (5 * 60 * 60 * 1000));

    const formattedDate = localDate.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    return formattedDate;
  } catch (error) {
    console.error('Ошибка форматирования даты:', error);
    return 'Не указано';
  }
};
</script>