import React from 'react';
import { Button } from './Button';
import { Sparkles, Type, PenTool, Code } from 'lucide-react';

interface AIToolbarProps {
  onAction: (action: string) => void;
  onClose: () => void;
  isLoading: boolean;
  hasSelection: boolean;
}

export const AIToolbar: React.FC<AIToolbarProps> = ({ onAction, isLoading, hasSelection }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px',
        gap: '4px',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        opacity: hasSelection ? 1 : 0.5,
        transition: 'opacity 0.2s ease',
      }}
    >
      <Button variant="ghost" onClick={() => onAction('summarize')} disabled={isLoading || !hasSelection} style={{ padding: '4px 8px', fontSize: '12px', height: '32px' }}>
        <Sparkles size={14} style={{ marginRight: '4px' }} /> Summarize
      </Button>
      <Button variant="ghost" onClick={() => onAction('fix_grammar')} disabled={isLoading || !hasSelection} style={{ padding: '4px 8px', fontSize: '12px', height: '32px' }}>
        <Type size={14} style={{ marginRight: '4px' }} /> Fix Grammar
      </Button>
      <Button variant="ghost" onClick={() => onAction('continue')} disabled={isLoading || !hasSelection} style={{ padding: '4px 8px', fontSize: '12px', height: '32px' }}>
        <PenTool size={14} style={{ marginRight: '4px' }} /> Continue
      </Button>
      <Button variant="ghost" onClick={() => onAction('explain')} disabled={isLoading || !hasSelection} style={{ padding: '4px 8px', fontSize: '12px', height: '32px' }}>
        <Code size={14} style={{ marginRight: '4px' }} /> Explain
      </Button>
    </div>
  );
};
