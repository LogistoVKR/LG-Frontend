import { ref, computed } from 'vue';
import { useAuth } from './useAuth.js';
import userService from '@/services/userService.js';

export function useOrganizations() {
  const { getToken } = useAuth();
  
  // State
  const organizations = ref([]);
  const selectedOrganization = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Computed
  const hasOrganizations = computed(() => organizations.value.length > 0);
  const selectedOrganizationId = computed(() => selectedOrganization.value?.id);

  // Methods
  const loadOrganizations = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const token = await getToken();
      const result = await userService.getOrganizations(0, 100, token);
      organizations.value = result.content || [];
      
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

  return {
    // State
    organizations,
    selectedOrganization,
    loading,
    error,
    
    // Computed
    hasOrganizations,
    selectedOrganizationId,
    
    // Methods
    loadOrganizations,
    selectOrganization,
    getSelectedOrganizationFromStorage
  };
} 