<template>
  <div class="min-h-screen bg-paper">
    <Sidebar />
    <div class="flex flex-col min-h-screen transition-all duration-300" :class="isSidebarOpen ? 'ml-64' : 'ml-0'">
      <Header />
      <main class="flex-1 p-6">
        <div class="max-w-7xl mx-auto">
<div class="flex justify-between items-center mb-5">
            <div>
              <h3 class="h3 text-ink">Организации</h3>
              <p class="body-s text-ink-3 mt-0.5">Всего: {{ getTotalElements() }}</p>
            </div>
            <button @click="showAddOrganizationModal = true" class="btn btn-primary gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Создать организацию
            </button>
          </div>

<div class="bg-surface rounded-[var(--r-3)] p-4 mb-5" style="box-shadow: var(--shadow-1);">
            <div>
              <label class="caption block mb-1">Название организации</label>
              <input v-model="filters.name" type="text" placeholder="Поиск по названию организации" class="field" @input="debouncedSearch">
            </div>
            <div class="mt-3 flex justify-end">
              <button @click="clearFilters" class="btn btn-ghost btn-sm text-ink-3 hover:text-ink">Очистить фильтры</button>
            </div>
          </div>

<div v-if="loading" class="flex items-center justify-center py-12">
            <div class="text-center">
              <div class="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-4" style="border-color: var(--accent);"></div>
              <p class="body-s text-ink-2">Загрузка организаций...</p>
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
            <div v-if="organizations.content && organizations.content.length > 0" class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b border-line">
                    <th class="px-5 py-3 text-left overline">Название</th>
                    <th class="px-5 py-3 text-left overline">Описание</th>
                    <th class="px-5 py-3 text-left overline">Роль</th>
                    <th class="px-5 py-3 text-left overline">Интеграция Ozon</th>
                    <th class="px-5 py-3 text-left overline">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="org in organizations.content" :key="org.id" class="border-b border-line-2 hover:bg-surface-2 transition-colors">
                    <td class="px-5 py-3 whitespace-nowrap">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-accent-soft rounded-[var(--r-2)] flex items-center justify-center text-accent font-semibold body-s shrink-0">
                          {{ org.name.charAt(0).toUpperCase() }}
                        </div>
                        <div class="body-s font-medium text-ink">{{ org.name }}</div>
                      </div>
                    </td>
                    <td class="px-5 py-3 whitespace-nowrap body-s text-ink-2">{{ org.description || '—' }}</td>
                    <td class="px-5 py-3 whitespace-nowrap">
                      <span class="badge" :class="getRoleBadgeClass(org.role)">{{ getRoleDisplayName(org.role) }}</span>
                    </td>
                    <td class="px-5 py-3 whitespace-nowrap">
                      <span class="badge" :class="org.hasOzonIntegration ? 'badge--purchase' : 'badge--neutral'">
                        {{ org.hasOzonIntegration ? 'Подключено' : 'Не подключено' }}
                      </span>
                    </td>
                    <td class="px-5 py-3 whitespace-nowrap">
                      <div class="flex items-center gap-2">
                        <button @click="editOrganization(org)" class="text-ink-3 hover:text-accent transition-colors">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button v-if="canDeleteOrganization(org)" @click="deleteOrganization(org)" class="text-ink-3 hover:text-danger transition-colors">
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p class="body-s text-ink-3 mb-4">Организации не найдены</p>
              <button @click="showAddOrganizationModal = true" class="btn btn-primary">Создать первую организацию</button>
            </div>
          </div>

<div v-if="!loading && !error && shouldShowPagination()" class="mt-5 flex items-center justify-between">
            <div class="body-s text-ink-3">Показано {{ organizations.numberOfElements || organizations.content?.length || 0 }} из {{ getTotalElements() }}</div>
            <div class="flex items-center gap-2">
              <button @click="changePage(getCurrentPage() - 1)" :disabled="getCurrentPage() === 0" class="btn btn-secondary btn-sm disabled:opacity-40 disabled:cursor-not-allowed">Назад</button>
              <span class="body-s text-ink-2 px-1">{{ getCurrentPage() + 1 }} из {{ getTotalPages() }}</span>
              <button @click="changePage(getCurrentPage() + 1)" :disabled="getCurrentPage() >= getTotalPages() - 1" class="btn btn-secondary btn-sm disabled:opacity-40 disabled:cursor-not-allowed">Вперед</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>

<OrganizationsModal
      :isOpen="showAddOrganizationModal || showEditOrganizationModal"
      @close="closeModal"
      @organizationSaved="handleOrganizationSaved"
      :editingOrganization="editingOrganization"
    />

<div v-if="showDeleteModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-surface rounded-[var(--r-4)] max-w-md w-full mx-4" style="box-shadow: var(--shadow-3);" @click.stop>
        <div class="px-6 py-4 border-b border-line">
          <h3 class="h3 text-ink">Подтверждение удаления</h3>
        </div>
        <div class="px-6 py-4">
          <p class="body text-ink-2">Вы уверены, что хотите удалить организацию "{{ organizationToDelete?.name }}"? Это действие нельзя отменить.</p>
        </div>
        <div class="flex justify-end gap-3 px-6 py-4 border-t border-line">
          <button @click="showDeleteModal = false; organizationToDelete = null" class="btn btn-secondary">Отмена</button>
          <button @click="confirmDelete" :disabled="submitting" class="btn btn-danger disabled:opacity-50">
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


const loading = ref(false);
const error = ref(null);
const organizations = ref({ content: [], totalElements: 0, totalPages: 0, number: 0, first: true, last: true, numberOfElements: 0 });
const currentPage = ref(0);
const pageSize = ref(10);


const filters = ref({
  name: ''
});


let searchTimeout = null;


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


    await organizationsStore.loadOrganizations();


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


  if (data.action === 'created') {

    organizationsStore.addOrganization(data.organization);
  } else {

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
    'OWNER': 'badge--purchase',
    'ADMIN': 'badge--writeoff',
    'WAREHOUSE_MANAGER': 'badge--transfer',
    'MEMBER': 'badge--neutral'
  };
  return classes[role] || 'badge--neutral';
};

const canDeleteOrganization = (org) => {

  return org.role === 'OWNER';
};


onMounted(() => {
  loadOrganizations();
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.relative')) {
    showProfileMenu.value = false;
  }
});
</script>