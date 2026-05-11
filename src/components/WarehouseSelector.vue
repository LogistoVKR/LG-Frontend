<template>
    <div class="relative">
      <input
        :value="displayValue"
        @input="handleInput"
        @focus="showDropdown = true"
        @blur="handleBlur"
        :placeholder="placeholder + ' (поиск по названию или адресу)'"
        class="field"
        :style="error ? 'border-color: var(--danger);' : ''"
        ref="inputRef"
      />

<div v-if="showDropdown" ref="dropdownRef" class="absolute z-50 w-full mt-1 bg-surface border border-line rounded-[var(--r-3)] max-h-60 overflow-y-auto" style="box-shadow: var(--shadow-2);" @scroll="handleScroll">
<div v-if="loading && warehouses.length === 0" class="p-3 text-center text-ink-3 flex items-center justify-center gap-2">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2" style="border-color: var(--accent);"></div>
          <span class="body-s">Загрузка...</span>
        </div>

<div v-else-if="warehouses.length === 0" class="p-3 body-s text-center text-ink-3">
          Склады не найдены
        </div>

<div v-else>
          <div
            v-for="warehouse in warehouses"
            :key="warehouse.id"
            @mousedown="selectWarehouse(warehouse)"
            class="px-3 py-2 hover:bg-surface-2 cursor-pointer border-b border-line-2 last:border-b-0 transition-colors"
          >
            <div class="font-medium text-ink body-s">{{ warehouse.name }}</div>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="badge" :class="warehouse.type === 'WAREHOUSE' ? 'badge--transfer' : 'badge--purchase'">
                {{ warehouse.type === 'WAREHOUSE' ? 'Склад' : 'Точка продаж' }}
              </span>
              <span v-if="warehouse.location" class="body-s text-ink-3 truncate">{{ warehouse.location }}</span>
            </div>
          </div>

          <div v-if="loading && warehouses.length > 0" class="p-2 body-s text-center text-ink-3">Загрузка...</div>
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
        or: 'true'
      };


      if (searchQuery.value.trim()) {
        params.name = searchQuery.value.trim();
        params.location = searchQuery.value.trim();
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

    setTimeout(() => {
      const active = document.activeElement;
      if (
        dropdownRef.value && dropdownRef.value.contains(active)
      ) {

        return;
      }
      showDropdown.value = false;
    }, 200);
  };


  watch(() => props.modelValue, async (newValue) => {
    if (newValue && !selectedWarehouse.value) {

      const warehouse = warehouses.value.find(w => w.id === newValue);
      if (warehouse) {
        selectedWarehouse.value = warehouse;
        searchQuery.value = warehouse.name;
      } else if (!props.isEditMode) {

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


  watch(() => props.displayData, (newDisplayData) => {
    if (newDisplayData && !selectedWarehouse.value) {

      selectedWarehouse.value = newDisplayData;
      searchQuery.value = newDisplayData.name;
    }
  }, { immediate: true });

  onMounted(() => {
    if (!props.isEditMode) {
      loadWarehouses();
    }
  });


  watch(() => organizationsStore.selectedOrganizationId, () => {
    if (!props.isEditMode) {
      currentPage.value = 0;

      warehouses.value = [];
      loadWarehouses();
    }
  });
  </script>

