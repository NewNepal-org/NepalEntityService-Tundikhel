import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { LangText as LangTextType } from '../../common/nes-types';

interface MarkdownTextProps {
  text: LangTextType;
  preferNepali?: boolean;
}

const MarkdownText: React.FC<MarkdownTextProps> = ({ text, preferNepali = false }) => {
  const nepali = text.ne?.value;
  const english = text.en?.value;
  
  if (preferNepali && nepali) {
    return <ReactMarkdown>{nepali}</ReactMarkdown>;
  }
  
  if (english && nepali) {
    return (
      <div>
        <ReactMarkdown>{english}</ReactMarkdown>
        <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #ddd' }} />
        <div style={{ color: '#666', fontSize: '0.9em' }}>
          <ReactMarkdown>{nepali}</ReactMarkdown>
        </div>
      </div>
    );
  }
  
  return <ReactMarkdown>{english || nepali || 'N/A'}</ReactMarkdown>;
};

export default MarkdownText;