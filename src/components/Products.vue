<template>
  <div class="min-h-screen bg-paper">
    <Sidebar />
    <div class="flex flex-col min-h-screen transition-all duration-300" :class="isSidebarOpen ? 'ml-64' : 'ml-0'">
      <Header />
      <main class="flex-1 p-6">
        <div class="max-w-7xl mx-auto">
          <div v-if="!canViewItems" class="text-center py-12 text-danger body">
            Нет доступа к товарам
          </div>
          <div v-else>
<div class="flex justify-between items-center mb-5">
              <div>
                <h3 class="h3 text-ink">Товары</h3>
                <p class="body-s text-ink-3 mt-0.5">Всего: {{ products.totalElements || 0 }}</p>
              </div>
              <div class="flex items-center gap-2">
                <div class="relative">
                  <button
                    v-if="canManageItems"
                    @click="syncOzon"
                    :disabled="ozonSyncing"
                    class="btn btn-secondary gap-2 disabled:opacity-60"
                    title="Синхронизировать товары с Ozon"
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
                <button v-if="canManageItems" @click="showCreateModal = true" class="btn btn-primary gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Добавить товар
                </button>
              </div>
            </div>

<div class="bg-surface rounded-[var(--r-3)] p-4 mb-5" style="box-shadow: var(--shadow-1);">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label class="caption block mb-1">Название товара</label>
                  <input v-model="filters.name" type="text" placeholder="Поиск по названию" class="field" @input="debouncedSearch">
                </div>
                <div>
                  <label class="caption block mb-1">SKU</label>
                  <input v-model="filters.sku" type="text" placeholder="Поиск по SKU" class="field" @input="debouncedSearch">
                </div>
                <div>
                  <label class="caption block mb-1">Штрих-код</label>
                  <input v-model="filters.barcode" type="text" placeholder="Поиск по штрих-коду" class="field" @input="debouncedSearch">
                </div>
              </div>
              <div class="mt-3 flex justify-end">
                <button @click="clearFilters" class="btn btn-ghost btn-sm text-ink-3 hover:text-ink">
                  Очистить фильтры
                </button>
              </div>
            </div>

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
      <Footer />
    </div>

<div v-if="(showCreateModal || showEditModal) && canManageItems" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-surface rounded-[var(--r-4)] max-w-md w-full mx-4" style="box-shadow: var(--shadow-3);">
        <div class="px-6 py-4 border-b border-line">
          <h3 class="h3 text-ink">{{ showEditModal ? 'Редактировать товар' : 'Добавить товар' }}</h3>
        </div>
        <form @submit.prevent="handleSubmit" class="px-6 py-4">
          <div class="space-y-4">
            <div>
              <label class="caption block mb-1">Название *</label>
              <input v-model="form.name" type="text" required maxlength="255" class="field" placeholder="Введите название товара">
            </div>
            <div>
              <label class="caption block mb-1">Описание</label>
              <textarea v-model="form.description" class="field" placeholder="Описание товара" rows="2" maxlength="255" style="height: auto; padding-top: 8px; padding-bottom: 8px;"></textarea>
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

<div v-if="showDeleteModal && canManageItems" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-surface rounded-[var(--r-4)] max-w-md w-full mx-4" style="box-shadow: var(--shadow-3);">
        <div class="px-6 py-4 border-b border-line">
          <h3 class="h3 text-ink">Подтверждение удаления</h3>
        </div>
        <div class="px-6 py-4">
          <p class="body text-ink-2">
            Вы уверены, что хотите удалить товар "{{ productToDelete?.name }}"? Это действие нельзя отменить.
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
import { useRoute } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import ProductsTable from '@/components/ProductsTable.vue';
import itemService from '@/services/itemService.js';
import warehouseService from '@/services/warehouseService.js';
import { useOrganizationsStore } from '@/stores/organizations.js';
import { useAuth } from '@/composables/useAuth.js';
import { useSidebar } from '@/composables/useSidebar.js';
import VariantTable from '@/components/VariantTable.vue';

const organizationsStore = useOrganizationsStore();
const { isAdmin, isOwner, isMember, isWarehouseManager } = useAuth();
const { isSidebarOpen } = useSidebar();
const route = useRoute();
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


const filters = ref({
  name: '',
  sku: '',
  barcode: ''
});

const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const submitting = ref(false);

const ozonSyncing = ref(false);
const ozonSyncResult = ref(null);

const syncOzon = async () => {
  const orgId = organizationsStore.selectedOrganizationId;
  if (!orgId || ozonSyncing.value) return;
  ozonSyncing.value = true;
  ozonSyncResult.value = null;
  try {
    await warehouseService.syncOzon(orgId);
    ozonSyncResult.value = 'success';
    await loadProducts();
  } catch (err) {
    console.error('Ozon sync error:', err);
    ozonSyncResult.value = 'error';
  } finally {
    ozonSyncing.value = false;
    setTimeout(() => { ozonSyncResult.value = null; }, 4000);
  }
};
const productToDelete = ref(null);

const form = ref({
  name: '',
  description: '',
  id: null
});

const showProfileMenu = ref(false);


const organizationId = computed(() => {
  return 'default-org-id';
});

const validProducts = computed(() => (products.value.content || []).filter(p => p && p.id));


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


const loadProducts = async () => {
  loading.value = true;
  error.value = null;
  try {
    const orgId = organizationsStore.selectedOrganizationId;
    if (!orgId) {
      products.value = { content: [], totalElements: 0, totalPages: 0, number: 0, first: true, last: true, numberOfElements: 0 };
      return;
    }


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


onMounted(() => {
  if (route.query.sku) {
    filters.value.sku = route.query.sku;
  }
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