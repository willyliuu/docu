'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Library, FolderOpen, Settings, Plus, Star } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { name: 'My Notes', path: '/', icon: Library },
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

    </aside>
  );
};
