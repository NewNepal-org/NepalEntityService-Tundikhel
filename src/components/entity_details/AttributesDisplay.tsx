import React from 'react';
import type { LangText } from '../../common/nes-types';
import LangTextComponent from './LangText';

interface AttributesDisplayProps {
  attributes: { [key: string]: unknown };
}

const AttributesDisplay: React.FC<AttributesDisplayProps> = ({ attributes }) => {
  const renderValue = (value: unknown, key: string): React.ReactNode => {

    // ───────────────────────────────────────────────
    // Handle LangText objects
    // ───────────────────────────────────────────────
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

    // ───────────────────────────────────────────────
    // Handle arrays
    // ───────────────────────────────────────────────
    if (Array.isArray(value)) {
      return (
        <ul style={{ margin: '6px 0', paddingLeft: '20px' }}>
          {value.map((item, index) => (
            <li key={index} style={{ marginBottom: '4px' }}>
              {renderValue(item, `${key}[${index}]`)}
            </li>
          ))}
        </ul>
      );
    }

    // ───────────────────────────────────────────────
    // Handle nested objects
    // ───────────────────────────────────────────────
    if (value && typeof value === 'object') {
      return (
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 4px',
            fontSize: '0.88em',
            marginTop: '6px',
          }}
        >
          <tbody>
            {Object.entries(value).map(([nestedKey, nestedValue]) => (
              <tr
                key={nestedKey}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  display: 'block',
                  width: '100%',
                }}
              >
                <td
                  style={{
                    padding: '8px 12px',
                    fontWeight: 900,
                    verticalAlign: 'top',
                    width: '100%',
                    borderRight: `1px solid var(--border-light)`,
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderTopLeftRadius: '6px',
                    borderBottomLeftRadius: '6px',
                    display: 'inline-block',
                  }}
                >
                  {nestedKey}
                </td>
                <td
                  style={{
                    padding: '8px 12px',
                    verticalAlign: 'top',
                    color: 'var(--text-primary)',
                    borderTopRightRadius: '6px',
                    borderBottomRightRadius: '6px',
                  }}
                >
                  {renderValue(nestedValue, `${key}.${nestedKey}`)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // ───────────────────────────────────────────────
    // Null / undefined
    // ───────────────────────────────────────────────
    if (value === null || value === undefined) {
      return <em style={{ color: 'var(--text-tertiary)' }}>not available</em>;
    }

    // ───────────────────────────────────────────────
    // Boolean
    // ───────────────────────────────────────────────
    if (typeof value === 'boolean') {
      return (
        <span
          style={{
            backgroundColor: value ? 'var(--success-bg)' : 'var(--error-bg)',
            color: value ? 'var(--success-text)' : 'var(--error-text)',
            padding: '3px 10px',
            borderRadius: '12px',
            fontSize: '0.85em',
            fontWeight: 600,
          }}
        >
          {value ? 'true' : 'false'}
        </span>
      );
    }

    // ───────────────────────────────────────────────
    // Default: string, number, etc.
    // ───────────────────────────────────────────────
    return <span>{String(value)}</span>;
  };

  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0 6px',
        fontSize: '0.95em',
        marginTop: '10px',
      }}
    >
      <tbody>
        {Object.entries(attributes).map(([key, value]) => (
          <tr
            key={key}
            className="attribute-row"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'block',
              transition: 'background-color 0.25s ease',
            }}
          >
            {/* Label Cell */}
            <td
              style={{
                padding: '10px 14px',
                fontWeight: 600,
                verticalAlign: 'top',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-tertiary)',
                borderRight: `1px solid var(--border-light)`,
                borderRadius: '0',
                width: '100%',
                display: 'inline-block',
              }}
            >
              {key}
            </td>

            {/* Value Cell */}
            <td
              style={{
                padding: '10px 14px',
                verticalAlign: 'top',
                color: 'var(--text-primary)',
                borderTopRightRadius: '8px',
                borderBottomRightRadius: '8px',
                lineHeight: '1.45',
                textAlign: 'left',
                width: 'fit-content',

              }}
            >
              {renderValue(value, key)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AttributesDisplay;
