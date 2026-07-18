import React from 'react';
import Link from 'next/link';
import { CategoryBadge } from './CategoryBadge';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Clock } from 'lucide-react';

interface NoteCardProps {
  id: string;
  title: string;
  contentSnippet: string;
  categoryName?: string;
  categoryColor?: string;
  updatedAt: string;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  id,
  title,
  contentSnippet,
  categoryName,
  categoryColor,
  updatedAt
}) => {
  return (
    <Link href={`/notes/${id}`} className="card flex-col gap-2" style={{ display: 'flex', color: 'inherit', textDecoration: 'none' }}>
      <div className="flex justify-between" style={{ alignItems: 'flex-start', gap: '16px', marginBottom: '8px' }}>
        <h3 style={{ margin: 0, lineHeight: 1.3, wordBreak: 'break-word' }}>{title}</h3>
        {categoryName && categoryColor && (
          <div style={{ flexShrink: 0 }}>
            <CategoryBadge name={categoryName} color={categoryColor} />
          </div>
        )}
      </div>
      <div style={{ 
        color: 'var(--text-secondary)', 
        fontSize: '14px', 
        position: 'relative',
        maxHeight: '350px',
        overflow: 'hidden'
      }} className="markdown-preview mini-preview">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({...props}) => <span style={{ color: 'var(--primary)' }}>{props.children}</span>
          }}
        >
          {contentSnippet}
        </ReactMarkdown>
        {/* Soft fade-out gradient for long content */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40px',
          background: 'linear-gradient(transparent, var(--surface))'
        }} />
      </div>
      <div style={{ fontFamily: 'var(--font-jb-mono), monospace', fontSize: '12px', color: 'var(--text-secondary)', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Clock size={12} />
        Updated: {new Date(updatedAt).toLocaleDateString()}
      </div>
    </Link>
  );
};
