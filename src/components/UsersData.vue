<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Загрузка пользователей...</p>
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

    <!-- Users Data -->
    <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div v-if="users.content && users.content.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Пользователь
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Роль
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата регистрации
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users.content" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium">
                    {{ getUserInitials(user) }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ getUserFullName(user) }}
                    </div>
                    <div class="text-sm text-gray-500">{{ user.username }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getRoleBadgeClass(user.role)">
                  {{ getRoleDisplayName(user.role) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(user.created) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button
                    @click="$emit('edit', user)"
                    class="text-blue-600 hover:text-blue-900 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="$emit('remove', user)"
                    class="text-red-600 hover:text-red-900 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <p class="text-gray-500 mb-4">Сотрудники не найдены</p>
        <button
          @click="$emit('create')"
          :disabled="!canManageUsers"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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

// Utility functions (копируем из store для использования в компоненте)
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
    'OWNER': 'bg-purple-100 text-purple-800',
    'ADMIN': 'bg-red-100 text-red-800',
    'WAREHOUSE_MANAGER': 'bg-blue-100 text-blue-800',
    'MEMBER': 'bg-gray-100 text-gray-800'
  };
  return classes[role] || 'bg-gray-100 text-gray-800';
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