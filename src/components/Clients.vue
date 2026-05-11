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
                <h3 class="h3 text-ink">Клиенты</h3>
                <p class="body-s text-ink-3 mt-0.5">Всего: {{ getTotalElements() }}</p>
              </div>
              <button v-if="canManageClients" @click="showCreateModal = true" class="btn btn-primary gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Добавить клиента
              </button>
            </div>

<div class="bg-surface rounded-[var(--r-3)] p-4 mb-5" style="box-shadow: var(--shadow-1);">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="caption block mb-1">Имя</label>
                  <input v-model="filters.firstName" type="text" placeholder="Поиск по имени" class="field" @input="debouncedSearch">
                </div>
                <div>
                  <label class="caption block mb-1">Фамилия</label>
                  <input v-model="filters.lastName" type="text" placeholder="Поиск по фамилии" class="field" @input="debouncedSearch">
                </div>
              </div>
              <div class="flex items-center mt-3 gap-2">
                <input id="birthdayToday" type="checkbox" v-model="filters.birthdayToday" class="w-4 h-4 rounded cursor-pointer" style="accent-color: var(--accent);" @change="debouncedSearch" />
                <label for="birthdayToday" class="body-s text-ink-2 select-none cursor-pointer">День рождения сегодня</label>
              </div>
              <div class="mt-3 flex justify-end">
                <button @click="clearFilters" class="btn btn-ghost btn-sm text-ink-3 hover:text-ink">Очистить фильтры</button>
              </div>
            </div>

<ClientsData
              :key="tableKey"
              :clients="clients"
              :loading="loading"
              :error="error"
              :canManageClients="canManageClients"
              :canEditClients="canEditClients"
              @edit="editClient"
              @delete="deleteClient"
              @create="showCreateModal = true"
            />

<div v-if="shouldShowPagination()" class="mt-5 flex items-center justify-between">
              <div class="body-s text-ink-3">Показано {{ clients.content?.length || 0 }} из {{ getTotalElements() }}</div>
              <div class="flex items-center gap-2">
                <button @click="changePage(getCurrentPage() - 1)" :disabled="getCurrentPage() === 0" class="btn btn-secondary btn-sm disabled:opacity-40 disabled:cursor-not-allowed">Назад</button>
                <span class="body-s text-ink-2 px-1">{{ getCurrentPage() + 1 }} из {{ getTotalPages() }}</span>
                <button @click="changePage(getCurrentPage() + 1)" :disabled="getCurrentPage() >= getTotalPages() - 1" class="btn btn-secondary btn-sm disabled:opacity-40 disabled:cursor-not-allowed">Вперед</button>
              </div>
            </div>
          </div>
        </div>
      </main>

<Footer />
    </div>

<div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-surface rounded-[var(--r-4)] max-w-md w-full mx-4" style="box-shadow: var(--shadow-3);">
        <div class="px-6 py-4 border-b border-line">
          <h3 class="h3 text-ink">{{ showEditModal ? 'Редактировать клиента' : 'Добавить клиента' }}</h3>
        </div>
        <form @submit.prevent="handleSubmit" class="px-6 py-4">
          <div class="space-y-4">
            <div>
              <label class="caption block mb-1">Имя *</label>
              <input v-model="form.firstName" type="text" required class="field" placeholder="Введите имя клиента" maxlength="255">
            </div>
            <div>
              <label class="caption block mb-1">Фамилия</label>
              <input v-model="form.lastName" type="text" class="field" placeholder="Введите фамилию клиента" maxlength="255">
            </div>
            <div>
              <label class="caption block mb-1">Отчество</label>
              <input v-model="form.middleName" type="text" class="field" placeholder="Введите отчество клиента" maxlength="255">
            </div>
            <div>
              <label class="caption block mb-1">Дата рождения</label>
              <input v-model="form.dateOfBirth" type="date" class="field">
            </div>
            <div>
              <label class="caption block mb-1">Email</label>
              <input v-model="form.email" type="email" class="field" placeholder="Введите email клиента" maxlength="255">
            </div>
            <div>
              <label class="caption block mb-1">Телефон</label>
              <input v-model="form.phoneNumber" type="tel" class="field" placeholder="Введите телефон клиента" maxlength="15">
            </div>
            <div>
              <label class="caption block mb-1">Персональная скидка (%)</label>
              <input
                v-model.number="form.personalDiscount"
                type="number" min="0" max="100" step="0.01"
                class="field"
                :style="validationErrors.personalDiscount ? 'border-color: var(--danger);' : ''"
                placeholder="Не задана"
                @input="delete validationErrors.personalDiscount">
              <p v-if="validationErrors.personalDiscount" class="mt-1 body-s text-danger">{{ validationErrors.personalDiscount }}</p>
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

<div v-if="showDeleteModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-surface rounded-[var(--r-4)] max-w-md w-full mx-4" style="box-shadow: var(--shadow-3);">
        <div class="px-6 py-4 border-b border-line">
          <h3 class="h3 text-ink">Подтверждение удаления</h3>
        </div>
        <div class="px-6 py-4">
          <p class="body text-ink-2">
            Вы уверены, что хотите удалить клиента "{{ [clientToDelete?.firstName, clientToDelete?.middleName, clientToDelete?.lastName].filter(Boolean).join(' ') }}"? Это действие нельзя отменить.
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

const canEditClients = computed(() => {
  const role = organizationsStore.selectedOrganization?.role;
  return role === 'ADMIN' || role === 'OWNER' || role === 'WAREHOUSE_MANAGER';
});


const loading = ref(false);
const error = ref(null);
const clients = ref({ content: [], totalElements: 0, totalPages: 0, number: 0, first: true, last: true, numberOfElements: 0 });
const currentPage = ref(0);
const pageSize = ref(10);


const filters = ref({
  firstName: '',
  lastName: '',
  birthdayToday: false
});


let searchTimeout = null;


const tableKey = ref(0);


const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const submitting = ref(false);
const clientToDelete = ref(null);


const form = ref({
  firstName: '',
  lastName: '',
  middleName: '',
  dateOfBirth: '',
  email: '',
  phoneNumber: '',
  personalDiscount: null
});


const validationErrors = ref({});

function validatePersonalDiscount(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const num = Number(value);
  if (isNaN(num)) {
    return 'Введите числовое значение';
  }
  if (num < 0 || num > 100) {
    return 'Значение должно быть от 0 до 100';
  }
  const parts = String(value).split('.');
  if (parts[1] && parts[1].length > 2) {
    return 'Максимум 2 знака после запятой';
  }
  return null;
}

const showProfileMenu = ref(false);


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
  tableKey.value++;
  loadClients();
};

const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    currentPage.value = 0;
    tableKey.value++;
    loadClients();
  }, 300);
};

const clearFilters = () => {
  filters.value.firstName = '';
  filters.value.lastName = '';
  filters.value.birthdayToday = false;
  currentPage.value = 0;
  tableKey.value++;
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
    personalDiscount: client.personalDiscount ?? null,
    id: client.id
  };
  validationErrors.value = {};
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

    currentPage.value = 0;
    tableKey.value++;
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
  const discountError = validatePersonalDiscount(form.value.personalDiscount);
  if (discountError) {
    validationErrors.value.personalDiscount = discountError;
    return;
  }
  validationErrors.value = {};

  submitting.value = true;
  try {
    const orgId = organizationsStore.selectedOrganizationId;
    const token = await getToken();
    if (showEditModal.value && form.value.id) {
      await clientService.updateClient(orgId, form.value.id, form.value, token);
    } else {
      await clientService.createClient(orgId, form.value, token);
    }

    currentPage.value = 0;
    tableKey.value++;
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
    phoneNumber: '',
    personalDiscount: null
  };
  validationErrors.value = {};
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


watch(() => organizationsStore.selectedOrganizationId, (newVal) => {
  if (newVal) {
    currentPage.value = 0;
    tableKey.value++;
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