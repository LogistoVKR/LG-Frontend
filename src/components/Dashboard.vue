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
          <!-- Default Dashboard Content -->
          <div>
            <!-- Welcome Section -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Добро пожаловать, {{ username }}!</h3>
              <p class="text-gray-600">Выберите раздел в боковом меню для начала работы с системой.</p>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex items-center">
                  <div class="p-3 rounded-full bg-gray-100 text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Товары</p>
                    <p class="text-2xl font-semibold text-gray-900">{{ loadingCounts ? '...' : itemCount }}</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex items-center">
                  <div class="p-3 rounded-full bg-gray-100 text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h6v6H3V3zM15 3h6v6h-6V3zM3 15h6v6H3v-6zM15 15h6v6h-6v-6z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Склады</p>
                    <p class="text-2xl font-semibold text-gray-900">{{ loadingCounts ? '...' : warehouseCount }}</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex items-center">
                  <div class="p-3 rounded-full bg-gray-100 text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Сотрудники</p>
                    <p class="text-2xl font-semibold text-gray-900">{{ loadingCounts ? '...' : userCount }}</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex items-center">
                  <div class="p-3 rounded-full bg-gray-100 text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Клиенты</p>
                    <p class="text-2xl font-semibold text-gray-900">{{ loadingCounts ? '...' : clientCount }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Последние действия</h3>
              <div class="text-center py-8 text-gray-500">
                <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>Нет последних действий</p>
              </div>
            </div>
          </div>
        </div>
      </main>



      <!-- Create/Edit Organization Form Modal -->
      <div v-if="showCreateForm" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" @click="closeCreateForm">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md" @click.stop>
          <div class="flex items-center justify-between p-6 border-b">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ editingOrganization ? 'Редактировать' : 'Создать' }} организацию
            </h3>
            <button
              @click="closeCreateForm"
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="saveOrganization" class="p-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Название *</label>
                <input
                  v-model="organizationForm.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                  v-model="organizationForm.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
                <input
                  v-model="organizationForm.address"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  v-model="organizationForm.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                <input
                  v-model="organizationForm.phone"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
            </div>
            
            <div class="flex items-center justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="closeCreateForm"
                class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Отмена
              </button>
              <button
                type="submit"
                :disabled="savingOrganization"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {{ savingOrganization ? 'Сохранение...' : (editingOrganization ? 'Сохранить' : 'Создать') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Footer -->
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAuth } from '@/composables/useAuth.js';
import { useOrganizationsStore } from '@/stores/organizations.js';
import { useSidebar } from '@/composables/useSidebar.js';
import warehouseService from '@/services/warehouseService.js';
import userService from '@/services/userService.js';
import Sidebar from '@/components/Sidebar.vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

const { username, getToken } = useAuth();
const organizationsStore = useOrganizationsStore();
const { isSidebarOpen } = useSidebar();

const showCreateForm = ref(false);

const itemCount = ref(0);
const warehouseCount = ref(0);
const userCount = ref(0);
const clientCount = ref(0);
const loadingCounts = ref(false);

async function fetchCounts() {
  if (!organizationsStore.selectedOrganizationId) return;
  loadingCounts.value = true;
  try {
    const token = await getToken();
    const [warehouseData, userData] = await Promise.all([
      warehouseService.getItemVariantPointOfStorageCount(organizationsStore.selectedOrganizationId),
      userService.getOrganizationCounts(organizationsStore.selectedOrganizationId, token)
    ]);
    itemCount.value = warehouseData.itemVariants ?? 0;
    warehouseCount.value = warehouseData.pointsOfStorage ?? 0;
    userCount.value = userData.users ?? 0;
    clientCount.value = userData.clients ?? 0;
  } catch (e) {
    itemCount.value = 0;
    warehouseCount.value = 0;
    userCount.value = 0;
    clientCount.value = 0;
  } finally {
    loadingCounts.value = false;
  }
}

onMounted(() => {
  // Не вызываем fetchCounts здесь
});

watch(
  () => organizationsStore.selectedOrganizationId,
  (newVal) => {
    if (newVal) fetchCounts();
  },
  { immediate: true }
);
</script> 