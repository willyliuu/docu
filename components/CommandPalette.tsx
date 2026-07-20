'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { Search, Folder, FileText, Settings, Plus } from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    setSearch('');
    command();
  };

  if (!open) return null;

  return (
    <div className="command-palette-overlay" onClick={() => setOpen(false)}>
      <Command
        className="command-palette-dialog"
        onClick={(e) => e.stopPropagation()}
        loop
      >
        <div className="command-palette-input-wrapper">
          <Search size={18} className="command-palette-icon" />
          <Command.Input
            autoFocus
            placeholder="Search notes or jump to..."
            value={search}
            onValueChange={setSearch}
            className="command-palette-input"
          />
        </div>

        <Command.List className="command-palette-list">
          <Command.Empty className="command-palette-empty">
            No exact command found.
            <div
              className="command-palette-search-fallback"
              onClick={() => runCommand(() => router.push(`/?query=${encodeURIComponent(search)}`))}
            >
              <Search size={16} />
              Search all notes for &quot;{search}&quot;
            </div>
          </Command.Empty>

          <Command.Group heading="Navigation">
            <Command.Item onSelect={() => runCommand(() => router.push('/'))} className="command-palette-item">
              <FileText size={16} />
              My Notes
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push('/categories'))} className="command-palette-item">
              <Folder size={16} />
              Categories
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push('/settings'))} className="command-palette-item">
              <Settings size={16} />
              Settings
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Quick Actions">
            <Command.Item onSelect={() => runCommand(() => router.push('/notes/new'))} className="command-palette-item">
              <Plus size={16} />
              Create New Note
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
