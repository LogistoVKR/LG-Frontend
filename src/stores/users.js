import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import userService from '@/services/userService.js';
import { useAuth } from '@/composables/useAuth.js';
import { useOrganizationsStore } from './organizations.js';

export const useUsersStore = defineStore('users', () => {
  const { getToken } = useAuth();
  const organizationsStore = useOrganizationsStore();
  
  // State
  const users = ref({ content: [], page: { totalElements: 0, totalPages: 0, number: 0 } });
  const loading = ref(false);
  const error = ref(null);
  const currentPage = ref(0);
  const pageSize = ref(20);
  
  // Search filters
  const filters = ref({
    username: '',
    firstName: '',
    lastName: ''
  });

  // Computed
  const organizationId = computed(() => organizationsStore.selectedOrganizationId);

  // Actions
  const loadUsers = async () => {
    // Не загружаем данные, если загружаются организации или организация не выбрана
    if (organizationsStore.loading || !organizationId.value) {
      users.value = { content: [], page: { totalElements: 0, totalPages: 0, number: 0 } };
      return;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      const token = await getToken();
      console.log('Загружаем пользователей с фильтрами:', filters.value); // Отладочная информация
      const result = await userService.getUsersByOrganizationId(
        organizationId.value, 
        currentPage.value, 
        pageSize.value, 
        token,
        filters.value.username,
        filters.value.firstName,
        filters.value.lastName
      );
      users.value = result;
    } catch (err) {
      error.value = 'Ошибка при загрузке пользователей: ' + err.message;
      console.error('Error loading users:', err);
    } finally {
      loading.value = false;
    }
  };

  // Поиск пользователей для добавления в организацию (с параметром or=true)
  const searchUsersForAdd = async (searchTerm) => {
    if (!organizationId.value) {
      return { content: [] };
    }
    
    try {
      const token = await getToken();
      console.log('Поиск пользователей для добавления:', searchTerm);
      const result = await userService.getUsersByOrganizationId(
        organizationId.value, 
        0, // первая страница
        50, // больше результатов для поиска
        token,
        searchTerm, // username
        searchTerm, // firstName
        searchTerm, // lastName
        true // or=true
      );
      return result;
    } catch (err) {
      console.error('Error searching users for add:', err);
      return { content: [] };
    }
  };

  const changePage = (page) => {
    currentPage.value = page;
    loadUsers();
  };

  const updateFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters };
    currentPage.value = 0;
    loadUsers();
  };

  const clearFilters = () => {
    filters.value.username = '';
    filters.value.firstName = '';
    filters.value.lastName = '';
    currentPage.value = 0;
    loadUsers();
  };

  const addUserToOrganization = async (data) => {
    try {
      const token = await getToken();
      const response = await userService.addUserToOrganization({
        ...data,
        organizationId: organizationId.value
      }, token);
      
      // После успешного добавления всегда обновляем список пользователей
      await loadUsers();
      
      return response;
    } catch (err) {
      error.value = 'Ошибка при добавлении пользователя: ' + err.message;
      console.error('Error adding user:', err);
      throw err;
    }
  };

  const updateUserInOrganization = async (data) => {
    try {
      const token = await getToken();
      const response = await userService.updateUserInOrganization({
        ...data,
        organizationId: organizationId.value
      }, token);
      
      // Если API возвращает обновленные данные пользователя, обновляем локальное состояние
      if (response) {
        console.log('Ответ от API при обновлении пользователя:', response);
        
        const updatedUser = response.user || response.data || response;
        
        if (updatedUser && updatedUser.created) {
          // Находим пользователя в списке и обновляем его данные
          const userIndex = users.value.content.findIndex(user => user.id === data.userId);
          if (userIndex !== -1) {
            users.value.content[userIndex] = {
              ...users.value.content[userIndex],
              created: updatedUser.created
            };
            console.log('Обновлен пользователь с новым created:', updatedUser.created);
          }
        } else {
          // Если нет обновленных данных, перезагружаем весь список
          console.log('Перезагружаем список пользователей');
          await loadUsers();
        }
      } else {
        // Если нет ответа, перезагружаем весь список
        console.log('Нет ответа от API, перезагружаем список пользователей');
        await loadUsers();
      }
    } catch (err) {
      error.value = 'Ошибка при обновлении пользователя: ' + err.message;
      console.error('Error updating user:', err);
      throw err;
    }
  };

  const removeUserFromOrganization = async (userId) => {
    try {
      const token = await getToken();
      await userService.removeUserFromOrganization({
        userId,
        organizationId: organizationId.value
      }, token);
      await loadUsers();
    } catch (err) {
      error.value = 'Ошибка при удалении пользователя: ' + err.message;
      console.error('Error removing user:', err);
      throw err;
    }
  };

  // Utility functions
  const getUserInitials = (user) => {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || user.username.charAt(0).toUpperCase();
  };

  const getUserTimeZone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
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
      'WAREHOUSE_MANAGER': 'Менеджер склада'
    };
    return roleNames[role] || role;
  };

  const getRoleBadgeClass = (role) => {
    const classes = {
      'OWNER': 'bg-purple-100 text-purple-800',
      'ADMIN': 'bg-red-100 text-red-800',
      'WAREHOUSE_MANAGER': 'bg-blue-100 text-blue-800'
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
      
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      const formattedDate = utcDate.toLocaleString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
        // Убираем timeZone - пусть JavaScript сам определит локальную зону
      });
      
      return formattedDate;
    } catch (error) {
      console.error('Ошибка форматирования даты:', error);
      return 'Не указано';
    }
  };

  // Utility methods for data access
  const getTotalElements = () => {
    if (users.value.page?.totalElements !== undefined) {
      return users.value.page.totalElements;
    }
    if (users.value.totalElements !== undefined) {
      return users.value.totalElements;
    }
    if (users.value.content && Array.isArray(users.value.content)) {
      return users.value.content.length;
    }
    return 0;
  };

  const getTotalPages = () => {
    if (users.value.page?.totalPages !== undefined) {
      return users.value.page.totalPages;
    }
    if (users.value.totalPages !== undefined) {
      return users.value.totalPages;
    }
    return 1;
  };

  const getCurrentPage = () => {
    if (users.value.page?.number !== undefined) {
      return users.value.page.number;
    }
    if (users.value.number !== undefined) {
      return users.value.number;
    }
    return currentPage.value;
  };

  const shouldShowPagination = () => {
    const totalPages = getTotalPages();
    const totalElements = getTotalElements();
    return totalPages > 1 && totalElements > pageSize.value;
  };

  // Watch for organization changes
  watch(organizationId, (newValue) => {
    if (newValue && !organizationsStore.loading) {
      loadUsers();
    } else {
      users.value = { content: [], page: { totalElements: 0, totalPages: 0, number: 0 } };
      error.value = null;
    }
  });

  // Watch for organizations loading completion
  watch(() => organizationsStore.loading, (isLoading) => {
    if (!isLoading && organizationId.value) {
      loadUsers();
    }
  });

  return {
    // State
    users,
    loading,
    error,
    currentPage,
    pageSize,
    filters,
    
    // Computed
    organizationId,
    
    // Actions
    loadUsers,
    changePage,
    updateFilters,
    clearFilters,
    addUserToOrganization,
    updateUserInOrganization,
    removeUserFromOrganization,
    searchUsersForAdd,
    
    // Utility functions
    getUserInitials,
    getUserFullName,
    getRoleDisplayName,
    getRoleBadgeClass,
    formatDate,
    getUserTimeZone,
    getTotalElements,
    getTotalPages,
    getCurrentPage,
    shouldShowPagination
  };
}); 