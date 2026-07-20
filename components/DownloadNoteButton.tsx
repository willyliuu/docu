'use client';

import React from 'react';
import { Download } from 'lucide-react';

interface DownloadNoteButtonProps {
  title: string;
  content: string;
}

export function DownloadNoteButton({ title, content }: DownloadNoteButtonProps) {
  const handleDownload = () => {
    // 1. Create a Blob from the content
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // 2. Sanitize title for filename
    const safeTitle = title
      .replace(/[^a-z0-9]/gi, '-') // Replace non-alphanumeric with hyphen
      .replace(/-+/g, '-') // Remove consecutive hyphens
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      || 'note';

    // 3. Create a temporary anchor element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${safeTitle}.md`;
    document.body.appendChild(link);
    link.click();

    // 4. Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      title="Download as Markdown"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 0.2s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
    >
      <Download size={18} />
    </button>
  );
}
