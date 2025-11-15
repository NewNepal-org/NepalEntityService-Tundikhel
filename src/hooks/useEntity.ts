import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import type { Entity } from '../common/nes-types';

export function useEntity(entityId: string | null) {
  const [entity, setEntity] = useState<Entity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!entityId) {
      setEntity(null);
      return;
    }

    const fetchEntity = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getEntity(entityId) as Entity;
        setEntity(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setEntity(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEntity();
  }, [entityId]);

  return { entity, loading, error };
}