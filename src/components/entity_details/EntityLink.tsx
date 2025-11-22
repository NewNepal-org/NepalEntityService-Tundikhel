import React from 'react';
import { Link } from 'react-router-dom';
import { getEntityPath } from '../../common/identifiers';

interface EntityLinkProps {
  entityId: string;
  children?: React.ReactNode;
}

const EntityLink: React.FC<EntityLinkProps> = ({ entityId, children }) => {
  // Check if it's an entity ID format (starts with "entity:")
  if (entityId && entityId.startsWith('entity:')) {
    const path = getEntityPath(entityId);

    return (
      <Link
        to={`/entity/${path}`}
        style={{
          color: 'var(--link-color)',
          textDecoration: 'none',
          fontWeight: 500,
          borderBottom: `1px solid var(--link-color)`,
          transition: 'color 0.2s ease, border-color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--link-hover)';
          e.currentTarget.style.borderBottomColor = 'var(--link-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--link-color)';
          e.currentTarget.style.borderBottomColor = 'var(--link-color)';
        }}
      >
        {children || entityId}
      </Link>
    );
  }

  // If it's not an entity ID, just return the text
  return <>{children || entityId}</>;
};

export default EntityLink;

