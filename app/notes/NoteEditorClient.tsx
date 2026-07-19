'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { createNote, updateNote } from './actions';
import { Save, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
}

interface NoteEditorClientProps {
  initialData?: { id: string; title: string; content: string; category_id: string | null };
  categories: Category[];
}

export default function NoteEditorClient({ initialData, categories }: NoteEditorClientProps) {
  const router = useRouter();
  
  const [noteId, setNoteId] = useState(initialData?.id);
  const [title, setTitle] = useState(initialData?.title || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '');
  const [content, setContent] = useState(initialData?.content || '');
  
  const [isSaving, setIsSaving] = useState(false);
  
  // Track last saved state to prevent unnecessary auto-saves
  const lastSavedState = useRef({ title: initialData?.title || '', content: initialData?.content || '', categoryId: initialData?.category_id || '' });

  const handleSave = useCallback(async (options: { isAutoSave?: boolean, shouldNavigate?: boolean } = {}) => {
    const { isAutoSave = false, shouldNavigate = false } = options;

    if (!title.trim() || !content.trim()) {
      if (!isAutoSave) toast.error('Please add a title and some content to your note.');
      return;
    }

    if (
      title === lastSavedState.current.title && 
      content === lastSavedState.current.content && 
      categoryId === lastSavedState.current.categoryId
    ) {
      if (shouldNavigate) router.push(noteId ? `/notes/${noteId}` : '/');
      return; // Nothing changed
    }

    setIsSaving(true);

    try {
      let currentNoteId = noteId;
      
      if (currentNoteId) {
        await updateNote(currentNoteId, title, content, categoryId || null);
      } else {
        currentNoteId = await createNote(title, content, categoryId || null);
        setNoteId(currentNoteId);
        // Only replace state if we are NOT navigating away, otherwise it can desync router
        if (!shouldNavigate) {
          window.history.replaceState(null, '', `/notes/${currentNoteId}/edit`);
        }
      }
      
      lastSavedState.current = { title, content, categoryId };

      if (isAutoSave) {
        toast.info('Auto-saved', { duration: 1500 });
      } else {
        toast.success('Note saved successfully!');
      }

      if (shouldNavigate) {
        router.push(`/notes/${currentNoteId}`);
      }
    } catch {
      if (!isAutoSave) toast.error('Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [title, content, categoryId, noteId, router]);

  // Auto-save every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleSave({ isAutoSave: true, shouldNavigate: false });
    }, 10000);
    return () => clearInterval(timer);
  }, [handleSave]);

  // Keyboard Shortcuts (Cmd+S, Cmd+N)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Cmd+S should explicitly NOT navigate, just save the progress!
        handleSave({ isAutoSave: false, shouldNavigate: false });
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        router.push('/notes/new');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, router]);

  return (
    <div className="flex-col" style={{ height: 'calc(100vh - 74px)', display: 'flex' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-4" style={{ marginBottom: '16px' }}>
          <Link href="/" className="btn btn-ghost" style={{ padding: '0 8px', height: '40px', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
            <ChevronLeft size={20} />
          </Link>
          <Input 
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Note Title"
            style={{ flex: 1, fontSize: '24px', fontWeight: 'bold' }}
          />
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <select 
            value={categoryId} 
            onChange={(e) => setCategoryId(e.target.value)}
            style={{ 
              backgroundColor: 'var(--surface)', 
              border: '1px solid var(--border)', 
              color: 'var(--text-primary)', 
              borderRadius: '8px',
              padding: '10px 14px',
              outline: 'none',
              maxWidth: '250px'
            }}
          >
            <option value="">No Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          
          <Button onClick={() => handleSave({ isAutoSave: false, shouldNavigate: true })} disabled={isSaving} className="flex items-center gap-2">
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Note'}
          </Button>
        </div>
      </div>
      
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <MarkdownEditor value={content} onChange={setContent} />
      </div>
    </div>
  );
}
