<template>
  <div class="relative">
    <input
      :value="displayValue"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      :placeholder="placeholder + ' (поиск по SKU или штрих-коду)'"
      class="input"
      :class="{ 
        'border-red-500': error || (required && !modelValue), 
        'border-gray-300': !error && !(required && !modelValue)
      }"
      ref="inputRef"
    />
    <!-- Dropdown -->
    <div v-if="showDropdown" ref="dropdownRef" class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-72 overflow-y-auto" @scroll="handleScroll">
      <!-- Loading -->
      <div v-if="loading && items.length === 0" class="p-3 text-center text-gray-500">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
        <span class="ml-2">Загрузка...</span>
      </div>
      <!-- No results -->
      <div v-else-if="items.length === 0" class="p-3 text-center text-gray-500">
        <div v-if="searchQuery.trim()">
          Товары не найдены по запросу "{{ searchQuery }}"
        </div>
        <div v-else>
          Начните вводить для поиска товаров
        </div>
      </div>
      <!-- Results -->
      <div v-else>
        <div v-for="item in items" :key="item.id" class="border-b border-gray-100 last:border-b-0">
          <div class="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50" 
               :class="{ 'bg-green-50': hasMatchingVariants(item) }"
               @mousedown.prevent="handleItemClick(item.id)">
            <div class="flex items-center space-x-2">
              <div class="font-medium text-gray-900">{{ item.name }}</div>
              <div v-if="hasMatchingVariants(item)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                Найдено
              </div>
            </div>
            <svg :class="{'transform rotate-90': expandedItemIds.includes(item.id)}" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div v-if="expandedItemIds.includes(item.id)" class="bg-gray-50">
            <div v-if="loadingVariants.has(item.id)" class="px-6 py-2 text-center text-gray-500">
              <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mx-auto"></div>
              <span class="text-xs ml-1">Загрузка вариантов...</span>
            </div>
            <div v-else-if="item.variantsLoaded && item.variants && item.variants.length > 0">
              <div v-for="variant in item.variants" :key="variant.id" @mousedown.prevent="selectVariant(variant, item)" 
                   :class="[
                     'px-6 py-2 cursor-pointer flex flex-col transition-colors',
                     isVariantMatching(variant) ? 'bg-yellow-50 hover:bg-yellow-100 border-l-4 border-yellow-400' : 'hover:bg-blue-50'
                   ]">
                <span class="font-medium text-gray-800">
                  SKU: <span :class="isSkuMatching(variant.sku) ? 'bg-yellow-200 px-1 rounded' : ''">{{ variant.sku || '—' }}</span>
                </span>
                <span class="text-xs text-gray-500">
                  Штрих-код: <span :class="isBarcodeMatching(variant.barcode) ? 'bg-yellow-200 px-1 rounded' : ''">{{ variant.barcode || '—' }}</span>
                </span>
                <span class="text-xs text-gray-500">Цена: {{ variant.price || '—' }} {{ variant.currency || '' }}</span>
              </div>
            </div>
            <div v-else-if="item.variantsLoaded && (!item.variants || item.variants.length === 0)" class="px-6 py-2 text-center text-gray-400 text-xs">
              У товара нет вариантов
            </div>
            <div v-else class="px-6 py-2 text-center text-gray-400 text-xs">
              Нажмите для загрузки вариантов...
            </div>
          </div>
        </div>
        <div v-if="loading && items.length > 0" class="p-2 text-center text-gray-400 text-xs">Загрузка...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import itemService from '@/services/itemService.js';
import { useOrganizationsStore } from '@/stores/organizations.js';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Выберите вариант товара'
  },
  error: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  displayData: {
    type: Object,
    default: null
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'select']);

const organizationsStore = useOrganizationsStore();

const showDropdown = ref(false);
const loading = ref(false);
const loadingVariants = ref(new Set()); // Для отслеживания загрузки вариантов конкретного товара
const items = ref([]); // товары с variants
const currentPage = ref(0);
const hasMorePages = ref(true);
const searchQuery = ref('');
const selectedVariant = ref(null);
const expandedItemIds = ref([]);
const dropdownRef = ref(null);
const inputRef = ref(null);

const displayValue = computed(() => {
  if (selectedVariant.value) {
    return selectedVariant.value.sku || selectedVariant.value.barcode || 'Без SKU';
  }
  return searchQuery.value;
});

// Функции для проверки соответствия вариантов поисковому запросу
const isVariantMatching = (variant) => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return false;
  
  const sku = (variant.sku || '').toLowerCase();
  const barcode = (variant.barcode || '').toLowerCase();
  return sku.includes(query) || barcode.includes(query);
};

const isSkuMatching = (sku) => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query || !sku) return false;
  return sku.toLowerCase().includes(query);
};

const isBarcodeMatching = (barcode) => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query || !barcode) return false;
  return barcode.toLowerCase().includes(query);
};

// Функция для проверки наличия подходящих вариантов у товара
const hasMatchingVariants = (item) => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query || !item.variantsLoaded || !item.variants) return false;
  
  return item.variants.some(variant => {
    const sku = (variant.sku || '').toLowerCase();
    const barcode = (variant.barcode || '').toLowerCase();
    return sku.includes(query) || barcode.includes(query);
  });
};

// Debounced search
let searchTimeout = null;
const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    currentPage.value = 0;
    loadItems();
    // Убеждаемся, что дропдаун остается видимым после поиска
    showDropdown.value = true;
  }, 300);
};

const loadItems = async (append = false) => {
  if (!organizationsStore.selectedOrganizationId) return;
  loading.value = true;
  try {
    const searchParams = {
      organizationId: organizationsStore.selectedOrganizationId,
      page: currentPage.value,
      size: 20, // Увеличиваем размер страницы для лучшей производительности
      or: 'true' // Добавляем параметр or=true
    };
    if (searchQuery.value.trim()) {
      searchParams.sku = searchQuery.value.trim(); // Поиск только по SKU
      searchParams.barcode = searchQuery.value.trim(); // Поиск только по штрих-коду
    }
    // Если поисковый запрос пустой, все равно загружаем товары для отображения
    const result = await itemService.getItems(searchParams);
    const itemsWithoutVariants = (result.content || []).map(item => ({
      ...item,
      variants: null, // Варианты будут загружены позже при необходимости
      variantsLoaded: false // Флаг для отслеживания загрузки вариантов
    }));
    if (append) {
      items.value = [...items.value, ...itemsWithoutVariants];
    } else {
      items.value = itemsWithoutVariants;
      // Сбрасываем состояние загруженных вариантов при новой загрузке
      expandedItemIds.value = [];
    }
    hasMorePages.value = !result.last;
    
    // Автоматически загружаем и раскрываем варианты если есть поисковый запрос
    if (searchQuery.value.trim() && !append) {
      autoExpandMatchingItems();
    }
  } catch (error) {
    console.error('Error loading items:', error);
    items.value = [];
  } finally {
    loading.value = false;
  }
};

const handleScroll = (e) => {
  const el = e.target;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40 && hasMorePages.value && !loading.value) {
    currentPage.value++;
    loadItems(true);
  }
};

const handleInput = (event) => {
  searchQuery.value = event.target.value;
  selectedVariant.value = null;
  emit('update:modelValue', '');
  // Сбрасываем состояние загруженных вариантов при новом поиске
  expandedItemIds.value = [];
  // Убеждаемся, что дропдаун остается видимым при вводе
  showDropdown.value = true;
  debouncedSearch();
};

const selectVariant = (variant, item) => {
  selectedVariant.value = variant;
  searchQuery.value = item.name + ' / ' + (variant.sku || variant.barcode || '');
  emit('update:modelValue', variant.id);
  emit('select', variant);
  showDropdown.value = false;
  // Сворачиваем все раскрытые товары после выбора
  expandedItemIds.value = [];
};

// Функция для автоматической загрузки вариантов при выборе товара
const autoLoadVariantsForItem = async (itemId) => {
  const item = items.value.find(i => i.id === itemId);
  if (!item || item.variantsLoaded) return; // Уже загружены или товар не найден
  
  loadingVariants.value.add(itemId);
  try {
    const variantsResult = await itemService.getItemVariants(itemId, 0, 20);
    item.variants = variantsResult.content;
    item.variantsLoaded = true;
    // Автоматически раскрываем товар после загрузки вариантов
    if (!expandedItemIds.value.includes(itemId)) {
      expandedItemIds.value.push(itemId);
    }
  } catch (error) {
    console.error(`Error loading variants for item ${itemId}:`, error);
    item.variants = [];
    item.variantsLoaded = true;
  } finally {
    loadingVariants.value.delete(itemId);
  }
};

// Функция для автоматического раскрытия товаров с подходящими вариантами
const autoExpandMatchingItems = async () => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return;
  
  // Ограничиваем количество одновременно загружаемых товаров для производительности
  const maxConcurrentLoads = 3;
  const itemsToLoad = items.value.filter(item => !item.variantsLoaded);
  
  for (let i = 0; i < itemsToLoad.length; i += maxConcurrentLoads) {
    const batch = itemsToLoad.slice(i, i + maxConcurrentLoads);
    
    const promises = batch.map(async (item) => {
      loadingVariants.value.add(item.id);
      try {
        const variantsResult = await itemService.getItemVariants(item.id, 0, 20);
        item.variants = variantsResult.content;
        item.variantsLoaded = true;
        
        const hasMatchingVariant = item.variants.some(variant => {
          const sku = (variant.sku || '').toLowerCase();
          const barcode = (variant.barcode || '').toLowerCase();
          return sku.includes(query) || barcode.includes(query);
        });
        
        // Если есть подходящие варианты, автоматически раскрываем товар
        if (hasMatchingVariant && !expandedItemIds.value.includes(item.id)) {
          expandedItemIds.value.push(item.id);
        }
      } catch (error) {
        console.error(`Error loading variants for item ${item.id}:`, error);
        item.variants = [];
        item.variantsLoaded = true;
      } finally {
        loadingVariants.value.delete(item.id);
      }
    });
    
    // Ждем завершения текущей партии
    await Promise.all(promises);
    
    // Небольшая пауза между партиями для плавности работы UI
    if (i + maxConcurrentLoads < itemsToLoad.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
};

const handleFocus = () => {
  showDropdown.value = true;
  // Если нет товаров и нет поискового запроса, загружаем начальные товары
  if (items.value.length === 0 && !searchQuery.value.trim() && !loading.value) {
    loadItems();
  }
};

const handleBlur = () => {
  // Delay hiding dropdown to allow for click events
  setTimeout(() => {
    const active = document.activeElement;
    if (
      dropdownRef.value && dropdownRef.value.contains(active)
    ) {
      // Не закрываем дропдаун, если фокус внутри
      return;
    }
    showDropdown.value = false;
  }, 200);
};

const toggleExpand = (itemId) => {
  const idx = expandedItemIds.value.indexOf(itemId);
  if (idx !== -1) {
    expandedItemIds.value.splice(idx, 1);
  } else {
    expandedItemIds.value.push(itemId);
    const item = items.value.find(i => i.id === itemId);
    if (item && !item.variantsLoaded) {
      loadVariantsForItem(itemId);
    }
  }
};

// Функция для автоматической загрузки вариантов при клике на товар
const handleItemClick = (itemId) => {
  const item = items.value.find(i => i.id === itemId);
  if (!item) return;
  
  // Всегда загружаем варианты при клике, если они еще не загружены
  if (!item.variantsLoaded) {
    autoLoadVariantsForItem(itemId);
  } else {
    // Если варианты уже загружены, просто переключаем раскрытие
    toggleExpand(itemId);
  }
};

// Функция для загрузки вариантов конкретного товара
const loadVariantsForItem = async (itemId) => {
  const item = items.value.find(i => i.id === itemId);
  if (!item || item.variantsLoaded) return; // Уже загружены или товар не найден
  
  loadingVariants.value.add(itemId);
  try {
    const variantsResult = await itemService.getItemVariants(itemId, 0, 20); // Reduced from 50 to 20
    item.variants = variantsResult.content;
    item.variantsLoaded = true;
  } catch (error) {
    console.error(`Error loading variants for item ${itemId}:`, error);
    item.variants = [];
    item.variantsLoaded = true;
  } finally {
    loadingVariants.value.delete(itemId);
  }
};

// Watch for external value changes (for editing mode)
watch(() => props.modelValue, async (newValue) => {
  if (newValue && !selectedVariant.value) {
    // Try to find the variant in current items list
    for (const item of items.value) {
      if (item.variantsLoaded && item.variants) {
        const variant = item.variants.find(v => v.id === newValue);
        if (variant) {
          selectedVariant.value = variant;
          searchQuery.value = item.name + ' / ' + (variant.sku || variant.barcode || '');
          break;
        }
      }
    }
    
    // If not found in current list and we don't have display data, try to load it specifically
    if (!selectedVariant.value && !props.isEditMode) {
      try {
        // First, we need to find which item this variant belongs to
        // We'll search through items with a broader search
        const searchParams = {
          organizationId: organizationsStore.selectedOrganizationId,
          page: 0,
          size: 20, // Reduced from 100 to 20
          or: 'true' // Добавляем параметр or=true для поиска по SKU и barcode
        };
        const result = await itemService.getItems(searchParams);
        
        for (const item of result.content || []) {
          try {
            const variantsResult = await itemService.getItemVariants(item.id, 0, 20); // Reduced from 100 to 20
            const variant = variantsResult.content.find(v => v.id === newValue);
            if (variant) {
              selectedVariant.value = variant;
              searchQuery.value = item.name + ' / ' + (variant.sku || variant.barcode || '');
              const existingItem = items.value.find(i => i.id === item.id);
              if (!existingItem) {
                items.value.unshift({ 
                  ...item, 
                  variants: variantsResult.content,
                  variantsLoaded: true 
                });
              } else {
                existingItem.variants = variantsResult.content;
                existingItem.variantsLoaded = true;
              }
              break;
            }
          } catch (error) {
            console.error(`Error loading variants for item ${item.id}:`, error);
          }
        }
      } catch (error) {
        console.error('Error loading variant by ID:', error);
      }
    }
  }
}, { immediate: true });

// Watch for display data changes (for editing mode)
watch(() => props.displayData, (newDisplayData) => {
  if (newDisplayData && !selectedVariant.value) {
    // Set display data directly without API call
    selectedVariant.value = newDisplayData;
    const displayName = newDisplayData.sku || newDisplayData.barcode || 'Без SKU';
    searchQuery.value = displayName;
  }
}, { immediate: true });

onMounted(() => {
  // Не загружаем данные автоматически, только при фокусе или поиске
});

// Watch organization changes
watch(() => organizationsStore.selectedOrganizationId, () => {
  currentPage.value = 0;
  // Очищаем список без перезагрузки страницы
  items.value = [];
  // Сбрасываем состояние загруженных вариантов
  expandedItemIds.value = [];
  if (showDropdown.value) {
    loadItems();
  }
});
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
  outline: none;
}
</style> 