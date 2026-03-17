import { useAuth } from '@/composables/useAuth.js';
import { authFetch } from './authFetch.js';

class WarehouseService {
  constructor() {
    const apiBase = import.meta.env.VITE_API_BASE;
    this.baseUrl = `${apiBase.replace(/\/$/, '')}/warehouse-service`;
  }

  async getAuthHeaders() {
    const { getToken } = useAuth();
    const token = await getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  async getPointsOfStorage(organizationId, searchParams = {}) {
    try {
      const params = new URLSearchParams({
        organizationId: organizationId,
        page: searchParams.page.toString(),
        size: searchParams.size.toString()
      });

      if (searchParams.name && searchParams.name.trim()) {
        params.append('name', searchParams.name.trim());
      }
      if (searchParams.location && searchParams.location.trim()) {
        params.append('location', searchParams.location.trim());
      }
      if (searchParams.type && searchParams.type.trim()) {
        params.append('type', searchParams.type.trim());
      }
      
      if (searchParams.name || searchParams.location) {
        params.append('or', 'true');
      }

      const response = await authFetch(`${this.baseUrl}/points-of-storage?${params}`, {
        method: 'GET',
        headers: await this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении точек хранения:', error);
      throw error;
    }
  }

  async getPointOfStorage(id) {
    try {
      const response = await authFetch(`${this.baseUrl}/points-of-storage/${id}`, {
        method: 'GET',
        headers: await this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении точки хранения:', error);
      throw error;
    }
  }

  async createPointOfStorage(data) {
    try {
      const response = await authFetch(`${this.baseUrl}/points-of-storage`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка при создании точки хранения:', error);
      throw error;
    }
  }

  async updatePointOfStorage(id, data) {
    try {
      const response = await authFetch(`${this.baseUrl}/points-of-storage/${id}`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка при обновлении точки хранения:', error);
      throw error;
    }
  }

  async deletePointOfStorage(id) {
    try {
      const response = await authFetch(`${this.baseUrl}/points-of-storage/${id}`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Ошибка при удалении точки хранения:', error);
      throw error;
    }
  }

  async getCurrencies() {
    try {
      const response = await authFetch(`${this.baseUrl}/currencies`, {
        method: 'GET',
        headers: await this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении валют:', error);
      throw error;
    }
  }

  async getItemMovements(organizationId, filters = {}, pageable = {}) {
    try {
      const params = new URLSearchParams({
        organizationId: organizationId,
        page: (pageable.page || 0).toString(),
        size: (pageable.size || 20).toString()
      });

      if (pageable.sort) {
        params.append('sort', pageable.sort);
      }

      if (filters.fromPointOfStorageId) {
        params.append('fromPointOfStorageId', filters.fromPointOfStorageId);
      }
      if (filters.toPointOfStorageId) {
        params.append('toPointOfStorageId', filters.toPointOfStorageId);
      }
      if (filters.type) {
        params.append('type', filters.type);
      }
      if (filters.itemVariantId) {
        params.append('itemVariantId', filters.itemVariantId);
      }
      if (filters.from) {
        params.append('from', filters.from);
      }
      if (filters.to) {
        params.append('to', filters.to);
      }

      const response = await authFetch(`${this.baseUrl}/items/movements?${params}`, {
        method: 'GET',
        headers: await this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении перемещений товаров:', error);
      throw error;
    }
  }

  async createItemMovement(data) {
    try {
      const response = await authFetch(`${this.baseUrl}/items/movements`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при создании перемещения товара:', error);
      throw error;
    }
  }

  async updateItemMovement(id, data) {
    try {
      const response = await authFetch(`${this.baseUrl}/items/movements/${id}`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при обновлении перемещения товара:', error);
      throw error;
    }
  }

  async deleteItemMovement(id) {
    try {
      const response = await authFetch(`${this.baseUrl}/items/movements/${id}`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('Ошибка при удалении перемещения товара:', error);
      throw error;
    }
  }

  async getItemVariantPointOfStorageCount(organizationId) {
    try {
      const response = await authFetch(`${this.baseUrl}/organizations/${organizationId}/counts`, {
        method: 'GET',
        headers: await this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении количества товаров и складов:', error);
      throw error;
    }
  }
}

export default new WarehouseService(); 