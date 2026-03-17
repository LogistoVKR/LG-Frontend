import { useAuth } from '@/composables/useAuth.js';
import { authFetch } from './authFetch.js';

class ItemService {
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

  async getItems(searchParams) {
    const params = new URLSearchParams({
      organizationId: searchParams.organizationId,
      page: searchParams.page.toString(),
      size: searchParams.size.toString()
    });
    
    if (searchParams.name) {
      params.append('name', searchParams.name);
    }
    if (searchParams.sku) {
      params.append('sku', searchParams.sku);
    }
    if (searchParams.barcode) {
      params.append('barcode', searchParams.barcode);
    }
    
    if (searchParams.or) {
      params.append('or', searchParams.or);
    }
    
    const response = await authFetch(`${this.baseUrl}/items?${params}`, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async getItemById(id) {
    const response = await authFetch(`${this.baseUrl}/items/${id}`, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async createItem({ name, description, organizationId }) {
    const body = {
      name: name.slice(0, 255),
      description: description ? description.slice(0, 255) : '',
      organizationId
    };
    const response = await authFetch(`${this.baseUrl}/items`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async updateItem(id, { name, description }) {
    const body = {};
    if (name) body.name = name.slice(0, 255);
    if (description) body.description = description.slice(0, 255);
    const response = await authFetch(`${this.baseUrl}/items/${id}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async deleteItem(id) {
    const response = await authFetch(`${this.baseUrl}/items/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return true;
  }

  async getItemVariants(id, page = 0, size = 5) {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
    const response = await authFetch(`${this.baseUrl}/items/${id}/variants?${params}`, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async createItemVariant({ sku, barcode, itemId, price, currency }) {
    const body = {
      sku: sku.slice(0, 255),
      barcode: barcode ? barcode.slice(0, 255) : '',
      itemId,
      price,
      currency
    };
    const response = await authFetch(`${this.baseUrl}/items/variants`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async updateItemVariant(id, { sku, barcode, price, currency }) {
    const body = {};
    if (sku) body.sku = sku.slice(0, 255);
    if (barcode) body.barcode = barcode.slice(0, 255);
    if (price !== undefined) body.price = price;
    if (currency) body.currency = currency;
    const response = await authFetch(`${this.baseUrl}/items/variants/${id}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async deleteItemVariant(id) {
    const response = await authFetch(`${this.baseUrl}/items/variants/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return true;
  }

  async getCurrencies() {
    const response = await authFetch(`${this.baseUrl}/currencies`, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async getVariantCounts(variantId) {
    const response = await authFetch(`${this.baseUrl}/items/variants/${variantId}/counts`, {
      method: 'GET',
      headers: await this.getAuthHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }
}

export default new ItemService(); 