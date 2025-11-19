import React from 'react';
import type { LangText } from '../../common/nes-types';
import LangTextComponent from './LangText';

interface AttributesDisplayProps {
  attributes: { [key: string]: unknown };
}

const AttributesDisplay: React.FC<AttributesDisplayProps> = ({ attributes }) => {
  const renderValue = (value: unknown, key: string): React.ReactNode => {
    // Handle LangText objects
    if (value && typeof value === 'object' && !Array.isArray(value) && ('en' in value || 'ne' in value)) {
      try {
        const langText = value as LangText;
        // Check if it has the LangText structure
        if ((langText.en && typeof langText.en === 'object' && 'value' in langText.en) ||
            (langText.ne && typeof langText.ne === 'object' && 'value' in langText.ne)) {
          return <LangTextComponent text={langText} />;
        }
      } catch {
        // Fall through to other handling
      }
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return (
        <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
          {value.map((item, index) => (
            <li key={index} style={{ marginBottom: '4px' }}>
              {renderValue(item, `${key}[${index}]`)}
            </li>
          ))}
        </ul>
      );
    }

    // Handle objects (nested)
    if (value && typeof value === 'object') {
      return (
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.9em',
          marginTop: '4px',
          border: `1px solid var(--border-light)`,
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <tbody>
            {Object.entries(value).map(([nestedKey, nestedValue]) => (
              <tr key={nestedKey} style={{ borderBottom: `1px solid var(--border-light)` }}>
                <td style={{
                  padding: '6px 10px',
                  fontWeight: '600',
                  verticalAlign: 'top',
                  width: '30%',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-tertiary)',
                  fontSize: '0.9em'
                }}>
                  {nestedKey}
                </td>
                <td style={{ padding: '6px 10px', verticalAlign: 'top' }}>
                  {renderValue(nestedValue, `${key}.${nestedKey}`)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // Handle strings, numbers, booleans, null
    if (value === null || value === undefined) {
      return <em style={{ color: 'var(--text-tertiary)' }}>null</em>;
    }

    if (typeof value === 'boolean') {
      return (
        <span style={{
          backgroundColor: value ? 'var(--success-bg)' : 'var(--error-bg)',
          color: value ? 'var(--success-text)' : 'var(--error-text)',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '0.85em',
          fontWeight: 'bold',
          transition: 'background-color 0.3s ease, color 0.3s ease'
        }}>
          {value ? 'true' : 'false'}
        </span>
      );
    }

    return <span>{String(value)}</span>;
  };

  return (
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '0.95em',
      marginTop: '4px'
    }}>
      <tbody>
        {Object.entries(attributes).map(([key, value]) => (
          <tr key={key} style={{ borderBottom: `1px solid var(--border-light)`, transition: 'border-color 0.3s ease' }}>
            <td style={{
              padding: '8px 12px',
              fontWeight: '600',
              verticalAlign: 'top',
              width: '30%',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-tertiary)',
              transition: 'color 0.3s ease, background-color 0.3s ease'
            }}>
              {key}
            </td>
            <td style={{
              padding: '8px 12px',
              verticalAlign: 'top',
              color: 'var(--text-primary)',
              transition: 'color 0.3s ease'
            }}>
              {renderValue(value, key)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AttributesDisplay;

