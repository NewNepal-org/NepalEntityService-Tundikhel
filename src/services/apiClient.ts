import { getApiUrl } from '../config/environment';

interface SearchFilters {
  entity_type?: string;
  sub_type?: string;
  tags?: string[];
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
    const { tags, ...rest } = filters;
    return this.request('/entities', {
      query: query || undefined,
      ...rest,
      ...(tags && tags.length > 0 ? { tags: tags.join(',') } : {}),
    });
  }

  async getEntity(id: string) {
    return this.request(`/entities/${encodeURIComponent(id)}`);
  }

  async getTags(): Promise<string[]> {
    const data = await this.request('/entities/tags') as { tags: string[] };
    return data.tags ?? [];
  }
}

export default new NESApiClient();