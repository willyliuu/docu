'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Terminal, LogOut, Menu, X, Library, FolderOpen, Settings, Plus } from 'lucide-react';

interface NavbarProps {
  user?: { name?: string | null, email?: string | null };
}

export const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: 'My Notes', path: '/', icon: Library },
    { name: 'Categories', path: '/categories', icon: FolderOpen },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        margin: '16px 24px',
        borderRadius: '16px',
        backgroundColor: 'rgba(36, 40, 59, 0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}>
        <div className="flex items-center gap-4">
          {user && (
            <button 
              className="btn btn-ghost mobile-only" 
              style={{ padding: '0 8px' }} 
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          )}
          <Link href="/" className="flex items-center gap-2 mobile-only" style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-bright)', textDecoration: 'none' }}>
            <Terminal size={24} color="var(--primary)" />
            Docu
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden-mobile" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {user.name || user.email}
              </span>
              <button onClick={() => signOut()} className="btn btn-ghost flex items-center gap-2" style={{ cursor: 'pointer' }}>
                <LogOut size={16} />
                <span className="hidden-mobile">Logout</span>
              </button>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Login
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Drawer */}
      {user && (
        <>
          {isMobileMenuOpen && (
            <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)} />
          )}
          <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
            <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-bright)' }}>Navigation</span>
              <button className="btn btn-ghost" style={{ padding: '4px' }} onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <Link href="/notes/new" className="btn btn-primary flex items-center gap-2" style={{ marginBottom: '16px' }} onClick={() => setIsMobileMenuOpen(false)}>
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
                  onClick={() => setIsMobileMenuOpen(false)}
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
          </div>
        </>
      )}
    </>
  );
};
