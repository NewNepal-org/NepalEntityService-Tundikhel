import React from 'react';
import type { LangText as LangTextType } from '../../common/nes-types';

interface LangTextProps {
  text: LangTextType;
  preferNepali?: boolean;
}

const LangText: React.FC<LangTextProps> = ({ text, preferNepali = false }) => {
  const nepali = text.ne?.value;
  const english = text.en?.value;

  if (preferNepali && nepali) {
    return <span>{nepali}</span>;
  }

  if (english && nepali) {
    return (
      <span>
        {english}<br />
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9em', transition: 'color 0.3s ease' }}>{nepali}</span>
      </span>
    );
  }

  return <span>{english || nepali || 'N/A'}</span>;
};

export default LangText;