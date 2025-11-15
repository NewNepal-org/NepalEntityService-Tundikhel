import { getApiUrl } from '../config/environment';

interface SearchFilters {
  entity_type?: string;
  sub_type?: string;
  limit?: number;
  offset?: number;
}

class NESApiClient {
  get baseUrl(): string {
    return getApiUrl();
  }

  async request(endpoint: string, params: Record<string, unknown> = {}): Promise<unknown> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, String(params[key]));
      }
    });

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  async searchEntities(query: string, filters: SearchFilters = {}) {
    return this.request('/entities', { query, ...filters });
  }

  async getEntity(id: string) {
    return this.request(`/entities/${encodeURIComponent(id)}`);
  }
}

export default new NESApiClient();