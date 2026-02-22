import React from 'react';

interface SubSectionHeaderProps {
  title: string;
}

const SubSectionHeader: React.FC<SubSectionHeaderProps> = ({ title }) => {
  return (
    <tr>
      <td colSpan={2} style={{ 
        padding: '8px', 
        backgroundColor: 'var(--table-header-bg)', 
        color: 'var(--text-inverse)',
        fontWeight: 'bold', 
        fontSize: '0.95em'
      }}>
        {title}
      </td>
    </tr>
  );
};

export default SubSectionHeader;