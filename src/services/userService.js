import { authFetch } from './authFetch.js';

class UserService {
  constructor() {
    const apiBase = import.meta.env.VITE_API_BASE;
    this.baseUrl = `${apiBase.replace(/\/$/, '')}/user-service`;
  }

  getAuthHeaders(token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  async getOrganizations(token, page = 0, size = 100, name = null) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      });
      
      if (name && name.trim()) {
        params.append('name', name.trim());
      }
      
      const response = await authFetch(`${this.baseUrl}/organizations?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(token)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении организаций:', error);
      throw error;
    }
  }

  async createOrganization(data, token) {
    try {
      const response = await authFetch(`${this.baseUrl}/organizations`, {
        method: 'POST',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка при создании организации:', error);
      throw error;
    }
  }

  async updateOrganization(id, data, token) {
    try {
      const response = await authFetch(`${this.baseUrl}/organizations/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка при обновлении организации:', error);
      throw error;
    }
  }

  async deleteOrganization(id, token) {
    try {
      const response = await authFetch(`${this.baseUrl}/organizations/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(token)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Ошибка при удалении организации:', error);
      throw error;
    }
  }

  async getUsersByOrganizationId(organizationId, page = 0, size = 20, token, username = null, firstName = null, lastName = null, or = false) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      });
      
      if (username && username.trim()) {
        params.append('username', username.trim());
      }
      if (firstName && firstName.trim()) {
        params.append('firstName', firstName.trim());
      }
      if (lastName && lastName.trim()) {
        params.append('lastName', lastName.trim());
      }
      
      if (or) {
        params.append('or', 'true');
      }

      const response = await authFetch(`${this.baseUrl}/organizations/${organizationId}/users?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(token)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении пользователей организации:', error);
      throw error;
    }
  }

  async addUserToOrganization(data, token) {
    try {
      const response = await authFetch(`${this.baseUrl}/organizations/users`, {
        method: 'POST',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка при добавлении пользователя в организацию:', error);
      throw error;
    }
  }

  async updateUserInOrganization(data, token) {
    try {
      const response = await authFetch(`${this.baseUrl}/organizations/users`, {
        method: 'PUT',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка при обновлении пользователя в организации:', error);
      throw error;
    }
  }

  async removeUserFromOrganization(data, token) {
    try {
      const response = await authFetch(`${this.baseUrl}/organizations/users`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Ошибка при удалении пользователя из организации:', error);
      throw error;
    }
  }

  async getCurrentUser(token) {
    try {
      const response = await authFetch(`${this.baseUrl}/users/login`, {
        method: 'POST',
        headers: this.getAuthHeaders(token)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении информации о пользователе:', error);
      throw error;
    }
  }

  async searchAllUsers(searchTerm, token) {
    try {
      const params = new URLSearchParams({
        username: searchTerm,
        firstName: searchTerm,
        lastName: searchTerm,
        or: 'true'
      });

      const response = await authFetch(`${this.baseUrl}/users?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(token)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка при поиске пользователей:', error);
      throw error;
    }
  }

  async getOrganizationCounts(organizationId, token) {
    try {
      const response = await authFetch(`${this.baseUrl}/organizations/${organizationId}/counts`, {
        method: 'GET',
        headers: this.getAuthHeaders(token)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении количества сотрудников и клиентов:', error);
      throw error;
    }
  }
}

export default new UserService(); 