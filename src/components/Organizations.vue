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
            <!-- Action Bar -->
            <div class="flex justify-between items-center mb-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Организации</h3>
                <p class="text-sm text-gray-600">Всего: {{ getTotalElements() }}</p>
              </div>
              
              <button
                @click="showAddOrganizationModal = true"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Создать организацию</span>
              </button>
            </div>

            <!-- Search Filters -->
            <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Название организации
                  </label>
                  <input
                    v-model="filters.name"
                    type="text"
                    placeholder="Поиск по названию организации"
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

            <!-- Content -->
            <div v-if="loading" class="flex items-center justify-center py-12">
              <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p class="text-gray-600">Загрузка организаций...</p>
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

            <!-- Organizations List -->
            <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
              <div v-if="organizations.content && organizations.content.length > 0" class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Название
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Описание
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Роль
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="org in organizations.content" :key="org.id" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-medium">
                            {{ org.name.charAt(0).toUpperCase() }}
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">{{ org.name }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{ org.description || 'Нет описания' }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                              :class="getRoleBadgeClass(org.role)">
                          {{ getRoleDisplayName(org.role) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div class="flex items-center space-x-2">
                          <button
                            @click="editOrganization(org)"
                            class="text-blue-600 hover:text-blue-900 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            v-if="canDeleteOrganization(org)"
                            @click="deleteOrganization(org)"
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p class="text-gray-500 mb-4">Организации не найдены</p>
                <button
                  @click="showAddOrganizationModal = true"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Создать первую организацию
                </button>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="!loading && !error && shouldShowPagination()" class="mt-6 flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Показано {{ organizations.numberOfElements || organizations.content?.length || 0 }} из {{ getTotalElements() }}
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
      </main>

      <!-- Footer -->
      <Footer />
    </div>

    <!-- Organizations Modal -->
    <OrganizationsModal 
      :isOpen="showAddOrganizationModal || showEditOrganizationModal"
      @close="closeModal"
      @organizationSaved="handleOrganizationSaved"
      :editingOrganization="editingOrganization"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" @click.stop>
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-semibold text-gray-900">Подтверждение удаления</h3>
        </div>
        
        <div class="px-6 py-4">
          <p class="text-gray-700 mb-4">
            Вы уверены, что хотите удалить организацию "{{ organizationToDelete?.name }}"?
            Это действие нельзя отменить.
          </p>
        </div>
        
        <div class="flex justify-end space-x-3 px-6 py-4 border-t">
          <button
            @click="showDeleteModal = false; organizationToDelete = null"
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
import { ref, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth.js';
import { useSidebar } from '@/composables/useSidebar.js';
import userService from '@/services/userService.js';
import OrganizationsModal from '@/components/OrganizationsModal.vue';
import Sidebar from '@/components/Sidebar.vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { useOrganizationsStore } from '@/stores/organizations.js';

const { getToken } = useAuth();
const { isSidebarOpen } = useSidebar();
const organizationsStore = useOrganizationsStore();

// State
const loading = ref(false);
const error = ref(null);
const organizations = ref({ content: [], totalElements: 0, totalPages: 0, number: 0, first: true, last: true, numberOfElements: 0 });
const currentPage = ref(0);
const pageSize = ref(10);

// Search filters
const filters = ref({
  name: ''
});

// Debounced search
let searchTimeout = null;

// Modal states
const showAddOrganizationModal = ref(false);
const showEditOrganizationModal = ref(false);
const showDeleteModal = ref(false);
const editingOrganization = ref(null);
const organizationToDelete = ref(null);
const submitting = ref(false);

const showProfileMenu = ref(false);



const loadOrganizations = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const token = await getToken();
    const result = await userService.getOrganizations(token, currentPage.value, pageSize.value, filters.value.name);
    
    // Обеспечиваем совместимость с разными структурами ответа
    organizations.value = {
      content: result.content || result.data || [],
      totalElements: result.totalElements || result.page?.totalElements || 0,
      totalPages: result.totalPages || result.page?.totalPages || 1,
      number: result.number || result.page?.number || currentPage.value,
      first: result.first !== undefined ? result.first : (currentPage.value === 0),
      last: result.last !== undefined ? result.last : (currentPage.value >= (result.totalPages || 1) - 1),
      numberOfElements: result.numberOfElements || result.content?.length || 0
    };
  } catch (err) {
    error.value = 'Ошибка при загрузке организаций: ' + err.message;
    console.error('Error loading organizations:', err);
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  currentPage.value = page;
  loadOrganizations();
};

const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    currentPage.value = 0;
    loadOrganizations();
  }, 300);
};

const clearFilters = () => {
  filters.value.name = '';
  currentPage.value = 0;
  loadOrganizations();
};

const editOrganization = (org) => {
  editingOrganization.value = org;
  showEditOrganizationModal.value = true;
};

const deleteOrganization = (org) => {
  organizationToDelete.value = org;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!organizationToDelete.value) return;
  
  submitting.value = true;
  try {
    const token = await getToken();
    await userService.deleteOrganization(organizationToDelete.value.id, token);
    
    await loadOrganizations();
    
    // Также обновляем store организаций
    await organizationsStore.loadOrganizations();
    
    // Закрываем модальное окно
    showDeleteModal.value = false;
    organizationToDelete.value = null;
  } catch (err) {
    error.value = 'Ошибка при удалении организации: ' + err.message;
    console.error('Error deleting organization:', err);
  } finally {
    submitting.value = false;
  }
};

const closeModal = () => {
  showAddOrganizationModal.value = false;
  showEditOrganizationModal.value = false;
  showDeleteModal.value = false;
  editingOrganization.value = null;
  organizationToDelete.value = null;
};

const handleOrganizationSaved = async (data) => {
  await loadOrganizations();
  
  // Также обновляем store организаций для селектора в хедере
  if (data.action === 'created') {
    // Для новой организации добавляем её в store и автоматически выбираем
    organizationsStore.addOrganization(data.organization);
  } else {
    // Для обновления перезагружаем весь список
    await organizationsStore.loadOrganizations();
  }
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

// Utility methods for pagination and data handling
const getTotalElements = () => {
  if (organizations.value.totalElements !== undefined) {
    return organizations.value.totalElements;
  }
  if (organizations.value.content && Array.isArray(organizations.value.content)) {
    return organizations.value.content.length;
  }
  return 0;
};

const getTotalPages = () => {
  if (organizations.value.totalPages !== undefined) {
    return organizations.value.totalPages;
  }
  return 1;
};

const getCurrentPage = () => {
  if (organizations.value.number !== undefined) {
    return organizations.value.number;
  }
  return currentPage.value;
};

const shouldShowPagination = () => {
  const totalPages = getTotalPages();
  const totalElements = getTotalElements();
  return totalPages > 1 && totalElements > pageSize.value;
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

const canDeleteOrganization = (org) => {
  // Только владельцы могут удалять организации
  return org.role === 'OWNER';
};

// Lifecycle
onMounted(() => {
  loadOrganizations();
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.relative')) {
    showProfileMenu.value = false;
  }
});
</script> 