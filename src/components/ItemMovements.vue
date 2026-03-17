<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <div class="flex flex-col min-h-screen transition-all duration-300" :class="isSidebarOpen ? 'ml-64' : 'ml-0'">
      <Header />
      <main class="flex-1 p-6">
        <div class="max-w-7xl mx-auto">
          <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p class="text-gray-600">Загрузка перемещений...</p>
            </div>
          </div>
          <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-red-800">{{ error }}</span>
            </div>
          </div>
          <div v-else>
            <div class="flex justify-between items-center mb-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Перемещения товаров</h3>
                <p class="text-sm text-gray-600">Всего: {{ movements?.totalElements || 0 }}</p>
              </div>
              <button
                v-if="canEdit"
                @click="openCreateModal"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Создать перемещение</span>
              </button>
            </div>
            
            <!-- Фильтры -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-md font-medium text-gray-900">Фильтры</h4>
                <div class="flex items-center space-x-3">
                  <div v-if="tableLoading" class="flex items-center text-sm text-gray-500">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Поиск...
                  </div>
                  <button
                    @click="resetFilters"
                    class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    Сбросить все
                  </button>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Откуда -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Откуда</label>
                  <WarehouseSelector
                    v-model="filters.fromPointOfStorageId"
                    placeholder="Все склады"
                    @select="applyFilters"
                    @update:modelValue="handleFromWarehouseChange"
                    :error="false"
                  />
                </div>
                
                <!-- Куда -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Куда</label>
                  <WarehouseSelector
                    v-model="filters.toPointOfStorageId"
                    placeholder="Все склады"
                    @select="applyFilters"
                    @update:modelValue="handleToWarehouseChange"
                    :error="false"
                  />
                </div>
                
                <!-- Тип перемещения -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Тип</label>
                  <select v-model="filters.type" @change="applyFilters" class="input">
                    <option value="">Все типы</option>
                    <option value="PURCHASE">Поступление</option>
                    <option value="SALE">Продажа</option>
                    <option value="TRANSFER">Перемещение</option>
                    <option value="RETURN">Возврат</option>
                    <option value="WRITE_OFF">Списание</option>
                    <option value="RESERVE">Резервирование</option>
                  </select>
                </div>
                
                <!-- Вариант товара -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Вариант товара</label>
                  <ItemVariantSelector
                    v-model="filters.itemVariantId"
                    placeholder="Все варианты"
                    @select="applyFilters"
                    @update:modelValue="handleItemVariantChange"
                    :error="false"
                  />
                </div>
                
                <!-- Дата от -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Дата от</label>
                  <input 
                    v-model="filters.from" 
                    type="datetime-local" 
                    @change="applyFilters"
                    class="input"
                  />
                </div>
                
                <!-- Дата до -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Дата до</label>
                  <input 
                    v-model="filters.to" 
                    type="datetime-local" 
                    @change="applyFilters"
                    class="input"
                  />
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm overflow-hidden relative">
              <!-- Loading overlay для таблицы -->
              <div v-if="tableLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div class="text-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p class="text-gray-600 text-sm">Загрузка данных...</p>
                </div>
              </div>
              
              <!-- Таблица данных -->
              <div v-if="movements?.content?.length" class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" @click="toggleSort">
                        <div class="flex items-center space-x-1">
                          <span>Дата</span>
                          <svg v-if="sortOrder === 'desc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                          <svg v-else-if="sortOrder === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                          </svg>
                          <svg v-else class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                        </div>
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Товар</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Откуда</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Куда</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Кол-во</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Цена</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Валюта</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Тип</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Причина</th>
                      <th v-if="canEdit" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="m in movements.content" :key="m.id">
                      <td class="px-4 py-2 whitespace-nowrap">{{ formatDate(m.created) }}</td>
                      <td class="px-4 py-2 whitespace-nowrap">{{ m.itemVariant?.sku || '-' }}</td>
                      <td class="px-4 py-2 whitespace-nowrap">{{ m.fromPointOfStorage?.name || '-' }}</td>
                      <td class="px-4 py-2 whitespace-nowrap">{{ m.toPointOfStorage?.name || '-' }}</td>
                      <td class="px-4 py-2 whitespace-nowrap">{{ m.quantity }}</td>
                      <td class="px-4 py-2 whitespace-nowrap">{{ m.pricePerItem }}</td>
                      <td class="px-4 py-2 whitespace-nowrap">{{ m.currency }}</td>
                      <td class="px-4 py-2 whitespace-nowrap">{{ getMovementTypeName(m.type) }}</td>
                      <td class="px-4 py-2 whitespace-nowrap">
                        <span v-if="m.reason" class="relative group cursor-pointer">
                          {{ m.reason.length > 5 ? m.reason.substring(0, 5) + '...' : m.reason }}
                          <span v-if="m.reason.length > 5" class="absolute left-1/2 z-50 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-pre-line shadow-lg max-w-xs break-words text-left">
                            {{ m.reason }}
                          </span>
                        </span>
                        <span v-else>-</span>
                      </td>
                      <td v-if="canEdit" class="px-4 py-2 whitespace-nowrap text-sm font-medium">
                        <div class="flex items-center space-x-2">
                          <button
                            @click="editMovement(m)"
                            class="text-blue-600 hover:text-blue-900 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            @click="deleteMovement(m.id)"
                            class="text-red-600 hover:text-red-900 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="p-6 text-gray-500 text-center">Нет перемещений</div>
            </div>
            
            <!-- Пагинация -->
            <div v-if="movements?.totalElements > 0" class="mt-6">
              <!-- Контроль размера страницы -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-700">Показать:</span>
                  <select v-model="pageSize" @change="changePageSize" class="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                  </select>
                  <span class="text-sm text-gray-700">записей</span>
                </div>
                <div class="text-sm text-gray-700">
                  Показано {{ (currentPage * pageSize) + 1 }}-{{ Math.min((currentPage + 1) * pageSize, movements.totalElements) }} из {{ movements.totalElements }}
                </div>
              </div>
              
              <!-- Навигация по страницам -->
              <div v-if="movements?.totalPages > 1" class="flex items-center justify-center space-x-2">
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 0"
                  class="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  ‹ Назад
                </button>
                
                <!-- Номера страниц -->
                <div class="flex items-center space-x-1">
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="goToPage(page - 1)"
                    :class="[
                      'px-3 py-2 text-sm border rounded-md transition-colors',
                      currentPage === page - 1 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'border-gray-300 hover:bg-gray-50'
                    ]">
                    {{ page }}
                  </button>
                </div>
                
                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage >= movements.totalPages - 1"
                  class="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Вперед ›
                </button>
              </div>
            </div>
            <!-- Модалка создания/редактирования -->
            <div v-if="showCreateModal || editModalData" class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50" @click.self="closeModal">
              <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                <h4 class="text-lg font-semibold mb-4">{{ editModalData ? 'Редактировать' : 'Создать' }} перемещение</h4>
                <form @submit.prevent="submitMovement">
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label class="block text-sm font-medium mb-1" :class="{ 'text-gray-400': !shouldShowFromField }">
                        Откуда
                        <span v-if="isFromRequired" class="text-red-500">*</span>
                      </label>
                      <div v-if="shouldShowFromField">
                        <WarehouseSelector
                          v-model="form.fromPointOfStorageId"
                          placeholder="Выберите склад откуда"
                          @select="handleFromWarehouseSelect"
                          :error="validationErrors.fromPointOfStorageId"
                          :display-data="editModalData?.fromPointOfStorage"
                          :is-edit-mode="!!editModalData"
                        />
                      </div>
                      <div v-else>
                        <input 
                          type="text" 
                          class="input bg-gray-100 text-gray-400 cursor-not-allowed" 
                          placeholder="Не требуется для данного типа операции"
                          disabled
                          readonly
                        />
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-1" :class="{ 'text-gray-400': !shouldShowToField }">
                        Куда
                        <span v-if="isToRequired" class="text-red-500">*</span>
                      </label>
                      <div v-if="shouldShowToField">
                        <WarehouseSelector
                          v-model="form.toPointOfStorageId"
                          placeholder="Выберите склад куда"
                          @select="handleToWarehouseSelect"
                          :error="validationErrors.toPointOfStorageId"
                          :display-data="editModalData?.toPointOfStorage"
                          :is-edit-mode="!!editModalData"
                        />
                      </div>
                      <div v-else>
                        <input 
                          type="text" 
                          class="input bg-gray-100 text-gray-400 cursor-not-allowed" 
                          placeholder="Не требуется для данного типа операции"
                          disabled
                          readonly
                        />
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-1">
                        Вариант товара
                        <span class="text-red-500">*</span>
                      </label>
                      <ItemVariantSelector
                        v-model="form.itemVariantId"
                        placeholder="Выберите вариант товара (поиск по SKU или штрих-коду)"
                        @select="handleVariantSelect"
                        :error="validationErrors.itemVariantId"
                        required
                        :display-data="editModalData?.itemVariant"
                        :is-edit-mode="!!editModalData"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-1">Цена за ед.</label>
                      <input v-model.number="form.pricePerItem" type="number" step="0.01" class="input" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-1">Валюта</label>
                      <select v-model="form.currency" class="input">
                        <option value="">Выберите валюту</option>
                        <option v-for="currency in currencies" :key="currency" :value="currency">
                          {{ currency }}
                        </option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-1">
                        Кол-во
                        <span class="text-red-500">*</span>
                      </label>
                      <input v-model.number="form.quantity" type="number" class="input" :class="{ 'border-red-500': validationErrors.quantity }" required />
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-1">Причина</label>
                      <input v-model="form.reason" class="input" maxlength="255" />
                      <div class="text-xs text-gray-500 mt-1 text-right">
                        {{ (form.reason || '').length }}/255
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-1">
                        Тип
                        <span class="text-red-500">*</span>
                      </label>
                      <select v-model="form.type" @change="onTypeChange" class="input" required>
                        <option value="PURCHASE">Поступление</option>
                        <option value="SALE">Продажа</option>
                        <option value="TRANSFER">Перемещение</option>
                        <option value="RETURN">Возврат</option>
                        <option value="WRITE_OFF">Списание</option>
                        <option value="RESERVE">Резервирование</option>
                      </select>
                      <div v-if="typeDescription" class="text-xs text-gray-500 mt-1">
                        {{ typeDescription }}
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-1">Дата создания</label>
                      <input 
                        v-model="form.created" 
                        type="datetime-local" 
                        class="input"
                        placeholder="Выберите дату и время"
                      />
                    </div>
                  </div>
                  <div class="flex items-center justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      @click="closeModal"
                      class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Отмена
                    </button>
                    <button
                      type="submit"
                      :disabled="loading"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                      {{ editModalData ? 'Сохранить' : 'Создать' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            <!-- Модалка подтверждения удаления -->
            <div v-if="showDeleteModal" class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50" @click.self="closeDeleteModal">
              <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <div class="flex items-center mb-4">
                  <div class="flex-shrink-0">
                    <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-lg font-medium text-gray-900">Подтверждение удаления</h3>
                    <p class="text-sm text-gray-500">Это действие нельзя отменить.</p>
                  </div>
                </div>
                
                <div class="flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    @click="closeDeleteModal"
                    class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Отмена
                  </button>
                  <button
                    type="button"
                    @click="confirmDelete"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <!-- Footer -->
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
const validationErrors = ref({}); // Для отслеживания ошибок валидации

// Состояние фильтров
const filters = ref({
  fromPointOfStorageId: '',
  toPointOfStorageId: '',
  type: '',
  itemVariantId: '',
  from: '',
  to: ''
});

const currentPage = ref(0);
const pageSize = ref(25); // По умолчанию 25 записей
const sortOrder = ref('desc'); // По умолчанию сортировка по убыванию (новые сверху)

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

// Computed properties для управления полями формы в зависимости от типа операции
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

// Computed для видимых номеров страниц
const visiblePages = computed(() => {
  if (!movements.value?.totalPages) return [];
  
  const totalPages = movements.value.totalPages;
  const current = currentPage.value + 1; // Текущая страница (1-based)
  const pages = [];
  
  if (totalPages <= 7) {
    // Если страниц мало, показываем все
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Показываем первую, последнюю и несколько вокруг текущей
    if (current <= 4) {
      // Начало: 1, 2, 3, 4, 5, ..., last
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      if (totalPages > 6) {
        pages.push('...');
        pages.push(totalPages);
      }
    } else if (current >= totalPages - 3) {
      // Конец: 1, ..., last-4, last-3, last-2, last-1, last
      pages.push(1);
      if (totalPages > 6) {
        pages.push('...');
      }
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Середина: 1, ..., current-1, current, current+1, ..., last
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

// Функция для конвертации локального времени в UTC для отправки на сервер
function convertToUTC(dateTimeString) {
  if (!dateTimeString) return null;
  try {
    const localDate = new Date(dateTimeString);
    if (isNaN(localDate.getTime())) {
      console.warn('Некорректная дата:', dateTimeString);
      return null;
    }
    // Просто возвращаем ISO строку (UTC)
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

async function loadMovements() {
  if (!organizationsStore.selectedOrganization?.id) return;
  
  // Показываем loading только для таблицы, не для всего компонента
  tableLoading.value = true;
  
  try {
    // Подготавливаем фильтры, убирая пустые значения и конвертируя даты в UTC
    const activeFilters = {};
    Object.keys(filters.value).forEach(key => {
      if (filters.value[key] && filters.value[key] !== '') {
        if (key === 'from' || key === 'to') {
          // Конвертируем даты в UTC для отправки на сервер (отнимаем 5 часов)
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
  validationErrors.value = {}; // Очищаем ошибки валидации
  resetForm();
  // Даем время селекторам сбросить свои значения
  setTimeout(() => {
    // Дополнительная очистка если нужно
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

// Функция для обработки изменения типа операции
function onTypeChange() {
  // Очищаем поля склада при смене типа
  if (!shouldShowFromField.value) {
    form.value.fromPointOfStorageId = '';
  }
  if (!shouldShowToField.value) {
    form.value.toPointOfStorageId = '';
  }
  
  // Очищаем ошибки валидации
  delete validationErrors.value.fromPointOfStorageId;
  delete validationErrors.value.toPointOfStorageId;
}

function editMovement(movement) {
  editModalData.value = movement;
  validationErrors.value = {}; // Очищаем ошибки валидации
  
  // Конвертируем UTC время в локальное для отображения в поле datetime-local
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
  
  // Открываем модальное окно - селекторы получат данные через display-data
  showCreateModal.value = true;
}

function handleFromWarehouseSelect(warehouse) {
  // Очищаем ошибку валидации для этого поля
  delete validationErrors.value.fromPointOfStorageId;
}

function handleToWarehouseSelect(warehouse) {
  // Очищаем ошибку валидации для этого поля
  delete validationErrors.value.toPointOfStorageId;
}

function handleVariantSelect(variant) {
  // Auto-fill price from variant if available
  if (variant.price) {
    form.value.pricePerItem = variant.price;
  }
  // Auto-fill currency from variant if available
  if (variant.currency) {
    form.value.currency = variant.currency;
  }
  // Очищаем ошибку валидации для этого поля
  delete validationErrors.value.itemVariantId;
}

async function submitMovement() {
  // Валидация обязательных полей
  validationErrors.value = {};
  let hasErrors = false;

  // Проверка обязательных полей
  if (!form.value.itemVariantId) {
    validationErrors.value.itemVariantId = true;
    hasErrors = true;
  }
  if (!form.value.quantity || form.value.quantity <= 0) {
    validationErrors.value.quantity = true;
    hasErrors = true;
  }

  // Проверка обязательных полей склада в зависимости от типа операции
  if (isFromRequired.value && !form.value.fromPointOfStorageId) {
    validationErrors.value.fromPointOfStorageId = true;
    hasErrors = true;
  }
  if (isToRequired.value && !form.value.toPointOfStorageId) {
    validationErrors.value.toPointOfStorageId = true;
    hasErrors = true;
  }

  // Специальная проверка для TRANSFER: from не должен равняться to
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
    return; // Не отправляем запрос если есть ошибки валидации
  }

  // Подготавливаем данные для отправки
  const submitData = {
    ...form.value,
    currency: form.value.currency || null // Передаем null если валюта не выбрана
  };

  // Очищаем поля, которые не должны быть заполнены для данного типа операции
  if (!shouldShowFromField.value) {
    submitData.fromPointOfStorageId = null;
  }
  if (!shouldShowToField.value) {
    submitData.toPointOfStorageId = null;
  }

  try {
    if (editModalData.value) {
      // При редактировании конвертируем локальное время в UTC
      if (submitData.created) {
        const utcDate = convertToUTC(submitData.created);
        if (utcDate) {
          submitData.created = utcDate;
        }
      }
      await warehouseService.updateItemMovement(editModalData.value.id, submitData);
    } else {
      // Конвертируем локальное время в UTC для отправки на сервер
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
  // Используем debounced загрузку для плавности
  debouncedLoadMovements();
}

function applyFilters() {
  currentPage.value = 0;
  // Используем debounced загрузку для плавности
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
  currentPage.value = 0; // Сбрасываем на первую страницу при изменении сортировки
  loadMovements();
}

function changePageSize() {
  currentPage.value = 0; // Сбрасываем на первую страницу при изменении размера
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
  // Используем debounced загрузку для плавности
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

// Добавить функцию для открытия модалки создания
function openCreateModal() {
  resetForm();
  editModalData.value = null;
  showCreateModal.value = true;
}

onMounted(() => {
  loadMovements();
  loadCurrencies();
});

// Watch for organization changes to reload data
watch(() => organizationsStore.selectedOrganizationId, (newVal) => {
  if (newVal) {
    // Сбрасываем пагинацию при смене организации
    currentPage.value = 0;
    // Очищаем данные без перезагрузки страницы
    movements.value = { content: [], totalElements: 0, totalPages: 0, number: 0, first: true, last: true, numberOfElements: 0 };
    loadMovements();
    loadCurrencies();
  } else {
    movements.value = { content: [], totalElements: 0, totalPages: 0, number: 0, first: true, last: true, numberOfElements: 0 };
    currencies.value = [];
  }
}, { immediate: true });
</script>

<style scoped>
.input {
  width: 100%;
  padding: 8px 10px;
  border: 1.5px solid #d1e3fa;
  border-radius: 6px;
  font-size: 1rem;
  background: #f8fbff;
  margin-bottom: 2px;
}
.input:focus {
  border-color: #007bff;
  background: #fff;
}
</style> 