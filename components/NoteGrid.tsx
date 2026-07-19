'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Masonry from 'react-masonry-css';
import { NoteCard } from './NoteCard';
import { fetchNotesPage } from '@/app/notes/actions';
import { Button } from './Button';

interface Note {
  id: string;
  title: string;
  contentSnippet: string;
  categoryName?: string;
  categoryColor?: string;
  updatedAt: string;
}

interface NoteGridProps {
  initialNotes: Note[];
  query: string;
  categoryId: string;
  sort: string;
}

export const NoteGrid: React.FC<NoteGridProps> = ({ initialNotes, query, categoryId, sort }) => {
  const [localNotes, setLocalNotes] = useState<Note[]>(initialNotes);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialNotes.length === 24);
  const [autoLoadCount, setAutoLoadCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  // Reset state when filters change
  useEffect(() => {
    setLocalNotes(initialNotes);
    setPage(1);
    setHasMore(initialNotes.length === 24);
    setAutoLoadCount(0);
  }, [initialNotes]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    try {
      const nextNotes = await fetchNotesPage(page, query, categoryId, sort);
      
      if (nextNotes.length > 0) {
        setLocalNotes(prev => [...prev, ...nextNotes]);
        setPage(p => p + 1);
        setAutoLoadCount(c => c + 1);
      }
      
      if (nextNotes.length < 24) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more notes", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, query, categoryId, sort, hasMore, isLoadingMore]);

  // Intersection Observer for Infinite Scroll (up to 2 times)
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && autoLoadCount < 2) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoadingMore, autoLoadCount]);

  const breakpointColumnsObj = {
    default: 4,
    1400: 3,
    1100: 2,
    768: 1
  };

  return (
    <div className="note-grid-container">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {localNotes.map(note => (
          <div key={note.id} style={{ marginBottom: '24px' }}>
            <NoteCard
              id={note.id}
              title={note.title}
              contentSnippet={note.contentSnippet}
              categoryName={note.categoryName}
              categoryColor={note.categoryColor}
              updatedAt={note.updatedAt}
            />
          </div>
        ))}
      </Masonry>
      
      {hasMore && (
        <div 
          ref={observerTarget} 
          style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}
        >
          {autoLoadCount >= 2 ? (
            <Button 
              onClick={loadMore} 
              disabled={isLoadingMore}
              variant="secondary"
            >
              {isLoadingMore ? 'Loading...' : 'Load More Notes'}
            </Button>
          ) : (
            isLoadingMore && <div style={{ color: 'var(--text-secondary)' }}>Loading more notes...</div>
          )}
        </div>
      )}
    </div>
  );
};
