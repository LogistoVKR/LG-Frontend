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
              <p class="text-gray-600">Загрузка данных...</p>
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
                <h3 class="text-lg font-semibold text-gray-900">Аналитика перемещений</h3>
                <p class="text-sm text-gray-600">Всего перемещений: {{ movements?.totalElements || 0 }}</p>
              </div>
            </div>

                        <!-- Фильтры -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div class="flex items-center justify-between mb-4">
                <h4 class="text-md font-medium text-gray-900">Фильтры</h4>
                <div class="flex items-center space-x-3">
                  <div v-if="chartsLoading" class="flex items-center text-sm text-gray-500">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Загрузка...
                  </div>
                  <button
                    @click="resetFilters"
                    class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    Сбросить все
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              </div>
              </div>

                        <!-- Статистика -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 relative">
              <!-- Loading overlay для статистики -->
              <div v-if="chartsLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                <div class="text-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p class="text-gray-600 text-sm">Обновление данных...</p>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    </div>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-500">Поступления</p>
                    <p class="text-lg font-semibold text-gray-900">{{ statistics.PURCHASE || 0 }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    </div>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-500">Продажи</p>
                    <p class="text-lg font-semibold text-gray-900">{{ statistics.SALE || 0 }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    </div>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-500">Перемещения</p>
                    <p class="text-lg font-semibold text-gray-900">{{ statistics.TRANSFER || 0 }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    </div>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-500">Списания</p>
                    <p class="text-lg font-semibold text-gray-900">{{ statistics.WRITE_OFF || 0 }}</p>
                  </div>
                </div>
              </div>
            </div>

                        <!-- Графики -->
            <div class="space-y-6">
              <!-- Первый ряд: круговая диаграмма и сумма закупа -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Круговая диаграмма - распределение по типам -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">Распределение по типам операций</h4>
                  <div class="relative h-80">
                    <div v-if="chartsLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <canvas ref="pieChartRef"></canvas>
                          </div>
                </div>
                
                <!-- Сумма закупа -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">Сумма закупа</h4>
                  <div class="h-80 flex flex-col justify-center">
                    <div v-if="chartsLoading" class="flex items-center justify-center">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <div v-else-if="Object.keys(purchaseSpending).length === 0" class="text-center text-gray-500">
                      <div class="text-2xl mb-2">📊</div>
                      <p>Нет данных о закупах</p>
                    </div>
                    <div v-else-if="Object.keys(purchaseSpending).length === 1" class="text-center">
                      <!-- Одна валюта - показываем как раньше -->
                      <div v-for="(data, currency) in purchaseSpending" :key="currency" class="mb-6">
                        <div class="text-4xl font-bold text-blue-600 mb-2">
                          {{ formatCurrency(data.total, getCurrencySymbol(currency)) }}
                        </div>
                        <p class="text-gray-600">Общая сумма поступлений</p>
                      </div>
                      
                      <div v-for="(data, currency) in purchaseSpending" :key="currency + '_avg'" class="bg-blue-50 rounded-lg p-6 max-w-xs mx-auto">
                        <div class="text-2xl font-semibold text-blue-700">
                          {{ formatCurrency(data.average, getCurrencySymbol(currency)) }}
                        </div>
                        <p class="text-sm text-blue-600">Средняя стоимость операции</p>
                      </div>
                    </div>
                    <div v-else class="space-y-3 max-h-72 overflow-y-auto">
                      <!-- Несколько валют - показываем список -->
                      <div v-for="(data, currency) in purchaseSpending" :key="currency" class="bg-blue-50 rounded-lg p-4">
                        <div class="flex justify-between items-center mb-2">
                          <span class="text-sm font-medium text-blue-800">{{ currency === 'Не указана' ? 'Без валюты' : currency }}</span>
                          <span class="text-xs text-blue-600">{{ data.count }} операций</span>
                        </div>
                        <div class="text-xl font-bold text-blue-700 mb-1">
                          {{ formatCurrency(data.total, getCurrencySymbol(currency)) }}
                        </div>
                        <div class="text-sm text-blue-600">
                          Средняя: {{ formatCurrency(data.average, getCurrencySymbol(currency)) }}
                        </div>
                </div>
              </div>
            </div>
          </div>
        </div>

              <!-- Второй ряд: график продаж на всю ширину -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h4 class="text-lg font-semibold text-gray-900 mb-2 md:mb-0">
                    Динамика продаж
                    <span v-if="selectedSalesItem" class="text-base font-normal text-gray-600">
                      - {{ selectedSalesItem.sku }}
                    </span>
                  </h4>
                  
                  <!-- Фильтр товара для графика -->
                  <div class="w-full md:w-80 flex items-center space-x-2">
                    <div class="flex-1">
                      <ItemVariantSelector
                        v-model="filters.salesChartItemId"
                        placeholder="Выберите товар для анализа"
                        @select="handleSalesItemChange"
                        @update:modelValue="handleSalesItemModelChange"
                        :error="false"
                        :key="salesSelectorKey"
                      />
                    </div>
                    <button
                      v-if="filters.salesChartItemId || selectedSalesItem"
                      @click="clearSalesItemFilter"
                      class="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Очистить фильтр">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div class="relative h-96">
                  <div v-if="chartsLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                    <div class="text-center">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                      <p class="text-gray-600 text-sm">Загрузка графика продаж...</p>
                    </div>
                  </div>
                  <canvas ref="salesChartRef"></canvas>
                </div>
              </div>

              <!-- Третий ряд: популярные товары на всю ширину -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Популярные товары</h4>
                <div class="relative">
                  <div v-if="chartsLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                    <div class="text-center">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                      <p class="text-gray-600 text-sm">Загрузка популярных товаров...</p>
                    </div>
                  </div>
                  
                  <div v-if="topProducts.length === 0" class="text-center text-gray-500 py-12">
                    <div class="text-3xl mb-4">📊</div>
                    <p class="text-lg">Нет данных о товарах</p>
                  </div>
                  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <div v-for="product in topProducts" :key="product.sku" 
                         class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors relative group cursor-pointer">
                      
                      <!-- Заголовок товара -->
                      <div class="mb-4">
                        <div class="font-medium text-gray-900 text-base mb-2">{{ product.sku }}</div>
                        <div class="flex flex-wrap gap-1 mb-2">
                          <span v-if="product.currencies.length === 0" 
                                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Без валюты
                          </span>
                          <span v-else v-for="currency in product.currencies" :key="currency"
                                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {{ currency }}
                          </span>
                        </div>
                      </div>
                      
                      <!-- Данные о количестве -->
                      <div class="space-y-3 text-sm">
                        <div class="flex justify-between items-center bg-blue-50 rounded p-3">
                          <span class="text-blue-600 font-medium">Закуплено:</span>
                          <span class="font-semibold text-blue-700">{{ product.purchaseQuantity }} шт</span>
                        </div>
                        
                        <div class="flex justify-between items-center bg-green-50 rounded p-3">
                          <span class="text-green-600 font-medium">Продано:</span>
                          <span class="font-semibold text-green-700">{{ product.saleQuantity }} шт</span>
                        </div>
    </div>

                      <!-- Tooltip при наведении -->
                      <div class="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 max-w-sm w-80 z-50 shadow-lg">
                        <div class="space-y-3">
                          <div class="font-semibold border-b border-gray-700 pb-1">{{ product.sku }}</div>
                          
                          <div v-if="product.description" class="text-gray-300">
                            <span class="font-medium">Описание:</span> {{ product.description }}
        </div>
        
                          <div class="grid grid-cols-2 gap-3 text-xs">
                            <!-- Закупки -->
            <div>
                              <div class="text-blue-300 font-medium mb-1">Закуплено ({{ product.purchaseQuantity }} шт)</div>
                              <div v-if="Object.keys(product.purchaseByCurrency).length === 0" class="text-gray-400">
                                Нет закупок
                              </div>
                              <div v-else class="space-y-1">
                                <div v-for="(amount, currency) in product.purchaseByCurrency" :key="`purchase_${currency}`" 
                                     class="flex justify-between bg-blue-900 bg-opacity-30 rounded px-2 py-1">
                                  <span class="text-blue-200">{{ currency === 'Не указана' ? 'Без валюты' : currency }}:</span>
                                  <span class="text-blue-100 font-medium">{{ formatCurrency(amount, getCurrencySymbol(currency)) }}</span>
                                </div>
                              </div>
            </div>
            
                            <!-- Продажи -->
            <div>
                              <div class="text-green-300 font-medium mb-1">Продано ({{ product.saleQuantity }} шт)</div>
                              <div v-if="Object.keys(product.saleByCurrency).length === 0" class="text-gray-400">
                                Нет продаж
                              </div>
                              <div v-else class="space-y-1">
                                <div v-for="(amount, currency) in product.saleByCurrency" :key="`sale_${currency}`" 
                                     class="flex justify-between bg-green-900 bg-opacity-30 rounded px-2 py-1">
                                  <span class="text-green-200">{{ currency === 'Не указана' ? 'Без валюты' : currency }}:</span>
                                  <span class="text-green-100 font-medium">{{ formatCurrency(amount, getCurrencySymbol(currency)) }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div v-if="product.lastMovementDate" class="text-gray-400 text-xs border-t border-gray-700 pt-2">
                            Последнее движение: {{ formatDate(product.lastMovementDate) }}
                          </div>
                        </div>
                        
                        <!-- Стрелка tooltip -->
                        <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
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
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';
import Footer from './Footer.vue';
import ItemVariantSelector from './ItemVariantSelector.vue';
import warehouseService from '@/services/warehouseService.js';
import { useOrganizationsStore } from '@/stores/organizations.js';
import { useSidebar } from '@/composables/useSidebar.js';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const organizationsStore = useOrganizationsStore();
const { isSidebarOpen } = useSidebar();

// State
const loading = ref(false);
const error = ref(null);
const movements = ref(null);
const chartsLoading = ref(false);

// Chart refs
const pieChartRef = ref(null);
const salesChartRef = ref(null);

// Chart instances
let pieChart = null;
let salesChart = null;

// Функции для работы с датами
function getStartOfMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01T00:00`;
}

function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}T23:59`;
}

// Состояние фильтров с датами по умолчанию
const filters = ref({
  from: getStartOfMonth(),
  to: getCurrentDateTime(),
  itemVariantId: '',
  salesChartItemId: '' // Фильтр товара для графика продаж
});

// Статистика
const statistics = ref({
  PURCHASE: 0,
  SALE: 0,
  TRANSFER: 0,
  RETURN: 0,
  WRITE_OFF: 0,
  RESERVE: 0
});

// Сумма закупа по валютам
const purchaseSpending = ref({});

// Данные о продажах по валютам
const salesData = ref({});

// Данные временных рядов продаж
const salesTimeSeries = ref({});

// Топ товаров
const topProducts = ref([]);

// Выбранный товар для графика продаж
const selectedSalesItem = ref(null);

// Key для принудительного перерендеринга селектора товаров
const salesSelectorKey = ref(0);

// Функция для конвертации локального времени в UTC для отправки на сервер
function convertToUTC(dateTimeString) {
  if (!dateTimeString) return null;
  try {
    const localDate = new Date(dateTimeString);
    if (isNaN(localDate.getTime())) {
      console.warn('Некорректная дата:', dateTimeString);
      return null;
    }
    // Конвертируем в UTC для отправки на сервер
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

function formatCurrency(amount, currency = '₸') {
  if (!amount && amount !== 0) return `0 ${currency}`;
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount) + ` ${currency}`;
}

function formatDate(date) {
  if (!date) return 'Нет данных';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

// Получить символ валюты
function getCurrencySymbol(currency) {
  const symbols = {
    'KZT': '₸',
    'USD': '$',
    'EUR': '€',
    'RUB': '₽',
    'GBP': '£',
    'Не указана': ''
  };
  return symbols[currency] || currency;
}

async function loadMovements() {
  if (!organizationsStore.selectedOrganization?.id) return;
  
  // Показываем loading только для всего компонента, не для фильтров
  if (!movements.value) {
  loading.value = true;
  } else {
    // Если данные уже есть, показываем только loading для данных
    chartsLoading.value = true;
  }
  
  try {
    // Подготавливаем фильтры
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
      page: 0,
      size: 10000,
      sort: 'created,desc'
    };
    
    const newMovements = await warehouseService.getItemMovements(
      organizationsStore.selectedOrganization.id,
      activeFilters,
      pageable
    );
    
    movements.value = newMovements;
    updateStatistics();
    await updateCharts();
    
  } catch (e) {
    error.value = e.message || 'Ошибка загрузки данных';
  } finally {
    loading.value = false;
    chartsLoading.value = false;
  }
}

function updateStatistics() {
  // Сбрасываем статистику
  statistics.value = {
    PURCHASE: 0,
    SALE: 0,
    TRANSFER: 0,
    RETURN: 0,
    WRITE_OFF: 0,
    RESERVE: 0
  };
  
  // Сбрасываем данные о сумме закупа, продажах и топ товарах
  purchaseSpending.value = {};
  salesData.value = {};
  salesTimeSeries.value = {};
  topProducts.value = [];
  
  if (movements.value?.content) {
    const purchaseCurrencyData = {};
    const salesCurrencyData = {};
    const salesTimeSeriesData = {};
    const productStats = {};
    
    movements.value.content.forEach(movement => {
      // Считаем количество операций по типам
      if (statistics.value.hasOwnProperty(movement.type)) {
        statistics.value[movement.type]++;
      }
      
      const price = movement.pricePerItem || 0;
      const quantity = movement.quantity || 0;
      const total = price * quantity;
      const currency = movement.currency || 'Не указана';
      
      // Считаем сумму закупа по валютам
      if (movement.type === 'PURCHASE') {
        if (!purchaseCurrencyData[currency]) {
          purchaseCurrencyData[currency] = {
            total: 0,
            count: 0
          };
        }
        
        purchaseCurrencyData[currency].total += total;
        purchaseCurrencyData[currency].count++;
      }
      
      // Считаем данные о продажах по валютам
      if (movement.type === 'SALE') {
        if (!salesCurrencyData[currency]) {
          salesCurrencyData[currency] = {
            total: 0,
            count: 0
          };
        }
        
        salesCurrencyData[currency].total += total;
        salesCurrencyData[currency].count++;
        
        // Собираем данные для временных рядов (группируем по дням)
        // Если выбран конкретный товар для графика, фильтруем только его продажи
        const includeInChart = !filters.value.salesChartItemId || 
                              movement.itemVariant?.id === filters.value.salesChartItemId;
        
        if (includeInChart) {
          const movementDate = new Date(movement.created);
          const dateKey = movementDate.toISOString().split('T')[0]; // YYYY-MM-DD
          
          if (!salesTimeSeriesData[currency]) {
            salesTimeSeriesData[currency] = {};
          }
          
          if (!salesTimeSeriesData[currency][dateKey]) {
            salesTimeSeriesData[currency][dateKey] = 0;
          }
          
          salesTimeSeriesData[currency][dateKey] += total;
        }
      }
      
      // Собираем статистику по товарам для топ списка (группируем по SKU)
      if (movement.itemVariant && (movement.type === 'PURCHASE' || movement.type === 'SALE')) {
        const sku = movement.itemVariant.sku || 'Неизвестный товар';
        
        if (!productStats[sku]) {
          productStats[sku] = {
            sku: sku,
            currencies: new Set(),
            purchaseQuantity: 0,
            saleQuantity: 0,
            purchaseTotal: 0,
            saleTotal: 0,
            purchaseByCurrency: {},
            saleByCurrency: {},
            lastMovementDate: null,
            description: movement.itemVariant.description || ''
          };
        }
        
        if (currency && currency !== 'Не указана') {
          productStats[sku].currencies.add(currency);
        }
        
        const movementDate = new Date(movement.created);
        if (!productStats[sku].lastMovementDate || movementDate > productStats[sku].lastMovementDate) {
          productStats[sku].lastMovementDate = movementDate;
        }
        
        if (movement.type === 'PURCHASE') {
          productStats[sku].purchaseQuantity += quantity;
          productStats[sku].purchaseTotal += total;
          
          // Сохраняем сумму по валюте для закупок
          if (!productStats[sku].purchaseByCurrency[currency]) {
            productStats[sku].purchaseByCurrency[currency] = 0;
          }
          productStats[sku].purchaseByCurrency[currency] += total;
          
        } else if (movement.type === 'SALE') {
          productStats[sku].saleQuantity += quantity;
          productStats[sku].saleTotal += total;
          
          // Сохраняем сумму по валюте для продаж
          if (!productStats[sku].saleByCurrency[currency]) {
            productStats[sku].saleByCurrency[currency] = 0;
          }
          productStats[sku].saleByCurrency[currency] += total;
        }
      }
    });
    
    Object.keys(purchaseCurrencyData).forEach(currency => {
      const data = purchaseCurrencyData[currency];
      purchaseSpending.value[currency] = {
        total: data.total,
        average: data.count > 0 ? data.total / data.count : 0,
        count: data.count
      };
    });
    
    Object.keys(salesCurrencyData).forEach(currency => {
      const data = salesCurrencyData[currency];
      salesData.value[currency] = {
        total: data.total,
        average: data.count > 0 ? data.total / data.count : 0,
        count: data.count
      };
    });
    
    salesTimeSeries.value = salesTimeSeriesData;
    
    // Формируем популярные товары (по количеству продаж)
    topProducts.value = Object.values(productStats)
      .sort((a, b) => b.saleQuantity - a.saleQuantity)
      .slice(0, 10) // Увеличиваем до 10 товаров
      .map(product => ({
        sku: product.sku,
        description: product.description,
        currencies: Array.from(product.currencies),
        purchaseQuantity: product.purchaseQuantity,
        saleQuantity: product.saleQuantity,
        purchaseTotal: product.purchaseTotal,
        saleTotal: product.saleTotal,
        purchaseByCurrency: product.purchaseByCurrency,
        saleByCurrency: product.saleByCurrency,
        lastMovementDate: product.lastMovementDate
      }));
  }
}

async function updateCharts() {
  await nextTick();
  
  // Дополнительная задержка для уверенности что DOM готов
  setTimeout(async () => {
    try {
      if (!movements.value?.content) {
        return;
      }
      
      const data = movements.value.content;
      
      // Данные для круговой диаграммы - фильтруем только типы с данными > 0
      const filteredStats = Object.entries(statistics.value).filter(([_, count]) => count > 0);
      const typeLabels = filteredStats.map(([type, _]) => getMovementTypeName(type));
      const typeData = filteredStats.map(([_, count]) => count);
      const typeColors = filteredStats.map(([type, _], index) => {
        const colorMap = {
          'PURCHASE': '#3B82F6',
          'SALE': '#10B981', 
          'TRANSFER': '#8B5CF6',
          'RETURN': '#F59E0B',
          'WRITE_OFF': '#EF4444',
          'RESERVE': '#6B7280'
        };
        return colorMap[type] || '#6B7280';
      });
      
      if (typeData.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
        updatePieChart(typeLabels, typeData, typeColors);
      } else {
        const emptyLabels = ['Нет данных'];
        const emptyData = [1];
        const emptyColors = ['#E5E7EB'];

        await new Promise(resolve => setTimeout(resolve, 100));
        updatePieChart(emptyLabels, emptyData, emptyColors);
      }

      await new Promise(resolve => setTimeout(resolve, 150));
      updateSalesChart();
    } catch (error) {
      console.error('Error in updateCharts:', error);
    }
  }, 200);
}

function updatePieChart(labels, data, colors) {
  try {
    const canvas = pieChartRef.value;
    if (!canvas) {
      console.warn('Pie chart canvas ref not available');
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('Cannot get 2d context for pie chart');
      return;
    }
    
    if (pieChart) {
      pieChart.destroy();
      pieChart = null;
    }
    
    pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error creating pie chart:', error);
  }
}

function updateSalesChart() {
  try {
    const canvas = salesChartRef.value;
    if (!canvas) {
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    
    if (salesChart) {
      salesChart.destroy();
      salesChart = null;
    }
    
    const hasData = Object.keys(salesTimeSeries.value).length > 0;
    
    if (!hasData) {
      salesChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Нет данных о продажах',
            data: [],
            borderColor: '#E5E7EB',
            backgroundColor: '#E5E7EB20',
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'linear',
              title: {
                display: true,
                text: 'Дата'
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Сумма продаж'
              }
            }
          },
          plugins: {
            legend: {
              position: 'top'
            }
          }
        }
      });
      return;
    }
    
    // Подготавливаем данные для графика
    const datasets = [];
    const allDates = new Set();
    
    // Собираем все даты
    Object.values(salesTimeSeries.value).forEach(currencyData => {
      Object.keys(currencyData).forEach(date => {
        allDates.add(date);
      });
    });
    
    const sortedDates = Array.from(allDates).sort();
    
    const currencyColors = {
      'KZT': '#3B82F6',
      'USD': '#10B981', 
      'EUR': '#8B5CF6',
      'RUB': '#F59E0B',
      'GBP': '#EF4444',
      'Не указана': '#6B7280'
    };
    
    let colorIndex = 0;
    const defaultColors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#84CC16'];
    
    Object.keys(salesTimeSeries.value).forEach(currency => {
      const currencyData = salesTimeSeries.value[currency];
      
      // Создаем данные для линии - используем простые координаты x,y
      const data = sortedDates.map((date, index) => ({
        x: new Date(date).getTime(), // Конвертируем в timestamp
        y: currencyData[date] || 0
      }));
      
      const color = currencyColors[currency] || defaultColors[colorIndex % defaultColors.length];
      colorIndex++;
      
      datasets.push({
        label: `${currency === 'Не указана' ? 'Без валюты' : currency} (${getCurrencySymbol(currency)})`,
        data: data,
        borderColor: color,
        backgroundColor: color + '20',
        fill: false,
        tension: 0.1,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5
      });
    });
    
    salesChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                day: 'dd.MM'
              }
            },
            title: {
              display: true,
              text: 'Дата'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Сумма продаж'
            },
            ticks: {
              callback: function(value) {
                return new Intl.NumberFormat('ru-RU').format(value);
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const currency = context.dataset.label.split(' ')[0];
                const symbol = getCurrencySymbol(currency);
                return `${context.dataset.label}: ${formatCurrency(context.parsed.y, symbol)}`;
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error creating sales chart:', error);
  }
}





function resetFilters() {
  filters.value = {
    from: getStartOfMonth(),
    to: getCurrentDateTime(),
    itemVariantId: '',
    salesChartItemId: ''
  };
  selectedSalesItem.value = null;
  salesSelectorKey.value++; // Принудительно перерендериваем селектор
  debouncedLoadMovements();
}

function handleItemVariantChange(value) {
  filters.value.itemVariantId = value;
  applyFilters();
}

function handleSalesItemChange(item) {
  selectedSalesItem.value = item;
  debouncedLoadMovements();
}

function handleSalesItemModelChange(value) {
  filters.value.salesChartItemId = value;
  if (!value) {
    selectedSalesItem.value = null;
  }
  debouncedLoadMovements();
}

function clearSalesItemFilter() {
  filters.value.salesChartItemId = '';
  selectedSalesItem.value = null;
  salesSelectorKey.value++; // Принудительно перерендериваем селектор
  debouncedLoadMovements();
}

function applyFilters() {
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

function destroyCharts() {
  try {
    if (pieChart) {
      pieChart.destroy();
      pieChart = null;
    }
    if (salesChart) {
      salesChart.destroy();
      salesChart = null;
    }
  } catch (error) {
    console.error('Error destroying charts:', error);
  }
}

onMounted(() => {
  // Небольшая задержка чтобы убедиться что DOM готов
  setTimeout(() => {
    if (organizationsStore.selectedOrganization?.id) {
      loadMovements();
    }
  }, 100);
});

onBeforeUnmount(() => {
  destroyCharts();
  if (loadMovementsTimeout) {
    clearTimeout(loadMovementsTimeout);
  }
});

// Watch for organization changes to reload data
watch(() => organizationsStore.selectedOrganizationId, (newVal, oldVal) => {
  if (newVal) {
    destroyCharts(); // Очищаем старые графики
    
    // Если это смена организации (а не первичная загрузка), сбрасываем данные
    if (oldVal && oldVal !== newVal) {
      movements.value = null;
      filters.value.salesChartItemId = '';
      selectedSalesItem.value = null;
      salesSelectorKey.value++; // Принудительно перерендериваем селектор
    }
    
    loadMovements();
  } else {
    destroyCharts();
    movements.value = null;
    statistics.value = {
      PURCHASE: 0,
      SALE: 0,
      TRANSFER: 0,
      RETURN: 0,
      WRITE_OFF: 0,
      RESERVE: 0
    };
    purchaseSpending.value = {};
    salesData.value = {};
    salesTimeSeries.value = {};
    topProducts.value = [];
    selectedSalesItem.value = null;
    salesSelectorKey.value++;
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