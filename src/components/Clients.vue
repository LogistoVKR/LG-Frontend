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
          <!-- Content -->
          <div>
            <!-- Action Bar -->
            <div class="flex justify-between items-center mb-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Клиенты</h3>
                <p class="text-sm text-gray-600">Всего: {{ getTotalElements() }}</p>
              </div>
              
              <button
                v-if="canManageClients"
                @click="showCreateModal = true"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Добавить клиента</span>
              </button>
            </div>

            <!-- Search Filters -->
            <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div class="col-span-1 flex items-center mt-2">
                <input
                  id="birthdayToday"
                  type="checkbox"
                  v-model="filters.birthdayToday"
                  class="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  @change="debouncedSearch"
                />
                <label for="birthdayToday" class="text-sm text-gray-700 select-none cursor-pointer">День рождения сегодня</label>
              </div>
              <div class="mt-3 flex justify-end">
                <button
                  @click="clearFilters"
                  class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                  Очистить фильтры
                </button>
              </div>
            </div>

            <!-- Clients Data -->
            <ClientsData
              :key="tableKey"
              :clients="clients"
              :loading="loading"
              :error="error"
              :canManageClients="canManageClients"
              @edit="editClient"
              @delete="deleteClient"
              @create="showCreateModal = true"
            />

            <!-- Pagination -->
            <div v-if="shouldShowPagination()" class="mt-6 flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Показано {{ clients.content?.length || 0 }} из {{ getTotalElements() }}
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="changePage(getCurrentPage() - 1)"
                  :disabled="getCurrentPage() === 0"
                  class="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                  Назад
                </button>
                <span class="px-3 py-1 text-sm">
                  {{ getCurrentPage() + 1 }} из {{ getTotalPages() }}
                </span>
                <button
                  @click="changePage(getCurrentPage() + 1)"
                  :disabled="getCurrentPage() >= getTotalPages() - 1"
                  class="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                  Вперед
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <Footer />
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ showEditModal ? 'Редактировать клиента' : 'Добавить клиента' }}
          </h3>
        </div>
        
        <form @submit.prevent="handleSubmit" class="px-6 py-4">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Имя *
              </label>
              <input
                v-model="form.firstName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите имя клиента"
                maxlength="255">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Фамилия
              </label>
              <input
                v-model="form.lastName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите фамилию клиента"
                maxlength="255">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Отчество
              </label>
              <input
                v-model="form.middleName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите отчество клиента"
                maxlength="255">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Дата рождения
              </label>
              <input
                v-model="form.dateOfBirth"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                v-model="form.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите email клиента"
                maxlength="255">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Телефон
              </label>
              <input
                v-model="form.phoneNumber"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите телефон клиента"
                maxlength="15">
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
              {{ submitting ? 'Сохранение...' : (showEditModal ? 'Обновить' : 'Создать') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-semibold text-gray-900">Подтверждение удаления</h3>
        </div>
        
        <div class="px-6 py-4">
          <p class="text-gray-700 mb-4">
            Вы уверены, что хотите удалить клиента "{{ [clientToDelete?.firstName, clientToDelete?.middleName, clientToDelete?.lastName].filter(Boolean).join(' ') }}"?
            Это действие нельзя отменить.
          </p>
        </div>
        
        <div class="flex justify-end space-x-3 px-6 py-4 border-t">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Отмена
          </button>
          <button
            @click="confirmDelete"
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
import { ref, onMounted, computed, watch } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import ClientsData from '@/components/ClientsData.vue';
import clientService from '@/services/clientService.js';
import { useOrganizationsStore } from '@/stores/organizations.js';
import { useAuth } from '@/composables/useAuth.js';
import { useSidebar } from '@/composables/useSidebar.js';

const organizationsStore = useOrganizationsStore();
const { getToken, isAdmin, isOwner, isMember, isWarehouseManager } = useAuth();
const { isSidebarOpen } = useSidebar();

const canManageClients = computed(() => {
  const role = organizationsStore.selectedOrganization?.role;
  return role === 'ADMIN' || role === 'OWNER';
});

// State
const loading = ref(false);
const error = ref(null);
const clients = ref({ content: [], totalElements: 0, totalPages: 0, number: 0, first: true, last: true, numberOfElements: 0 });
const currentPage = ref(0);
const pageSize = ref(10);

// Search filters
const filters = ref({
  firstName: '',
  lastName: '',
  birthdayToday: false
});

// Debounced search
let searchTimeout = null;

// Table key for forced re-render
const tableKey = ref(0);

// Modal states
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const submitting = ref(false);
const clientToDelete = ref(null);

// Form data
const form = ref({
  firstName: '',
  lastName: '',
  middleName: '',
  dateOfBirth: '',
  email: '',
  phoneNumber: ''
});

const showProfileMenu = ref(false);

// Methods
const loadClients = async () => {
  loading.value = true;
  error.value = null;
  try {
    const orgId = organizationsStore.selectedOrganizationId;
    if (!orgId) {
      clients.value = { content: [], totalElements: 0, totalPages: 0, number: 0, first: true, last: true, numberOfElements: 0 };
      return;
    }
    const token = await getToken();
    let dateOfBirth = null;
    if (filters.value.birthdayToday) {
      const now = new Date();
      const plus5 = new Date(now.getTime() + 5 * 60 * 60 * 1000);
      const year = plus5.getUTCFullYear();
      const month = String(plus5.getUTCMonth() + 1).padStart(2, '0');
      const day = String(plus5.getUTCDate()).padStart(2, '0');
      dateOfBirth = `${year}-${month}-${day}`;
    }
    clients.value = await clientService.getClientsByOrganization(
      orgId, 
      currentPage.value, 
      pageSize.value, 
      token, 
      filters.value.firstName, 
      filters.value.lastName,
      dateOfBirth
    );
  } catch (err) {
    error.value = 'Ошибка при загрузке клиентов: ' + err.message;
    console.error('Error loading clients:', err);
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  currentPage.value = page;
  tableKey.value++; // Увеличиваем ключ для принудительного обновления таблицы
  loadClients();
};

const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    currentPage.value = 0;
    tableKey.value++; // Увеличиваем ключ для принудительного обновления таблицы
    loadClients();
  }, 300);
};

const clearFilters = () => {
  filters.value.firstName = '';
  filters.value.lastName = '';
  filters.value.birthdayToday = false; // Сбрасываем чекбокс
  currentPage.value = 0;
  tableKey.value++; // Увеличиваем ключ для принудительного обновления таблицы
  loadClients();
};

const editClient = (client) => {
  form.value = {
    firstName: client.firstName || '',
    lastName: client.lastName || '',
    middleName: client.middleName || '',
    dateOfBirth: client.dateOfBirth || '',
    email: client.email || '',
    phoneNumber: client.phoneNumber || '',
    id: client.id
  };
  showEditModal.value = true;
};

const deleteClient = (client) => {
  clientToDelete.value = client;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!clientToDelete.value) return;
  submitting.value = true;
  try {
    const orgId = organizationsStore.selectedOrganizationId;
    const token = await getToken();
    await clientService.deleteClient(orgId, clientToDelete.value.id, token);
    // Сбрасываем страницу при удалении клиента
    currentPage.value = 0;
    tableKey.value++; // Увеличиваем ключ для принудительного обновления таблицы
    await loadClients();
    showDeleteModal.value = false;
    clientToDelete.value = null;
  } catch (err) {
    error.value = 'Ошибка при удалении клиента: ' + err.message;
    console.error('Error deleting client:', err);
  } finally {
    submitting.value = false;
  }
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    const orgId = organizationsStore.selectedOrganizationId;
    const token = await getToken();
    if (showEditModal.value && form.value.id) {
      await clientService.updateClient(orgId, form.value.id, form.value, token);
    } else {
      await clientService.createClient(orgId, form.value, token);
    }
    // Сбрасываем страницу при создании/обновлении клиента
    currentPage.value = 0;
    tableKey.value++; // Увеличиваем ключ для принудительного обновления таблицы
    await loadClients();
    closeModal();
  } catch (err) {
    error.value = 'Ошибка при сохранении клиента: ' + err.message;
    console.error('Error saving client:', err);
  } finally {
    submitting.value = false;
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  form.value = {
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: ''
  };
  clientToDelete.value = null;
};

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
};

const handleLogout = async () => {
  try {
    await logout();
  } catch (error) {
    console.error('Ошибка выхода:', error);
  }
  showProfileMenu.value = false;
};

// Utility methods
const getTotalElements = () => {
  if (clients.value.totalElements !== undefined) {
    return clients.value.totalElements;
  }
  if (clients.value.content && Array.isArray(clients.value.content)) {
    return clients.value.content.length;
  }
  return 0;
};

const getTotalPages = () => {
  if (clients.value.totalPages !== undefined) {
    return clients.value.totalPages;
  }
  return 1;
};

const getCurrentPage = () => {
  if (clients.value.number !== undefined) {
    return clients.value.number;
  }
  return currentPage.value;
};

const shouldShowPagination = () => {
  const totalPages = getTotalPages();
  const totalElements = getTotalElements();
  return totalPages > 1 && totalElements > pageSize.value;
};

// Lifecycle
// Следим за изменением выбранной организации и загружаем клиентов
watch(() => organizationsStore.selectedOrganizationId, (newVal) => {
  if (newVal) {
    currentPage.value = 0;
    tableKey.value++; // Увеличиваем ключ для принудительного обновления таблицы
    loadClients();
  } else {
    clients.value = { content: [], totalElements: 0, totalPages: 0, number: 0, first: true, last: true, numberOfElements: 0 };
  }
}, { immediate: true });

document.addEventListener('click', (e) => {
  if (!e.target.closest('.relative')) {
    showProfileMenu.value = false;
  }
});
</script> 