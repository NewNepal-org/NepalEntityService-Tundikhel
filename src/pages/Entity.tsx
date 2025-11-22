import React from 'react';
import { useLocation } from 'react-router-dom';
import { useEntity } from '../hooks/useEntity';
import { createEntityId } from '../common/identifiers';
import { PersonDetails, OrganizationDetails, LocationDetails, EntityName } from '../components/entity_details';
import type { Person, Organization, Location } from '../common/nes-types';

const Entity: React.FC = () => {
  const location = useLocation();

  // Extract path after /entity/
  const entityPath = location.pathname.replace('/entity/', '');
  const entityId = entityPath ? createEntityId(entityPath) : null;

  const { entity, loading, error } = useEntity(entityId);

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
  if (!entity) return <div style={{ padding: '20px' }}>Entity not found</div>;

  const renderEntityDetails = () => {
    switch (entity.type) {
      case 'person':
        return <PersonDetails entity={entity as Person} />;
      case 'organization':
        return <OrganizationDetails entity={entity as Organization} />;
      case 'location':
        return <LocationDetails entity={entity as Location} />;
      default:
        return <div>Unknown entity type: {entity.type}</div>;
    }
  };

  return (
    <div style={{
      padding: '24px',
      maxWidth: '900px',
      margin: '0 auto',
      backgroundColor: 'var(--bg-secondary)',
      minHeight: '100vh',
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          margin: '0 0 8px 0',
          fontSize: '2rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          transition: 'color 0.3s ease'
        }}>
          <EntityName names={entity.names} />
        </h1>
        <div style={{
          fontSize: '0.9em',
          color: 'var(--text-secondary)',
          textTransform: 'capitalize',
          transition: 'color 0.3s ease'
        }}>
          {entity.type}{entity.sub_type ? ` • ${entity.sub_type.replace(/_/g, ' ')}` : ''}
        </div>
      </div>
      {renderEntityDetails()}
    </div>
  );
};

export default Entity;