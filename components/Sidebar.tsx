'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Library, FolderOpen, Settings, Plus, Star, Code, Terminal } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { name: 'My Notes', path: '/', icon: Library },
    { name: 'Sandbox', path: '/sandbox', icon: Code },
    { name: 'Favorites', path: '/favorites', icon: Star },
    { name: 'Categories', path: '/categories', icon: FolderOpen },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <aside className="desktop-sidebar glass-panel" style={{
      width: '250px',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div className="flex items-center gap-2" style={{ padding: '0 8px 16px 8px', marginBottom: '8px', borderBottom: '1px solid var(--border)' }}>
        <Terminal size={24} color="var(--primary)" />
        <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-bright)' }}>Docu</span>
      </div>

      <Link href="/notes/new" className="btn btn-primary flex items-center gap-2" style={{ marginBottom: '16px' }}>
        <Plus size={18} />
        New Note
      </Link>

      {links.map(link => {
        const isActive = pathname === link.path;
        return (
          <Link
            key={link.path}
            href={link.path}
            className="btn btn-ghost flex items-center gap-3 sidebar-link"
            style={{
              justifyContent: 'flex-start',
              gap: '12px',
              backgroundColor: isActive ? 'var(--surface)' : 'transparent',
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            <link.icon size={18} />
            {link.name}
          </Link>
        );
      })}

      <div style={{ marginTop: 'auto' }}>
        <button
          onClick={() => window.dispatchEvent(new Event('open-help-modal'))}
          className="btn btn-ghost flex items-center gap-3 sidebar-link"
          style={{
            width: '100%',
            justifyContent: 'flex-start',
            gap: '12px',
            color: 'var(--text-secondary)',
            border: 'none',
            background: 'none',
            cursor: 'pointer'
          }}
        >
          <div style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            width: '20px', height: '20px', 
            border: '1px solid currentColor', 
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            ?
          </div>
          Shortcuts & Help
        </button>
      </div>
    </aside>
  );
};
