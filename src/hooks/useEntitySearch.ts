import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import type { Entity } from '../common/nes-types';

interface SearchFilters {
  entity_type?: string;
  sub_type?: string;
  limit?: number;
  offset?: number;
}

interface SearchResponse {
  entities: Entity[];
  total: number;
}

export function useEntitySearch(query: string, filters: SearchFilters = {}) {
  const [results, setResults] = useState<Entity[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filtersString = JSON.stringify(filters);

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
        const data = await apiClient.searchEntities(query, filters) as SearchResponse;
        setResults(data.entities || []);
        setTotal(data.total || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setResults([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchEntities, 300);
    return () => clearTimeout(timeoutId);
  }, [query, filtersString, filters]);

  return { results, total, loading, error };
}