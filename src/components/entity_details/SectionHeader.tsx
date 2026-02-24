import React from 'react';

interface SectionHeaderProps {
  title: string;
  titleNe?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, titleNe }) => {
  return (
    <tr>
      <td colSpan={2} style={{
        padding: '14px 16px',
        fontWeight: '700',
        fontSize: '1.05em',
        backgroundColor: 'var(--table-header-bg)',
        color: 'var(--text-inverse)',
        borderTop: `2px solid var(--border-color)`,
        borderBottom: `1px solid var(--border-color)`,
        transition: 'background-color 0.3s ease'
      }}>
        {title}
        {titleNe && (
          <span style={{ marginLeft: '8px', fontWeight: '600' }}>/ {titleNe}</span>
        )}
      </td>
    </tr>
  );
};

export default SectionHeader;