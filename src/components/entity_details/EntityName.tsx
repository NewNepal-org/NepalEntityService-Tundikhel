import React from 'react';
import type { Name } from '../../common/nes-types';

interface EntityNameProps {
  names: Name[];
  showPrimary?: boolean;
  style?: React.CSSProperties;
}

const EntityName: React.FC<EntityNameProps> = ({ names, style }) => {
  const primaryName = names.find(name => name.kind === 'PRIMARY');
  const name = primaryName || names[0];
  
  if (!name) return <span>Unknown</span>;
  
  const english = name.en?.full;
  const nepali = name.ne?.full;
  
  return (
    <span style={style}>
      {english && nepali ? (
        <>
          {english}<br />
          <span style={{ color: '#666', fontSize: '0.9em' }}>{nepali}</span>
        </>
      ) : (
        english || nepali || 'Unknown'
      )}
    </span>
  );
};

export default EntityName;