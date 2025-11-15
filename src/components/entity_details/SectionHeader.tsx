import React from 'react';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <tr>
      <td colSpan={2} style={{ 
        padding: '12px 8px', 
        backgroundColor: '#2563eb', 
        color: 'white',
        fontWeight: 'bold', 
        fontSize: '1.1em',
        borderTop: '2px solid #ddd'
      }}>
        {title}
      </td>
    </tr>
  );
};

export default SectionHeader;