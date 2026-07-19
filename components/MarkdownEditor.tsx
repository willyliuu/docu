'use client';

import React, { ClassAttributes, HTMLAttributes, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Mermaid } from './Mermaid';
import { Button } from './Button';
import { Edit3, Eye } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

type CodeProps = ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & { inline?: boolean; node?: unknown };

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Mobile Tab Bar */}
      <div className="md-tab-bar" style={{ padding: '8px 16px', gap: '8px' }}>
        <Button 
          variant={activeTab === 'write' ? 'primary' : 'ghost'} 
          onClick={() => setActiveTab('write')}
          style={{ flex: 1, gap: '8px' }}
        >
          <Edit3 size={16} /> Write
        </Button>
        <Button 
          variant={activeTab === 'preview' ? 'primary' : 'ghost'} 
          onClick={() => setActiveTab('preview')}
          style={{ flex: 1, gap: '8px' }}
        >
          <Eye size={16} /> Preview
        </Button>
      </div>

      <div className="md-editor-container">
        {/* Editor Pane */}
        <div className={`md-pane ${activeTab === 'preview' ? 'mobile-hidden' : ''}`} style={{ borderRight: '1px solid var(--border)' }}>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your note in markdown here..."
            style={{
              flex: 1,
              width: '100%',
              resize: 'none',
              border: 'none',
              outline: 'none',
              padding: '24px',
              backgroundColor: 'var(--bg-alt)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-jb-mono), monospace',
              fontSize: '14px',
              lineHeight: 1.6
            }}
          />
        </div>
        
        {/* Preview Pane */}
        <div className={`md-pane markdown-preview ${activeTab === 'write' ? 'mobile-hidden' : ''}`} style={{ padding: '24px', overflowY: 'auto', backgroundColor: 'var(--bg-main)' }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }: CodeProps) {
                const match = /language-(\w+)/.exec(className || '');
                if (!inline && match) {
                  if (match[1] === 'mermaid') {
                    return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                  }
                  return (
                    <SyntaxHighlighter
                      style={dracula as { [key: string]: React.CSSProperties }}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{ margin: 0, borderRadius: '4px', background: 'var(--bg-alt)' }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  );
                }
                return (
                  <code className={className} style={{ background: 'var(--bg-alt)', padding: '2px 4px', borderRadius: '4px', fontFamily: 'var(--font-jb-mono), monospace' }} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {value || '*Nothing to preview yet...*'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
