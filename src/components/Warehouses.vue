<template>
  <div class="min-h-screen bg-paper">
    <Sidebar />
    <div class="flex flex-col min-h-screen transition-all duration-300" :class="isSidebarOpen ? 'ml-64' : 'ml-0'">
      <Header />
      <main class="flex-1 p-6">
        <div class="max-w-7xl mx-auto">
          <div>
            <div class="flex justify-between items-center mb-5">
              <div>
                <h3 class="h3 text-ink">Точки хранения</h3>
                <p class="body-s text-ink-3 mt-0.5">Всего: {{ getTotalElements() || 0 }}</p>
              </div>
              <div class="flex items-center gap-2">
                <div class="relative">
                  <button
                    v-if="canManageWarehouses"
                    @click="syncOzon"
                    :disabled="ozonSyncing"
                    class="btn btn-secondary gap-2 disabled:opacity-60"
                    title="Синхронизировать точки хранения с Ozon"
                  >
                    <svg
                      class="w-4 h-4"
                      :class="{ 'animate-spin': ozonSyncing }"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {{ ozonSyncing ? 'Синхронизация...' : 'Синх. Ozon' }}
                  </button>
                  <span
                    v-if="ozonSyncResult === 'success'"
                    class="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-success text-white text-[9px] font-bold"
                  >✓</span>
                  <span
                    v-if="ozonSyncResult === 'error'"
                    class="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-white text-[9px] font-bold"
                  >!</span>
                </div>
                <button v-if="canManageWarehouses" @click="showCreateModal = true" class="btn btn-primary gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Добавить склад
                </button>
              </div>
            </div>

<div class="bg-surface rounded-[var(--r-3)] p-4 mb-5" style="box-shadow: var(--shadow-1);">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label class="caption block mb-1">Название склада</label>
                  <input v-model="filters.name" type="text" placeholder="Поиск по названию" class="field" @input="debouncedSearch">
                </div>
                <div>
                  <label class="caption block mb-1">Расположение</label>
                  <input v-model="filters.location" type="text" placeholder="Поиск по расположению" class="field" @input="debouncedSearch">
                </div>
                <div>
                  <label class="caption block mb-1">Тип</label>
                  <select v-model="filters.type" @change="debouncedSearch" class="field">
                    <option value="">Все типы</option>
                    <option value="WAREHOUSE">Склад</option>
                    <option value="POINT_OF_SALE">Точка продаж</option>
                  </select>
                </div>
              </div>
              <div class="mt-3 flex justify-end">
                <button @click="clearFilters" class="btn btn-ghost btn-sm text-ink-3 hover:text-ink">Очистить фильтры</button>
              </div>
            </div>

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

      <Footer />
    </div>

<div v-if="(showCreateModal || showEditModal) && canManageWarehouses" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-surface rounded-[var(--r-4)] max-w-md w-full mx-4" style="box-shadow: var(--shadow-3);" @click.stop>
        <div class="px-6 py-4 border-b border-line">
          <h3 class="h3 text-ink">{{ showEditModal ? 'Редактировать склад' : 'Добавить склад' }}</h3>
        </div>
        <form @submit.prevent="handleSubmit" class="px-6 py-4">
          <div class="space-y-4">
            <div>
              <label class="caption block mb-1">Название *</label>
              <input v-model="form.name" type="text" required maxlength="255" class="field" placeholder="Введите название склада">
            </div>
            <div>
              <label class="caption block mb-1">Описание</label>
              <textarea v-model="form.description" class="field" placeholder="Описание склада" rows="2" maxlength="255" style="height: auto; padding-top: 8px; padding-bottom: 8px;"></textarea>
            </div>
            <div>
              <label class="caption block mb-1">Расположение</label>
              <input v-model="form.location" type="text" maxlength="255" class="field" placeholder="Введите адрес или описание расположения">
            </div>
            <div>
              <label class="caption block mb-1">Тип *</label>
              <select v-model="form.type" required class="field">
                <option value="">Выберите тип</option>
                <option value="WAREHOUSE">Склад</option>
                <option value="POINT_OF_SALE">Точка продаж</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="closeModal" class="btn btn-secondary">Отмена</button>
            <button type="submit" :disabled="submitting" class="btn btn-primary disabled:opacity-50">
              {{ submitting ? 'Сохранение...' : (showEditModal ? 'Обновить' : 'Создать') }}
            </button>
          </div>
        </form>
      </div>
    </div>

<div v-if="showDeleteModal && canManageWarehouses" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-surface rounded-[var(--r-4)] max-w-md w-full mx-4" style="box-shadow: var(--shadow-3);" @click.stop>
        <div class="px-6 py-4 border-b border-line">
          <h3 class="h3 text-ink">Подтверждение удаления</h3>
        </div>
        <div class="px-6 py-4">
          <p class="body text-ink-2">
            Вы уверены, что хотите удалить склад "{{ warehouseToDelete?.name }}"? Это действие нельзя отменить.
          </p>
        </div>
        <div class="flex justify-end gap-3 px-6 py-4 border-t border-line">
          <button @click="showDeleteModal = false" class="btn btn-secondary">Отмена</button>
          <button @click="confirmDelete" :disabled="submitting" class="btn btn-danger disabled:opacity-50">
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
  return role === 'ADMIN' || role === 'OWNER' || role === 'WAREHOUSE_MANAGER';
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

const ozonSyncing = ref(false);
const ozonSyncResult = ref(null);

const syncOzon = async () => {
  const orgId = organizationsStore.selectedOrganizationId;
  if (!orgId || ozonSyncing.value) return;
  ozonSyncing.value = true;
  ozonSyncResult.value = null;
  try {
    await warehouseService.syncOzonWarehouses(orgId);
    ozonSyncResult.value = 'success';
    await loadWarehouses();
  } catch (err) {
    console.error('Ozon warehouses sync error:', err);
    ozonSyncResult.value = 'error';
  } finally {
    ozonSyncing.value = false;
    setTimeout(() => { ozonSyncResult.value = null; }, 4000);
  }
};

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

      const updateData = {};
      if (form.value.name && form.value.name.trim() !== '') updateData.name = form.value.name.slice(0, 255);
      if (form.value.description && form.value.description.trim() !== '') updateData.description = form.value.description.slice(0, 255);
      if (locationValue) updateData.location = locationValue.slice(0, 255);
      if (form.value.type) updateData.type = form.value.type;
      await warehouseService.updatePointOfStorage(form.value.id, updateData);
    } else {

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
    currentPage.value = 0;
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