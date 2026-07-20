'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { CategoryBadge } from './CategoryBadge';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Clock, Star } from 'lucide-react';
import { toggleFavorite } from '@/app/notes/actions';

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  categoryName?: string;
  categoryColor?: string;
  updatedAt: string;
  isFavorite?: boolean;
  query?: string;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  id,
  title,
  content,
  categoryName,
  categoryColor,
  updatedAt,
  isFavorite = false,
  query = ''
}) => {
  const [optimisticFavorite, setOptimisticFavorite] = useState(isFavorite);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    const newValue = !optimisticFavorite;
    setOptimisticFavorite(newValue);
    try {
      await toggleFavorite(id, newValue);
    } catch (error) {
      console.log("error: ", error)
      setOptimisticFavorite(!newValue); // Revert on failure
    }
  };

  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? 
            <mark key={i} style={{ backgroundColor: 'var(--yellow)', color: '#000', padding: '0 2px', borderRadius: '2px' }}>{part}</mark> : 
            part
        )}
      </span>
    );
  };

  const renderContent = () => {
    if (!query) {
      return (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({...props}) => <span style={{ color: 'var(--primary)' }}>{props.children}</span>
          }}
        >
          {content.substring(0, 600) + (content.length > 600 ? '...' : '')}
        </ReactMarkdown>
      );
    }

    const plainText = content.replace(/[#_*~`>\[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
    const lowerPlain = plainText.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerPlain.indexOf(lowerQuery);
    
    let snippet = plainText;
    if (index !== -1) {
      const start = Math.max(0, index - 60);
      const end = Math.min(plainText.length, start + 300);
      snippet = plainText.substring(start, end);
      if (start > 0) snippet = '...' + snippet;
      if (end < plainText.length) snippet = snippet + '...';
    } else {
      snippet = plainText.substring(0, 300) + (plainText.length > 300 ? '...' : '');
    }

    return (
      <div style={{ paddingTop: '8px', lineHeight: 1.6 }}>
        {getHighlightedText(snippet, query)}
      </div>
    );
  };

  return (
    <Link href={`/notes/${id}`} className="card flex-col gap-2" style={{ display: 'flex', color: 'inherit', textDecoration: 'none' }}>
      <div className="flex justify-between" style={{ alignItems: 'flex-start', gap: '16px', marginBottom: '8px' }}>
        <h3 style={{ margin: 0, lineHeight: 1.3, wordBreak: 'break-word', flex: 1 }}>
          {getHighlightedText(title, query)}
        </h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={handleToggleFavorite}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: optimisticFavorite ? '#e0af68' : 'var(--text-secondary)',
              padding: '4px',
              display: 'flex'
            }}
          >
            <Star size={18} fill={optimisticFavorite ? '#e0af68' : 'none'} />
          </button>
          {categoryName && categoryColor && (
          <div style={{ flexShrink: 0 }}>
            <CategoryBadge name={categoryName} color={categoryColor} />
          </div>
        )}
        </div>
      </div>
      <div style={{
        color: 'var(--text-secondary)',
        fontSize: '14px',
        position: 'relative',
        maxHeight: '350px',
        overflow: 'hidden'
      }} className="markdown-preview mini-preview">
        {renderContent()}
        {/* Soft fade-out gradient for long content */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40px',
          background: 'linear-gradient(transparent, rgba(36, 40, 59, 0.9))'
        }} />
      </div>
      <div style={{ fontFamily: 'var(--font-jb-mono), monospace', fontSize: '12px', color: 'var(--text-secondary)', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Clock size={12} />
        Updated: {new Date(updatedAt).toLocaleDateString('en-US')}
      </div>
    </Link>
  );
};
