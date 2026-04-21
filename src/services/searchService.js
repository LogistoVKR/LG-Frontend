class SearchService {
  constructor() {
    const apiBase = import.meta.env.VITE_API_BASE;
    this.baseUrl = `${apiBase.replace(/\/$/, '')}/warehouse-service`;
  }

  async searchItems(query, topK = 5) {
    const params = new URLSearchParams({
      query: query,
      topK: topK.toString()
    });

    const response = await fetch(`${this.baseUrl}/search/items?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

export default new SearchService();
