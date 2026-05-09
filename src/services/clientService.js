import { useAuth } from '@/composables/useAuth.js';
import { authFetch } from './authFetch.js';

class ClientService {
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

  async getClientsByOrganization(organizationId, page = 0, size = 20, token, firstName = null, lastName = null, dateOfBirth = null) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });

    if (firstName && firstName.trim()) {
      params.append('firstName', firstName.trim());
    }
    if (lastName && lastName.trim()) {
      params.append('lastName', lastName.trim());
    }
    if (dateOfBirth && dateOfBirth.trim()) {
      params.append('dateOfBirth', dateOfBirth.trim());
    }

    const response = await authFetch(`${this.baseUrl}/organizations/${organizationId}/clients?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async createClient(organizationId, data, token) {

    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      dateOfBirth: data.dateOfBirth,
      email: data.email,
      phoneNumber: data.phoneNumber,
      organizationId: organizationId
    };
    if (data.personalDiscount !== null && data.personalDiscount !== undefined && data.personalDiscount !== '') {
      payload.personalDiscount = Number(data.personalDiscount);
    }
    const body = JSON.stringify(payload);
    const response = await authFetch(`${this.baseUrl}/clients`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async updateClient(organizationId, clientId, data, token) {

    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      dateOfBirth: data.dateOfBirth,
      email: data.email,
      phoneNumber: data.phoneNumber
    };
    if (data.personalDiscount !== null && data.personalDiscount !== undefined && data.personalDiscount !== '') {
      payload.personalDiscount = Number(data.personalDiscount);
    }
    const body = JSON.stringify(payload);
    const response = await authFetch(`${this.baseUrl}/clients/${clientId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      body
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async deleteClient(organizationId, clientId, token) {
    const response = await authFetch(`${this.baseUrl}/clients/${clientId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(token)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  }
}

export default new ClientService();