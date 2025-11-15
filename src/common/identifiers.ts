import type { EntityType, EntitySubType } from './nes-types';

interface EntityIdParts {
  entityType: EntityType;
  subType?: EntitySubType;
  slug: string;
}

export function breakEntityId(entityId: string): EntityIdParts {
  // Remove "entity:" prefix
  const withoutPrefix = entityId.replace(/^entity:/, '');
  
  // Split by "/"
  const parts = withoutPrefix.split('/');
  
  if (parts.length === 2) {
    // Format: entity:type/slug
    return {
      entityType: parts[0] as EntityType,
      slug: parts[1]
    };
  } else if (parts.length === 3) {
    // Format: entity:type/subtype/slug
    return {
      entityType: parts[0] as EntityType,
      subType: parts[1] as EntitySubType,
      slug: parts[2]
    };
  }
  
  throw new Error(`Invalid entity ID format: ${entityId}`);
}

export function getEntityPath(entityId: string): string {
  // Remove "entity:" prefix and return the path
  return entityId.replace(/^entity:/, '');
}

export function createEntityId(path: string): string {
  // Add "entity:" prefix to path
  return `entity:${path}`;
}