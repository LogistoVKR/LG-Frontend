<template>
  <div class="relative">
    <input
      :value="displayValue"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      :placeholder="placeholder"
      class="field"
      :style="error ? 'border-color: var(--danger);' : ''"
      ref="inputRef"
      autocomplete="off"
    />

    <div
      v-if="showDropdown"
      ref="dropdownRef"
      class="absolute z-50 w-full mt-1 bg-surface border border-line rounded-[var(--r-3)] max-h-60 overflow-y-auto"
      style="box-shadow: var(--shadow-2);"
    >
      <div v-if="loading && clients.length === 0" class="p-3 text-center text-ink-3 flex items-center justify-center gap-2">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2" style="border-color: var(--accent);"></div>
        <span class="body-s">Загрузка...</span>
      </div>

      <div v-else-if="clients.length === 0" class="p-3 body-s text-center text-ink-3">
        Клиенты не найдены
      </div>

      <div v-else>
        <div
          v-for="client in clients"
          :key="client.id"
          @mousedown="selectClient(client)"
          class="px-3 py-2 hover:bg-surface-2 cursor-pointer border-b border-line-2 last:border-b-0 transition-colors"
        >
          <div class="body-s text-ink font-medium">{{ clientName(client) }}</div>
          <div class="flex items-center gap-2 mt-0.5">
            <span v-if="client.personalDiscount != null" class="badge badge--sale">
              Скидка {{ client.personalDiscount }}%
            </span>
            <span v-else class="body-s text-ink-3">Без скидки</span>
            <span v-if="client.phoneNumber" class="body-s text-ink-3 truncate">{{ client.phoneNumber }}</span>
          </div>
        </div>

        <div v-if="loading && clients.length > 0" class="p-2 body-s text-center text-ink-3">Загрузка...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import clientService from '@/services/clientService.js';
import { useOrganizationsStore } from '@/stores/organizations.js';
import { useAuth } from '@/composables/useAuth.js';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Поиск по имени или фамилии'
  },
  error: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'select']);

const organizationsStore = useOrganizationsStore();
const { getToken } = useAuth();

const showDropdown = ref(false);
const loading = ref(false);
const clients = ref([]);
const searchQuery = ref('');
const selectedClient = ref(null);
const dropdownRef = ref(null);
const inputRef = ref(null);

const displayValue = computed(() => {
  if (selectedClient.value) {
    return clientName(selectedClient.value);
  }
  return searchQuery.value;
});

function clientName(client) {
  return [client.firstName, client.lastName].filter(Boolean).join(' ');
}

let searchTimeout = null;
function debouncedSearch() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadClients();
  }, 300);
}

async function loadClients() {
  const orgId = organizationsStore.selectedOrganizationId;
  if (!orgId) return;

  loading.value = true;
  try {
    const token = await getToken();
    const query = searchQuery.value.trim();
    let firstName = null;
    let lastName = null;

    if (query) {
      const spaceIdx = query.indexOf(' ');
      if (spaceIdx !== -1) {
        firstName = query.slice(0, spaceIdx);
        lastName = query.slice(spaceIdx + 1) || null;
      } else {
        firstName = query;
      }
    }

    const result = await clientService.getClientsByOrganization(
      orgId, 0, 20, token, firstName, lastName
    );
    clients.value = result.content || [];
  } catch (err) {
    clients.value = [];
  } finally {
    loading.value = false;
  }
}

function handleInput(event) {
  searchQuery.value = event.target.value;
  if (selectedClient.value) {
    selectedClient.value = null;
    emit('update:modelValue', '');
    emit('select', null);
  }
  debouncedSearch();
}

function handleFocus() {
  showDropdown.value = true;
  if (clients.value.length === 0) {
    loadClients();
  }
}

function selectClient(client) {
  selectedClient.value = client;
  searchQuery.value = clientName(client);
  emit('update:modelValue', client.id);
  emit('select', client);
  showDropdown.value = false;
}

function handleBlur() {
  setTimeout(() => {
    const active = document.activeElement;
    if (dropdownRef.value && dropdownRef.value.contains(active)) {
      return;
    }
    showDropdown.value = false;
    if (!selectedClient.value) {
      searchQuery.value = '';
    }
  }, 200);
}
</script>
