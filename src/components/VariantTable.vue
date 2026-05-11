<template>
  <div>
    <div v-if="!canViewVariants" class="text-center py-6 text-danger body-s font-semibold">
      Нет доступа к вариациям
    </div>
    <div v-else>
      <div v-if="loading" class="flex items-center gap-2 text-ink-3 py-2 px-2">
        <svg class="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" style="color: var(--accent);">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <span class="body-s">Загрузка вариаций...</span>
      </div>
      <div v-else-if="error" class="text-danger body-s py-2 px-2">{{ error }}</div>
      <div v-else>
        <table class="w-full table-fixed" style="margin:0;">
          <thead>
            <tr class="border-b border-line">
              <th class="px-2 py-1 text-left overline w-1/4">SKU</th>
              <th class="px-2 py-1 text-left overline w-1/4">Штрихкод</th>
              <th class="px-2 py-1 text-left overline w-20">Цена</th>
              <th class="px-2 py-1 text-left overline w-20">Валюта</th>
              <th class="px-2 py-1 text-center overline w-20">Наличие</th>
              <th class="px-2 py-1 text-center overline w-16">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="variants.length === 0">
              <td colspan="6" class="text-center body-s text-ink-3 py-2">Нет вариаций</td>
            </tr>
            <tr v-for="variant in variants" :key="variant.id" class="border-b border-line-2 hover:bg-surface-3 transition-colors" @click="canManageVariants && !variant.isEditing ? startEditVariant(variant) : null" :class="{ 'cursor-pointer': canManageVariants && !variant.isEditing }">
              <td class="px-2 py-1">
                <div class="relative group">
                  <input v-model="variant.editSku" @input="onVariantEdit(variant)" :readonly="!variant.isEditing || !canManageVariants" class="w-full bg-transparent border-none focus:ring-0 p-0 m-0 truncate body-s text-ink mono" />
                  <div v-if="!variant.isEditing && variant.editSku && variant.editSku.length > 35" class="absolute z-50 opacity-0 group-hover:opacity-100 transition-opacity bottom-full left-0 mb-1 px-2 py-1.5 bg-ink/80 text-[var(--ink-on-dark)] text-xs rounded-[var(--r-2)] whitespace-normal w-max max-w-xs pointer-events-none">
                    {{ variant.editSku }}
                  </div>
                </div>
              </td>
              <td class="px-2 py-1">
                <div class="relative group">
                  <input v-model="variant.editBarcode" @input="onVariantEdit(variant)" :readonly="!variant.isEditing || !canManageVariants" class="w-full bg-transparent border-none focus:ring-0 p-0 m-0 truncate body-s text-ink-2 mono" />
                  <div v-if="!variant.isEditing && variant.editBarcode && variant.editBarcode.length > 35" class="absolute z-50 opacity-0 group-hover:opacity-100 transition-opacity bottom-full left-0 mb-1 px-2 py-1.5 bg-ink/80 text-[var(--ink-on-dark)] text-xs rounded-[var(--r-2)] whitespace-normal w-max max-w-xs pointer-events-none">
                    {{ variant.editBarcode }}
                  </div>
                </div>
              </td>
              <td class="px-2 py-1">
                <input v-model.number="variant.editPrice" @input="onVariantEdit(variant)" :readonly="!variant.isEditing || !canManageVariants" type="number" min="0" step="0.01" class="w-full bg-transparent border-none focus:ring-0 p-0 m-0 body-s text-ink mono" />
              </td>
              <td class="px-2 py-1">
                <select v-model="variant.editCurrency" @change="onVariantEdit(variant)" :disabled="!variant.isEditing || !canManageVariants" class="w-full bg-transparent border-none focus:ring-0 p-0 m-0 appearance-none body-s text-ink-2">
                  <option v-for="cur in currencies" :key="cur" :value="cur">{{ cur }}</option>
                </select>
              </td>
              <td class="px-2 py-1 text-center">
                <button
                  @click.stop="showInventoryModal(variant)"
                  class="text-success hover:text-[#1F5C46] text-xs flex items-center justify-center gap-1 mx-auto transition-colors">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Показать</span>
                </button>
              </td>
              <td class="px-2 py-1 text-center">
                <div class="flex items-center justify-center gap-1">
                  <button v-if="variant.isEditing && canManageVariants && variant.isChanged" @click.stop="saveVariantEdit(variant)" class="text-accent hover:text-[var(--accent-hover)] transition-colors text-xs flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M7 3v4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <rect x="9" y="14" width="6" height="4" rx="1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button v-else-if="canManageVariants" @click.stop="variantToDelete = variant; showDeleteVariantModal = true" class="text-ink-3 hover:text-danger transition-colors text-xs flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr class="opacity-60 hover:opacity-100 cursor-pointer border-b border-line-2" @click="startAddVariant" v-if="!addingVariant && canManageVariants">
              <td colspan="6" class="text-center text-accent body-s py-1.5">+ Добавить вариацию</td>
            </tr>
            <tr v-if="addingVariant && canManageVariants" class="border-b border-line-2">
              <td class="px-2 py-1">
                <input v-model="newVariant.sku" maxlength="255" required class="w-full border border-line rounded-[var(--r-1)] px-1 py-0.5 body-s text-ink" placeholder="SKU" />
              </td>
              <td class="px-2 py-1">
                <input v-model="newVariant.barcode" maxlength="255" class="w-full border border-line rounded-[var(--r-1)] px-1 py-0.5 body-s text-ink" placeholder="Штрихкод" />
              </td>
              <td class="px-2 py-1">
                <input v-model.number="newVariant.price" type="number" min="0" step="0.01" required class="w-full border border-line rounded-[var(--r-1)] px-1 py-0.5 body-s text-ink" placeholder="Цена" />
              </td>
              <td class="px-2 py-1">
                <select v-model="newVariant.currency" required class="w-full border border-line rounded-[var(--r-1)] px-1 py-0.5 appearance-none body-s text-ink">
                  <option v-for="cur in currencies" :key="cur" :value="cur">{{ cur }}</option>
                </select>
              </td>
              <td class="px-2 py-1 text-center">
                <span class="text-ink-3 body-s">—</span>
              </td>
              <td class="px-2 py-1 text-right">
                <button @click="saveNewVariant" class="text-accent hover:text-[var(--accent-hover)] body-s transition-colors">Сохранить</button>
                <button @click="cancelAddVariant" class="text-ink-3 hover:text-ink-2 body-s ml-2 transition-colors">✕</button>
              </td>
            </tr>
          </tbody>
        </table>
<div v-if="totalPages > 1" class="flex items-center justify-between mt-2 px-2 py-1">
          <div class="body-s text-ink-3">
            Показано {{ page * 5 + 1 }}–{{ page * 5 + variants.length }} из {{ totalPages * 5 }}
          </div>
          <div class="flex items-center gap-1">
            <button @click="changePage(page - 1)" :disabled="page === 0" class="btn btn-secondary btn-sm disabled:opacity-40 disabled:cursor-not-allowed">Назад</button>
            <span class="body-s text-ink-2 px-1">{{ page + 1 }} из {{ totalPages }}</span>
            <button @click="changePage(page + 1)" :disabled="page >= totalPages - 1" class="btn btn-secondary btn-sm disabled:opacity-40 disabled:cursor-not-allowed">Вперед</button>
          </div>
        </div>
      </div>

<div v-if="showDeleteVariantModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-surface rounded-[var(--r-4)] max-w-md w-full mx-4" style="box-shadow: var(--shadow-3);">
          <div class="px-6 py-4 border-b border-line">
            <h3 class="h3 text-ink">Подтверждение удаления вариации</h3>
          </div>
          <div class="px-6 py-4">
            <p class="body text-ink-2">Вы уверены, что хотите удалить вариацию товара? Это действие нельзя отменить.</p>
          </div>
          <div class="flex justify-end gap-3 px-6 py-4 border-t border-line">
            <button @click="showDeleteVariantModal = false" class="btn btn-secondary">Отмена</button>
            <button @click="confirmDeleteVariant" :disabled="submitting" class="btn btn-danger disabled:opacity-50">
              {{ submitting ? 'Удаление...' : 'Удалить' }}
            </button>
          </div>
        </div>
      </div>

<div v-if="showInventoryModalVisible" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-surface rounded-[var(--r-4)] max-w-2xl w-full mx-4" style="box-shadow: var(--shadow-3);">
          <div class="px-6 py-4 border-b border-line">
            <h3 class="h3 text-ink">
              Наличие товара — <span class="mono">{{ selectedVariant?.sku || 'N/A' }}</span>
            </h3>
          </div>
          <div class="px-6 py-4">
            <div v-if="inventoryLoading" class="flex items-center justify-center gap-2 py-8">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2" style="border-color: var(--accent);"></div>
              <span class="body-s text-ink-2">Загрузка...</span>
            </div>
            <div v-else-if="inventoryError" class="text-danger body py-4">{{ inventoryError }}</div>
            <div v-else-if="inventoryData && inventoryData.length > 0">
              <div class="space-y-2">
                <div
                  v-for="item in inventoryData"
                  :key="item.pointOfStorage.id"
                  class="bg-surface-2 rounded-[var(--r-3)] p-4">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="body font-medium text-ink">{{ item.pointOfStorage.name }}</h4>
                      <p class="body-s text-ink-3">Тип: {{ item.pointOfStorage.type === 'WAREHOUSE' ? 'Склад' : 'Точка продаж' }}</p>
                      <p v-if="item.pointOfStorage.description" class="body-s text-ink-3">{{ item.pointOfStorage.description }}</p>
                    </div>
                    <div class="text-right">
                      <div class="text-lg font-semibold text-success mono">{{ item.quantity }} шт.</div>
                      <div v-if="item.reserved > 0" class="body-s text-warning mono">Зарезервировано: {{ item.reserved }} шт.</div>
                      <div class="body-s text-ink-3 mono">Доступно: {{ item.quantity - item.reserved }} шт.</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4 p-4 bg-accent-soft rounded-[var(--r-3)]">
                <div class="flex justify-between items-center mb-1">
                  <span class="body-s font-medium text-accent">Общее количество:</span>
                  <span class="body font-semibold text-accent mono">{{ inventoryData.reduce((sum, item) => sum + item.quantity, 0) }} шт.</span>
                </div>
                <div class="flex justify-between items-center mb-1">
                  <span class="body-s font-medium text-accent">Всего зарезервировано:</span>
                  <span class="body font-semibold text-warning mono">{{ inventoryData.reduce((sum, item) => sum + item.reserved, 0) }} шт.</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="body-s font-medium text-accent">Доступно к продаже:</span>
                  <span class="body font-semibold text-success mono">{{ inventoryData.reduce((sum, item) => sum + (item.quantity - item.reserved), 0) }} шт.</span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 body-s text-ink-3">Товар отсутствует на складах</div>
          </div>
          <div class="flex justify-end px-6 py-4 border-t border-line">
            <button @click="closeInventoryModal" class="btn btn-secondary">Закрыть</button>
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