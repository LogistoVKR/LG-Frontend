<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" @click="closeModal">
    <div class="bg-surface rounded-[var(--r-4)] w-full max-w-md mx-4" style="box-shadow: var(--shadow-3);" @click.stop>
      <div class="flex items-center justify-between px-6 py-4 border-b border-line">
        <h3 class="h3 text-ink">
          {{ editingOrganization ? 'Редактировать' : 'Создать' }} организацию
        </h3>
      </div>

      <form @submit.prevent="saveOrganization" class="p-6">
        <div class="space-y-4">
          <div>
            <label class="caption block mb-1">Название *</label>
            <input v-model="form.name" type="text" required maxlength="255" class="field">
            <p class="body-s text-ink-3 mt-1">{{ form.name.length }}/255 символов</p>
          </div>

          <div>
            <label class="caption block mb-1">Описание</label>
            <textarea v-model="form.description" rows="3" maxlength="255" class="field" style="height: auto; padding-top: 8px; padding-bottom: 8px;"></textarea>
            <p class="body-s text-ink-3 mt-1">{{ form.description.length }}/255 символов</p>
          </div>

          <div v-if="canManageOzonKey">
            <label class="caption block mb-1">Client ID Ozon</label>
            <input v-model="form.ozonClientId" type="text" maxlength="255" placeholder="Введите Client ID Ozon" class="field">
          </div>

          <div v-if="canManageOzonKey">
            <label class="caption block mb-1">API ключ Ozon</label>
            <div class="flex items-center gap-2">
              <input v-model="form.ozonApiKey" type="password" autocomplete="off" maxlength="255" :placeholder="ozonKeyPlaceholder" class="field flex-1">
              <button
                v-if="editingOrganization?.hasOzonIntegration"
                type="button"
                :disabled="deletingKey || saving"
                @click="removeOzonApiKey"
                class="btn btn-secondary btn-sm text-danger border-danger hover:bg-danger-soft disabled:opacity-50 whitespace-nowrap">
                {{ deletingKey ? 'Удаление...' : 'Удалить ключ' }}
              </button>
            </div>
            <p class="body-s text-ink-3 mt-1">
              <template v-if="editingOrganization?.hasOzonIntegration">
                Ключ установлен. Оставьте поле пустым, чтобы сохранить текущий ключ, или введите новое значение для замены.
              </template>
              <template v-else>
                Введите API ключ для интеграции с Ozon (необязательно)
              </template>
            </p>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 mt-6">
          <button type="button" @click="closeModal" class="btn btn-secondary">Отмена</button>
          <button type="submit" :disabled="saving || !form.name.trim()" class="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {{ saving ? 'Сохранение...' : (editingOrganization ? 'Сохранить' : 'Создать') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue';
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
const deletingKey = ref(false);

const form = reactive({
  name: '',
  description: '',
  ozonClientId: '',
  ozonApiKey: ''
});

const canManageOzonKey = computed(() => {
  if (!props.editingOrganization) return true;
  const role = props.editingOrganization.role;
  return role === 'OWNER' || role === 'ADMIN';
});

const ozonKeyPlaceholder = computed(() => {
  return props.editingOrganization?.hasOzonIntegration ? '••••••••••••' : '';
});

const closeModal = () => {
  emit('close');
};

const resetForm = () => {
  form.name = '';
  form.description = '';
  form.ozonClientId = '';
  form.ozonApiKey = '';
};

const saveOrganization = async () => {
  if (!form.name.trim()) {
    return;
  }

  saving.value = true;

  try {
    const token = await getToken();
    const payload = {
      name: form.name,
      description: form.description
    };
    if (canManageOzonKey.value) {
      payload.ozonClientId = form.ozonClientId.trim();
      if (form.ozonApiKey.trim() !== '') {
        payload.ozonApiKey = form.ozonApiKey;
      }
    }

    let result;

    if (props.editingOrganization) {
      result = await userService.updateOrganization(props.editingOrganization.id, payload, token);
      await organizationsStore.loadOrganizations();
    } else {
      result = await userService.createOrganization(payload, token);
      organizationsStore.addOrganization(result);
    }


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

const removeOzonApiKey = async () => {
  if (!props.editingOrganization?.id || !canManageOzonKey.value) return;
  if (!window.confirm('Удалить интеграцию Ozon для этой организации?')) return;

  deletingKey.value = true;
  try {
    const token = await getToken();
    await userService.deleteOzonApiKey(props.editingOrganization.id, token);
    await organizationsStore.loadOrganizations();
    emit('organizationSaved', {
      action: 'updated',
      organization: { ...props.editingOrganization, hasOzonIntegration: false }
    });
    closeModal();
  } catch (err) {
    console.error('Error deleting ozon api key:', err);
  } finally {
    deletingKey.value = false;
  }
};


watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    if (props.editingOrganization) {
      form.name = props.editingOrganization.name || '';
      form.description = props.editingOrganization.description || '';
      form.ozonClientId = props.editingOrganization.ozonClientId || '';
      form.ozonApiKey = '';
    } else {
      resetForm();
    }
  }
});
</script>