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

  if (loading) {
    return (
      <div style={{
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "var(--text-primary)"
      }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            border: "4px solid var(--border-light)",
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            marginBottom: "14px"
          }}
        />
        <span style={{ fontSize: "1rem", opacity: 0.8 }}>Loading entity…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: "40px 20px",
        textAlign: "center",
        color: "var(--error-text)"
      }}>
        <h3 style={{ marginBottom: "10px" }}>Something went wrong</h3>
        <p style={{ opacity: 0.85 }}>{error}</p>
      </div>
    );
  }

  if (!entity) {
    return (
      <div style={{
        padding: "40px 20px",
        textAlign: "center",
        color: "var(--text-primary)"
      }}>
        <h3 style={{ marginBottom: "10px" }}>Entity Not Found</h3>
        <p style={{ opacity: 0.7 }}>The entity you're looking for may not exist or the ID is incorrect.</p>
      </div>
    );
  }

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