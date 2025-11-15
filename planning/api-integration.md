# API Integration Plan

## Nepal Entity Service API Integration

**Tundikhel Playground Purpose**: This frontend serves as a testing playground for the Nepal Entity Service, allowing developers to test API functionality against both production and local development instances.

### Environment Configuration

```javascript
const ENVIRONMENTS = {
  PRODUCTION: 'https://nes.newnepal.org',
  LOCAL: 'http://localhost:5173'
};

const API_CONFIG = {
  timeout: 10000, // 10 seconds
  apiPath: '/api', // Always appended to base URL
  rateLimit: {
    perMinute: 100,
    perHour: 1000
  }
};

// Get current environment from localStorage or default to production
const getCurrentEnvironment = () => {
  return localStorage.getItem('nes_environment') || 'PRODUCTION';
};

const getApiBaseUrl = () => {
  const env = getCurrentEnvironment();
  return `${ENVIRONMENTS[env]}${API_CONFIG.apiPath}`;
};
```

## Core API Endpoints

### 1. Entity Search and Listing
```
GET /api/entities
```

**Parameters**:
- `query`: Search term (English or Nepali)
- `entity_type`: person | organization | location
- `sub_type`: political_party, government_body, etc.
- `limit`: Results per page (default: 20, max: 100)
- `offset`: Pagination offset
- `attributes`: JSON filter for entity attributes

**Usage Examples**:
```javascript
// Search for politicians
fetch(`${API_BASE_URL}/entities?query=poudel&entity_type=person`)

// Get political parties
fetch(`${API_BASE_URL}/entities?entity_type=organization&sub_type=political_party`)

// Search in Nepali
fetch(`${API_BASE_URL}/entities?query=राम चन्द्र पौडेल`)
```

### 2. Entity Details
```
GET /api/entities/{id}
```

**Usage**:
```javascript
// Get specific entity
fetch(`${API_BASE_URL}/entities/entity:person/ram-chandra-poudel`)
```

### 3. Entity Relationships
```
GET /api/entities/{id}/relationships
GET /api/relationships
```

**Parameters**:
- `relationship_type`: MEMBER_OF, AFFILIATED_WITH, EMPLOYED_BY, etc.
- `source_entity_id`: Filter by source entity
- `target_entity_id`: Filter by target entity
- `currently_active`: true/false for active relationships

**Usage**:
```javascript
// Get all relationships for an entity
fetch(`${API_BASE_URL}/entities/entity:person/ram-chandra-poudel/relationships`)

// Find party members
fetch(`${API_BASE_URL}/relationships?relationship_type=MEMBER_OF&target_entity_id=entity:organization/political_party/nepali-congress`)
```

### 4. Version History
```
GET /api/entities/{id}/versions
```

**Usage**:
```javascript
// Get entity version history
fetch(`${API_BASE_URL}/entities/entity:person/ram-chandra-poudel/versions`)
```

### 5. Schema Discovery
```
GET /api/schemas
```

**Usage**:
```javascript
// Get available entity types and subtypes
fetch(`${API_BASE_URL}/schemas`)
```

## API Client Implementation

### Environment Switcher Component

```javascript
function EnvironmentSwitcher() {
  const [currentEnv, setCurrentEnv] = useState(getCurrentEnvironment());

  const switchEnvironment = (env) => {
    localStorage.setItem('nes_environment', env);
    setCurrentEnv(env);
    window.location.reload(); // Reload to apply new API base URL
  };

  return (
    <div className={`env-switcher ${currentEnv.toLowerCase()}`}>
      <span>API: </span>
      <select value={currentEnv} onChange={(e) => switchEnvironment(e.target.value)}>
        <option value="PRODUCTION">Production</option>
        <option value="LOCAL">Local</option>
      </select>
      {currentEnv === 'LOCAL' && (
        <span className="warning">⚠️ Local Dev</span>
      )}
    </div>
  );
}
```

### Base API Client

```javascript
class NESApiClient {
  constructor() {
    this.requestCount = { minute: 0, hour: 0 };
    this.resetCounters();
  }

  get baseUrl() {
    return getApiBaseUrl(); // Dynamic base URL
  }

  async request(endpoint, params = {}) {
    // Rate limiting check
    if (this.requestCount.minute >= RATE_LIMIT.perMinute) {
      throw new Error('Rate limit exceeded (per minute)');
    }
    if (this.requestCount.hour >= RATE_LIMIT.perHour) {
      throw new Error('Rate limit exceeded (per hour)');
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    try {
      const response = await fetch(url, {
        timeout: API_TIMEOUT,
        headers: {
          'Accept': 'application/json',
        }
      });

      this.requestCount.minute++;
      this.requestCount.hour++;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  resetCounters() {
    // Reset minute counter every minute
    setInterval(() => {
      this.requestCount.minute = 0;
    }, 60000);

    // Reset hour counter every hour
    setInterval(() => {
      this.requestCount.hour = 0;
    }, 3600000);
  }

  // Entity methods
  async searchEntities(query, filters = {}) {
    return this.request('/entities', { query, ...filters });
  }

  async getEntity(id) {
    return this.request(`/entities/${id}`);
  }

  async getEntityRelationships(id, filters = {}) {
    return this.request(`/entities/${id}/relationships`, filters);
  }

  async getEntityVersions(id) {
    return this.request(`/entities/${id}/versions`);
  }

  async getRelationships(filters = {}) {
    return this.request('/relationships', filters);
  }

  async getSchemas() {
    return this.request('/schemas');
  }
}

}

export default new NESApiClient();
```

## React Hooks for API Integration

### useEntity Hook

```javascript
import { useState, useEffect } from 'react';
import apiClient from './apiClient';

export function useEntity(entityId) {
  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!entityId) return;

    const fetchEntity = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getEntity(entityId);
        setEntity(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEntity();
  }, [entityId]);

  return { entity, loading, error };
}
```

### useEntitySearch Hook

```javascript
export function useEntitySearch(query, filters = {}) {
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setTotal(0);
      return;
    }

    const searchEntities = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.searchEntities(query, filters);
        setResults(data.entities || []);
        setTotal(data.total || 0);
      } catch (err) {
        setError(err.message);
        setResults([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchEntities, 300);
    return () => clearTimeout(timeoutId);
  }, [query, JSON.stringify(filters)]);

  return { results, total, loading, error };
}
```

### useEntityRelationships Hook

```javascript
export function useEntityRelationships(entityId, filters = {}) {
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!entityId) return;

    const fetchRelationships = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getEntityRelationships(entityId, filters);
        setRelationships(data.relationships || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRelationships();
  }, [entityId, JSON.stringify(filters)]);

  return { relationships, loading, error };
}
```

## Caching Strategy

### Local Storage Cache

```javascript
class CacheManager {
  constructor(ttl = 300000) { // 5 minutes default TTL
    this.ttl = ttl;
  }

  set(key, data) {
    const item = {
      data,
      timestamp: Date.now(),
      ttl: this.ttl
    };
    localStorage.setItem(`nes_cache_${key}`, JSON.stringify(item));
  }

  get(key) {
    const item = localStorage.getItem(`nes_cache_${key}`);
    if (!item) return null;

    const parsed = JSON.parse(item);
    const now = Date.now();

    if (now - parsed.timestamp > parsed.ttl) {
      localStorage.removeItem(`nes_cache_${key}`);
      return null;
    }

    return parsed.data;
  }

  clear() {
    Object.keys(localStorage)
      .filter(key => key.startsWith('nes_cache_'))
      .forEach(key => localStorage.removeItem(key));
  }
}

export default new CacheManager();
```

## Error Handling

### API Error Types

```javascript
export class APIError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
  }
}

export class RateLimitError extends APIError {
  constructor(message) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

export class NotFoundError extends APIError {
  constructor(message) {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}
```

### Error Boundary Component

```javascript
import React from 'react';

class APIErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('API Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default APIErrorBoundary;
```

## Performance Optimization

### Request Deduplication

```javascript
class RequestDeduplicator {
  constructor() {
    this.pendingRequests = new Map();
  }

  async request(key, requestFn) {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    const promise = requestFn().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }
}

export default new RequestDeduplicator();
```

### Pagination Helper

```javascript
export function usePagination(fetchFn, pageSize = 20) {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);
      
      const offset = items.length;
      const data = await fetchFn({ limit: pageSize, offset });
      
      setItems(prev => [...prev, ...data.entities]);
      setHasMore(data.entities.length === pageSize);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setItems([]);
    setHasMore(true);
    setError(null);
  };

  return { items, hasMore, loading, error, loadMore, reset };
}
```

## Testing Strategy

### API Mock for Development

```javascript
export const mockApiClient = {
  async searchEntities(query, filters) {
    return {
      entities: [
        {
          id: 'entity:person/harka-sampang',
          names: [{ kind: 'PRIMARY', en: { full: 'Harka Sampang' } }],
          type: 'person',
          attributes: { party: 'nepal-communist-party' }
        }
      ],
      total: 1,
      limit: 20,
      offset: 0
    };
  },

  async getEntity(id) {
    return {
      id,
      names: [{ kind: 'PRIMARY', en: { full: 'Harka Sampang' } }],
      type: 'person',
      attributes: { party: 'nepal-communist-party' }
    };
  }
};
```

This integration plan provides a solid foundation for consuming the Nepal Entity Service API in the Tundikhel frontend application.