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
          <!-- Loading/Error/Access States handled in table -->
          <div v-if="!canViewItems" class="text-center py-12 text-red-500 text-lg font-semibold">
            Нет доступа к товарам
          </div>
          <div v-else>
            <!-- Action Bar -->
            <div class="flex justify-between items-center mb-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Товары</h3>
                <p class="text-sm text-gray-600">Всего: {{ products.totalElements || 0 }}</p>
              </div>
              <button
                v-if="canManageItems"
                @click="showCreateModal = true"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Добавить товар</span>
              </button>
            </div>

            <!-- Search Filters -->
            <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Название товара
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
                    SKU
                  </label>
                  <input
                    v-model="filters.sku"
                    type="text"
                    placeholder="Поиск по SKU"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    @input="debouncedSearch">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Штрих-код
                  </label>
                  <input
                    v-model="filters.barcode"
                    type="text"
                    placeholder="Поиск по штрих-коду"
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

            <!-- Products Table (отдельный компонент) -->
            <ProductsTable
              :products="products"
              :loading="loading"
              :error="error"
              :canManageItems="canManageItems"
              :expandedProductIds="expandedProductIds"
              :currencies="currencies"
              @edit="editProduct"
              @delete="deleteProduct"
              @create="() => showCreateModal = true"
              @change-page="changePage"
              @toggle-expand="toggleExpand"
            />
          </div>
        </div>
      </main>

      <!-- Footer -->
      <Footer />
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="(showCreateModal || showEditModal) && canManageItems" class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ showEditModal ? 'Редактировать товар' : 'Добавить товар' }}
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
                placeholder="Введите название товара">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                v-model="form.description"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Описание товара"
                rows="2"
                maxlength="255"></textarea>
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
    <div v-if="showDeleteModal && canManageItems" class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-semibold text-gray-900">Подтверждение удаления</h3>
        </div>
        <div class="px-6 py-4">
          <p class="text-gray-700 mb-4">
            Вы уверены, что хотите удалить товар "{{ productToDelete?.name }}"?
            Это действие нельзя отменить.
          </p>
        </div>
        <div class="flex justify-end space-x-3 px-6 py-4 border-t">
          <button @click="showDeleteModal = false" class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Отмена
          </button>
          <button @click="confirmDelete" :disabled="submitting" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
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
import ProductsTable from '@/components/ProductsTable.vue';
import itemService from '@/services/itemService.js';
import { useOrganizationsStore } from '@/stores/organizations.js';
import { useAuth } from '@/composables/useAuth.js';
import { useSidebar } from '@/composables/useSidebar.js';
import VariantTable from '@/components/VariantTable.vue';

const organizationsStore = useOrganizationsStore();
const { isAdmin, isOwner, isMember, isWarehouseManager } = useAuth();
const { isSidebarOpen } = useSidebar();
const canManageItems = computed(() => {
  const role = organizationsStore.selectedOrganization?.role;
  return role === 'ADMIN' || role === 'OWNER';
});
const canViewItems = computed(() => {
  const role = organizationsStore.selectedOrganization?.role;
  return role === 'ADMIN' || role === 'OWNER' || role === 'MEMBER' || role === 'WAREHOUSE_MANAGER';
});

const loading = ref(false);
const error = ref(null);
const products = ref({ content: [], totalElements: 0, totalPages: 0, number: 0, first: true, last: true, numberOfElements: 0 });
const currentPage = ref(0);
const pageSize = ref(10);

// Search filters
const filters = ref({
  name: '',
  sku: '',
  barcode: ''
});

const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const submitting = ref(false);
const productToDelete = ref(null);

const form = ref({
  name: '',
  description: '',
  id: null
});

const showProfileMenu = ref(false);

// Computed
const organizationId = computed(() => {
  return 'default-org-id'; // Заглушка, в реальном приложении получать из контекста
});

const validProducts = computed(() => (products.value.content || []).filter(p => p && p.id));

// Debounced search
let searchTimeout = null;
const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    currentPage.value = 0;
    loadProducts();
  }, 300);
};

// Methods
const loadProducts = async () => {
  loading.value = true;
  error.value = null;
  try {
    const orgId = organizationsStore.selectedOrganizationId;
    if (!orgId) {
      products.value = { content: [], totalElements: 0, totalPages: 0, number: 0, first: true, last: true, numberOfElements: 0 };
      return;
    }
    
    // Prepare search parameters
    const searchParams = {
      organizationId: orgId,
      page: currentPage.value,
      size: pageSize.value
    };
    
    if (filters.value.name.trim()) {
      searchParams.name = filters.value.name.trim();
    }
    if (filters.value.sku.trim()) {
      searchParams.sku = filters.value.sku.trim();
    }
    if (filters.value.barcode.trim()) {
      searchParams.barcode = filters.value.barcode.trim();
    }
    
    products.value = await itemService.getItems(searchParams);
    
    // Auto-expand products if searching by sku or barcode
    if ((filters.value.sku.trim() || filters.value.barcode.trim()) && products.value.content) {
      products.value.content.forEach(product => {
        if (!expandedProductIds.value.includes(product.id)) {
          expandedProductIds.value.push(product.id);
        }
      });
    }
  } catch (err) {
    error.value = 'Ошибка при загрузке товаров: ' + err.message;
    console.error('Error loading products:', err);
  } finally {
    loading.value = false;
  }
};

const clearFilters = () => {
  filters.value = {
    name: '',
    sku: '',
    barcode: ''
  };
  expandedProductIds.value = [];
  currentPage.value = 0;
  loadProducts();
};

const changePage = (page) => {
  currentPage.value = page;
  loadProducts();
};

const editProduct = (product) => {
  form.value = {
    name: product.name || '',
    description: product.description || '',
    id: product.id
  };
  showEditModal.value = true;
};

const deleteProduct = (product) => {
  productToDelete.value = product;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!productToDelete.value) return;
  submitting.value = true;
  try {
    await itemService.deleteItem(productToDelete.value.id);
    await loadProducts();
    showDeleteModal.value = false;
    productToDelete.value = null;
  } catch (err) {
    error.value = 'Ошибка при удалении товара: ' + err.message;
    console.error('Error deleting product:', err);
  } finally {
    submitting.value = false;
  }
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    const orgId = organizationsStore.selectedOrganizationId;
    if (showEditModal.value && form.value.id) {
      await itemService.updateItem(form.value.id, {
        name: form.value.name.slice(0, 255),
        description: form.value.description ? form.value.description.slice(0, 255) : ''
      });
    } else {
      await itemService.createItem({
        name: form.value.name.slice(0, 255),
        description: form.value.description ? form.value.description.slice(0, 255) : '',
        organizationId: orgId
      });
    }
    await loadProducts();
    closeModal();
  } catch (err) {
    error.value = 'Ошибка при сохранении товара: ' + err.message;
    console.error('Error saving product:', err);
  } finally {
    submitting.value = false;
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  form.value = { name: '', description: '', id: null };
  productToDelete.value = null;
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

const expandedProductIds = ref([]);
function toggleExpand(productId) {
  const idx = expandedProductIds.value.indexOf(productId);
  if (idx !== -1) {
    expandedProductIds.value.splice(idx, 1);
  } else {
    expandedProductIds.value.push(productId);
  }
}
const currencies = ref([]);

const loadCurrencies = async () => {
  try {
    currencies.value = await itemService.getCurrencies();
  } catch (err) {
    currencies.value = [];
  }
};

// Lifecycle
onMounted(() => {
  loadProducts();
  loadCurrencies();
});

watch(() => organizationsStore.selectedOrganizationId, (newVal) => {
  if (newVal) {
    loadProducts();
  } else {
    products.value = { content: [], totalElements: 0, totalPages: 0, number: 0, first: true, last: true, numberOfElements: 0 };
  }
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.relative')) {
    showProfileMenu.value = false;
  }
});
</script> 