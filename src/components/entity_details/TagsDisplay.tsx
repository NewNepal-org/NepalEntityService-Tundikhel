import React from 'react';

interface TagsDisplayProps {
  tags: string[];
}

const TagsDisplay: React.FC<TagsDisplayProps> = ({ tags }) => {
  if (!tags || tags.length === 0) {
    return <em>No tags</em>;
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {tags.map((tag, index) => (
        <span
          key={index}
          style={{
            display: 'inline-block',
            backgroundColor: 'var(--badge-bg)',
            color: 'var(--badge-text)',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '0.85em',
            fontWeight: '500',
            border: `1px solid var(--badge-border)`,
            transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease'
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default TagsDisplay;

