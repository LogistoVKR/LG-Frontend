<template>
  <div class="min-h-screen bg-paper">
    <Sidebar />
    <div class="flex flex-col min-h-screen transition-all duration-300" :class="isSidebarOpen ? 'ml-64' : 'ml-0'">
      <Header />
      <main class="flex-1 p-6">
        <div class="max-w-7xl mx-auto">
          <div>
<div v-if="!organizationsStore.loading && !organizationsStore.selectedOrganizationId" class="bg-warning-soft border border-warning rounded-[var(--r-3)] p-4 mb-5">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-warning shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span class="body-s text-warning">Выберите организацию для просмотра сотрудников</span>
              </div>
            </div>

<div v-else-if="!organizationsStore.loading">
<div class="flex justify-between items-center mb-5">
                <div>
                  <h3 class="h3 text-ink">
                    Сотрудники организации
                    <span v-if="organizationsStore.selectedOrganization" class="text-accent">"{{ organizationsStore.selectedOrganization.name }}"</span>
                  </h3>
                  <p class="body-s text-ink-3 mt-0.5">Всего: {{ getTotalElements() }}</p>
                </div>

                <button @click="showAddUserModal = true" :disabled="!organizationsStore.selectedOrganizationId" class="btn btn-primary gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Добавить пользователя
                </button>
              </div>

<div class="bg-surface rounded-[var(--r-3)] p-4 mb-5" style="box-shadow: var(--shadow-1);">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label class="caption block mb-1">Имя пользователя</label>
                    <input
                      v-model="filters.username"
                      type="text"
                      placeholder="Поиск по имени пользователя"
                      class="field"
                      @input="debouncedSearch">
                  </div>
                  <div>
                    <label class="caption block mb-1">Имя</label>
                    <input v-model="filters.firstName" type="text" placeholder="Поиск по имени" class="field" @input="debouncedSearch">
                  </div>
                  <div>
                    <label class="caption block mb-1">Фамилия</label>
                    <input v-model="filters.lastName" type="text" placeholder="Поиск по фамилии" class="field" @input="debouncedSearch">
                  </div>
                </div>
                <div class="mt-3 flex justify-end">
                  <button @click="clearFilters" class="btn btn-ghost btn-sm text-ink-3 hover:text-ink">Очистить фильтры</button>
                </div>
              </div>

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

<div v-if="usersStore.shouldShowPagination()" class="mt-5 flex items-center justify-between">
                <div class="body-s text-ink-3">
                  Показано {{ usersStore.users.content?.length || 0 }} из {{ usersStore.getTotalElements() }}
                </div>
                <div class="flex items-center gap-2">
                  <button @click="changePage(usersStore.getCurrentPage() - 1)" :disabled="usersStore.getCurrentPage() === 0" class="btn btn-secondary btn-sm disabled:opacity-40 disabled:cursor-not-allowed">Назад</button>
                  <span class="body-s text-ink-2 px-1">{{ usersStore.getCurrentPage() + 1 }} из {{ usersStore.getTotalPages() }}</span>
                  <button @click="changePage(usersStore.getCurrentPage() + 1)" :disabled="usersStore.getCurrentPage() >= usersStore.getTotalPages() - 1" class="btn btn-secondary btn-sm disabled:opacity-40 disabled:cursor-not-allowed">Вперед</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

<Footer />
    </div>

<div v-if="showAddUserModal || showEditUserModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" @click="closeModal">
      <div class="bg-surface rounded-[var(--r-4)] max-w-md w-full mx-4" style="box-shadow: var(--shadow-3);" @click.stop>
        <div class="px-6 py-4 border-b border-line">
          <h3 class="h3 text-ink">{{ showEditUserModal ? 'Изменить роль пользователя' : 'Добавить пользователя' }}</h3>
          <p v-if="showEditUserModal" class="body-s text-ink-3 mt-1">
            Пользователь: {{ usersStore.getUserFullName(userToEdit) || userToEdit?.email || 'Неизвестный пользователь' }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="px-6 py-4">
          <div class="space-y-4">
            <div v-if="!showEditUserModal">
              <label class="caption block mb-1">Поиск пользователя *</label>
              <div class="relative">
                <input v-model="searchTerm" type="text" required class="field" placeholder="Введите имя, фамилию или username" @input="searchUsersForAdd" @blur="setTimeout(() => searchResults.value = [], 200)">

                <div v-if="searchResults.length > 0" class="absolute z-10 w-full mt-1 bg-surface border border-line rounded-[var(--r-3)] max-h-60 overflow-y-auto" style="box-shadow: var(--shadow-2);">
                  <div v-for="user in searchResults" :key="user.id" @click="selectUserForAdd(user)" class="px-3 py-2 hover:bg-surface-2 cursor-pointer border-b border-line-2 last:border-b-0 transition-colors">
                    <div class="body-s font-medium text-ink">{{ user.username || user.email }}</div>
                    <div class="body-s text-ink-3">{{ user.firstName }} {{ user.lastName }}</div>
                  </div>
                </div>

                <div v-if="searching" class="absolute right-3 top-2.5">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2" style="border-color: var(--accent);"></div>
                </div>
              </div>
              <input v-model="form.userId" type="hidden" required>
            </div>

            <input v-if="showEditUserModal" v-model="form.userId" type="hidden" required>

            <div>
              <label class="caption block mb-1">Роль *</label>
              <select v-model="form.role" required class="field">
                <option value="">Выберите роль</option>
                <option value="OWNER">Владелец</option>
                <option value="ADMIN">Администратор</option>
                <option value="WAREHOUSE_MANAGER">Менеджер склада</option>
                <option value="MEMBER">Участник</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="closeModal" class="btn btn-secondary">Отмена</button>
            <button type="submit" :disabled="submitting" class="btn btn-primary disabled:opacity-50">
              {{ submitting ? 'Сохранение...' : (showEditUserModal ? 'Обновить' : 'Добавить') }}
            </button>
          </div>
        </form>
      </div>
    </div>

<div v-if="showRemoveUserModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" @click="showRemoveUserModal = false">
      <div class="bg-surface rounded-[var(--r-4)] max-w-md w-full mx-4" style="box-shadow: var(--shadow-3);" @click.stop>
        <div class="px-6 py-4 border-b border-line">
          <h3 class="h3 text-ink">Подтверждение удаления</h3>
        </div>
        <div class="px-6 py-4">
          <p class="body text-ink-2">
            Вы уверены, что хотите удалить пользователя "{{ usersStore.getUserFullName(userToRemove) || userToRemove?.username }}" из организации? Это действие нельзя отменить.
          </p>
        </div>
        <div class="flex justify-end gap-3 px-6 py-4 border-t border-line">
          <button @click="showRemoveUserModal = false; userToRemove = null" class="btn btn-secondary">Отмена</button>
          <button @click="confirmRemoveUser" :disabled="submitting" class="btn btn-danger disabled:opacity-50">
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


const tableKey = ref(0);


const filters = ref({
  username: '',
  firstName: '',
  lastName: ''
});


let searchTimeout = null;


const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    usersStore.currentPage = 0;
    tableKey.value++;
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
  tableKey.value++;
  usersStore.clearFilters();
};


const showAddUserModal = ref(false);
const showEditUserModal = ref(false);
const showRemoveUserModal = ref(false);
const submitting = ref(false);
const userToRemove = ref(null);
const userToEdit = ref(null);


const form = ref({
  userId: '',
  role: ''
});


const searchTerm = ref('');
const searchResults = ref([]);
const searching = ref(false);
let addUserSearchTimeout = null;


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
    tableKey.value++;
    showRemoveUserModal.value = false;
    userToRemove.value = null;
  } catch (err) {

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

    tableKey.value++;
    closeModal();
  } catch (err) {

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


const getTotalElements = () => {
  return usersStore.getTotalElements();
};

const canManageUsers = computed(() => {
  const role = organizationsStore.selectedOrganization?.role;
  return role === 'ADMIN' || role === 'OWNER';
});

const changePage = (page) => {
  usersStore.currentPage = page;
  tableKey.value++;
  usersStore.changePage(page);
};


onMounted(() => {
  usersStore.loadUsers();

  filters.value.username = usersStore.filters.username;
  filters.value.firstName = usersStore.filters.firstName;
  filters.value.lastName = usersStore.filters.lastName;
});
</script>