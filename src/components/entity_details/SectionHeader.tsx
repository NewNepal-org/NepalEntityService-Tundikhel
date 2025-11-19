import React from 'react';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <tr>
      <td colSpan={2} style={{
        padding: '16px 20px',
        backgroundColor: 'var(--table-header-bg)',
        color: 'white',
        fontWeight: '600',
        fontSize: '1.05em',
        letterSpacing: '0.3px',
        borderTop: `2px solid var(--table-header-border)`,
        transition: 'background-color 0.3s ease, border-color 0.3s ease'
      }}>
        {title}
      </td>
    </tr>
  );
};

export default SectionHeader;