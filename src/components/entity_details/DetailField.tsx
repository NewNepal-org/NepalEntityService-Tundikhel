import React from 'react';

interface DetailFieldProps {
  label: string;
  labelNe?: string;
  children: React.ReactNode;
}

const DetailField: React.FC<DetailFieldProps> = ({ label, labelNe, children }) => {
  
 
  if (children === null || children === undefined || children === '' || (Array.isArray(children) && children.length === 0)) {
    return null;
  }

  return (
    <tr style={{ borderBottom: `1px solid var(--border-light)` }}>
      <td style={{
        padding: '12px 16px',
        fontWeight: '600',
        verticalAlign: 'top',
        width: '220px',
        backgroundColor: 'var(--bg-tertiary)',
        color: 'var(--text-primary)',
        fontSize: '0.95em',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        wordWrap: 'break-word',
        overflowWrap: 'anywhere',
        minWidth: '100px',
      }}>
        {label}
        {labelNe && (
          <><br /><span style={{ color: 'var(--text-secondary)', fontSize: '0.85em', fontWeight: 'normal' }}>{labelNe}</span></>
        )}
      </td>
      <td style={{
        padding: '12px 16px',
        verticalAlign: 'top',
        color: 'var(--text-primary)',
        lineHeight: '1.6',
        transition: 'color 0.3s ease'
      }}>
        {children}
      </td>
    </tr>
  );
};

export default DetailField;