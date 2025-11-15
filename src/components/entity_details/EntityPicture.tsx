import React from 'react';
import type { EntityPicture as EntityPictureType } from '../../common/nes-types';

interface EntityPictureProps {
  pictures?: EntityPictureType[] | null;
  alt: string;
  size?: number;
  style?: React.CSSProperties;
}

const EntityPicture: React.FC<EntityPictureProps> = ({ 
  pictures, 
  alt, 
  size = 150,
  style 
}) => {
  if (!pictures || pictures.length === 0) return null;
  
  const picture = pictures[0];
  
  return (
    <img 
      src={picture.url} 
      alt={alt}
      style={{
        width: size,
        height: size,
        objectFit: 'cover',
        borderRadius: '8px',
        ...style
      }}
    />
  );
};

export default EntityPicture;