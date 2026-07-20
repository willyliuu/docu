'use client';

import React, { useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { Button } from '@/components/Button';
import { LayoutTemplate } from 'lucide-react';

interface DiffViewerClientProps {
  oldValue: string;
  newValue: string;
}

export default function DiffViewerClient({ oldValue, newValue }: DiffViewerClientProps) {
  const [splitView, setSplitView] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="flex justify-end">
        <Button
          variant="secondary"
          onClick={() => setSplitView(!splitView)}
          className="flex items-center gap-2"
        >
          <LayoutTemplate size={16} />
          {splitView ? 'Switch to Unified View' : 'Switch to Split View'}
        </Button>
      </div>

      <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--bg-main)' }}>
        <ReactDiffViewer
          oldValue={oldValue}
          newValue={newValue}
          splitView={splitView}
          useDarkTheme={true}
          leftTitle="Historical Version (Committed)"
          rightTitle="Current Version (Live)"
          styles={{
            variables: {
              dark: {
                diffViewerBackground: 'var(--bg-main)',
                diffViewerColor: 'var(--text-primary)',
                // Using Tokyo Night success/error colors instead of GitHub colors
                addedBackground: 'rgba(158, 206, 106, 0.15)', // var(--success)
                addedColor: 'var(--text-primary)',
                removedBackground: 'rgba(247, 118, 142, 0.15)', // var(--error)
                removedColor: 'var(--text-primary)',
                wordAddedBackground: 'rgba(158, 206, 106, 0.35)',
                wordRemovedBackground: 'rgba(247, 118, 142, 0.35)',
                addedGutterBackground: 'rgba(158, 206, 106, 0.1)',
                removedGutterBackground: 'rgba(247, 118, 142, 0.1)',
                gutterBackground: 'var(--bg-alt)',
                gutterColor: 'var(--text-secondary)',
                emptyLineBackground: 'var(--bg-alt)'
              }
            },
            diffContainer: {
              fontFamily: 'var(--font-jb-mono), monospace',
            },
            contentText: {
              fontSize: '16px',
              fontFamily: 'var(--font-jb-mono), monospace',
            },
            lineNumber: {
              fontSize: '14px',
              fontFamily: 'var(--font-jb-mono), monospace',
            },
            titleBlock: {
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              backgroundColor: 'var(--surface)',
              borderBottom: '1px solid var(--border)',
              color: 'var(--text-bright)'
            },
            line: {
              lineHeight: 1.6
            },
            marker: {
              color: 'var(--text-secondary)'
            }
          }}
        />
      </div>
    </div>
  );
}
