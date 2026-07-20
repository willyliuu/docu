import React, { ClassAttributes, HTMLAttributes, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Mermaid } from './Mermaid';
import { Button } from './Button';
import { Edit3, Eye } from 'lucide-react';
import { AIToolbar } from './AIToolbar';
import { useCompletion } from '@ai-sdk/react';
import { toast } from 'sonner';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

type CodeProps = ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & { inline?: boolean; node?: unknown };

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  
  // AI Feature State
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selection, setSelection] = useState<{ start: number; end: number; text: string } | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Wait for the portal target to be mounted by NoteEditorClient
    const el = document.getElementById('ai-toolbar-portal-target');
    if (el) setPortalTarget(el);
  }, []);

  const { complete, completion, isLoading, stop, setCompletion } = useCompletion({
    api: '/api/ai',
    streamProtocol: 'text',
    onFinish: (_: string, result: string) => {
      if (selection) {
        const newValue = value.substring(0, selection.start) + result + value.substring(selection.end);
        onChange(newValue);
        setSelection(null);
        setCompletion('');
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to process AI request');
      setSelection(null);
      setCompletion('');
    }
  });

  const handleMouseUp = () => {
    if (isLoading) return;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      const selectedText = textarea.value.substring(start, end);
      setSelection({ start, end, text: selectedText });
    } else {
      setSelection(null);
    }
  };

  const handleAIAction = async (action: string) => {
    if (!selection) return;
    await complete(selection.text, {
      body: { action, context: value }
    });
  };

  const handleCancelAI = () => {
    stop();
    setSelection(null);
    setCompletion('');
  };

  // Determine what to show in the textarea
  const displayValue = (isLoading && selection) 
    ? value.substring(0, selection.start) + completion + value.substring(selection.end)
    : value;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      
      {/* Portal the AIToolbar to the header in NoteEditorClient */}
      {portalTarget && createPortal(
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!isLoading && (
            <AIToolbar 
              onAction={handleAIAction} 
              onClose={handleCancelAI} 
              isLoading={isLoading} 
              hasSelection={!!selection}
            />
          )}
          {isLoading && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--primary)',
              color: 'var(--primary)',
              fontSize: '12px',
              backgroundColor: 'var(--surface)'
            }}>
              <span className="animate-pulse">✨ AI is writing...</span>
              <Button variant="ghost" onClick={handleCancelAI} style={{ padding: '0 4px', height: 'auto', color: 'var(--error)' }}>Stop</Button>
            </div>
          )}
        </div>,
        portalTarget
      )}

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
            ref={textareaRef}
            spellCheck={false}
            value={displayValue}
            onChange={(e) => {
              if (isLoading) return; // Prevent user edit while streaming
              onChange(e.target.value);
            }}
            onMouseUp={handleMouseUp}
            onKeyUp={handleMouseUp}
            readOnly={isLoading}
            placeholder="Write your note in markdown here..."
            style={{
              flex: 1,
              width: '100%',
              resize: 'none',
              border: 'none',
              outline: 'none',
              padding: '24px',
              backgroundColor: 'var(--bg-alt)',
              color: isLoading ? 'var(--text-secondary)' : 'var(--text-primary)',
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
            {displayValue || '*Nothing to preview yet...*'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
