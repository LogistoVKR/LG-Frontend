import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import userService from '@/services/userService.js';
import { useAuth } from '@/composables/useAuth.js';

export const useOrganizationsStore = defineStore('organizations', () => {
  const { getToken } = useAuth();
  
  // State
  const organizations = ref([]);
  const selectedOrganization = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Computed
  const hasOrganizations = computed(() => organizations.value.length > 0);
  const selectedOrganizationId = computed(() => selectedOrganization.value?.id);

  // Actions
  const loadOrganizations = async (name = null) => {
    loading.value = true;
    error.value = null;
    
    try {
      const token = await getToken();
      const result = await userService.getOrganizations(token, 0, 100, name);
      organizations.value = Array.isArray(result.content) ? result.content : [];
      
      // Восстанавливаем выбранную организацию из localStorage
      getSelectedOrganizationFromStorage();
      
      // Если есть организации и не выбрана, выбираем первую
      if (organizations.value.length > 0 && !selectedOrganization.value) {
        selectedOrganization.value = organizations.value[0];
        localStorage.setItem('selectedOrganizationId', organizations.value[0].id);
      }
    } catch (err) {
      error.value = 'Ошибка при загрузке организаций: ' + err.message;
      console.error('Error loading organizations:', err);
    } finally {
      loading.value = false;
    }
  };

  const selectOrganization = (organization) => {
    selectedOrganization.value = organization;
    // Сохраняем выбор в localStorage
    localStorage.setItem('selectedOrganizationId', organization.id);
  };

  const getSelectedOrganizationFromStorage = () => {
    const savedId = localStorage.getItem('selectedOrganizationId');
    
    if (savedId && organizations.value.length > 0) {
      const org = organizations.value.find(o => o.id === savedId);
      if (org) {
        selectedOrganization.value = org;
      } else {
        // Если сохраненная организация не найдена, выбираем первую
        if (organizations.value.length > 0) {
          selectedOrganization.value = organizations.value[0];
          localStorage.setItem('selectedOrganizationId', organizations.value[0].id);
        }
      }
    }
  };

  // Метод для добавления новой организации и автоматического выбора её
  const addOrganization = (organization) => {
    const existingIndex = organizations.value.findIndex(org => org.id === organization.id);
    if (existingIndex === -1) {
      organizations.value.push(organization);
    } else {
      organizations.value[existingIndex] = organization;
    }
    
    // Автоматически выбираем новую организацию
    selectedOrganization.value = organization;
    localStorage.setItem('selectedOrganizationId', organization.id);
  };

  return {
    // State
    organizations,
    selectedOrganization,
    loading,
    error,
    
    // Computed
    hasOrganizations,
    selectedOrganizationId,
    
    // Actions
    loadOrganizations,
    selectOrganization,
    getSelectedOrganizationFromStorage,
    addOrganization
  };
}); 