<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="flex flex-col min-h-screen transition-all duration-300" :class="isSidebarOpen ? 'ml-64' : 'ml-0'">
      <!-- Header -->
      <Header />

      <!-- Page Content -->
      <main class="flex-1 p-6">
        <div class="max-w-7xl mx-auto">
          <!-- Users Content -->
          <div>
            <!-- No Organization Selected State -->
            <div v-if="!organizationsStore.loading && !organizationsStore.selectedOrganizationId" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span class="text-yellow-800">Выберите организацию для просмотра сотрудников</span>
              </div>
            </div>

            <!-- Content -->
            <div v-else-if="!organizationsStore.loading">
              <!-- Action Bar -->
              <div class="flex justify-between items-center mb-6">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    Сотрудники организации
                    <span v-if="organizationsStore.selectedOrganization" class="text-blue-600">"{{ organizationsStore.selectedOrganization.name }}"</span>
                  </h3>
                  <p class="text-sm text-gray-600">Всего: {{ getTotalElements() }}</p>
                </div>
                
                <button
                  @click="showAddUserModal = true"
                  :disabled="!organizationsStore.selectedOrganizationId"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Добавить пользователя</span>
                </button>
              </div>

              <!-- Search Filters -->
              <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Имя пользователя
                    </label>
                    <input
                      v-model="filters.username"
                      type="text"
                      placeholder="Поиск по имени пользователя"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      @input="debouncedSearch">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Имя
                    </label>
                    <input
                      v-model="filters.firstName"
                      type="text"
                      placeholder="Поиск по имени"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      @input="debouncedSearch">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Фамилия
                    </label>
                    <input
                      v-model="filters.lastName"
                      type="text"
                      placeholder="Поиск по фамилии"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      @input="debouncedSearch">
                  </div>
                </div>
                <div class="mt-3 flex justify-end">
                  <button
                    @click="clearFilters"
                    class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                    Очистить фильтры
                  </button>
                </div>
              </div>

              <!-- Users Data -->
              <UsersData
                :key="tableKey"
                :users="usersStore.users"
                :loading="usersStore.loading"
                :error="usersStore.error"
                :canManageUsers="canManageUsers"
                @edit="editUser"
                @remove="removeUser"
                @create="showAddUserModal = true"
              />

              <!-- Pagination -->
              <div v-if="usersStore.shouldShowPagination()" class="mt-6 flex items-center justify-between">
                <div class="text-sm text-gray-700">
                  Показано {{ usersStore.users.content?.length || 0 }} из {{ usersStore.getTotalElements() }}
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="changePage(usersStore.getCurrentPage() - 1)"
                    :disabled="usersStore.getCurrentPage() === 0"
                    class="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                    Назад
                  </button>
                  <span class="px-3 py-1 text-sm">
                    {{ usersStore.getCurrentPage() + 1 }} из {{ usersStore.getTotalPages() }}
                  </span>
                  <button
                    @click="changePage(usersStore.getCurrentPage() + 1)"
                    :disabled="usersStore.getCurrentPage() >= usersStore.getTotalPages() - 1"
                    class="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                    Вперед
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <Footer />
    </div>

    <!-- Add/Edit User Modal -->
    <div v-if="showAddUserModal || showEditUserModal" class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50" @click="closeModal">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" @click.stop>
        <div class="px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ showEditUserModal ? 'Изменить роль пользователя' : 'Добавить пользователя' }}
            </h3>
            <p v-if="showEditUserModal" class="text-sm text-gray-600 mt-1">
              Пользователь: {{ usersStore.getUserFullName(userToEdit) || userToEdit?.email || 'Неизвестный пользователь' }}
            </p>
          </div>
        </div>
        
        <form @submit.prevent="handleSubmit" class="px-6 py-4">
          <div class="space-y-4">
            <!-- Поиск пользователя для добавления -->
            <div v-if="!showEditUserModal">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Поиск пользователя *
              </label>
              <div class="relative">
                <input
                  v-model="searchTerm"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Введите имя, фамилию или username пользователя"
                  @input="searchUsersForAdd"
                  @blur="setTimeout(() => searchResults.value = [], 200)">
                
                <!-- Результаты поиска -->
                <div v-if="searchResults.length > 0" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div
                    v-for="user in searchResults"
                    :key="user.id"
                    @click="selectUserForAdd(user)"
                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0">
                    <div class="font-medium">{{ user.username || user.email }}</div>
                    <div class="text-sm text-gray-600">
                      {{ user.firstName }} {{ user.lastName }}
                    </div>
                  </div>
                </div>
                
                <!-- Индикатор загрузки -->
                <div v-if="searching" class="absolute right-3 top-3">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              </div>
              
              <!-- Скрытое поле для ID выбранного пользователя -->
              <input
                v-model="form.userId"
                type="hidden"
                required>
            </div>
            
            <!-- Скрытое поле ID для редактирования -->
            <input
              v-if="showEditUserModal"
              v-model="form.userId"
              type="hidden"
              required>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Роль *
              </label>
              <select
                v-model="form.role"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Выберите роль</option>
                <option value="OWNER">Владелец</option>
                <option value="ADMIN">Администратор</option>
                <option value="WAREHOUSE_MANAGER">Менеджер склада</option>
                <option value="MEMBER">Участник</option>
              </select>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Отмена
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {{ submitting ? 'Сохранение...' : (showEditUserModal ? 'Обновить' : 'Добавить') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Remove User Confirmation Modal -->
    <div v-if="showRemoveUserModal" class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50" @click="showRemoveUserModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" @click.stop>
        <div class="px-6 py-4 border-b flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Подтверждение удаления</h3>
        </div>
        
        <div class="px-6 py-4">
          <p class="text-gray-700 mb-4">
            Вы уверены, что хотите удалить пользователя "{{ usersStore.getUserFullName(userToRemove) || userToRemove?.username }}" из организации?
            Это действие нельзя отменить.
          </p>
        </div>
        
        <div class="flex justify-end space-x-3 px-6 py-4 border-t">
          <button
            @click="showRemoveUserModal = false; userToRemove = null"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Отмена
          </button>
          <button
            @click="confirmRemoveUser"
            :disabled="submitting"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
            {{ submitting ? 'Удаление...' : 'Удалить' }}
          </button>
        </div>
      </div>
    </div>
  </div>


</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUsersStore } from '@/stores/users.js';
import { useOrganizationsStore } from '@/stores/organizations.js';
import { useAuth } from '@/composables/useAuth.js';
import { useSidebar } from '@/composables/useSidebar.js';
import userService from '@/services/userService.js';
import Sidebar from '@/components/Sidebar.vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import UsersData from '@/components/UsersData.vue';

const router = useRouter();
const usersStore = useUsersStore();
const organizationsStore = useOrganizationsStore();
const { getToken } = useAuth();
const { isSidebarOpen } = useSidebar();

// Table key for forced re-render
const tableKey = ref(0);

// Search filters
const filters = ref({
  username: '',
  firstName: '',
  lastName: ''
});

// Debounced search
let searchTimeout = null;

// Debounced search function
const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    usersStore.currentPage = 0;
    tableKey.value++; // Увеличиваем ключ для принудительного обновления таблицы
    usersStore.updateFilters({
      username: filters.value.username,
      firstName: filters.value.firstName,
      lastName: filters.value.lastName
    });
  }, 300);
};

const clearFilters = () => {
  filters.value.username = '';
  filters.value.firstName = '';
  filters.value.lastName = '';
  usersStore.currentPage = 0;
  tableKey.value++; // Увеличиваем ключ для принудительного обновления таблицы
  usersStore.clearFilters();
};

// Modal states
const showAddUserModal = ref(false);
const showEditUserModal = ref(false);
const showRemoveUserModal = ref(false);
const submitting = ref(false);
const userToRemove = ref(null);
const userToEdit = ref(null);

// Form data
const form = ref({
  userId: '',
  role: ''
});

// Search for adding users
const searchTerm = ref('');
const searchResults = ref([]);
const searching = ref(false);
let addUserSearchTimeout = null;

// Watch for organization changes to reload data
// Теперь это обрабатывается в Users store

// Methods
const searchUsersForAdd = async () => {
  if (!searchTerm.value.trim()) {
    searchResults.value = [];
    return;
  }
  
  if (addUserSearchTimeout) {
    clearTimeout(addUserSearchTimeout);
  }
  
  addUserSearchTimeout = setTimeout(async () => {
    searching.value = true;
    try {
      const token = await getToken();
      const result = await userService.searchAllUsers(searchTerm.value.trim(), token);
      searchResults.value = result.content || [];
    } catch (err) {
      console.error('Error searching users:', err);
      searchResults.value = [];
    } finally {
      searching.value = false;
    }
  }, 300);
};

const selectUserForAdd = (user) => {
  form.value.userId = user.id;
  searchTerm.value = user.username || user.email || user.id;
  searchResults.value = [];
};

const clearUserSearch = () => {
  searchTerm.value = '';
  searchResults.value = [];
};

const editUser = (user) => {
  if (!organizationsStore.selectedOrganizationId) {
    usersStore.error = 'Не выбрана организация';
    return;
  }
  
  userToEdit.value = user;
  form.value = {
    userId: user.id,
    role: user.role
  };
  showEditUserModal.value = true;
};

const removeUser = (user) => {
  if (!organizationsStore.selectedOrganizationId) {
    usersStore.error = 'Не выбрана организация';
    return;
  }
  
  userToRemove.value = user;
  showRemoveUserModal.value = true;
};

const confirmRemoveUser = async () => {
  if (!userToRemove.value) return;
  
  submitting.value = true;
  try {
    await usersStore.removeUserFromOrganization(userToRemove.value.id);
    tableKey.value++; // Увеличиваем ключ для принудительного обновления таблицы
    showRemoveUserModal.value = false;
    userToRemove.value = null;
  } catch (err) {
    // Ошибка уже обработана в store
  } finally {
    submitting.value = false;
  }
};

const handleSubmit = async () => {
  submitting.value = true;
  
  try {
    if (showEditUserModal.value) {
      await usersStore.updateUserInOrganization({
        userId: form.value.userId,
        role: form.value.role
      });
    } else {
      await usersStore.addUserToOrganization({
        userId: form.value.userId,
        role: form.value.role
      });
    }
    
    tableKey.value++; // Увеличиваем ключ для принудительного обновления таблицы
    closeModal();
  } catch (err) {
    // Ошибка уже обработана в store
  } finally {
    submitting.value = false;
  }
};

const closeModal = () => {
  showAddUserModal.value = false;
  showEditUserModal.value = false;
  form.value = { userId: '', role: '' };
  userToRemove.value = null;
  userToEdit.value = null;
  clearUserSearch();
};

// Utility functions
const getTotalElements = () => {
  return usersStore.getTotalElements();
};

const canManageUsers = computed(() => {
  const role = organizationsStore.selectedOrganization?.role;
  return role === 'ADMIN' || role === 'OWNER';
});

const changePage = (page) => {
  usersStore.currentPage = page;
  tableKey.value++; // Увеличиваем ключ для принудительного обновления таблицы
  usersStore.changePage(page);
};

// Lifecycle
onMounted(() => {
  usersStore.loadUsers();
  // Синхронизируем локальные фильтры с фильтрами в store
  filters.value.username = usersStore.filters.username;
  filters.value.firstName = usersStore.filters.firstName;
  filters.value.lastName = usersStore.filters.lastName;
});
</script> 