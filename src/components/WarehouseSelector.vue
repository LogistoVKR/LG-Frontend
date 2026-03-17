<template>
    <div class="relative">
      <input
        :value="displayValue"
        @input="handleInput"
        @focus="showDropdown = true"
        @blur="handleBlur"
        :placeholder="placeholder + ' (поиск по названию или адресу)'"
        class="input"
        :class="{ 'border-red-500': error }"
        ref="inputRef"
      />
      
      <!-- Dropdown -->
      <div v-if="showDropdown" ref="dropdownRef" class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto" @scroll="handleScroll">
        <!-- Loading -->
        <div v-if="loading && warehouses.length === 0" class="p-3 text-center text-gray-500">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
          <span class="ml-2">Загрузка...</span>
        </div>
        
        <!-- No results -->
        <div v-else-if="warehouses.length === 0" class="p-3 text-center text-gray-500">
          Склады не найдены
        </div>
        
        <!-- Results -->
        <div v-else>
          <div
            v-for="warehouse in warehouses"
            :key="warehouse.id"
            @mousedown="selectWarehouse(warehouse)"
            class="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="font-medium text-gray-900">{{ warehouse.name }}</div>
                <div class="text-xs text-gray-500 flex items-center space-x-2">
                  <span class="inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full"
                        :class="warehouse.type === 'WAREHOUSE' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'">
                    {{ warehouse.type === 'WAREHOUSE' ? 'Склад' : 'Точка продаж' }}
                  </span>
                  <span v-if="warehouse.location" class="truncate">{{ warehouse.location }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="loading && warehouses.length > 0" class="p-2 text-center text-gray-400 text-xs">Загрузка...</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import warehouseService from '@/services/warehouseService.js';
  import { useOrganizationsStore } from '@/stores/organizations.js';
  
  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Выберите склад'
    },
    error: {
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
  const warehouses = ref([]);
  const currentPage = ref(0);
  const hasMorePages = ref(true);
  const searchQuery = ref('');
  const selectedWarehouse = ref(null);
  const dropdownRef = ref(null);
  const inputRef = ref(null);
  
  const displayValue = computed(() => {
    if (selectedWarehouse.value) {
      return selectedWarehouse.value.name;
    }
    return searchQuery.value;
  });
  
  // Debounced search
  let searchTimeout = null;
  const debouncedSearch = () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    searchTimeout = setTimeout(() => {
      currentPage.value = 0;
      loadWarehouses();
    }, 300);
  };
  
  const loadWarehouses = async (append = false) => {
    if (!organizationsStore.selectedOrganizationId) return;
    
    loading.value = true;
    try {
      const params = {
        page: currentPage.value,
        size: 10,
        or: 'true' // Добавляем параметр or=true
      };
      
      // Apply search filter to both name and location
      if (searchQuery.value.trim()) {
        params.name = searchQuery.value.trim();
        params.location = searchQuery.value.trim(); // Добавляем поиск по location
      }
      
      const result = await warehouseService.getPointsOfStorage(
        organizationsStore.selectedOrganizationId,
        params
      );
      
      if (append) {
        warehouses.value = [...warehouses.value, ...result.content];
      } else {
        warehouses.value = result.content;
      }
      
      hasMorePages.value = !result.last;
    } catch (error) {
      console.error('Error loading warehouses:', error);
      warehouses.value = [];
    } finally {
      loading.value = false;
    }
  };
  
  const handleScroll = (e) => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40 && hasMorePages.value && !loading.value) {
      currentPage.value++;
      loadWarehouses(true);
    }
  };
  
  const handleInput = (event) => {
    searchQuery.value = event.target.value;
    selectedWarehouse.value = null;
    emit('update:modelValue', '');
    debouncedSearch();
  };
  
  const selectWarehouse = (warehouse) => {
    selectedWarehouse.value = warehouse;
    searchQuery.value = warehouse.name;
    emit('update:modelValue', warehouse.id);
    emit('select', warehouse);
    showDropdown.value = false;
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
  
  // Watch for external value changes (for editing mode)
  watch(() => props.modelValue, async (newValue) => {
    if (newValue && !selectedWarehouse.value) {
      // Try to find the warehouse in current list
      const warehouse = warehouses.value.find(w => w.id === newValue);
      if (warehouse) {
        selectedWarehouse.value = warehouse;
        searchQuery.value = warehouse.name;
      } else if (!props.isEditMode) {
        // Only make API call if we're not in edit mode
        try {
          const warehouseData = await warehouseService.getPointOfStorage(newValue);
          selectedWarehouse.value = warehouseData;
          searchQuery.value = warehouseData.name;
        } catch (error) {
          console.error('Error loading warehouse by ID:', error);
        }
      }
    }
  }, { immediate: true });
  
  // Watch for display data changes (for editing mode)
  watch(() => props.displayData, (newDisplayData) => {
    if (newDisplayData && !selectedWarehouse.value) {
      // Set display data directly without API call
      selectedWarehouse.value = newDisplayData;
      searchQuery.value = newDisplayData.name;
    }
  }, { immediate: true });
  
  onMounted(() => {
    if (!props.isEditMode) {
      loadWarehouses();
    }
  });
  
  // Watch organization changes
  watch(() => organizationsStore.selectedOrganizationId, () => {
    if (!props.isEditMode) {
      currentPage.value = 0;
      // Очищаем список без перезагрузки страницы
      warehouses.value = [];
      loadWarehouses();
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