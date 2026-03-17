<template>
  <div>
    <div v-if="!canViewVariants" class="text-center py-6 text-red-500 text-base font-semibold">
      Нет доступа к вариациям
    </div>
    <div v-else>
      <div v-if="loading" class="flex items-center space-x-2 text-gray-500 py-2">
        <svg class="animate-spin h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        Загрузка вариаций...
      </div>
      <div v-else-if="error" class="text-red-500 py-2">{{ error }}</div>
      <div v-else>
        <table class="min-w-full divide-y divide-gray-200" style="margin:0;">
          <thead>
            <tr>
              <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
              <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Штрихкод</th>
              <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Цена</th>
              <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Валюта</th>
              <th class="px-2 py-1 text-center text-xs font-medium text-gray-500 uppercase">Наличие</th>
              <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="variants.length === 0">
              <td colspan="6" class="text-center text-gray-400 text-xs py-1">Нет вариаций</td>
            </tr>
            <tr v-for="variant in variants" :key="variant.id" @click="canManageVariants && !variant.isEditing ? startEditVariant(variant) : null" :class="{ 'cursor-pointer': canManageVariants && !variant.isEditing }">
              <td class="px-2 py-1 text-sm">
                <input v-model="variant.editSku" @input="onVariantEdit(variant)" :readonly="!variant.isEditing || !canManageVariants" class="w-full bg-transparent border-none focus:ring-0 p-0 m-0" />
              </td>
              <td class="px-2 py-1 text-sm">
                <input v-model="variant.editBarcode" @input="onVariantEdit(variant)" :readonly="!variant.isEditing || !canManageVariants" class="w-full bg-transparent border-none focus:ring-0 p-0 m-0" />
              </td>
              <td class="px-2 py-1 text-sm">
                <input v-model.number="variant.editPrice" @input="onVariantEdit(variant)" :readonly="!variant.isEditing || !canManageVariants" type="number" min="0" step="0.01" class="w-full bg-transparent border-none focus:ring-0 p-0 m-0" />
              </td>
              <td class="px-2 py-1 text-sm">
                <select v-model="variant.editCurrency" @change="onVariantEdit(variant)" :disabled="!variant.isEditing || !canManageVariants" class="w-full bg-transparent border-none focus:ring-0 p-0 m-0 appearance-none">
                  <option v-for="cur in currencies" :key="cur" :value="cur">{{ cur }}</option>
                </select>
              </td>
              <td class="px-2 py-1 text-center">
                <button 
                  @click.stop="showInventoryModal(variant)" 
                  class="text-green-600 hover:text-green-900 text-xs flex items-center justify-center space-x-1 mx-auto">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Показать</span>
                </button>
              </td>
              <td class="px-2 py-1 text-right">
                <div class="flex items-center justify-end space-x-1">
                  <button v-if="variant.isEditing && canManageVariants && variant.isChanged" @click.stop="saveVariantEdit(variant)" class="text-blue-600 hover:text-blue-900 text-xs flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M7 3v4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <rect x="9" y="14" width="6" height="4" rx="1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button v-else-if="canManageVariants" @click.stop="variantToDelete = variant; showDeleteVariantModal = true" class="text-red-600 hover:text-red-900 transition-colors text-xs flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr class="opacity-60 hover:opacity-100 cursor-pointer" @click="startAddVariant" v-if="!addingVariant && canManageVariants">
              <td colspan="6" class="text-center text-blue-400 text-lg py-1">+ Добавить вариацию</td>
            </tr>
            <tr v-if="addingVariant && canManageVariants">
              <td class="px-2 py-1 text-sm">
                <input v-model="newVariant.sku" maxlength="255" required class="w-full border border-blue-200 rounded px-1 py-0.5" placeholder="SKU" />
              </td>
              <td class="px-2 py-1 text-sm">
                <input v-model="newVariant.barcode" maxlength="255" class="w-full border border-blue-200 rounded px-1 py-0.5" placeholder="Штрихкод" />
              </td>
              <td class="px-2 py-1 text-sm">
                <input v-model.number="newVariant.price" type="number" min="0" step="0.01" required class="w-full border border-blue-200 rounded px-1 py-0.5" placeholder="Цена" />
              </td>
              <td class="px-2 py-1 text-sm">
                <select v-model="newVariant.currency" required class="w-full border border-blue-200 rounded px-1 py-0.5 appearance-none">
                  <option v-for="cur in currencies" :key="cur" :value="cur">{{ cur }}</option>
                </select>
              </td>
              <td class="px-2 py-1 text-center">
                <span class="text-gray-400 text-xs">—</span>
              </td>
              <td class="px-2 py-1 text-right">
                <button @click="saveNewVariant" class="text-blue-600 hover:text-blue-900 text-xs">Сохранить</button>
                <button @click="cancelAddVariant" class="text-gray-400 hover:text-gray-600 text-xs ml-2">✕</button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination for variants -->
        <div v-if="totalPages > 1" class="flex items-center justify-between mt-2 px-2 py-1">
          <div class="text-xs text-gray-600">
            Показано {{ page * 5 + 1 }}-{{ page * 5 + variants.length }} из {{ totalPages * 5 }}
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="changePage(page - 1)"
              :disabled="page === 0"
              class="px-2 py-1 text-xs border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
              Назад
            </button>
            <span class="px-2 py-1 text-xs">
              {{ page + 1 }} из {{ totalPages }}
            </span>
            <button
              @click="changePage(page + 1)"
              :disabled="page >= totalPages - 1"
              class="px-2 py-1 text-xs border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
              Вперед
            </button>
          </div>
        </div>
      </div>
      <!-- Variant Delete Confirmation Modal -->
      <div v-if="showDeleteVariantModal" class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Подтверждение удаления вариации</h3>
          </div>
          <div class="px-6 py-4">
            <p class="text-gray-700 mb-4">
              Вы уверены, что хотите удалить вариацию товара?<br>Это действие нельзя отменить.
            </p>
          </div>
          <div class="flex justify-end space-x-3 px-6 py-4 border-t">
            <button @click="showDeleteVariantModal = false" class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Отмена
            </button>
            <button @click="confirmDeleteVariant" :disabled="submitting" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
              {{ submitting ? 'Удаление...' : 'Удалить' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Inventory Modal -->
      <div v-if="showInventoryModalVisible" class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">
              Наличие товара - {{ selectedVariant?.sku || 'N/A' }}
            </h3>
          </div>
          <div class="px-6 py-4">
            <div v-if="inventoryLoading" class="flex items-center justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span class="ml-2 text-gray-600">Загрузка...</span>
            </div>
            <div v-else-if="inventoryError" class="text-red-600 py-4">
              {{ inventoryError }}
            </div>
            <div v-else-if="inventoryData && inventoryData.length > 0">
              <div class="space-y-3">
                <div 
                  v-for="item in inventoryData" 
                  :key="item.pointOfStorage.id"
                  class="bg-gray-50 rounded-lg p-4">
                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="font-medium text-gray-900">{{ item.pointOfStorage.name }}</h4>
                      <p class="text-sm text-gray-600">
                        Тип: {{ item.pointOfStorage.type === 'WAREHOUSE' ? 'Склад' : 'Точка продаж' }}
                      </p>
                      <p v-if="item.pointOfStorage.description" class="text-sm text-gray-600">
                        {{ item.pointOfStorage.description }}
                      </p>
                    </div>
                    <div class="text-right">
                      <div class="text-lg font-semibold text-green-600">
                        {{ item.quantity }} шт.
                      </div>
                      <div v-if="item.reserved > 0" class="text-sm text-orange-600">
                        Зарезервировано: {{ item.reserved }} шт.
                      </div>
                      <div class="text-sm text-gray-500">
                        Доступно: {{ item.quantity - item.reserved }} шт.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                <div class="flex justify-between items-center">
                  <span class="font-medium text-blue-900">Общее количество:</span>
                  <span class="text-lg font-bold text-blue-900">
                    {{ inventoryData.reduce((sum, item) => sum + item.quantity, 0) }} шт.
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="font-medium text-blue-900">Всего зарезервировано:</span>
                  <span class="text-lg font-bold text-orange-700">
                    {{ inventoryData.reduce((sum, item) => sum + item.reserved, 0) }} шт.
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="font-medium text-blue-900">Доступно к продаже:</span>
                  <span class="text-lg font-bold text-green-700">
                    {{ inventoryData.reduce((sum, item) => sum + (item.quantity - item.reserved), 0) }} шт.
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              Товар отсутствует на складах
            </div>
          </div>
          <div class="flex justify-end px-6 py-4 border-t">
            <button @click="closeInventoryModal" class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import itemService from '@/services/itemService.js';
import { useOrganizationsStore } from '@/stores/organizations.js';

const props = defineProps({
  itemId: { type: [String, Number], required: true },
  currencies: { type: Array, required: true }
});

const organizationsStore = useOrganizationsStore();
const role = computed(() => organizationsStore.selectedOrganization?.role);
const canManageVariants = computed(() => role.value === 'ADMIN' || role.value === 'OWNER');
const canViewVariants = computed(() => ['ADMIN', 'OWNER', 'MEMBER', 'WAREHOUSE_MANAGER'].includes(role.value));

const variants = ref([]);
const loading = ref(false);
const error = ref(null);
const page = ref(0);
const totalPages = ref(1);
const addingVariant = ref(false);
const newVariant = ref({ sku: '', barcode: '', price: null, currency: null });
const showDeleteVariantModal = ref(false);
const variantToDelete = ref(null);
const submitting = ref(false);

// Inventory modal state
const showInventoryModalVisible = ref(false);
const selectedVariant = ref(null);
const inventoryData = ref([]);
const inventoryLoading = ref(false);
const inventoryError = ref(null);

async function loadVariants(pageNum = 0) {
  loading.value = true;
  error.value = null;
  try {
    const res = await itemService.getItemVariants(props.itemId, pageNum, 5);
    if (Array.isArray(res)) {
      variants.value = res;
      totalPages.value = 1;
    } else if (res && Array.isArray(res.content)) {
      variants.value = res.content;
      totalPages.value = res.totalPages || 1;
    } else {
      variants.value = [];
      totalPages.value = 1;
    }
    page.value = pageNum;
  } catch (err) {
    error.value = 'Ошибка при загрузке вариаций: ' + err.message;
  } finally {
    loading.value = false;
  }
}

function changePage(newPage) {
  if (newPage < 0 || newPage >= totalPages.value) return;
  loadVariants(newPage);
}

function startAddVariant() {
  addingVariant.value = true;
  newVariant.value = { sku: '', barcode: '', price: null, currency: props.currencies[0] || null };
}
function cancelAddVariant() {
  addingVariant.value = false;
}
async function saveNewVariant() {
  if (!newVariant.value.sku || !newVariant.value.price || !newVariant.value.currency) return;
  try {
    await itemService.createItemVariant({
      sku: newVariant.value.sku,
      barcode: newVariant.value.barcode,
      itemId: props.itemId,
      price: newVariant.value.price,
      currency: newVariant.value.currency
    });
    addingVariant.value = false;
    await loadVariants(page.value);
  } catch (err) {
    alert('Ошибка при создании вариации: ' + err.message);
  }
}
function startEditVariant(variant) {
  if (!canManageVariants.value) return;
  variant.isEditing = true;
  variant.editSku = variant.sku;
  variant.editBarcode = variant.barcode;
  variant.editPrice = variant.price;
  variant.editCurrency = variant.currency;
  variant.isChanged = false;
}
function onVariantEdit(variant) {
  if (!variant.isEditing) return;
  variant.isChanged =
    variant.editSku !== variant.sku ||
    variant.editBarcode !== variant.barcode ||
    variant.editPrice !== variant.price ||
    variant.editCurrency !== variant.currency;
}
async function saveVariantEdit(variant) {
  if (!variant.isChanged) return;
  try {
    await itemService.updateItemVariant(variant.id, {
      sku: variant.editSku,
      barcode: variant.editBarcode,
      price: variant.editPrice,
      currency: variant.editCurrency
    });
    variant.sku = variant.editSku;
    variant.barcode = variant.editBarcode;
    variant.price = variant.editPrice;
    variant.currency = variant.editCurrency;
    variant.isEditing = false;
    variant.isChanged = false;
    await loadVariants(page.value);
  } catch (err) {
    alert('Ошибка при обновлении вариации: ' + err.message);
  }
}
async function confirmDeleteVariant() {
  if (!variantToDelete.value) return;
  submitting.value = true;
  try {
    await itemService.deleteItemVariant(variantToDelete.value.id);
    await loadVariants(page.value);
    showDeleteVariantModal.value = false;
    variantToDelete.value = null;
  } catch (err) {
    alert('Ошибка при удалении вариации: ' + err.message);
  } finally {
    submitting.value = false;
  }
}

// Inventory modal functions
async function showInventoryModal(variant) {
  selectedVariant.value = variant;
  showInventoryModalVisible.value = true;
  inventoryLoading.value = true;
  inventoryError.value = null;
  inventoryData.value = [];
  
  try {
    const data = await itemService.getVariantCounts(variant.id);
    inventoryData.value = data;
  } catch (err) {
    inventoryError.value = 'Ошибка при загрузке данных о наличии: ' + err.message;
    console.error('Error loading inventory data:', err);
  } finally {
    inventoryLoading.value = false;
  }
}

function closeInventoryModal() {
  showInventoryModalVisible.value = false;
  selectedVariant.value = null;
  inventoryData.value = [];
  inventoryError.value = null;
}

watch(() => props.itemId, (newId) => {
  if (newId) loadVariants(0);
});
onMounted(() => {
  if (props.itemId) loadVariants(0);
});
watch(variants, (vars) => {
  for (const v of vars) {
    v.editSku = v.sku;
    v.editBarcode = v.barcode;
    v.editPrice = v.price;
    v.editCurrency = v.currency;
    v.isEditing = false;
    v.isChanged = false;
  }
});
</script> 