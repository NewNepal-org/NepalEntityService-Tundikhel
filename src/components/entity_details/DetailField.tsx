import React from 'react';

interface DetailFieldProps {
  label: string;
  labelNe?: string;
  children: React.ReactNode;
}

const DetailField: React.FC<DetailFieldProps> = ({ label, labelNe, children }) => {
  return (
    <tr>
      <td style={{ padding: '8px', fontWeight: 'bold', verticalAlign: 'top', width: '200px' }}>
        {label}:<br />
        {labelNe && <span style={{ color: '#666', fontSize: '0.9em', fontWeight: 'normal' }}>{labelNe}</span>}
      </td>
      <td style={{ padding: '8px', verticalAlign: 'top' }}>
        {children || <em>No value</em>}
      </td>
    </tr>
  );
};

export default DetailField;