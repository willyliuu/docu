'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Mermaid } from './Mermaid';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  return (
    <div style={{ display: 'flex', height: '100%', minHeight: '600px', borderTop: '1px solid var(--border)' }}>
      {/* Editor Pane */}
      <div style={{ flex: 1, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
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
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto', backgroundColor: 'var(--bg-main)' }} className="markdown-preview">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              if (!inline && match) {
                if (match[1] === 'mermaid') {
                  return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                }
                return (
                  <SyntaxHighlighter
                    style={vscDarkPlus as any}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ margin: 0, borderRadius: '4px', background: 'var(--bg-alt)' }}
                    {...props}
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
  );
};
