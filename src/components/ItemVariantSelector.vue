<template>
  <div class="relative">
    <input
      :value="displayValue"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      :placeholder="placeholder + ' (поиск по SKU или штрих-коду)'"
      class="field"
      :style="(error || (required && !modelValue)) ? 'border-color: var(--danger);' : ''"
      ref="inputRef"
    />
<div v-if="showDropdown" ref="dropdownRef" class="absolute z-50 w-full mt-1 bg-surface border border-line rounded-[var(--r-3)] max-h-72 overflow-y-auto" style="box-shadow: var(--shadow-2);" @scroll="handleScroll">
<div v-if="loading && items.length === 0" class="p-3 body-s text-center text-ink-3 flex items-center justify-center gap-2">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2" style="border-color: var(--accent);"></div>
        Загрузка...
      </div>
<div v-else-if="items.length === 0" class="p-3 body-s text-center text-ink-3">
        <div v-if="searchQuery.trim()">Товары не найдены по запросу "{{ searchQuery }}"</div>
        <div v-else>Начните вводить для поиска товаров</div>
      </div>
<div v-else>
        <div v-for="item in items" :key="item.id" class="border-b border-line-2 last:border-b-0">
          <div class="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-surface-2 transition-colors"
               :class="{ 'bg-success-soft': hasMatchingVariants(item) }"
               @mousedown.prevent="handleItemClick(item.id)">
            <div class="flex items-center gap-2">
              <div class="body-s font-medium text-ink">{{ item.name }}</div>
              <span v-if="hasMatchingVariants(item)" class="badge badge--purchase">Найдено</span>
            </div>
            <svg :class="{'rotate-90': expandedItemIds.includes(item.id)}" class="w-4 h-4 transition-transform text-ink-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div v-if="expandedItemIds.includes(item.id)" class="bg-surface-2">
            <div v-if="loadingVariants.has(item.id)" class="px-6 py-2 text-center text-ink-3 flex items-center justify-center gap-1">
              <div class="animate-spin rounded-full h-3 w-3 border-b-2" style="border-color: var(--accent);"></div>
              <span class="body-s">Загрузка вариантов...</span>
            </div>
            <div v-else-if="item.variantsLoaded && item.variants && item.variants.length > 0">
              <div v-for="variant in item.variants" :key="variant.id" @mousedown.prevent="selectVariant(variant, item)"
                   class="px-6 py-2 cursor-pointer flex flex-col transition-colors hover:bg-surface-3"
                   :class="isVariantMatching(variant) ? 'bg-warning-soft border-l-4 border-warning' : ''">
                <span class="body-s font-medium text-ink mono">
                  SKU: <span :class="isSkuMatching(variant.sku) ? 'bg-warning-soft px-1 rounded-[var(--r-1)]' : ''">{{ variant.sku || '—' }}</span>
                </span>
                <span class="body-s text-ink-3 mono">
                  Штрих-код: <span :class="isBarcodeMatching(variant.barcode) ? 'bg-warning-soft px-1 rounded-[var(--r-1)]' : ''">{{ variant.barcode || '—' }}</span>
                </span>
                <span class="body-s text-ink-3">Цена: {{ variant.price || '—' }} {{ variant.currency || '' }}</span>
              </div>
            </div>
            <div v-else-if="item.variantsLoaded && (!item.variants || item.variants.length === 0)" class="px-6 py-2 body-s text-center text-ink-3">
              У товара нет вариантов
            </div>
            <div v-else class="px-6 py-2 body-s text-center text-ink-3">
              Нажмите для загрузки вариантов...
            </div>
          </div>
        </div>
        <div v-if="loading && items.length > 0" class="p-2 body-s text-center text-ink-3">Загрузка...</div>
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
const loadingVariants = ref(new Set());
const items = ref([]);
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


const hasMatchingVariants = (item) => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query || !item.variantsLoaded || !item.variants) return false;

  return item.variants.some(variant => {
    const sku = (variant.sku || '').toLowerCase();
    const barcode = (variant.barcode || '').toLowerCase();
    return sku.includes(query) || barcode.includes(query);
  });
};


let searchTimeout = null;
const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    currentPage.value = 0;
    loadItems();

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
      size: 20,
      or: 'true'
    };
    if (searchQuery.value.trim()) {
      searchParams.sku = searchQuery.value.trim();
      searchParams.barcode = searchQuery.value.trim();
    }

    const result = await itemService.getItems(searchParams);
    const itemsWithoutVariants = (result.content || []).map(item => ({
      ...item,
      variants: null,
      variantsLoaded: false
    }));
    if (append) {
      items.value = [...items.value, ...itemsWithoutVariants];
    } else {
      items.value = itemsWithoutVariants;

      expandedItemIds.value = [];
    }
    hasMorePages.value = !result.last;


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

  expandedItemIds.value = [];

  showDropdown.value = true;
  debouncedSearch();
};

const selectVariant = (variant, item) => {
  selectedVariant.value = variant;
  searchQuery.value = item.name + ' / ' + (variant.sku || variant.barcode || '');
  emit('update:modelValue', variant.id);
  emit('select', variant);
  showDropdown.value = false;

  expandedItemIds.value = [];
};


const autoLoadVariantsForItem = async (itemId) => {
  const item = items.value.find(i => i.id === itemId);
  if (!item || item.variantsLoaded) return;

  loadingVariants.value.add(itemId);
  try {
    const variantsResult = await itemService.getItemVariants(itemId, 0, 20);
    item.variants = variantsResult.content;
    item.variantsLoaded = true;

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


const autoExpandMatchingItems = async () => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return;


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


    await Promise.all(promises);


    if (i + maxConcurrentLoads < itemsToLoad.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
};

const handleFocus = () => {
  showDropdown.value = true;

  if (items.value.length === 0 && !searchQuery.value.trim() && !loading.value) {
    loadItems();
  }
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


const handleItemClick = (itemId) => {
  const item = items.value.find(i => i.id === itemId);
  if (!item) return;


  if (!item.variantsLoaded) {
    autoLoadVariantsForItem(itemId);
  } else {

    toggleExpand(itemId);
  }
};


const loadVariantsForItem = async (itemId) => {
  const item = items.value.find(i => i.id === itemId);
  if (!item || item.variantsLoaded) return;

  loadingVariants.value.add(itemId);
  try {
    const variantsResult = await itemService.getItemVariants(itemId, 0, 20);
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


watch(() => props.modelValue, async (newValue) => {
  if (newValue && !selectedVariant.value) {

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


    if (!selectedVariant.value && !props.isEditMode) {
      try {


        const searchParams = {
          organizationId: organizationsStore.selectedOrganizationId,
          page: 0,
          size: 20,
          or: 'true'
        };
        const result = await itemService.getItems(searchParams);

        for (const item of result.content || []) {
          try {
            const variantsResult = await itemService.getItemVariants(item.id, 0, 20);
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


watch(() => props.displayData, (newDisplayData) => {
  if (newDisplayData && !selectedVariant.value) {

    selectedVariant.value = newDisplayData;
    const displayName = newDisplayData.sku || newDisplayData.barcode || 'Без SKU';
    searchQuery.value = displayName;
  }
}, { immediate: true });

onMounted(() => {

});


watch(() => organizationsStore.selectedOrganizationId, () => {
  currentPage.value = 0;

  items.value = [];

  expandedItemIds.value = [];
  if (showDropdown.value) {
    loadItems();
  }
});
</script>

