import React from 'react';
import { useLocation } from 'react-router-dom';
import { useEntity } from '../hooks/useEntity';
import { createEntityId } from '../common/identifiers';
import { PersonDetails, OrganizationDetails, LocationDetails, ProjectDetails, NGODetails, InternationalOrgDetails, EntityName } from '../components/entity_details';
import type { Person, Organization, Location, Project } from '../common/nes-types';

const Entity: React.FC = () => {
  const location = useLocation();

  // Extract path after /entity/
  const entityPath = location.pathname.replace('/entity/', '');
  const entityId = entityPath ? createEntityId(entityPath) : null;

  const { entity, loading, error } = useEntity(entityId);

  if (loading) {
    return (
      <div style={{
        padding: "40px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "var(--text-primary)",
        width: '100%',
        boxSizing: 'border-box',
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
        padding: "40px 16px",
        textAlign: "center",
        color: "var(--error-text)",
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <h3 style={{ marginBottom: "10px" }}>Something went wrong</h3>
        <p style={{ opacity: 0.85, wordWrap: 'break-word' }}>{error}</p>
      </div>
    );
  }

  if (!entity) {
    return (
      <div style={{
        padding: "40px 16px",
        textAlign: "center",
        color: "var(--text-primary)",
        width: '100%',
        boxSizing: 'border-box',
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
        // Route to specific organization detail components based on sub_type
        if (entity.sub_type === 'ngo') {
          return <NGODetails entity={entity as Organization} />;
        } else if (entity.sub_type === 'international_org') {
          return <InternationalOrgDetails entity={entity as Organization} />;
        } else {
          return <OrganizationDetails entity={entity as Organization} />;
        }
      case 'location':
        return <LocationDetails entity={entity as Location} />;
      case 'project':
        return <ProjectDetails entity={entity as Project} />;
      default:
        return <div>Unknown entity type: {entity.type}</div>;
    }
  };

  return (
    <div style={{
      padding: '16px',
      maxWidth: '100%',
      margin: '0 auto',
      backgroundColor: 'var(--bg-secondary)',
      minHeight: '100vh',
      boxSizing: 'border-box',
      overflowWrap: 'break-word',
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          margin: '0 0 8px 0',
          fontSize: '1.8rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          transition: 'color 0.3s ease',
          wordWrap: 'break-word'
        }}>
          <EntityName names={entity.names} />
        </h1>
        <div style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          textTransform: 'capitalize',
          transition: 'color 0.3s ease',
          wordWrap: 'break-word'
        }}>
          {entity.type}{entity.sub_type ? ` • ${entity.sub_type.replace(/_/g, ' ')}` : ''}
        </div>
      </div>
      {renderEntityDetails()}
    </div>
  );
};

export default Entity;
