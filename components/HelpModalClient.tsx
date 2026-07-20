'use client';

import React, { useState, useEffect } from 'react';
import { Keyboard, X, Command, Edit3, FileText } from 'lucide-react';

type Tab = 'global' | 'editor' | 'markdown';

export function HelpModalClient() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('global');

  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsOpen(true);
      }
      
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('open-help-modal', handleOpenModal);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('open-help-modal', handleOpenModal);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="card" style={{
        width: '900px',
        height: '600px',
        maxWidth: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        padding: 0,
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '24px', 
          borderBottom: '1px solid var(--border)', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Keyboard size={24} color="var(--primary)" />
            Help & Shortcuts
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* LEFT COLUMN: TABS */}
          <div style={{ 
            width: '220px', 
            borderRight: '1px solid var(--border)', 
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            backgroundColor: 'var(--bg-alt)'
          }}>
            <TabButton 
              active={activeTab === 'global'} 
              onClick={() => setActiveTab('global')} 
              icon={<Command size={18} />} 
              label="Global Shortcuts" 
            />
            <TabButton 
              active={activeTab === 'editor'} 
              onClick={() => setActiveTab('editor')} 
              icon={<Edit3 size={18} />} 
              label="Editor Shortcuts" 
            />
            <TabButton 
              active={activeTab === 'markdown'} 
              onClick={() => setActiveTab('markdown')} 
              icon={<FileText size={18} />} 
              label="Markdown Guide" 
            />
          </div>

          {/* RIGHT COLUMN: CONTENT */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            {activeTab === 'global' && <GlobalShortcuts />}
            {activeTab === 'editor' && <EditorShortcuts />}
            {activeTab === 'markdown' && <MarkdownGuide />}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 14px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: active ? 'var(--surface)' : 'transparent',
        color: active ? 'var(--primary)' : 'var(--text-secondary)',
        fontWeight: active ? 'bold' : 'normal',
        textAlign: 'left',
        transition: 'all 0.2s ease'
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function GlobalShortcuts() {
  return (
    <div>
      <h3 style={{ marginBottom: '24px' }}>Global Shortcuts</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ShortcutRow shortcut="?" description="Show this help menu" />
        <ShortcutRow shortcut="Cmd/Ctrl + K" description="Open command palette (search)" />
        <ShortcutRow shortcut="Cmd/Ctrl + N" description="Create a new note" />
      </div>
    </div>
  );
}

function EditorShortcuts() {
  return (
    <div>
      <h3 style={{ marginBottom: '24px' }}>Editor Shortcuts</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ShortcutRow shortcut="Cmd/Ctrl + S" description="Save current note (auto-saves every 10s)" />
      </div>
    </div>
  );
}

function MarkdownGuide() {
  const Divider = () => <div style={{ gridColumn: '1 / -1', height: '1px', backgroundColor: 'var(--border)', margin: '4px 0' }}></div>;

  return (
    <div>
      <h3 style={{ marginBottom: '24px' }}>Markdown Guide</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Docu supports GitHub Flavored Markdown. Here is a cheat sheet of the syntax.
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '16px',
        backgroundColor: 'var(--bg-alt)',
        padding: '24px',
        borderRadius: '8px',
        fontSize: '14px',
        alignItems: 'center'
      }}>
        {/* Headers */}
        <div><strong># Heading 1</strong></div>
        <div><h1 style={{ margin: 0 }}>Heading 1</h1></div>
        <Divider />

        <div><strong>## Heading 2</strong></div>
        <div><h2 style={{ margin: 0 }}>Heading 2</h2></div>
        <Divider />

        {/* Text Styling */}
        <div><strong>**bold text**</strong></div>
        <div><strong>bold text</strong></div>
        <Divider />

        <div><strong>*italic text*</strong></div>
        <div><em>italic text</em></div>
        <Divider />
        
        <div><strong>~~strikethrough~~</strong></div>
        <div><del>strikethrough</del></div>
        <Divider />

        {/* Highlight/Sub/Superscript */}
        <div><strong>==highlighted== / &lt;mark&gt;highlight&lt;/mark&gt;</strong></div>
        <div><mark style={{ backgroundColor: 'var(--yellow)', color: '#000', padding: '0 4px', borderRadius: '2px' }}>highlighted</mark></div>
        <Divider />
        
        <div><strong>H~2~O / H&lt;sub&gt;2&lt;/sub&gt;O</strong></div>
        <div>H<sub>2</sub>O</div>
        <Divider />

        <div><strong>X^2^ / X&lt;sup&gt;2&lt;/sup&gt;</strong></div>
        <div>X<sup>2</sup></div>
        <Divider />

        {/* Links & Images */}
        <div><strong>[Link](https://google.com)</strong></div>
        <div><a href="#" style={{ color: 'var(--primary)' }}>Link</a></div>
        <Divider />
        
        <div><strong>![Alt Text](image.jpg)</strong></div>
        <div><span style={{ color: 'var(--text-secondary)' }}>🖼️ Image Placeholder</span></div>
        <Divider />

        {/* Lists */}
        <div>
          <strong>- Item 1</strong><br/>
          <strong>- Item 2</strong>
        </div>
        <div>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
        <Divider />
        
        <div>
          <strong>1. First</strong><br/>
          <strong>2. Second</strong>
        </div>
        <div>
          <ol style={{ margin: 0, paddingLeft: '20px' }}>
            <li>First</li>
            <li>Second</li>
          </ol>
        </div>
        <Divider />
        
        {/* Task Lists */}
        <div>
          <strong>- [x] Done</strong><br/>
          <strong>- [ ] Todo</strong>
        </div>
        <div>
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li style={{ display: 'flex', alignItems: 'center' }}><input type="checkbox" checked readOnly style={{ width: 'auto', margin: '0 8px 0 0' }} />Done</li>
            <li style={{ display: 'flex', alignItems: 'center' }}><input type="checkbox" readOnly style={{ width: 'auto', margin: '0 8px 0 0' }} />Todo</li>
          </ul>
        </div>
        <Divider />
        
        {/* Definition Lists */}
        <div>
          <strong>&lt;dl&gt;</strong><br/>
          <strong>  &lt;dt&gt;Term&lt;/dt&gt;</strong><br/>
          <strong>  &lt;dd&gt;Definition&lt;/dd&gt;</strong><br/>
          <strong>&lt;/dl&gt;</strong>
        </div>
        <div>
          <dl style={{ margin: 0 }}>
            <dt style={{ fontWeight: 'bold' }}>Term</dt>
            <dd style={{ marginLeft: '16px', margin: 0 }}>Definition</dd>
          </dl>
        </div>
        <Divider />

        {/* Blockquote */}
        <div><strong>&gt; Blockquote text</strong></div>
        <div style={{ borderLeft: '4px solid var(--primary)', paddingLeft: '12px', color: 'var(--text-secondary)' }}>Blockquote text</div>
        <Divider />

        {/* Code */}
        <div><strong>`inline code`</strong></div>
        <div><code style={{ background: 'var(--surface)', padding: '2px 4px', borderRadius: '4px', fontFamily: 'var(--font-jb-mono)' }}>inline code</code></div>
        <Divider />

        <div><strong>```js<br/>const a = 1;<br/>```</strong></div>
        <div><pre style={{ background: 'var(--surface)', padding: '12px', borderRadius: '4px', margin: 0, fontFamily: 'var(--font-jb-mono)' }}>const a = 1;</pre></div>
        <Divider />

        {/* Tables */}
        <div>
          <strong>| A | B |</strong><br/>
          <strong>|---|---|</strong><br/>
          <strong>| 1 | 2 |</strong>
        </div>
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '4px 8px' }}>A</th>
                <th style={{ textAlign: 'left', padding: '4px 8px' }}>B</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '4px 8px' }}>1</td>
                <td style={{ padding: '4px 8px' }}>2</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Divider />

        {/* Emojis */}
        <div><strong>:smile:</strong></div>
        <div>😄 (Emoji shorthand support)</div>
        <Divider />
        
        {/* Footnotes */}
        <div><strong>Text [^1]<br/><br/>[^1]: The footnote</strong></div>
        <div>Text <sup><a href="#" style={{ color: 'var(--primary)' }}>1</a></sup></div>
        <Divider />
        
        {/* Heading IDs */}
        <div><strong># My Title &#123;#my-id&#125;</strong></div>
        <div><h1 style={{ margin: 0, fontSize: '18px' }}>My Title</h1> <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>(Anchor ID: my-id)</span></div>

      </div>
    </div>
  );
}

function ShortcutRow({ shortcut, description }: { shortcut: string, description: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-alt)', borderRadius: '8px' }}>
      <span style={{ color: 'var(--text-primary)' }}>{description}</span>
      <kbd style={{ 
        backgroundColor: 'var(--surface)', 
        border: '1px solid var(--border)',
        padding: '4px 8px',
        borderRadius: '6px',
        fontFamily: 'var(--font-jb-mono), monospace',
        fontSize: '12px',
        color: 'var(--text-bright)',
        boxShadow: '0 2px 0 var(--border)'
      }}>
        {shortcut}
      </kbd>
    </div>
  );
}
