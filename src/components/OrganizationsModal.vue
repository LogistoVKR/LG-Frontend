<template>
  <div v-if="isOpen" class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50" @click="closeModal">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b">
        <div>
          <h3 class="text-xl font-semibold text-gray-900">
            {{ editingOrganization ? 'Редактировать' : 'Создать' }} организацию
          </h3>
        </div>
      </div>

      <!-- Form Content -->
      <form @submit.prevent="saveOrganization" class="p-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Название *</label>
            <input
              v-model="form.name"
              type="text"
              required
              maxlength="255"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <p class="text-xs text-gray-500 mt-1">{{ form.name.length }}/255 символов</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea
              v-model="form.description"
              rows="3"
              maxlength="255"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
            <p class="text-xs text-gray-500 mt-1">{{ form.description.length }}/255 символов</p>
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
            :disabled="saving || !form.name.trim()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {{ saving ? 'Сохранение...' : (editingOrganization ? 'Сохранить' : 'Создать') }}
          </button>
        </div>
      </form>
    </div>


  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import userService from '@/services/userService.js';
import { useAuth } from '@/composables/useAuth.js';
import { useOrganizationsStore } from '@/stores/organizations.js';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  editingOrganization: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'organizationSaved']);

const { getToken } = useAuth();
const organizationsStore = useOrganizationsStore();

const saving = ref(false);

const form = reactive({
  name: '',
  description: ''
});

const closeModal = () => {
  emit('close');
};

const resetForm = () => {
  form.name = '';
  form.description = '';
};

const editOrganization = (organization) => {
  form.name = organization.name || '';
  form.description = organization.description || '';
};

const saveOrganization = async () => {
  if (!form.name.trim()) {
    return;
  }
  
  saving.value = true;
  
  try {
    const token = await getToken();
    let result;
    
    if (props.editingOrganization) {
      result = await userService.updateOrganization(props.editingOrganization.id, form, token);
      await organizationsStore.loadOrganizations();
    } else {
      result = await userService.createOrganization(form, token);
      organizationsStore.addOrganization(result);
    }
    
    // Эмитим событие с результатом операции
    emit('organizationSaved', {
      action: props.editingOrganization ? 'updated' : 'created',
      organization: result
    });
    
    closeModal();
  } catch (err) {
    console.error('Error saving organization:', err);
  } finally {
    saving.value = false;
  }
};

// Сбрасываем форму при открытии модала или заполняем при редактировании
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    if (props.editingOrganization) {
      form.name = props.editingOrganization.name || '';
      form.description = props.editingOrganization.description || '';
    } else {
      resetForm();
    }
  }
});
</script> 