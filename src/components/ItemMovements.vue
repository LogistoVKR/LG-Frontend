<template>
  <div class="min-h-screen bg-paper">
    <Sidebar />
    <div class="flex flex-col min-h-screen transition-all duration-300" :class="isSidebarOpen ? 'ml-64' : 'ml-0'">
      <Header />
      <main class="flex-1 p-6">
        <div class="max-w-7xl mx-auto">
          <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="text-center">
              <div class="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-4" style="border-color: var(--accent);"></div>
              <p class="body-s text-ink-2">Загрузка перемещений...</p>
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
          <div v-else>
            <div class="flex justify-between items-center mb-5">
              <div>
                <h3 class="h3 text-ink">Перемещения товаров</h3>
                <p class="body-s text-ink-3 mt-0.5">Всего: {{ movements?.totalElements || 0 }}</p>
              </div>
              <button v-if="canEdit" @click="openCreateModal" class="btn btn-primary gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Создать перемещение
              </button>
            </div>

<div class="bg-surface rounded-[var(--r-3)] p-5 mb-5" style="box-shadow: var(--shadow-1);">
              <div class="flex items-center justify-between mb-4">
                <span class="h3 text-ink">Фильтры</span>
                <div class="flex items-center gap-3">
                  <div v-if="tableLoading" class="flex items-center gap-2 body-s text-ink-3">
                    <div class="animate-spin rounded-full h-3.5 w-3.5 border-b-2" style="border-color: var(--accent);"></div>
                    Поиск...
                  </div>
                  <button @click="resetFilters" class="btn btn-ghost btn-sm text-ink-3 hover:text-ink">
                    Сбросить все
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label class="caption block mb-1">Откуда</label>
                  <WarehouseSelector v-model="filters.fromPointOfStorageId" placeholder="Все склады" @select="applyFilters" @update:modelValue="handleFromWarehouseChange" :error="false" />
                </div>
                <div>
                  <label class="caption block mb-1">Куда</label>
                  <WarehouseSelector v-model="filters.toPointOfStorageId" placeholder="Все склады" @select="applyFilters" @update:modelValue="handleToWarehouseChange" :error="false" />
                </div>
                <div>
                  <label class="caption block mb-1">Тип</label>
                  <select v-model="filters.type" @change="applyFilters" class="field">
                    <option value="">Все типы</option>
                    <option value="PURCHASE">Поступление</option>
                    <option value="SALE">Продажа</option>
                    <option value="TRANSFER">Перемещение</option>
                    <option value="RETURN">Возврат</option>
                    <option value="WRITE_OFF">Списание</option>
                    <option value="RESERVE">Резервирование</option>
                  </select>
                </div>
                <div>
                  <label class="caption block mb-1">Вариант товара</label>
                  <ItemVariantSelector v-model="filters.itemVariantId" placeholder="Все варианты" @select="applyFilters" @update:modelValue="handleItemVariantChange" :error="false" />
                </div>
                <div>
                  <label class="caption block mb-1">Дата от</label>
                  <input v-model="filters.from" type="datetime-local" @change="applyFilters" class="field" />
                </div>
                <div>
                  <label class="caption block mb-1">Дата до</label>
                  <input v-model="filters.to" type="datetime-local" @change="applyFilters" class="field" />
                </div>
              </div>
            </div>

            <div class="bg-surface rounded-[var(--r-3)] overflow-hidden relative" style="box-shadow: var(--shadow-1);">
<div v-if="tableLoading" class="absolute inset-0 bg-surface/80 flex items-center justify-center z-10">
                <div class="text-center">
                  <div class="animate-spin rounded-full h-7 w-7 border-b-2 mx-auto mb-2" style="border-color: var(--accent);"></div>
                  <p class="body-s text-ink-2">Загрузка данных...</p>
                </div>
              </div>

<div v-if="movements?.content?.length" class="overflow-x-auto">
                <table class="min-w-full">
                  <thead>
                    <tr class="border-b border-line">
                      <th class="px-4 py-3 text-left overline cursor-pointer hover:bg-surface-2 transition-colors" @click="toggleSort">
                        <div class="flex items-center gap-1">
                          <span>Дата</span>
                          <svg v-if="sortOrder === 'desc'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                          <svg v-else-if="sortOrder === 'asc'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                          </svg>
                        </div>
                      </th>
                      <th class="px-4 py-3 text-left overline">Товар</th>
                      <th class="px-4 py-3 text-left overline">Откуда</th>
                      <th class="px-4 py-3 text-left overline">Куда</th>
                      <th class="px-4 py-3 text-left overline">Кол-во</th>
                      <th class="px-4 py-3 text-left overline">Цена</th>
                      <th class="px-4 py-3 text-left overline">Валюта</th>
                      <th class="px-4 py-3 text-left overline">Тип</th>
                      <th class="px-4 py-3 text-left overline">Причина</th>
                      <th v-if="canEdit" class="px-4 py-3 text-left overline">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="m in movements.content" :key="m.id" class="border-b border-line-2 hover:bg-surface-2 transition-colors">
                      <td class="px-4 py-2.5 whitespace-nowrap body-s text-ink-2 mono">{{ formatDate(m.created) }}</td>
                      <td class="px-4 py-2.5 whitespace-nowrap body-s text-ink mono">{{ m.itemVariant?.sku || '—' }}</td>
                      <td class="px-4 py-2.5 whitespace-nowrap body-s text-ink-2">{{ m.fromPointOfStorage?.name || '—' }}</td>
                      <td class="px-4 py-2.5 whitespace-nowrap body-s text-ink-2">{{ m.toPointOfStorage?.name || '—' }}</td>
                      <td class="px-4 py-2.5 whitespace-nowrap body-s text-ink mono">{{ m.quantity }}</td>
                      <td class="px-4 py-2.5 whitespace-nowrap body-s text-ink mono">{{ m.pricePerItem }}</td>
                      <td class="px-4 py-2.5 whitespace-nowrap body-s text-ink-2">{{ m.currency || '—' }}</td>
                      <td class="px-4 py-2.5 whitespace-nowrap">
                        <span :class="getMovementBadgeClass(m.type)" class="badge">{{ getMovementTypeName(m.type) }}</span>
                      </td>
                      <td class="px-4 py-2.5 whitespace-nowrap body-s text-ink-2">
                        <span v-if="m.reason" class="relative group cursor-pointer">
                          {{ m.reason.length > 5 ? m.reason.substring(0, 5) + '...' : m.reason }}
                          <span v-if="m.reason.length > 5" class="absolute left-1/2 z-50 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-ink/80 text-[var(--ink-on-dark)] text-xs rounded-[var(--r-2)] px-2 py-1 whitespace-pre-line max-w-xs break-words text-left" style="box-shadow: var(--shadow-2);">
                            {{ m.reason }}
                          </span>
                        </span>
                        <span v-else>—</span>
                      </td>
                      <td v-if="canEdit" class="px-4 py-2.5 whitespace-nowrap">
                        <div class="flex items-center gap-2">
                          <button @click="editMovement(m)" class="text-ink-3 hover:text-accent transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button @click="deleteMovement(m.id)" class="text-ink-3 hover:text-danger transition-colors">
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
              <div v-else class="p-8 body-s text-ink-3 text-center">Нет перемещений</div>
            </div>

<div v-if="movements?.totalElements > 0" class="mt-5">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <span class="body-s text-ink-2">Показать:</span>
                  <select v-model="pageSize" @change="changePageSize" class="field" style="width: auto; height: 32px; padding: 0 8px;">
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                  </select>
                  <span class="body-s text-ink-2">записей</span>
                </div>
                <div class="body-s text-ink-3">
                  Показано {{ (currentPage * pageSize) + 1 }}–{{ Math.min((currentPage + 1) * pageSize, movements.totalElements) }} из {{ movements.totalElements }}
                </div>
              </div>

              <div v-if="movements?.totalPages > 1" class="flex items-center justify-center gap-1">
                <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 0" class="btn btn-secondary btn-sm disabled:opacity-40 disabled:cursor-not-allowed">
                  ‹ Назад
                </button>
                <div class="flex items-center gap-1">
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="goToPage(page - 1)"
                    class="btn btn-sm"
                    :class="currentPage === page - 1 ? 'btn-primary' : 'btn-secondary'">
                    {{ page }}
                  </button>
                </div>
                <button @click="goToPage(currentPage + 1)" :disabled="currentPage >= movements.totalPages - 1" class="btn btn-secondary btn-sm disabled:opacity-40 disabled:cursor-not-allowed">
                  Вперед ›
                </button>
              </div>
            </div>

<div v-if="showCreateModal || editModalData" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" @click.self="closeModal">
              <div class="bg-surface rounded-[var(--r-4)] p-6 w-full max-w-lg mx-4" style="box-shadow: var(--shadow-3);">
                <h4 class="h3 text-ink mb-5">{{ editModalData ? 'Редактировать' : 'Создать' }} перемещение</h4>
                <form @submit.prevent="submitMovement">
                  <div class="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label class="caption block mb-1" :class="{ 'opacity-40': !shouldShowFromField }">
                        Откуда<span v-if="isFromRequired" class="text-danger ml-0.5">*</span>
                      </label>
                      <div v-if="shouldShowFromField">
                        <WarehouseSelector v-model="form.fromPointOfStorageId" placeholder="Выберите склад откуда" @select="handleFromWarehouseSelect" :error="validationErrors.fromPointOfStorageId" :display-data="editModalData?.fromPointOfStorage" :is-edit-mode="!!editModalData" />
                      </div>
                      <div v-else>
                        <input type="text" class="field opacity-50 cursor-not-allowed" placeholder="Не требуется для данного типа" disabled readonly />
                      </div>
                    </div>
                    <div>
                      <label class="caption block mb-1" :class="{ 'opacity-40': !shouldShowToField }">
                        Куда<span v-if="isToRequired" class="text-danger ml-0.5">*</span>
                      </label>
                      <div v-if="shouldShowToField">
                        <WarehouseSelector v-model="form.toPointOfStorageId" placeholder="Выберите склад куда" @select="handleToWarehouseSelect" :error="validationErrors.toPointOfStorageId" :display-data="editModalData?.toPointOfStorage" :is-edit-mode="!!editModalData" />
                      </div>
                      <div v-else>
                        <input type="text" class="field opacity-50 cursor-not-allowed" placeholder="Не требуется для данного типа" disabled readonly />
                      </div>
                    </div>
                    <div>
                      <label class="caption block mb-1">Вариант товара<span class="text-danger ml-0.5">*</span></label>
                      <ItemVariantSelector v-model="form.itemVariantId" placeholder="Поиск по SKU или штрих-коду" @select="handleVariantSelect" :error="validationErrors.itemVariantId" required :display-data="editModalData?.itemVariant" :is-edit-mode="!!editModalData" />
                    </div>
                    <div>
                      <label class="caption block mb-1">Цена за ед.</label>
                      <input v-model.number="form.pricePerItem" type="number" step="0.01" class="field" />
                    </div>
                    <div>
                      <label class="caption block mb-1">Валюта</label>
                      <select v-model="form.currency" class="field">
                        <option value="">Выберите валюту</option>
                        <option v-for="currency in currencies" :key="currency" :value="currency">{{ currency }}</option>
                      </select>
                    </div>
                    <div>
                      <label class="caption block mb-1">Кол-во<span class="text-danger ml-0.5">*</span></label>
                      <input v-model.number="form.quantity" type="number" class="field" :style="validationErrors.quantity ? 'border-color: var(--danger);' : ''" required />
                    </div>
                    <div>
                      <label class="caption block mb-1">Причина</label>
                      <input v-model="form.reason" class="field" maxlength="255" />
                      <div class="body-s text-ink-3 mt-1 text-right">{{ (form.reason || '').length }}/255</div>
                    </div>
                    <div>
                      <label class="caption block mb-1">Тип<span class="text-danger ml-0.5">*</span></label>
                      <select v-model="form.type" @change="onTypeChange" class="field" required>
                        <option value="PURCHASE">Поступление</option>
                        <option value="SALE">Продажа</option>
                        <option value="TRANSFER">Перемещение</option>
                        <option value="RETURN">Возврат</option>
                        <option value="WRITE_OFF">Списание</option>
                        <option value="RESERVE">Резервирование</option>
                      </select>
                      <div v-if="typeDescription" class="body-s text-ink-3 mt-1">{{ typeDescription }}</div>
                    </div>
                    <div>
                      <label class="caption block mb-1">Дата создания</label>
                      <input v-model="form.created" type="datetime-local" class="field" />
                    </div>
                  </div>
                  <div class="flex items-center justify-end gap-3 mt-4">
                    <button type="button" @click="closeModal" class="btn btn-secondary">Отмена</button>
                    <button type="submit" :disabled="loading" class="btn btn-primary disabled:opacity-50">
                      {{ editModalData ? 'Сохранить' : 'Создать' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>

<div v-if="showDeleteModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" @click.self="closeDeleteModal">
              <div class="bg-surface rounded-[var(--r-4)] p-6 w-full max-w-md mx-4" style="box-shadow: var(--shadow-3);">
                <div class="flex items-center gap-3 mb-5">
                  <div class="p-2 rounded-[var(--r-3)] bg-danger-soft shrink-0">
                    <svg class="w-5 h-5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="h3 text-ink">Подтверждение удаления</h3>
                    <p class="body-s text-ink-3">Это действие нельзя отменить.</p>
                  </div>
                </div>
                <div class="flex items-center justify-end gap-3">
                  <button type="button" @click="closeDeleteModal" class="btn btn-secondary">Отмена</button>
                  <button type="button" @click="confirmDelete" class="btn btn-danger">Удалить</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';
import Footer from './Footer.vue';
import WarehouseSelector from './WarehouseSelector.vue';
import ItemVariantSelector from './ItemVariantSelector.vue';
import warehouseService from '@/services/warehouseService.js';
import { useOrganizationsStore } from '@/stores/organizations.js';
import { useSidebar } from '@/composables/useSidebar.js';

const organizationsStore = useOrganizationsStore();
const { isSidebarOpen } = useSidebar();

const loading = ref(false);
const error = ref(null);
const movements = ref(null);
const tableLoading = ref(false);
const showCreateModal = ref(false);
const editModalData = ref(null);
const showDeleteModal = ref(false);
const deleteModalData = ref(null);
const currencies = ref([]);
const validationErrors = ref({});


const filters = ref({
  fromPointOfStorageId: '',
  toPointOfStorageId: '',
  type: '',
  itemVariantId: '',
  from: '',
  to: ''
});

const currentPage = ref(0);
const pageSize = ref(25);
const sortOrder = ref('desc');

const form = ref({
  fromPointOfStorageId: '',
  toPointOfStorageId: '',
  itemVariantId: '',
  pricePerItem: 0,
  currency: '',
  quantity: 1,
  reason: '',
  type: 'TRANSFER',
  created: '',
  organizationId: ''
});

const canEdit = computed(() => {
  const role = organizationsStore.selectedOrganization?.role;
  return role === 'ADMIN' || role === 'OWNER' || role === 'WAREHOUSE_MANAGER';
});


const shouldShowFromField = computed(() => {
  const type = form.value.type;
  return ['SALE', 'TRANSFER', 'WRITE_OFF', 'RESERVE'].includes(type);
});

const shouldShowToField = computed(() => {
  const type = form.value.type;
  return ['PURCHASE', 'TRANSFER', 'RETURN'].includes(type);
});

const isFromRequired = computed(() => {
  const type = form.value.type;
  return ['SALE', 'TRANSFER', 'WRITE_OFF', 'RESERVE'].includes(type);
});

const isToRequired = computed(() => {
  const type = form.value.type;
  return ['PURCHASE', 'TRANSFER', 'RETURN'].includes(type);
});

const typeDescription = computed(() => {
  const descriptions = {
    'PURCHASE': 'Товар поступает на склад от поставщика',
    'SALE': 'Товар уходит со склада клиенту',
    'TRANSFER': 'Перенос товара между складами',
    'RETURN': 'Возврат товара от клиента или на склад',
    'WRITE_OFF': 'Списание товара (порча, недостача)',
    'RESERVE': 'Резервирование товара под заказ'
  };
  return descriptions[form.value.type] || '';
});


const visiblePages = computed(() => {
  if (!movements.value?.totalPages) return [];

  const totalPages = movements.value.totalPages;
  const current = currentPage.value + 1;
  const pages = [];

  if (totalPages <= 7) {

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {

    if (current <= 4) {

      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      if (totalPages > 6) {
        pages.push('...');
        pages.push(totalPages);
      }
    } else if (current >= totalPages - 3) {

      pages.push(1);
      if (totalPages > 6) {
        pages.push('...');
      }
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {

      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    }
  }

  return pages.filter(page => page !== '...' || pages.indexOf(page) === pages.lastIndexOf(page));
});

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);

  const localDate = new Date(d.getTime() + (5 * 60 * 60 * 1000));

  const pad = n => n.toString().padStart(2, '0');
  return `${pad(localDate.getDate())}.${pad(localDate.getMonth() + 1)}.${localDate.getFullYear()} ${pad(localDate.getHours())}:${pad(localDate.getMinutes())}`;
}


function convertToUTC(dateTimeString) {
  if (!dateTimeString) return null;
  try {
    const localDate = new Date(dateTimeString);
    if (isNaN(localDate.getTime())) {
      console.warn('Некорректная дата:', dateTimeString);
      return null;
    }

    return localDate.toISOString().replace('Z', '');
  } catch (error) {
    console.error('Ошибка конвертации даты в UTC:', error);
    return null;
  }
}

function getMovementTypeName(type) {
  const typeNames = {
    'PURCHASE': 'Поступление',
    'SALE': 'Продажа',
    'TRANSFER': 'Перемещение',
    'RETURN': 'Возврат',
    'WRITE_OFF': 'Списание',
    'RESERVE': 'Резервирование'
  };
  return typeNames[type] || type;
}

function getMovementBadgeClass(type) {
  const badgeClasses = {
    'PURCHASE': 'badge--purchase',
    'SALE': 'badge--sale',
    'TRANSFER': 'badge--transfer',
    'RETURN': 'badge--return',
    'WRITE_OFF': 'badge--writeoff',
    'RESERVE': 'badge--reserve'
  };
  return badgeClasses[type] || 'badge--neutral';
}

async function loadMovements() {
  if (!organizationsStore.selectedOrganization?.id) return;


  tableLoading.value = true;

  try {

    const activeFilters = {};
    Object.keys(filters.value).forEach(key => {
      if (filters.value[key] && filters.value[key] !== '') {
        if (key === 'from' || key === 'to') {

          const utcDate = convertToUTC(filters.value[key]);
          if (utcDate) {
            activeFilters[key] = utcDate;
          }
        } else {
          activeFilters[key] = filters.value[key];
        }
      }
    });

    const pageable = {
      page: currentPage.value,
      size: pageSize.value,
      sort: `created,${sortOrder.value}`
    };

    const newMovements = await warehouseService.getItemMovements(
      organizationsStore.selectedOrganization.id,
      activeFilters,
      pageable
    );

    movements.value = newMovements;

  } catch (e) {
    error.value = e.message || 'Ошибка загрузки перемещений';
  } finally {
    tableLoading.value = false;
  }
}

async function loadCurrencies() {
  try {
    currencies.value = await warehouseService.getCurrencies();
  } catch (e) {
    console.error('Error loading currencies:', e);
    currencies.value = [];
  }
}

function closeModal() {
  showCreateModal.value = false;
  editModalData.value = null;
  validationErrors.value = {};
  resetForm();

  setTimeout(() => {

  }, 50);
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  deleteModalData.value = null;
}

function getCurrentLocalDateTimeString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function resetForm() {
  form.value = {
    fromPointOfStorageId: '',
    toPointOfStorageId: '',
    itemVariantId: '',
    pricePerItem: 0,
    currency: '',
    quantity: 1,
    reason: '',
    type: 'PURCHASE',
    created: getCurrentLocalDateTimeString(),
    organizationId: organizationsStore.selectedOrganization?.id || ''
  };
}


function onTypeChange() {

  if (!shouldShowFromField.value) {
    form.value.fromPointOfStorageId = '';
  }
  if (!shouldShowToField.value) {
    form.value.toPointOfStorageId = '';
  }


  delete validationErrors.value.fromPointOfStorageId;
  delete validationErrors.value.toPointOfStorageId;
}

function editMovement(movement) {
  editModalData.value = movement;
  validationErrors.value = {};


  let localCreated = '';
  if (movement.created) {
    try {
      const utcDate = new Date(movement.created);
      const localDate = new Date(utcDate.getTime() + (5 * 60 * 60 * 1000));
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, '0');
      const day = String(localDate.getDate()).padStart(2, '0');
      const hours = String(localDate.getHours()).padStart(2, '0');
      const minutes = String(localDate.getMinutes()).padStart(2, '0');
      localCreated = `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error('Ошибка конвертации даты:', error);
      localCreated = '';
    }
  }

  form.value = {
    fromPointOfStorageId: movement.fromPointOfStorage?.id || '',
    toPointOfStorageId: movement.toPointOfStorage?.id || '',
    itemVariantId: movement.itemVariant?.id || '',
    pricePerItem: movement.pricePerItem,
    currency: movement.currency || '',
    quantity: movement.quantity,
    reason: movement.reason,
    type: movement.type,
    created: localCreated,
    organizationId: organizationsStore.selectedOrganization?.id || ''
  };


  showCreateModal.value = true;
}

function handleFromWarehouseSelect(warehouse) {

  delete validationErrors.value.fromPointOfStorageId;
}

function handleToWarehouseSelect(warehouse) {

  delete validationErrors.value.toPointOfStorageId;
}

function handleVariantSelect(variant) {

  if (variant.price) {
    form.value.pricePerItem = variant.price;
  }

  if (variant.currency) {
    form.value.currency = variant.currency;
  }

  delete validationErrors.value.itemVariantId;
}

async function submitMovement() {

  validationErrors.value = {};
  let hasErrors = false;


  if (!form.value.itemVariantId) {
    validationErrors.value.itemVariantId = true;
    hasErrors = true;
  }
  if (!form.value.quantity || form.value.quantity <= 0) {
    validationErrors.value.quantity = true;
    hasErrors = true;
  }


  if (isFromRequired.value && !form.value.fromPointOfStorageId) {
    validationErrors.value.fromPointOfStorageId = true;
    hasErrors = true;
  }
  if (isToRequired.value && !form.value.toPointOfStorageId) {
    validationErrors.value.toPointOfStorageId = true;
    hasErrors = true;
  }


  if (form.value.type === 'TRANSFER' &&
      form.value.fromPointOfStorageId &&
      form.value.toPointOfStorageId &&
      form.value.fromPointOfStorageId === form.value.toPointOfStorageId) {
    validationErrors.value.fromPointOfStorageId = true;
    validationErrors.value.toPointOfStorageId = true;
    error.value = 'Нельзя перемещать товар на тот же склад';
    hasErrors = true;
  }

  if (hasErrors) {
    return;
  }


  const submitData = {
    ...form.value,
    currency: form.value.currency || null
  };


  if (!shouldShowFromField.value) {
    submitData.fromPointOfStorageId = null;
  }
  if (!shouldShowToField.value) {
    submitData.toPointOfStorageId = null;
  }

  try {
    if (editModalData.value) {

      if (submitData.created) {
        const utcDate = convertToUTC(submitData.created);
        if (utcDate) {
          submitData.created = utcDate;
        }
      }
      await warehouseService.updateItemMovement(editModalData.value.id, submitData);
    } else {

      let utcDate = null;
      if (submitData.created) {
        utcDate = convertToUTC(submitData.created);
      } else {
        utcDate = convertToUTC(getCurrentLocalDateTimeString());
      }
      await warehouseService.createItemMovement({
        ...submitData,
        created: utcDate,
        organizationId: organizationsStore.selectedOrganization.id
      });
    }
    closeModal();
    await loadMovements();
  } catch (e) {
    const errorMessage = e.message || 'Ошибка сохранения';
    if (errorMessage.includes('недостаточно остатков') ||
        errorMessage.includes('insufficient quantity') ||
        errorMessage.includes('not enough stock')) {
      error.value = 'Недостаточно товара на складе для выполнения операции';
    } else if (errorMessage.includes('negative balance') ||
               errorMessage.includes('отрицательный остаток')) {
      error.value = 'Операция приведёт к отрицательному остатку на складе';
    } else {
      error.value = errorMessage;
    }
  }
}

async function deleteMovement(id) {
  deleteModalData.value = { id: id };
  showDeleteModal.value = true;
}

async function confirmDelete() {
  try {
    await warehouseService.deleteItemMovement(deleteModalData.value.id);
    showDeleteModal.value = false;
    deleteModalData.value = null;
    await loadMovements();
  } catch (e) {
    error.value = e.message || 'Ошибка удаления';
  }
}

function resetFilters() {
  filters.value = {
    fromPointOfStorageId: '',
    toPointOfStorageId: '',
    type: '',
    itemVariantId: '',
    from: '',
    to: ''
  };
  currentPage.value = 0;

  debouncedLoadMovements();
}

function applyFilters() {
  currentPage.value = 0;

  debouncedLoadMovements();
}

function handleFromWarehouseChange(value) {
  filters.value.fromPointOfStorageId = value;
  applyFilters();
}

function handleToWarehouseChange(value) {
  filters.value.toPointOfStorageId = value;
  applyFilters();
}

function handleItemVariantChange(value) {
  filters.value.itemVariantId = value;
  applyFilters();
}

function toggleSort() {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc';
  currentPage.value = 0;
  loadMovements();
}

function changePageSize() {
  currentPage.value = 0;
  loadMovements();
}

function goToPage(page) {
  if (page >= 0 && page < movements.value.totalPages) {
    currentPage.value = page;
    loadMovements();
  }
}

function clearFilter(filterName) {
  filters.value[filterName] = '';
  currentPage.value = 0;

  debouncedLoadMovements();
}

let loadMovementsTimeout = null;
function debouncedLoadMovements() {
  if (loadMovementsTimeout) {
    clearTimeout(loadMovementsTimeout);
  }
  loadMovementsTimeout = setTimeout(() => {
    loadMovements();
  }, 300);
}


function openCreateModal() {
  resetForm();
  editModalData.value = null;
  showCreateModal.value = true;
}

onMounted(() => {
  loadMovements();
  loadCurrencies();
});


watch(() => organizationsStore.selectedOrganizationId, (newVal) => {
  if (newVal) {

    currentPage.value = 0;

    movements.value = { content: [], totalElements: 0, totalPages: 0, number: 0, first: true, last: true, numberOfElements: 0 };
    loadMovements();
    loadCurrencies();
  } else {
    movements.value = { content: [], totalElements: 0, totalPages: 0, number: 0, first: true, last: true, numberOfElements: 0 };
    currencies.value = [];
  }
}, { immediate: true });
</script>

