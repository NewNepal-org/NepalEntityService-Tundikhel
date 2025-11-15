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
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1><EntityName names={entity.names} /></h1>
      {renderEntityDetails()}
    </div>
  );
};

export default Entity;