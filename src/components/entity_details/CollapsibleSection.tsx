import React, { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  titleNe?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  titleNe, 
  children, 
  defaultOpen = false 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => setIsOpen(prev => !prev);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <>
      <tr>
        <td 
          colSpan={2} 
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          aria-label={`${title} ${titleNe ? `/ ${titleNe}` : ''}`}
          style={{
            padding: '14px 16px',
            fontWeight: '600',
            fontSize: '1em',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: `1px solid var(--border-color)`,
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
        >
          <span style={{ marginRight: '8px' }} aria-hidden="true">{isOpen ? '▼' : '▶'}</span>
          {title}
          {titleNe && (
            <span style={{ marginLeft: '8px', fontWeight: '500', color: 'var(--text-secondary)' }}>/ {titleNe}</span>
          )}
        </td>
      </tr>
      {isOpen && children}
    </>
  );
};

export default CollapsibleSection;
