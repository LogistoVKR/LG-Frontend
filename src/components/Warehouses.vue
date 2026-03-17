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
          <!-- Warehouses Content -->
          <div>
            <!-- Action Bar -->
            <div class="flex justify-between items-center mb-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Точки хранения</h3>
                <p class="text-sm text-gray-600">Всего: {{ getTotalElements() || 0 }}</p>
              </div>
              <button
                v-if="canManageWarehouses"
                @click="showCreateModal = true"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h6v6H3V3zM15 3h6v6h-6V3zM3 15h6v6H3v-6zM15 15h6v6h-6v-6z" />
                </svg>
                <span>Добавить склад</span>
              </button>
            </div>

            <!-- Search Filters -->
            <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Название склада
                  </label>
                  <input
                    v-model="filters.name"
                    type="text"
                    placeholder="Поиск по названию"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    @input="debouncedSearch">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Расположение
                  </label>
                  <input
                    v-model="filters.location"
                    type="text"
                    placeholder="Поиск по расположению"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    @input="debouncedSearch">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Тип
                  </label>
                  <select
                    v-model="filters.type"
                    @change="debouncedSearch"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Все типы</option>
                    <option value="WAREHOUSE">Склад</option>
                    <option value="POINT_OF_SALE">Точка продаж</option>
                  </select>
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

            <!-- Warehouses Table (отдельный компонент) -->
            <WarehousesTable
              :warehouses="warehouses"
              :loading="loading"
              :error="error"
              :canManageWarehouses="canManageWarehouses"
              @edit="editWarehouse"
              @delete="deleteWarehouse"
              @create="() => showCreateModal = true"
              @change-page="changePage"
            />
          </div>
        </div>
      </main>

      <!-- Footer -->
      <Footer />
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="(showCreateModal || showEditModal) && canManageWarehouses" class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" @click.stop>
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ showEditModal ? 'Редактировать склад' : 'Добавить склад' }}
          </h3>
        </div>
        
        <form @submit.prevent="handleSubmit" class="px-6 py-4">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Название *
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                maxlength="255"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите название склада">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                v-model="form.description"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Описание склада"
                rows="2"
                maxlength="255"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Расположение
              </label>
              <input
                v-model="form.location"
                type="text"
                maxlength="255"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите адрес или описание расположения">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Тип *
              </label>
              <select
                v-model="form.type"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Выберите тип</option>
                <option value="WAREHOUSE">Склад</option>
                <option value="POINT_OF_SALE">Точка продаж</option>
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
              {{ submitting ? 'Сохранение...' : (showEditModal ? 'Обновить' : 'Создать') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal && canManageWarehouses" class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" @click.stop>
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-semibold text-gray-900">Подтверждение удаления</h3>
        </div>
        
        <div class="px-6 py-4">
          <p class="text-gray-700 mb-4">
            Вы уверены, что хотите удалить склад "{{ warehouseToDelete?.name }}"?
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
import { ref, onMounted, watch, computed } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import WarehousesTable from '@/components/WarehousesTable.vue';
import warehouseService from '@/services/warehouseService.js';
import { useOrganizationsStore } from '@/stores/organizations.js';
import { useAuth } from '@/composables/useAuth.js';
import { useSidebar } from '@/composables/useSidebar.js';

const organizationsStore = useOrganizationsStore();
const { isAdmin, isOwner, isMember, isWarehouseManager } = useAuth();
const { isSidebarOpen } = useSidebar();

const canManageWarehouses = computed(() => {
  const role = organizationsStore.selectedOrganization?.role;
  return role === 'ADMIN' || role === 'OWNER';
});

const loading = ref(false);
const error = ref(null);
const warehouses = ref({ content: [], totalElements: 0, totalPages: 0, number: 0, first: true, last: true, numberOfElements: 0 });
const currentPage = ref(0);
const pageSize = ref(10);

const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const submitting = ref(false);
const warehouseToDelete = ref(null);

const form = ref({
  name: '',
  location: '',
  type: '',
  description: '',
  id: null
});

const filters = ref({
  name: '',
  location: '',
  type: ''
});

// Debounced search
let searchTimeout = null;
const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    currentPage.value = 0;
    loadWarehouses();
  }, 300);
};

const loadWarehouses = async () => {
  loading.value = true;
  error.value = null;
  try {
    const orgId = organizationsStore.selectedOrganizationId;
    if (!orgId) {
      warehouses.value = { content: [], totalElements: 0, totalPages: 0, number: 0, first: true, last: true, numberOfElements: 0 };
      return;
    }
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      name: filters.value.name,
      location: filters.value.location,
      type: filters.value.type
    };
    const result = await warehouseService.getPointsOfStorage(orgId, params);
    
    // Обеспечиваем совместимость с разными структурами ответа
    warehouses.value = {
      content: result.content || result.data || [],
      totalElements: result.totalElements || result.page?.totalElements || 0,
      totalPages: result.totalPages || result.page?.totalPages || 1,
      number: result.number || result.page?.number || currentPage.value,
      first: result.first !== undefined ? result.first : (currentPage.value === 0),
      last: result.last !== undefined ? result.last : (currentPage.value >= (result.totalPages || 1) - 1),
      numberOfElements: result.numberOfElements || result.content?.length || 0
    };
  } catch (err) {
    error.value = 'Ошибка при загрузке точек хранения: ' + err.message;
    console.error('Error loading warehouses:', err);
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  currentPage.value = page;
  loadWarehouses();
};

const editWarehouse = (warehouse) => {
  form.value = {
    name: warehouse.name || '',
    location: warehouse.location || '',
    type: warehouse.type || '',
    description: warehouse.description || '',
    id: warehouse.id
  };
  showEditModal.value = true;
};

const deleteWarehouse = (warehouse) => {
  warehouseToDelete.value = warehouse;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!warehouseToDelete.value) return;
  submitting.value = true;
  try {
    await warehouseService.deletePointOfStorage(warehouseToDelete.value.id);
    await loadWarehouses();
    showDeleteModal.value = false;
    warehouseToDelete.value = null;
  } catch (err) {
    error.value = 'Ошибка при удалении точки хранения: ' + err.message;
    console.error('Error deleting warehouse:', err);
  } finally {
    submitting.value = false;
  }
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    const orgId = organizationsStore.selectedOrganizationId;
    const locationValue = form.value.location && form.value.location.trim() !== '' ? form.value.location : null;
    if (showEditModal.value && form.value.id) {
      // Обновление: не передавать organizationId, только name, description, location, type если есть
      const updateData = {};
      if (form.value.name && form.value.name.trim() !== '') updateData.name = form.value.name.slice(0, 255);
      if (form.value.description && form.value.description.trim() !== '') updateData.description = form.value.description.slice(0, 255);
      if (locationValue) updateData.location = locationValue.slice(0, 255);
      if (form.value.type) updateData.type = form.value.type;
      await warehouseService.updatePointOfStorage(form.value.id, updateData);
    } else {
      // Создание: передавать organizationId и все поля
      const data = {
        name: form.value.name.slice(0, 255),
        location: locationValue ? locationValue.slice(0, 255) : null,
        type: form.value.type,
        organizationId: orgId
      };
      if (form.value.description && form.value.description.trim() !== '') {
        data.description = form.value.description.slice(0, 255);
      }
      await warehouseService.createPointOfStorage(data);
    }
    await loadWarehouses();
    closeModal();
  } catch (err) {
    error.value = 'Ошибка при сохранении точки хранения: ' + err.message;
    console.error('Error saving warehouse:', err);
  } finally {
    submitting.value = false;
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  form.value = { name: '', location: '', type: '', description: '', id: null };
  warehouseToDelete.value = null;
};

const clearFilters = () => {
  filters.value = { name: '', location: '', type: '' };
  currentPage.value = 0;
  loadWarehouses();
};

// Utility methods for pagination and data handling
const getTotalElements = () => {
  if (warehouses.value.totalElements !== undefined) {
    return warehouses.value.totalElements;
  }
  if (warehouses.value.content && Array.isArray(warehouses.value.content)) {
    return warehouses.value.content.length;
  }
  return 0;
};

const getTotalPages = () => {
  if (warehouses.value.totalPages !== undefined) {
    return warehouses.value.totalPages;
  }
  return 1;
};

const getCurrentPage = () => {
  if (warehouses.value.number !== undefined) {
    return warehouses.value.number;
  }
  return currentPage.value;
};

const shouldShowPagination = () => {
  const totalPages = getTotalPages();
  const totalElements = getTotalElements();
  return totalPages > 1 && totalElements > pageSize.value;
};

watch(() => organizationsStore.selectedOrganizationId, (newVal) => {
  if (newVal) {
    currentPage.value = 0; // Сбрасываем страницу при смене организации
    loadWarehouses();
  } else {
    warehouses.value = { content: [], totalElements: 0, totalPages: 0, number: 0, first: true, last: true, numberOfElements: 0 };
  }
}, { immediate: true });

onMounted(() => {
  loadWarehouses();
});


</script> 

<style scoped>
</style> 