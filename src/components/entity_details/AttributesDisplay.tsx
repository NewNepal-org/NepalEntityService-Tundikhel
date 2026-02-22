import React from 'react';
import type { LangText } from '../../common/nes-types';
import LangTextComponent from './LangText';

interface AttributesDisplayProps {
  attributes: { [key: string]: unknown };
}

const AttributesDisplay: React.FC<AttributesDisplayProps> = ({ attributes }) => {
  const renderValue = (value: unknown, key: string): React.ReactNode => {

    // Handle LangText objects
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      ('en' in value || 'ne' in value)
    ) {
      try {
        const langText = value as LangText;

        if (
          (langText.en && typeof langText.en === 'object' && 'value' in langText.en) ||
          (langText.ne && typeof langText.ne === 'object' && 'value' in langText.ne)
        ) {
          return <LangTextComponent text={langText} />;
        }
      } catch {
        console.error('Error rendering LangText:', value);
        return <em style={{ color: 'var(--text-tertiary)' }}>Error rendering LangText</em>;
      }
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return (
        <ul style={{ 
          margin: '4px 0', 
          paddingLeft: '20px',
          listStyleType: 'disc'
        }}>
          {value.map((item, index) => (
            <li key={index} style={{ 
              marginBottom: '6px',
              color: 'var(--text-primary)'
            }}>
              {renderValue(item, `${key}[${index}]`)}
            </li>
          ))}
        </ul>
      );
    }

    // Handle nested objects
    if (value && typeof value === 'object') {
      return (
        <div style={{ 
          marginTop: '8px',
          marginLeft: '12px',
          paddingLeft: '12px',
          borderLeft: '3px solid var(--border-color)'
        }}>
          {Object.entries(value).map(([nestedKey, nestedValue]) => (
            <div
              key={nestedKey}
              style={{
                marginBottom: '8px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              <div
                style={{
                  fontSize: '0.85em',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {nestedKey}
              </div>
              <div
                style={{
                  fontSize: '0.92em',
                  color: 'var(--text-primary)',
                  paddingLeft: '8px'
                }}
              >
                {renderValue(nestedValue, `${key}.${nestedKey}`)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Null / undefined
    if (value === null || value === undefined) {
      return null;
    }

    // Boolean
    if (typeof value === 'boolean') {
      return (
        <span
          style={{
            display: 'inline-block',
            backgroundColor: value ? '#d4edda' : '#f8d7da',
            color: value ? '#155724' : '#721c24',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '0.85em',
            fontWeight: 600,
            border: value ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
          }}
        >
          {value ? '✓ true' : '✗ false'}
        </span>
      );
    }

    // Default: string, number, etc.
    return <span style={{ color: 'var(--text-primary)' }}>{String(value)}</span>;
  };

  return (
    <div style={{ 
      display: 'grid',
      gap: '12px',
      marginTop: '8px'
    }}>
      {Object.entries(attributes).map(([key, value]) => (
        <div
          key={key}
          style={{
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-primary)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            padding: '12px 16px',
            color: 'var(--text-primary)',
            lineHeight: '1.6',
            fontSize: '0.95em'
          }}
        >
          <div
            style={{
              fontWeight: 600,
              marginBottom: '8px',
              color: 'var(--text-secondary)',
              fontSize: '0.9em',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {key}
          </div>
          <div>
            {renderValue(value, key)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttributesDisplay;
